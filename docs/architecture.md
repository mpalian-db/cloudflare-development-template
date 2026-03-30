# Architecture Guide

## Overview

This template uses **hexagonal architecture** (also called ports and adapters) to keep your application's business logic completely separate from Cloudflare-specific infrastructure.

The core idea: your application talks to abstract interfaces (ports), not to Cloudflare services directly. A thin adapter layer translates between the port interface and the actual Cloudflare API.

## Why This Matters

If you ever want to move your application from Cloudflare to AWS, Azure, or run it locally:

1. Your business logic (`app/core/`) stays exactly the same.
2. Your port interfaces (`app/ports/`) stay exactly the same.
3. You write new adapters (`app/adapters/aws/` or `app/adapters/local/`) that implement the same interfaces using different services.

Nothing else changes.

## Directory Structure

```
app/
  ports/             -- Interfaces (the contract)
  adapters/
    cloudflare/      -- Cloudflare implementations
  core/              -- Business logic (no infrastructure)
  api/               -- HTTP routes (Hono)
  frontend/          -- UI (React + Vite)
```

## How It Works

### Ports

A port is a TypeScript interface that describes what a service does, without saying how. For example, `DatabasePort` describes querying and executing SQL -- it says nothing about D1, PostgreSQL, or any specific database.

```typescript
// app/ports/database.ts
export interface DatabasePort {
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  execute(sql: string, params?: unknown[]): Promise<QueryResult>;
}
```

### Adapters

An adapter implements a port using a specific technology. The Cloudflare D1 adapter uses `D1Database` bindings to fulfil the `DatabasePort` contract.

```typescript
// app/adapters/cloudflare/d1-database.ts
import type { DatabasePort, QueryResult } from "../../ports/database";

export class D1DatabaseAdapter implements DatabasePort {
  constructor(private db: D1Database) {}

  async query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    const result = await this.db.prepare(sql).bind(...(params ?? [])).all();
    return { rows: result.results as T[], rowsAffected: result.meta.changes };
  }

  async execute(sql: string, params?: unknown[]): Promise<QueryResult> {
    const result = await this.db.prepare(sql).bind(...(params ?? [])).run();
    return { rows: [], rowsAffected: result.meta.changes };
  }
}
```

### Wiring It Together

At the application boundary (typically in the Hono route handler), the adapter is created and injected into business logic:

```typescript
// app/api/index.ts
import { Hono } from "hono";
import { D1DatabaseAdapter } from "../adapters/cloudflare/d1-database";
import { listUsers } from "../core/users";

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/users", async (c) => {
  const db = new D1DatabaseAdapter(c.env.DB);
  const users = await listUsers(db);  // core function receives the port
  return c.json(users);
});
```

The business logic function (`listUsers`) accepts a `DatabasePort`, not a `D1DatabaseAdapter`. It has no idea which database it is talking to.

## Available Ports

| Port                | File                          | Cloudflare Service    |
|---------------------|-------------------------------|-----------------------|
| `DatabasePort`      | `app/ports/database.ts`       | D1 (SQLite)           |
| `KVStorePort`       | `app/ports/kv-store.ts`       | KV                    |
| `StoragePort`       | `app/ports/storage.ts`        | R2                    |
| `QueuePort`         | `app/ports/queue.ts`          | Queues                |
| `AIPort`            | `app/ports/ai.ts`             | Workers AI            |
| `VectorizePort`     | `app/ports/vectorize.ts`      | Vectorize             |
| `DurableSessionPort`| `app/ports/durable-session.ts`| Durable Objects       |

## Migrating to Another Provider

1. Create `app/adapters/<provider>/` (e.g., `app/adapters/aws/`).
2. For each port your application uses, create an adapter that implements the interface:
   - `DatabasePort` --> PostgreSQL via `pg`, DynamoDB, etc.
   - `StoragePort` --> S3
   - `KVStorePort` --> Redis, DynamoDB
   - `QueuePort` --> SQS, RabbitMQ
   - `AIPort` --> OpenAI API, AWS Bedrock
   - `VectorizePort` --> Pinecone, pgvector
   - `DurableSessionPort` --> Redis + WebSocket server
3. Update the composition root (where adapters are created) to use the new adapters.
4. `app/core/` and `app/ports/` remain untouched.

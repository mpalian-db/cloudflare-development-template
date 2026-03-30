# Cloudflare Development Template -- Design Specification

## 1. Purpose

A git template repository that enables anyone -- including non-developers -- to describe an application idea to Claude Code and have it scaffolded, built, and deployed on Cloudflare. The template ships no application code. Its value lies entirely in CLAUDE.md (instructions for Claude), custom skills (automated workflows), and port interfaces (abstraction contracts).

All Cloudflare-specific infrastructure is abstracted behind typed interfaces so that any generated application can be migrated to AWS, Azure, or another provider by writing new adapters without changing business logic.

## 2. Target Audience

**Primary:** Beginners with an application idea but no coding experience. Claude acts as their entire engineering team -- explaining decisions, handling setup, and generating all code.

**Secondary:** Experienced developers who want a fast, opinionated scaffold on Cloudflare with built-in portability. Claude adapts its communication style based on the user's apparent skill level.

## 3. Technology Stack

| Layer       | Default                  | Notes                                      |
|-------------|--------------------------|---------------------------------------------|
| Language    | TypeScript               | Strict mode                                 |
| Frontend    | React + Vite             | Deployed to Cloudflare Pages                |
| API         | Hono                     | Runs on Cloudflare Workers                  |
| Database    | Cloudflare D1            | Accessed via `DatabasePort` interface       |
| KV          | Cloudflare KV            | Accessed via `KVStorePort` interface        |
| Storage     | Cloudflare R2            | Accessed via `StoragePort` interface        |
| Queue       | Cloudflare Queues        | Accessed via `QueuePort` interface          |
| AI          | Cloudflare Workers AI    | Accessed via `AIPort` interface             |
| Vector      | Cloudflare Vectorize     | Accessed via `VectorizePort` interface      |
| State       | Cloudflare Durable Objects | Accessed via `DurableSessionPort` interface |
| Python      | uv (never pip)           | Only when Python is required                |

Claude defaults to React + Vite for the frontend and Hono for the API unless the user specifies otherwise.

For any Cloudflare service not listed above, Claude consults the Cloudflare documentation MCP server and wires it up with an appropriate port/adapter pair following the same pattern.

## 4. Architecture

### 4.1 Hexagonal Architecture (Ports and Adapters)

All business logic lives in `app/core/` with zero imports from Cloudflare SDKs, Workers APIs, or any infrastructure library.

All Cloudflare-specific code lives in `app/adapters/cloudflare/`. Each adapter implements one port interface.

To migrate the application to another provider, create a new adapter directory (e.g., `app/adapters/aws/`) and implement the same port interfaces. Business logic and ports remain unchanged.

### 4.2 Directory Layout

```
app/
  ports/               # TypeScript interfaces -- the abstraction contract
    database.ts
    kv-store.ts
    storage.ts
    queue.ts
    ai.ts
    vectorize.ts
    durable-session.ts
  adapters/
    cloudflare/        # Cloudflare-specific implementations
      d1-database.ts
      kv-store.ts
      r2-storage.ts
      queue.ts
      workers-ai.ts
      vectorize.ts
      durable-session.ts
  core/                # Business logic -- no infrastructure imports
    (generated per app)
  api/                 # Hono routes and middleware
    (generated per app)
  frontend/            # React + Vite application
    (generated per app)
```

### 4.3 Rule: No Infrastructure Leakage

The following are never permitted in `app/core/`:
- Direct imports from `@cloudflare/workers-types`, `wrangler`, or any Cloudflare SDK
- References to `env.DB`, `env.KV`, `env.BUCKET`, or any Workers binding
- Cloudflare-specific types (`D1Database`, `KVNamespace`, `R2Bucket`, etc.)

All infrastructure access flows through port interfaces injected at the application boundary (typically in the Hono route handler or a composition root).

## 5. Repository Structure

```
cloudflare-development-template/
  .claude/
    skills/              # Custom project-local skills
      onboard.md
      scaffold.md
      add-database.md
      add-storage.md
      add-kv.md
      add-queue.md
      add-ai.md
      add-vectorize.md
      add-durable-object.md
      add-auth.md
      deploy.md
  .mcp.json              # Pre-configured MCP servers
  .gitignore
  .dockerignore
  .env.example           # Required credentials template
  CLAUDE.md              # The brain -- all instructions for Claude
  Makefile               # Key commands (dev, deploy, test, etc.)
  README.md              # Short setup guide -- clone to running app
  config.toml            # Application configuration
  docker/                # Dockerfiles
  docker-compose.yaml
  data/                  # Data files
  docs/
    architecture.md      # Port/adapter pattern explanation
  app/
    ports/               # Port interfaces only -- no implementations
      database.ts
      kv-store.ts
      storage.ts
      queue.ts
      ai.ts
      vectorize.ts
      durable-session.ts
```

Files Claude generates after scaffolding (not shipped):
- `package.json`, `tsconfig.json`, `vite.config.ts`, `wrangler.toml`
- All adapter implementations in `app/adapters/cloudflare/`
- All business logic in `app/core/`
- All routes in `app/api/`
- All frontend code in `app/frontend/`

## 6. Project Conventions

| Concern               | Convention                                                |
|------------------------|-----------------------------------------------------------|
| Credentials            | `.env` file, never committed. `.env.example` documents required variables. |
| Configuration          | `config.toml` for application settings                    |
| Commands               | `Makefile` with targets: `dev`, `deploy`, `test`, `lint`, `migrate` |
| Docker                 | Dockerfiles in `docker/`, orchestration in `docker-compose.yaml` |
| Documentation          | README kept short (purpose + setup). Detailed docs in `docs/` |
| Language               | British English in all documentation                      |
| Formatting             | No emojis anywhere                                        |
| Git                    | `.gitignore` maintained, secrets never committed          |

## 7. MCP Configuration

The `.mcp.json` file ships with two MCP servers:

### 7.1 Cloudflare Documentation

Provides Claude with access to current Cloudflare documentation. Used as the fallback for any Cloudflare service not covered by the core port interfaces.

### 7.2 Context7

Provides Claude with up-to-date documentation for React, Hono, Vite, and any other library the user's application pulls in. Prevents stale training data from causing errors.

## 8. Plugin Dependencies

The following Claude Code plugins are required and installed automatically during the `/onboard` skill:

### 8.1 Cloudflare Plugin (`cloudflare@cloudflare`)

Skills used:
- `cloudflare:wrangler` -- CLI operations (init, dev, deploy, d1, kv, r2)
- `cloudflare:workers-best-practices` -- code review against Cloudflare patterns
- `cloudflare:durable-objects` -- Durable Object patterns and lifecycle
- `cloudflare:agents-sdk` -- AI agent development on Workers
- `cloudflare:building-mcp-server-on-cloudflare` -- MCP server builds
- `cloudflare:building-ai-agent-on-cloudflare` -- AI agent builds
- `cloudflare:web-perf` -- performance analysis and optimisation
- `cloudflare:sandbox-sdk` -- sandboxed application patterns

### 8.2 Superpowers Plugin (`superpowers@claude-plugins-official`)

Skills used:
- `superpowers:brainstorming` -- idea refinement before building
- `superpowers:writing-plans` -- implementation planning
- `superpowers:executing-plans` -- plan execution
- `superpowers:subagent-driven-development` -- parallel agent work
- `superpowers:test-driven-development` -- TDD workflow
- `superpowers:systematic-debugging` -- debugging methodology
- `superpowers:verification-before-completion` -- final verification
- `superpowers:finishing-a-development-branch` -- branch completion
- `superpowers:requesting-code-review` -- code review workflow

### 8.3 Context7 Plugin (`context7@claude-plugins-official`)

Provides the Context7 MCP server for library documentation lookups.

### 8.4 Playwright Plugin (`playwright@claude-plugins-official`)

Browser testing support. Used when the application requires end-to-end testing.

## 9. Custom Skills

All custom skills live in `.claude/skills/` and are available to anyone who clones the repository.

### 9.1 `/onboard` -- First-Run Experience

**Trigger:** Claude detects a fresh clone (no `package.json`, no `wrangler.toml`).

**Steps:**
1. Check for and install required plugins:
   - `claude plugin install cloudflare@cloudflare`
   - `claude plugin install superpowers@claude-plugins-official`
   - `claude plugin install context7@claude-plugins-official`
   - `claude plugin install playwright@claude-plugins-official`
2. Check for Node.js and npm. Guide installation if missing.
3. Walk through `npx wrangler login` for Cloudflare authentication.
4. Ask the user to describe their application idea.
5. Invoke `/scaffold` with the gathered description.

### 9.2 `/scaffold` -- Project Generation

**Input:** Application description from the user.

**Steps:**
1. Analyse the description to determine which Cloudflare services are needed.
2. Generate `package.json` with appropriate dependencies.
3. Generate `tsconfig.json` with strict mode.
4. Generate `wrangler.toml` with required bindings.
5. Generate `vite.config.ts` for the frontend build.
6. Create Hono API skeleton in `app/api/`.
7. Create React frontend skeleton in `app/frontend/`.
8. Create only the needed adapter implementations in `app/adapters/cloudflare/`.
9. Create initial business logic in `app/core/`.
10. Populate `Makefile`, `.env.example`, `config.toml`, `docker-compose.yaml`.
11. Populate `docker/` with appropriate Dockerfiles.
12. Update `.gitignore` and `.dockerignore`.
13. Run `npm install`.
14. Run `npm run dev` to verify the scaffold works.

### 9.3 `/add-database` -- Wire Up D1

**Steps:**
1. Check if `DatabasePort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/d1-database.ts` implementing `DatabasePort`.
3. Add D1 binding to `wrangler.toml`.
4. Create `migrations/` directory with initial migration.
5. Update `.env.example` with database name.
6. Update `config.toml` with database settings.
7. Add `migrate` target to `Makefile`.

### 9.4 `/add-storage` -- Wire Up R2

**Steps:**
1. Check if `StoragePort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/r2-storage.ts` implementing `StoragePort`.
3. Add R2 binding to `wrangler.toml`.
4. Update `.env.example` with bucket name.
5. Update `config.toml` with storage settings.

### 9.5 `/add-kv` -- Wire Up KV

**Steps:**
1. Check if `KVStorePort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/kv-store.ts` implementing `KVStorePort`.
3. Add KV binding to `wrangler.toml`.
4. Update `.env.example` with namespace ID.
5. Update `config.toml` with KV settings.

### 9.6 `/add-queue` -- Wire Up Queues

**Steps:**
1. Check if `QueuePort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/queue.ts` implementing `QueuePort`.
3. Add producer and consumer bindings to `wrangler.toml`.
4. Update `.env.example` with queue name.
5. Update `config.toml` with queue settings.

### 9.7 `/add-ai` -- Wire Up Workers AI

**Steps:**
1. Check if `AIPort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/workers-ai.ts` implementing `AIPort`.
3. Add AI binding to `wrangler.toml`.
4. Include model selection guidance as comments in the adapter.

### 9.8 `/add-vectorize` -- Wire Up Vectorize

**Steps:**
1. Check if `VectorizePort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/vectorize.ts` implementing `VectorizePort`.
3. Add Vectorize index binding to `wrangler.toml`.
4. Wire up with Workers AI adapter for embedding generation if `/add-ai` has not been run.
5. Update `.env.example` with index name.

### 9.9 `/add-durable-object` -- Wire Up Durable Objects

**Steps:**
1. Check if `DurableSessionPort` already has an adapter. Skip if so.
2. Create `app/adapters/cloudflare/durable-session.ts` implementing `DurableSessionPort`.
3. Add Durable Object class and binding to `wrangler.toml`.
4. Include WebSocket support if the application requires real-time features.

### 9.10 `/add-auth` -- Authentication System

**Steps:**
1. Create auth middleware for Hono.
2. Create session management using KV or Durable Objects.
3. Create user model and repository using `DatabasePort`.
4. Wire up Cloudflare Turnstile for bot protection if the app has public-facing forms.
5. Update `.env.example` with auth-related secrets.
6. Update `config.toml` with auth settings.

### 9.11 `/deploy` -- Full Deployment

**Steps:**
1. Verify `wrangler login` session is active.
2. Create any required Cloudflare resources:
   - D1 databases (`wrangler d1 create`)
   - R2 buckets (`wrangler r2 bucket create`)
   - KV namespaces (`wrangler kv namespace create`)
   - Vectorize indexes (`wrangler vectorize create`)
3. Run database migrations (`wrangler d1 migrations apply`).
4. Build the frontend (`npm run build`).
5. Deploy to Cloudflare (`wrangler deploy` or `wrangler pages deploy`).
6. Verify the deployment is live and respond with the URL.

## 10. Port Interface Specifications

### 10.1 DatabasePort

```typescript
export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowsAffected: number;
  lastRowId?: number;
}

export interface DatabasePort {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  execute(sql: string, params?: unknown[]): Promise<QueryResult>;
  batch(statements: Array<{ sql: string; params?: unknown[] }>): Promise<QueryResult[]>;
  transaction<T>(fn: (tx: DatabasePort) => Promise<T>): Promise<T>;
}
```

### 10.2 KVStorePort

```typescript
export interface KVStoreOptions {
  ttlSeconds?: number;
  metadata?: Record<string, string>;
}

export interface KVListResult {
  keys: Array<{ name: string; metadata?: Record<string, string> }>;
  cursor?: string;
  complete: boolean;
}

export interface KVStorePort {
  get<T = string>(key: string): Promise<T | null>;
  put(key: string, value: string | ArrayBuffer, options?: KVStoreOptions): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string, cursor?: string, limit?: number): Promise<KVListResult>;
}
```

### 10.3 StoragePort

```typescript
export interface StorageMetadata {
  contentType?: string;
  contentLength?: number;
  customMetadata?: Record<string, string>;
}

export interface StorageObject {
  key: string;
  data: ReadableStream | ArrayBuffer;
  metadata: StorageMetadata;
}

export interface StoragePort {
  get(key: string): Promise<StorageObject | null>;
  put(key: string, data: ReadableStream | ArrayBuffer, metadata?: StorageMetadata): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string, cursor?: string, limit?: number): Promise<{ objects: Array<{ key: string; metadata: StorageMetadata }>; cursor?: string }>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}
```

### 10.4 QueuePort

```typescript
export interface QueueMessage<T = unknown> {
  id: string;
  body: T;
  timestamp: Date;
}

export interface QueuePort<T = unknown> {
  send(message: T): Promise<void>;
  sendBatch(messages: T[]): Promise<void>;
}

export interface QueueConsumer<T = unknown> {
  process(handler: (messages: QueueMessage<T>[]) => Promise<void>): void;
}
```

### 10.5 AIPort

```typescript
export interface AITextOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIPort {
  generateText(prompt: string, options?: AITextOptions): Promise<string>;
  generateEmbedding(text: string, model?: string): Promise<number[]>;
}
```

### 10.6 VectorizePort

```typescript
export interface VectorEntry {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean>;
}

export interface VectorQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface VectorizePort {
  upsert(vectors: VectorEntry[]): Promise<void>;
  query(vector: number[], topK?: number, filter?: Record<string, unknown>): Promise<VectorQueryResult[]>;
  deleteByIds(ids: string[]): Promise<void>;
}
```

### 10.7 DurableSessionPort

```typescript
export interface DurableSessionPort<TState = Record<string, unknown>> {
  getState(): Promise<TState>;
  setState(state: Partial<TState>): Promise<void>;
  alarm(scheduledTime: Date): Promise<void>;
  acceptWebSocket(): WebSocket;
  broadcast(message: string | ArrayBuffer): Promise<void>;
}
```

## 11. CLAUDE.md Structure

CLAUDE.md is organised into the following sections:

### 11.1 Project Identity
- This is a meta-scaffold template for Cloudflare applications.
- Claude's role: the user's entire engineering team.
- Adapt communication to the user's skill level. Default: beginner-friendly with explanations.

### 11.2 First-Run Detection
- If no `package.json` or `wrangler.toml` exists, this is a fresh clone.
- Invoke the `/onboard` skill automatically.

### 11.3 Technology Stack Defaults
- Frontend: React + Vite (unless user specifies otherwise).
- API: Hono on Cloudflare Workers.
- Language: TypeScript with strict mode.
- If Python is needed: always use `uv`, never `pip`.

### 11.4 Architecture Rules
- Hexagonal architecture: ports in `app/ports/`, adapters in `app/adapters/cloudflare/`.
- Business logic in `app/core/` -- zero infrastructure imports.
- No Cloudflare-specific types, bindings, or SDKs in core.
- All infrastructure access via injected port interfaces.

### 11.5 Cloudflare Services Catalogue
- Core services (D1, KV, R2, Queues, Durable Objects, Workers AI, Vectorize): what each does, when to use it, which port it maps to.
- All other services: consult the Cloudflare documentation MCP server.

### 11.6 Project Conventions
- Credentials in `.env`, configuration in `config.toml`.
- Important commands in `Makefile`.
- Dockerfiles in `docker/`, data in `data/`, documentation in `docs/`.
- README kept short. Detailed documentation goes to `docs/`.
- British English, no emojis.
- `.gitignore` and `.dockerignore` maintained.

### 11.7 Skills Reference
- When to invoke each custom skill.
- When to invoke each plugin skill.

### 11.8 Portability Guide
- To migrate: create `app/adapters/<provider>/` and implement the same port interfaces.
- Business logic and ports never change.
- Adapter selection is configured at the composition root.

## 12. README Structure

The README provides a concise, beginner-friendly guide:

### 12.1 What This Is
One paragraph explaining the template: describe your app, Claude builds it on Cloudflare.

### 12.2 Prerequisites
- Claude Code installed
- Node.js (v18+)
- A Cloudflare account (free tier is sufficient)

### 12.3 Quick Start (Step by Step)
1. Clone the repository.
2. Open the project directory in your terminal.
3. Run `claude` to start Claude Code.
4. Claude will detect this is a fresh project and begin the onboarding flow:
   - It installs required Claude Code plugins (Cloudflare, Superpowers, Context7, Playwright). You will be asked to approve each installation.
   - It checks for Node.js and guides you through installation if needed.
   - It runs `npx wrangler login` to authenticate with Cloudflare. A browser window opens for you to log in to your Cloudflare account.
   - It asks you to describe your application idea.
5. Claude generates the entire project based on your description.
6. Claude runs the development server. You can view your app in the browser.
7. When ready, tell Claude to deploy. It creates the required Cloudflare resources and deploys.

### 12.4 What Happens Behind the Scenes
Brief explanation of the architecture, port/adapter pattern, and why this makes the app portable.

### 12.5 Available Commands
Reference to the Makefile targets and key skills the user can invoke.

### 12.6 Recommended Plugins
List of plugins Claude installs automatically, with brief descriptions.

### 12.7 Further Reading
Pointers to `docs/architecture.md` and other documentation.

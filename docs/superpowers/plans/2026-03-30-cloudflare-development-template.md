# Cloudflare Development Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a git template repository where CLAUDE.md, custom skills, and port interfaces enable Claude Code to scaffold, build, and deploy any application on Cloudflare from a user's idea description.

**Architecture:** The template ships no application code -- only instruction files (CLAUDE.md, skills), port interfaces (TypeScript interfaces in `app/ports/`), configuration (.mcp.json, Makefile, Docker), and documentation. Claude generates all application code at runtime based on the user's description. Hexagonal architecture enforces portability via ports and adapters.

**Tech Stack:** TypeScript (strict), React + Vite (frontend default), Hono (API), Cloudflare Workers/Pages/D1/KV/R2/Queues/Durable Objects/Workers AI/Vectorize.

---

## File Map

### Root configuration files
- Create: `.gitignore` -- git ignore rules for Node.js, Cloudflare, env files
- Create: `.dockerignore` -- Docker build context exclusions
- Create: `.env.example` -- template for required credentials
- Create: `.mcp.json` -- MCP server configuration (empty placeholder, plugins provide the servers)
- Create: `config.toml` -- application configuration template
- Create: `Makefile` -- key development commands
- Create: `docker-compose.yaml` -- container orchestration template
- Create: `CLAUDE.md` -- the brain; all instructions for Claude
- Create: `README.md` -- beginner-friendly setup guide

### Port interfaces (app/ports/)
- Create: `app/ports/database.ts` -- DatabasePort interface
- Create: `app/ports/kv-store.ts` -- KVStorePort interface
- Create: `app/ports/storage.ts` -- StoragePort interface
- Create: `app/ports/queue.ts` -- QueuePort interface
- Create: `app/ports/ai.ts` -- AIPort interface
- Create: `app/ports/vectorize.ts` -- VectorizePort interface
- Create: `app/ports/durable-session.ts` -- DurableSessionPort interface

### Custom skills (.claude/skills/)
- Create: `.claude/skills/onboard.md` -- first-run experience
- Create: `.claude/skills/scaffold.md` -- project generation
- Create: `.claude/skills/add-database.md` -- wire up D1
- Create: `.claude/skills/add-storage.md` -- wire up R2
- Create: `.claude/skills/add-kv.md` -- wire up KV
- Create: `.claude/skills/add-queue.md` -- wire up Queues
- Create: `.claude/skills/add-ai.md` -- wire up Workers AI
- Create: `.claude/skills/add-vectorize.md` -- wire up Vectorize
- Create: `.claude/skills/add-durable-object.md` -- wire up Durable Objects
- Create: `.claude/skills/add-auth.md` -- authentication system
- Create: `.claude/skills/deploy.md` -- deployment flow

### Documentation (docs/)
- Create: `docs/architecture.md` -- port/adapter pattern explanation
- Create: `docker/.gitkeep` -- placeholder for Dockerfiles directory
- Create: `data/.gitkeep` -- placeholder for data directory

---

## Task 1: Root Configuration Files

**Files:**
- Create: `.gitignore`
- Create: `.dockerignore`
- Create: `.env.example`
- Create: `config.toml`
- Create: `.mcp.json`

- [ ] **Step 1: Create `.gitignore`**

```gitignore
# Dependencies
node_modules/

# Build output
dist/
.wrangler/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Test coverage
coverage/

# TypeScript build cache
*.tsbuildinfo

# Data directory contents (keep directory)
data/*
!data/.gitkeep
```

- [ ] **Step 2: Create `.dockerignore`**

```dockerignore
node_modules/
dist/
.wrangler/
.git/
.gitignore
.env
.env.local
.env.*.local
*.log
npm-debug.log*
coverage/
docs/
.claude/
*.md
!README.md
```

- [ ] **Step 3: Create `.env.example`**

```env
# Cloudflare
# These values are populated automatically by wrangler after login.
# You do not need to fill them in manually unless deploying from CI/CD.
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# Application
# Add application-specific credentials below as needed.
# Claude will update this file when adding services (e.g., /add-database, /add-auth).
```

- [ ] **Step 4: Create `config.toml`**

```toml
# Application Configuration
# This file is checked into git. Do NOT put secrets here -- use .env instead.
# Claude updates this file when scaffolding the application and adding services.

[app]
name = ""
environment = "development"
```

- [ ] **Step 5: Create `.mcp.json`**

```json
{
  "mcpServers": {}
}
```

Note: The Cloudflare docs and Context7 MCP servers are provided by the Cloudflare and Context7 plugins respectively. They become available automatically once the plugins are installed during `/onboard`. The `.mcp.json` file is kept as an empty placeholder so that Claude or the user can add project-specific MCP servers later.

- [ ] **Step 6: Commit**

```bash
git add .gitignore .dockerignore .env.example config.toml .mcp.json
git commit -m "Add root configuration files

Set up .gitignore, .dockerignore, .env.example, config.toml, and
.mcp.json as the foundation for the template repository."
```

---

## Task 2: Makefile and Docker

**Files:**
- Create: `Makefile`
- Create: `docker-compose.yaml`
- Create: `docker/.gitkeep`
- Create: `data/.gitkeep`

- [ ] **Step 1: Create `Makefile`**

```makefile
.PHONY: dev build deploy test lint migrate clean help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start the development server
	npx wrangler dev

build: ## Build the frontend and worker
	npm run build

deploy: ## Deploy to Cloudflare
	npx wrangler deploy

test: ## Run tests
	npm test

lint: ## Run linter
	npm run lint

migrate: ## Run D1 database migrations
	npx wrangler d1 migrations apply

clean: ## Remove build artifacts
	rm -rf dist/ node_modules/ .wrangler/
```

- [ ] **Step 2: Create `docker-compose.yaml`**

```yaml
# Docker Compose configuration.
# Claude populates this file during /scaffold based on the application's needs.
# Typical services: app (the Worker), database (local D1 substitute for testing).

services: {}
```

- [ ] **Step 3: Create `docker/.gitkeep` and `data/.gitkeep`**

Create both files as empty placeholders so git tracks the directories.

- [ ] **Step 4: Commit**

```bash
git add Makefile docker-compose.yaml docker/.gitkeep data/.gitkeep
git commit -m "Add Makefile, Docker configuration, and data directory

Makefile provides dev, build, deploy, test, lint, migrate, and clean
targets. Docker and data directories are placeholders populated during
scaffolding."
```

---

## Task 3: Port Interfaces

**Files:**
- Create: `app/ports/database.ts`
- Create: `app/ports/kv-store.ts`
- Create: `app/ports/storage.ts`
- Create: `app/ports/queue.ts`
- Create: `app/ports/ai.ts`
- Create: `app/ports/vectorize.ts`
- Create: `app/ports/durable-session.ts`

- [ ] **Step 1: Create `app/ports/database.ts`**

```typescript
export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowsAffected: number;
  lastRowId?: number;
}

export interface DatabasePort {
  query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;

  execute(sql: string, params?: unknown[]): Promise<QueryResult>;

  batch(
    statements: Array<{ sql: string; params?: unknown[] }>,
  ): Promise<QueryResult[]>;

  transaction<T>(fn: (tx: DatabasePort) => Promise<T>): Promise<T>;
}
```

- [ ] **Step 2: Create `app/ports/kv-store.ts`**

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

  put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVStoreOptions,
  ): Promise<void>;

  delete(key: string): Promise<void>;

  list(
    prefix?: string,
    cursor?: string,
    limit?: number,
  ): Promise<KVListResult>;
}
```

- [ ] **Step 3: Create `app/ports/storage.ts`**

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

export interface StorageListResult {
  objects: Array<{ key: string; metadata: StorageMetadata }>;
  cursor?: string;
}

export interface StoragePort {
  get(key: string): Promise<StorageObject | null>;

  put(
    key: string,
    data: ReadableStream | ArrayBuffer,
    metadata?: StorageMetadata,
  ): Promise<void>;

  delete(key: string): Promise<void>;

  list(
    prefix?: string,
    cursor?: string,
    limit?: number,
  ): Promise<StorageListResult>;

  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}
```

- [ ] **Step 4: Create `app/ports/queue.ts`**

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
  process(
    handler: (messages: QueueMessage<T>[]) => Promise<void>,
  ): void;
}
```

- [ ] **Step 5: Create `app/ports/ai.ts`**

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

- [ ] **Step 6: Create `app/ports/vectorize.ts`**

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

  query(
    vector: number[],
    topK?: number,
    filter?: Record<string, unknown>,
  ): Promise<VectorQueryResult[]>;

  deleteByIds(ids: string[]): Promise<void>;
}
```

- [ ] **Step 7: Create `app/ports/durable-session.ts`**

```typescript
// WebSocket refers to the standard Web API WebSocket, not a Cloudflare-specific type.
export interface DurableSessionPort<TState = Record<string, unknown>> {
  getState(): Promise<TState>;
  setState(state: Partial<TState>): Promise<void>;
  alarm(scheduledTime: Date): Promise<void>;
  acceptWebSocket(): WebSocket;
  broadcast(message: string | ArrayBuffer): Promise<void>;
}
```

- [ ] **Step 8: Commit**

```bash
git add app/ports/
git commit -m "Add port interfaces for all Cloudflare services

Define DatabasePort, KVStorePort, StoragePort, QueuePort, AIPort,
VectorizePort, and DurableSessionPort. These typed interfaces form
the abstraction contract that keeps business logic decoupled from
Cloudflare infrastructure."
```

---

## Task 4: Onboard Skill

**Files:**
- Create: `.claude/skills/onboard.md`

- [ ] **Step 1: Create `.claude/skills/onboard.md`**

```markdown
---
name: onboard
description: First-run experience -- install plugins, authenticate with Cloudflare, and gather the user's application idea
---

# Onboard

This skill runs when a user opens the template for the first time.

## Trigger

Run this skill when the project has no `package.json` and no `wrangler.toml`. These files are absent in a fresh clone and are only created during scaffolding.

## Steps

### 1. Install Required Plugins

Check which plugins are already installed. For each missing plugin, run the install command. The user will be prompted to approve each installation.

```bash
claude plugin install cloudflare@cloudflare
claude plugin install superpowers@claude-plugins-official
claude plugin install context7@claude-plugins-official
claude plugin install playwright@claude-plugins-official
```

If a plugin is already installed, skip it. Do not reinstall.

### 2. Check Prerequisites

Verify that Node.js (v18+) and npm are available:

```bash
node --version
npm --version
```

If Node.js is not installed, explain that it is required and guide the user to https://nodejs.org/ or suggest using nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install --lts
```

Wait for the user to confirm Node.js is installed before continuing.

### 3. Authenticate with Cloudflare

Run wrangler login. This opens a browser window for the user to log in to their Cloudflare account.

```bash
npx wrangler login
```

Explain to the user: "A browser window will open. Log in to your Cloudflare account (or create one -- the free tier is sufficient). Once you have authorised wrangler, come back here."

Verify the login succeeded:

```bash
npx wrangler whoami
```

If it fails, ask the user to try again.

### 4. Gather the Application Idea

Ask the user to describe their application. Use open-ended prompting:

> "What application would you like to build? Describe the idea in your own words -- what it does, who it is for, and any features you have in mind. Do not worry about technical details; I will handle those."

Listen for:
- The core purpose of the application
- Who the target users are
- Key features and functionality
- Any specific requirements (e.g., "needs real-time updates", "handles file uploads")

If the description is vague, ask one clarifying question at a time. Do not overwhelm with multiple questions.

### 5. Hand Off to Scaffold

Once you understand the application well enough to determine:
- Whether it needs a frontend, API, or both
- Which Cloudflare services it requires (D1, KV, R2, Queues, AI, Vectorize, Durable Objects)
- The core data model

Invoke the `/scaffold` skill with the gathered information.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/onboard.md
git commit -m "Add /onboard skill for first-run experience

Handles plugin installation, Node.js verification, Cloudflare
authentication, and gathering the user's application idea before
handing off to /scaffold."
```

---

## Task 5: Scaffold Skill

**Files:**
- Create: `.claude/skills/scaffold.md`

- [ ] **Step 1: Create `.claude/skills/scaffold.md`**

```markdown
---
name: scaffold
description: Generate full project structure from the user's application description
---

# Scaffold

Generate the complete project structure based on the user's application description gathered during `/onboard`.

## Input

The application description including:
- Core purpose and target users
- Required features
- Which Cloudflare services are needed

## Steps

### 1. Analyse Requirements

Determine from the description:
- **Frontend needed?** If the app has a UI, scaffold React + Vite. If API-only, skip.
- **Which services?** Map features to Cloudflare services:
  - Persistent data --> D1 (invoke `/add-database`)
  - Key-value caching or sessions --> KV (invoke `/add-kv`)
  - File uploads or media --> R2 (invoke `/add-storage`)
  - Background jobs or async processing --> Queues (invoke `/add-queue`)
  - AI features (text generation, embeddings) --> Workers AI (invoke `/add-ai`)
  - Search or recommendations --> Vectorize (invoke `/add-vectorize`)
  - Real-time collaboration or WebSockets --> Durable Objects (invoke `/add-durable-object`)
  - User accounts or login --> invoke `/add-auth`

### 2. Generate `package.json`

Create `package.json` with:
- Project name derived from `config.toml` `app.name` (or ask the user)
- Dependencies: `hono` for the API layer
- Dependencies: `react`, `react-dom`, `vite`, `@vitejs/plugin-react` if frontend is needed
- Dev dependencies: `wrangler`, `typescript`, `@cloudflare/workers-types`, `vitest`
- Scripts:
  - `dev`: `wrangler dev`
  - `build`: `vite build` (if frontend) or `wrangler deploy --dry-run`
  - `test`: `vitest run`
  - `lint`: `tsc --noEmit`

### 3. Generate `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./app"
  },
  "include": ["app/**/*.ts", "app/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Generate `wrangler.toml`

Create a minimal `wrangler.toml` with:
- `name` from the project name
- `main` pointing to the Worker entry point (`app/api/index.ts`)
- `compatibility_date` set to today's date
- Bindings added by the `/add-*` skills as needed

### 5. Generate Application Skeleton

Create the Hono API entry point at `app/api/index.ts`:

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
```

If frontend is needed, generate `vite.config.ts` and the React skeleton:
- `app/frontend/index.html`
- `app/frontend/main.tsx`
- `app/frontend/App.tsx`

Create `app/core/` directory for business logic (initially empty; Claude populates during development).

### 6. Wire Up Required Services

For each Cloudflare service identified in step 1, invoke the corresponding `/add-*` skill:
- `/add-database` for D1
- `/add-kv` for KV
- `/add-storage` for R2
- `/add-queue` for Queues
- `/add-ai` for Workers AI
- `/add-vectorize` for Vectorize
- `/add-durable-object` for Durable Objects
- `/add-auth` for authentication

Each skill creates the adapter, updates `wrangler.toml`, and updates `.env.example` and `config.toml`.

### 7. Populate Configuration Files

Update `Makefile` targets if any service-specific commands are needed.

Update `config.toml` with the application name and environment.

Update `docker-compose.yaml` if the app needs local services for development.

Populate `docker/Dockerfile` with a multi-stage build:
- Stage 1: Build (Node.js, npm install, npm run build)
- Stage 2: Runtime (minimal image with built output)

Update `.gitignore` and `.dockerignore` with any new patterns.

### 8. Install and Verify

```bash
npm install
npm run dev
```

Open the development URL in the browser to verify the scaffold is working. Report the URL to the user.

### 9. Commit the Scaffold

```bash
git add -A
git commit -m "scaffold: generate project from application description"
```

Explain to the user what was created and what each directory contains.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/scaffold.md
git commit -m "Add /scaffold skill for project generation

Analyses the user's application description, generates package.json,
tsconfig, wrangler.toml, Hono API skeleton, optional React frontend,
and invokes /add-* skills for each required Cloudflare service."
```

---

## Task 6: Service Skills (add-database, add-storage, add-kv, add-queue)

**Files:**
- Create: `.claude/skills/add-database.md`
- Create: `.claude/skills/add-storage.md`
- Create: `.claude/skills/add-kv.md`
- Create: `.claude/skills/add-queue.md`

- [ ] **Step 1: Create `.claude/skills/add-database.md`**

```markdown
---
name: add-database
description: Wire up Cloudflare D1 database with the DatabasePort abstraction layer
---

# Add Database (D1)

Wire up Cloudflare D1 as the relational database, implementing the `DatabasePort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/d1-database.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/database.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/d1-database.ts` that implements `DatabasePort` from `app/ports/database.ts`.

The adapter:
- Accepts a `D1Database` binding in its constructor
- Maps `query()` to `d1.prepare(sql).bind(...params).all()`
- Maps `execute()` to `d1.prepare(sql).bind(...params).run()`
- Maps `batch()` to `d1.batch()`
- Maps `transaction()` -- note that D1 does not support interactive transactions; implement as a batch of statements wrapped in a savepoint

### 2. Update `wrangler.toml`

Add the D1 binding:

```toml
[[d1_databases]]
binding = "DB"
database_name = "<app-name>-db"
database_id = ""  # Populated after running: npx wrangler d1 create <app-name>-db
```

Use the application name from `config.toml` for the database name.

### 3. Create Migrations Directory

Create `migrations/0001_initial.sql` with a comment explaining that this file should contain the initial schema. If the application's data model is already known, generate the CREATE TABLE statements.

### 4. Update Configuration

Add to `.env.example`:
```
# D1 Database
# database_id is populated after running: npx wrangler d1 create <app-name>-db
D1_DATABASE_ID=
```

Add to `config.toml`:
```toml
[database]
name = "<app-name>-db"
migrations_dir = "migrations"
```

### 5. Update Makefile

Ensure the `migrate` target exists:
```makefile
migrate: ## Run D1 database migrations
	npx wrangler d1 migrations apply $(shell grep 'database_name' wrangler.toml | head -1 | cut -d'"' -f2) --local
```

### 6. Commit

```bash
git add app/adapters/cloudflare/d1-database.ts migrations/ wrangler.toml .env.example config.toml Makefile
git commit -m "feat: wire up D1 database with DatabasePort adapter"
```
```

- [ ] **Step 2: Create `.claude/skills/add-storage.md`**

```markdown
---
name: add-storage
description: Wire up Cloudflare R2 object storage with the StoragePort abstraction layer
---

# Add Storage (R2)

Wire up Cloudflare R2 as object/blob storage, implementing the `StoragePort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/r2-storage.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/storage.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/r2-storage.ts` that implements `StoragePort` from `app/ports/storage.ts`.

The adapter:
- Accepts an `R2Bucket` binding in its constructor
- Maps `get()` to `bucket.get(key)` and wraps the result as a `StorageObject`
- Maps `put()` to `bucket.put(key, data, { httpMetadata, customMetadata })`
- Maps `delete()` to `bucket.delete(key)`
- Maps `list()` to `bucket.list({ prefix, cursor, limit })`
- Maps `getSignedUrl()` -- note that R2 does not natively support presigned URLs from Workers; implement using a signed URL pattern with a time-limited token, or document that this method requires a custom implementation

### 2. Update `wrangler.toml`

Add the R2 binding:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "<app-name>-storage"
```

### 3. Update Configuration

Add to `.env.example`:
```
# R2 Storage
# Bucket is created with: npx wrangler r2 bucket create <app-name>-storage
R2_BUCKET_NAME=
```

Add to `config.toml`:
```toml
[storage]
bucket_name = "<app-name>-storage"
```

### 4. Commit

```bash
git add app/adapters/cloudflare/r2-storage.ts wrangler.toml .env.example config.toml
git commit -m "feat: wire up R2 storage with StoragePort adapter"
```
```

- [ ] **Step 3: Create `.claude/skills/add-kv.md`**

```markdown
---
name: add-kv
description: Wire up Cloudflare KV key-value store with the KVStorePort abstraction layer
---

# Add KV Store

Wire up Cloudflare KV as the key-value store, implementing the `KVStorePort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/kv-store.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/kv-store.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/kv-store.ts` that implements `KVStorePort` from `app/ports/kv-store.ts`.

The adapter:
- Accepts a `KVNamespace` binding in its constructor
- Maps `get()` to `kv.get(key)` with appropriate type parsing
- Maps `put()` to `kv.put(key, value, { expirationTtl, metadata })`
- Maps `delete()` to `kv.delete(key)`
- Maps `list()` to `kv.list({ prefix, cursor, limit })`

### 2. Update `wrangler.toml`

Add the KV binding:

```toml
[[kv_namespaces]]
binding = "KV"
id = ""  # Populated after running: npx wrangler kv namespace create <app-name>-kv
```

### 3. Update Configuration

Add to `.env.example`:
```
# KV Namespace
# Created with: npx wrangler kv namespace create <app-name>-kv
KV_NAMESPACE_ID=
```

Add to `config.toml`:
```toml
[kv]
namespace = "<app-name>-kv"
```

### 4. Commit

```bash
git add app/adapters/cloudflare/kv-store.ts wrangler.toml .env.example config.toml
git commit -m "feat: wire up KV store with KVStorePort adapter"
```
```

- [ ] **Step 4: Create `.claude/skills/add-queue.md`**

```markdown
---
name: add-queue
description: Wire up Cloudflare Queues with the QueuePort abstraction layer
---

# Add Queue

Wire up Cloudflare Queues for async message processing, implementing the `QueuePort` and `QueueConsumer` interfaces.

## Pre-check

1. Read `app/adapters/cloudflare/queue.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/queue.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/queue.ts` that implements `QueuePort` and `QueueConsumer` from `app/ports/queue.ts`.

The adapter:
- Producer: accepts a `Queue` binding in its constructor
  - Maps `send()` to `queue.send(message)`
  - Maps `sendBatch()` to `queue.sendBatch(messages.map(body => ({ body })))`
- Consumer: exports a `queue` handler function for `wrangler.toml`
  - Maps `process()` to the `queue(batch, env)` export handler

### 2. Update `wrangler.toml`

Add the Queue producer binding:

```toml
[[queues.producers]]
queue = "<app-name>-queue"
binding = "QUEUE"

[[queues.consumers]]
queue = "<app-name>-queue"
max_batch_size = 10
max_batch_timeout = 30
```

### 3. Update Configuration

Add to `.env.example`:
```
# Queue
# Created with: npx wrangler queues create <app-name>-queue
QUEUE_NAME=
```

Add to `config.toml`:
```toml
[queue]
name = "<app-name>-queue"
max_batch_size = 10
max_batch_timeout = 30
```

### 4. Commit

```bash
git add app/adapters/cloudflare/queue.ts wrangler.toml .env.example config.toml
git commit -m "feat: wire up Queues with QueuePort adapter"
```
```

- [ ] **Step 5: Commit all four skills**

```bash
git add .claude/skills/add-database.md .claude/skills/add-storage.md .claude/skills/add-kv.md .claude/skills/add-queue.md
git commit -m "Add /add-database, /add-storage, /add-kv, /add-queue skills

Each skill wires up a Cloudflare service with its corresponding
port interface, updates wrangler.toml bindings, and maintains
.env.example and config.toml."
```

---

## Task 7: Service Skills (add-ai, add-vectorize, add-durable-object, add-auth)

**Files:**
- Create: `.claude/skills/add-ai.md`
- Create: `.claude/skills/add-vectorize.md`
- Create: `.claude/skills/add-durable-object.md`
- Create: `.claude/skills/add-auth.md`

- [ ] **Step 1: Create `.claude/skills/add-ai.md`**

```markdown
---
name: add-ai
description: Wire up Cloudflare Workers AI with the AIPort abstraction layer
---

# Add AI (Workers AI)

Wire up Cloudflare Workers AI for text generation and embeddings, implementing the `AIPort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/workers-ai.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/ai.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/workers-ai.ts` that implements `AIPort` from `app/ports/ai.ts`.

The adapter:
- Accepts an `Ai` binding in its constructor
- Maps `generateText()` to `ai.run(model, { prompt, max_tokens, temperature })`
  - Default model: `@cf/meta/llama-3.1-8b-instruct` (or current recommended model -- check Cloudflare docs via the MCP server)
  - Supports system prompt via the messages array format
- Maps `generateEmbedding()` to `ai.run(model, { text })`
  - Default embedding model: `@cf/baai/bge-base-en-v1.5` (or current recommended -- check Cloudflare docs)

### 2. Update `wrangler.toml`

Add the AI binding:

```toml
[ai]
binding = "AI"
```

### 3. Commit

```bash
git add app/adapters/cloudflare/workers-ai.ts wrangler.toml
git commit -m "feat: wire up Workers AI with AIPort adapter"
```
```

- [ ] **Step 2: Create `.claude/skills/add-vectorize.md`**

```markdown
---
name: add-vectorize
description: Wire up Cloudflare Vectorize with the VectorizePort abstraction layer
---

# Add Vectorize

Wire up Cloudflare Vectorize for vector search, implementing the `VectorizePort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/vectorize.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/vectorize.ts` to confirm the port interface is present.

## Steps

### 1. Ensure AI is Available

Vectorize typically requires embeddings. Check if `app/adapters/cloudflare/workers-ai.ts` exists. If not, invoke `/add-ai` first so that embeddings can be generated.

### 2. Create the Adapter

Create `app/adapters/cloudflare/vectorize.ts` that implements `VectorizePort` from `app/ports/vectorize.ts`.

The adapter:
- Accepts a `VectorizeIndex` binding in its constructor
- Maps `upsert()` to `index.upsert(vectors)`
- Maps `query()` to `index.query(vector, { topK, filter })`
- Maps `deleteByIds()` to `index.deleteByIds(ids)`

### 3. Update `wrangler.toml`

Add the Vectorize binding:

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "<app-name>-index"
```

### 4. Update Configuration

Add to `.env.example`:
```
# Vectorize
# Created with: npx wrangler vectorize create <app-name>-index --dimensions 768 --metric cosine
VECTORIZE_INDEX_NAME=
```

Add to `config.toml`:
```toml
[vectorize]
index_name = "<app-name>-index"
dimensions = 768
metric = "cosine"
```

### 5. Commit

```bash
git add app/adapters/cloudflare/vectorize.ts wrangler.toml .env.example config.toml
git commit -m "feat: wire up Vectorize with VectorizePort adapter"
```
```

- [ ] **Step 3: Create `.claude/skills/add-durable-object.md`**

```markdown
---
name: add-durable-object
description: Wire up Cloudflare Durable Objects with the DurableSessionPort abstraction layer
---

# Add Durable Object

Wire up Cloudflare Durable Objects for stateful edge compute, implementing the `DurableSessionPort` interface.

## Pre-check

1. Read `app/adapters/cloudflare/durable-session.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/durable-session.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/durable-session.ts` that implements `DurableSessionPort` from `app/ports/durable-session.ts`.

The adapter is a Durable Object class that:
- Uses `this.ctx.storage` for `getState()` and `setState()`
- Uses `this.ctx.storage.setAlarm()` for `alarm()`
- Uses `this.ctx.acceptWebSocket()` for `acceptWebSocket()`
- Implements `broadcast()` by iterating `this.ctx.getWebSockets()` and sending to each
- Exports the class so it can be referenced in `wrangler.toml`

Also create a helper function or factory for obtaining a Durable Object stub from a Hono route handler, so business logic does not need to interact with the `DurableObjectNamespace` binding directly.

### 2. Update `wrangler.toml`

Add the Durable Object binding:

```toml
[durable_objects]
bindings = [
  { name = "SESSION", class_name = "DurableSession" }
]

[[migrations]]
tag = "v1"
new_classes = ["DurableSession"]
```

### 3. Commit

```bash
git add app/adapters/cloudflare/durable-session.ts wrangler.toml
git commit -m "feat: wire up Durable Objects with DurableSessionPort adapter"
```
```

- [ ] **Step 4: Create `.claude/skills/add-auth.md`**

```markdown
---
name: add-auth
description: Add authentication system with session management and bot protection
---

# Add Authentication

Add a complete authentication system to the application.

## Pre-check

1. Check if authentication middleware already exists in `app/api/`. If so, inform the user and stop.
2. Ensure `/add-database` has been run (authentication needs user storage). If not, run it first.
3. Ensure `/add-kv` has been run (session storage). If not, run it first.

## Steps

### 1. Create Auth Middleware

Create `app/api/middleware/auth.ts` with a Hono middleware that:
- Reads a session token from cookies or the `Authorization` header
- Looks up the session in KV via `KVStorePort`
- Attaches the user to the Hono context if the session is valid
- Returns 401 if the session is invalid or missing

### 2. Create User Repository

Create `app/core/user-repository.ts` that uses `DatabasePort` to:
- `findById(id)` -- look up a user by ID
- `findByEmail(email)` -- look up a user by email
- `create(user)` -- insert a new user
- `verifyPassword(email, password)` -- verify credentials (use a secure hashing algorithm; recommend bcrypt or argon2)

This file lives in `app/core/` and depends only on the `DatabasePort` interface.

### 3. Create Session Management

Create `app/core/session-manager.ts` that uses `KVStorePort` to:
- `create(userId)` -- generate a session token, store in KV with TTL
- `validate(token)` -- look up and return the session
- `destroy(token)` -- delete the session from KV

This file lives in `app/core/` and depends only on the `KVStorePort` interface.

### 4. Create Auth Routes

Create `app/api/routes/auth.ts` with Hono routes for:
- `POST /api/auth/register` -- create account
- `POST /api/auth/login` -- authenticate and create session
- `POST /api/auth/logout` -- destroy session
- `GET /api/auth/me` -- return current user (protected)

### 5. Add Cloudflare Turnstile (Optional)

If the application has public-facing forms, add Turnstile bot protection:
- Create `app/api/middleware/turnstile.ts` that validates the `cf-turnstile-response` token
- Apply to registration and login routes

### 6. Create Database Migration

Create `migrations/0002_users.sql` with:
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 7. Update Configuration

Add to `.env.example`:
```
# Authentication
SESSION_SECRET=
# Turnstile (optional -- for bot protection on public forms)
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Add to `config.toml`:
```toml
[auth]
session_ttl_seconds = 86400  # 24 hours
enable_turnstile = false
```

### 8. Commit

```bash
git add app/api/middleware/ app/core/user-repository.ts app/core/session-manager.ts app/api/routes/auth.ts migrations/ .env.example config.toml
git commit -m "feat: add authentication system with session management"
```
```

- [ ] **Step 5: Commit all four skills**

```bash
git add .claude/skills/add-ai.md .claude/skills/add-vectorize.md .claude/skills/add-durable-object.md .claude/skills/add-auth.md
git commit -m "Add /add-ai, /add-vectorize, /add-durable-object, /add-auth skills

Complete the service skills catalogue. Each skill wires up its
Cloudflare service with the corresponding port interface."
```

---

## Task 8: Deploy Skill

**Files:**
- Create: `.claude/skills/deploy.md`

- [ ] **Step 1: Create `.claude/skills/deploy.md`**

```markdown
---
name: deploy
description: Deploy the application to Cloudflare -- create resources, run migrations, and publish
---

# Deploy

Handle the full deployment flow: create Cloudflare resources, run migrations, build, and deploy.

## Pre-check

1. Verify wrangler is authenticated:
   ```bash
   npx wrangler whoami
   ```
   If not authenticated, run `npx wrangler login` and wait for the user to complete the flow.

2. Read `wrangler.toml` to determine which resources need to be created.

## Steps

### 1. Create Cloudflare Resources

For each binding in `wrangler.toml` that has an empty ID or has not been created yet:

**D1 Database:**
```bash
npx wrangler d1 create <database-name>
```
Copy the returned `database_id` into `wrangler.toml`.

**KV Namespace:**
```bash
npx wrangler kv namespace create <namespace-name>
```
Copy the returned `id` into `wrangler.toml`.

**R2 Bucket:**
```bash
npx wrangler r2 bucket create <bucket-name>
```

**Queues:**
```bash
npx wrangler queues create <queue-name>
```

**Vectorize Index:**
```bash
npx wrangler vectorize create <index-name> --dimensions <dim> --metric <metric>
```
Use dimensions and metric from `config.toml`.

### 2. Run Database Migrations

If D1 is configured:
```bash
npx wrangler d1 migrations apply <database-name> --remote
```

### 3. Build

```bash
npm run build
```

Verify the build succeeds with no errors.

### 4. Deploy

For Workers:
```bash
npx wrangler deploy
```

For Pages (if the project uses a separate Pages deployment):
```bash
npx wrangler pages deploy dist/
```

### 5. Verify

After deployment, wrangler prints the live URL. Report this to the user.

If possible, make a quick health check request:
```bash
curl -s <deployed-url>/api/health
```

Expected response: `{"status":"ok"}`

### 6. Commit Deployment Config

If `wrangler.toml` was updated with resource IDs:
```bash
git add wrangler.toml
git commit -m "chore: update wrangler.toml with deployed resource IDs"
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/deploy.md
git commit -m "Add /deploy skill for Cloudflare deployment

Handles resource creation (D1, KV, R2, Queues, Vectorize),
database migrations, build, deploy, and verification."
```

---

## Task 9: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
# Cloudflare Development Template

## Project Identity

This is a meta-scaffold template for building applications on Cloudflare. You are the user's entire engineering team. Your job is to understand their application idea and build it -- from scaffolding to deployment.

**Adapt to the user's skill level.** Most users are beginners with no coding experience. Default to explaining your decisions in plain language. If the user demonstrates technical knowledge (uses specific terminology, asks about implementation details, pushes back on architectural choices), adjust to a more concise, peer-level communication style.

## First-Run Detection

**If `package.json` and `wrangler.toml` do not exist, this is a fresh clone.** Run the `/onboard` skill immediately. Do not wait for the user to ask.

## Technology Stack

Use these defaults unless the user specifies otherwise:

| Concern   | Default              |
|-----------|----------------------|
| Language  | TypeScript (strict)  |
| Frontend  | React + Vite         |
| API       | Hono                 |
| Runtime   | Cloudflare Workers   |
| Hosting   | Cloudflare Pages     |

If the user asks for a different frontend framework (Vue, Svelte, Angular), use it. If the user wants no frontend (API-only), skip it.

If Python is needed for any reason, always use `uv` as the package manager. Never use `pip`.

## Architecture Rules

Follow hexagonal architecture (ports and adapters). This is non-negotiable -- it is what makes the application portable.

### Directory Structure

```
app/
  ports/           # TypeScript interfaces -- NEVER modify these
  adapters/
    cloudflare/    # Cloudflare-specific implementations of ports
  core/            # Business logic -- ZERO infrastructure imports
  api/             # Hono routes and middleware
  frontend/        # React (or other framework) application
```

### The One Rule

**`app/core/` must have zero imports from Cloudflare SDKs, Workers APIs, or any infrastructure library.** All infrastructure access goes through port interfaces defined in `app/ports/` and injected at the boundary (Hono route handlers or a composition root).

These are never permitted in `app/core/`:
- Imports from `@cloudflare/workers-types`, `wrangler`, or Cloudflare SDK packages
- References to `env.DB`, `env.KV`, `env.BUCKET`, or any Workers binding
- Cloudflare-specific types (`D1Database`, `KVNamespace`, `R2Bucket`)

### Adapters

Each Cloudflare service has a corresponding adapter in `app/adapters/cloudflare/` that implements the port interface from `app/ports/`. The adapters are the only files that import Cloudflare-specific code.

To migrate the application to another provider (AWS, Azure), create `app/adapters/aws/` or `app/adapters/azure/` and implement the same port interfaces. Business logic and ports do not change.

## Cloudflare Services

Use the following services and their corresponding ports:

| Service          | Port Interface      | Adapter File                              | When to Use                              |
|------------------|---------------------|-------------------------------------------|------------------------------------------|
| D1               | `DatabasePort`      | `app/adapters/cloudflare/d1-database.ts`  | Relational data, SQL queries             |
| KV               | `KVStorePort`       | `app/adapters/cloudflare/kv-store.ts`     | Key-value cache, session storage         |
| R2               | `StoragePort`       | `app/adapters/cloudflare/r2-storage.ts`   | File uploads, media, binary objects      |
| Queues           | `QueuePort`         | `app/adapters/cloudflare/queue.ts`        | Background jobs, async processing        |
| Workers AI       | `AIPort`            | `app/adapters/cloudflare/workers-ai.ts`   | Text generation, embeddings              |
| Vectorize        | `VectorizePort`     | `app/adapters/cloudflare/vectorize.ts`    | Semantic search, recommendations         |
| Durable Objects  | `DurableSessionPort`| `app/adapters/cloudflare/durable-session.ts` | Real-time, WebSockets, stateful sessions |

For any Cloudflare service not listed above (Hyperdrive, Browser Rendering, Email Workers, Images, Stream, Calls, Pub/Sub, Analytics Engine, Rate Limiting, Turnstile, Zero Trust, AI Gateway), consult the Cloudflare documentation using the `search_cloudflare_documentation` MCP tool. Create a new port interface in `app/ports/` and adapter in `app/adapters/cloudflare/` following the same pattern.

## Project Conventions

| Concern         | Convention                                                      |
|-----------------|-----------------------------------------------------------------|
| Credentials     | `.env` file, never committed. `.env.example` documents variables.|
| Configuration   | `config.toml` for application settings (checked into git).     |
| Commands        | `Makefile` with targets: `dev`, `build`, `deploy`, `test`, `lint`, `migrate`. |
| Docker          | Dockerfiles in `docker/`, orchestration in `docker-compose.yaml`.|
| Documentation   | README is short (setup only). Detailed docs go to `docs/`.     |
| Language        | British English in all documentation and comments.              |
| Formatting      | No emojis in code, comments, commit messages, or documentation. |
| Git             | `.gitignore` maintained. Secrets never committed.               |
| Data            | Data files go in `data/`.                                       |

## Skills

### Custom Skills (available in this project)

| Skill              | When to Use                                                    |
|--------------------|----------------------------------------------------------------|
| `/onboard`         | Fresh clone detected (no package.json/wrangler.toml).          |
| `/scaffold`        | After onboarding, to generate the full project.                |
| `/add-database`    | Application needs relational data (D1).                        |
| `/add-storage`     | Application needs file/blob storage (R2).                      |
| `/add-kv`          | Application needs key-value cache or sessions (KV).            |
| `/add-queue`       | Application needs background/async processing (Queues).        |
| `/add-ai`          | Application needs AI text generation or embeddings.            |
| `/add-vectorize`   | Application needs vector search or recommendations.            |
| `/add-durable-object` | Application needs real-time/WebSocket/stateful features.   |
| `/add-auth`        | Application needs user accounts and login.                     |
| `/deploy`          | User wants to deploy to Cloudflare.                            |

### Plugin Skills (require installed plugins)

Use these when relevant:

**Cloudflare plugin (`cloudflare@cloudflare`):**
- `cloudflare:wrangler` -- for wrangler CLI operations
- `cloudflare:workers-best-practices` -- to review code against Cloudflare patterns
- `cloudflare:durable-objects` -- when working with Durable Objects
- `cloudflare:agents-sdk` -- when building AI agents
- `cloudflare:building-mcp-server-on-cloudflare` -- when building MCP servers
- `cloudflare:building-ai-agent-on-cloudflare` -- when building AI agents
- `cloudflare:web-perf` -- for performance analysis
- `cloudflare:sandbox-sdk` -- for sandboxed applications

**Superpowers plugin (`superpowers@claude-plugins-official`):**
- `superpowers:brainstorming` -- to refine the user's idea before building
- `superpowers:writing-plans` -- to create implementation plans
- `superpowers:executing-plans` -- to execute plans step by step
- `superpowers:subagent-driven-development` -- for parallel development
- `superpowers:test-driven-development` -- for TDD workflow
- `superpowers:systematic-debugging` -- when debugging issues
- `superpowers:verification-before-completion` -- before declaring work done
- `superpowers:requesting-code-review` -- to review completed work

**Context7 plugin (`context7@claude-plugins-official`):**
- Use `resolve-library-id` and `query-docs` to look up current documentation for any library (React, Hono, Vite, etc.) before generating code that depends on it.

**Playwright plugin (`playwright@claude-plugins-official`):**
- When the user wants end-to-end browser testing.

## Portability

This is the core promise of the template. When the user wants to migrate:

1. Create `app/adapters/<provider>/` (e.g., `app/adapters/aws/`).
2. Implement each port interface using the target provider's services.
3. Update the composition root to inject the new adapters instead of the Cloudflare ones.
4. Business logic in `app/core/` and port interfaces in `app/ports/` remain untouched.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Add CLAUDE.md -- the brain of the template

Comprehensive instructions for Claude covering first-run detection,
architecture rules, Cloudflare services catalogue, project conventions,
skills reference, and portability guide."
```

---

## Task 10: README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Cloudflare Development Template

Describe your application idea to Claude Code and it will build, test, and deploy it on Cloudflare.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) installed
- [Node.js](https://nodejs.org/) v18 or later
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (the free tier is sufficient)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cloudflare-development-template
   ```

2. **Start Claude Code**

   ```bash
   claude
   ```

3. **Follow the onboarding flow**

   Claude detects this is a fresh project and walks you through setup automatically:

   - **Plugin installation** -- Claude installs the required plugins (Cloudflare, Superpowers, Context7, Playwright). You will be asked to approve each one.
   - **Node.js check** -- Claude verifies Node.js is installed. If not, it guides you through installation.
   - **Cloudflare login** -- Claude runs `npx wrangler login`, which opens a browser window. Log in to your Cloudflare account (or create one) and authorise wrangler. Return to the terminal when done.
   - **Describe your app** -- Claude asks what you want to build. Describe your idea in plain language: what it does, who it is for, what features it needs. Do not worry about technical details.

4. **Claude builds your app**

   Based on your description, Claude generates the entire project: API, frontend, database schema, configuration, and Docker setup. It installs dependencies and starts the development server.

5. **View your app**

   Claude tells you the local URL (typically `http://localhost:8787`). Open it in your browser.

6. **Deploy when ready**

   Tell Claude "deploy my app" or run `/deploy`. Claude creates the required Cloudflare resources (databases, storage buckets, etc.), runs migrations, builds the project, and deploys it. It gives you the live URL when done.

## What Happens Behind the Scenes

Your application is built using a portable architecture. All Cloudflare-specific code is isolated behind abstract interfaces (called "ports"). Your application's business logic never touches Cloudflare directly -- it communicates through these interfaces.

This means you can migrate your application to AWS, Azure, or any other provider by writing new implementations of the same interfaces, without changing your application logic.

For a detailed explanation, see [docs/architecture.md](docs/architecture.md).

## Available Commands

Once the project is scaffolded, these commands are available via `make`:

| Command        | Description                        |
|----------------|------------------------------------|
| `make dev`     | Start the development server       |
| `make build`   | Build the frontend and worker      |
| `make deploy`  | Deploy to Cloudflare               |
| `make test`    | Run tests                          |
| `make lint`    | Run the linter                     |
| `make migrate` | Run database migrations            |
| `make clean`   | Remove build artifacts             |
| `make help`    | Show all available commands        |

## Installed Plugins

Claude installs these plugins automatically during setup:

| Plugin                              | Purpose                                |
|-------------------------------------|----------------------------------------|
| `cloudflare@cloudflare`             | Cloudflare CLI tools and best practices|
| `superpowers@claude-plugins-official`| Planning, debugging, and TDD workflows|
| `context7@claude-plugins-official`  | Up-to-date library documentation       |
| `playwright@claude-plugins-official`| Browser-based end-to-end testing       |

## Further Reading

- [Architecture Guide](docs/architecture.md) -- how the port/adapter pattern works and how to migrate
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Add README with beginner-friendly setup guide

Step-by-step instructions covering clone, onboarding, app generation,
and deployment. Documents commands, plugins, and architecture."
```

---

## Task 11: Architecture Documentation

**Files:**
- Create: `docs/architecture.md`

- [ ] **Step 1: Create `docs/architecture.md`**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/architecture.md
git commit -m "Add architecture documentation

Explains the port/adapter pattern, how ports and adapters work,
provides code examples, and documents the migration path to
other providers."
```

---

## Task 12: Final Commit and Verification

**Files:**
- All files from previous tasks

- [ ] **Step 1: Verify all files exist**

```bash
ls -la .gitignore .dockerignore .env.example config.toml .mcp.json Makefile docker-compose.yaml CLAUDE.md README.md
ls -la app/ports/database.ts app/ports/kv-store.ts app/ports/storage.ts app/ports/queue.ts app/ports/ai.ts app/ports/vectorize.ts app/ports/durable-session.ts
ls -la .claude/skills/onboard.md .claude/skills/scaffold.md .claude/skills/add-database.md .claude/skills/add-storage.md .claude/skills/add-kv.md .claude/skills/add-queue.md .claude/skills/add-ai.md .claude/skills/add-vectorize.md .claude/skills/add-durable-object.md .claude/skills/add-auth.md .claude/skills/deploy.md
ls -la docs/architecture.md docker/.gitkeep data/.gitkeep
```

All files should exist. If any are missing, create them from the corresponding task.

- [ ] **Step 2: Verify git status is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

If there are uncommitted files, stage and commit them:

```bash
git add -A
git commit -m "chore: add any remaining template files"
```

- [ ] **Step 3: Verify the template structure**

```bash
find . -not -path './.git/*' -not -path './.git' | sort
```

Expected output should match the repository structure defined in the spec (section 5), plus the docs and plans directories.

- [ ] **Step 4: Tag the initial release**

```bash
git tag -a v0.1.0 -m "Initial template release

Meta-scaffold for building Cloudflare applications via Claude Code.
Ships with CLAUDE.md, 11 custom skills, 7 port interfaces,
and beginner-friendly documentation."
```

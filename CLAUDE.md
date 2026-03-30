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
  api/             # HTTP routes (Hono)
  frontend/        # UI (React + Vite)
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
- `superpowers:finishing-a-development-branch` -- branch completion

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

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

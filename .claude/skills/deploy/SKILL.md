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


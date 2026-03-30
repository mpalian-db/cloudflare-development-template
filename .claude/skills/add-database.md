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

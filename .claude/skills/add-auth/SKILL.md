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

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

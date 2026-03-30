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

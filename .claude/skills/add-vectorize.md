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

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

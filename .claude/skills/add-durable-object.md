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

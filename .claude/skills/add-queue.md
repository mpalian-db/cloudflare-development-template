---
name: add-queue
description: Wire up Cloudflare Queues with the QueuePort abstraction layer
---

# Add Queue

Wire up Cloudflare Queues for async message processing, implementing the `QueuePort` and `QueueConsumer` interfaces.

## Pre-check

1. Read `app/adapters/cloudflare/queue.ts`. If it exists, this service is already wired up. Inform the user and stop.
2. Read `app/ports/queue.ts` to confirm the port interface is present.

## Steps

### 1. Create the Adapter

Create `app/adapters/cloudflare/queue.ts` that implements `QueuePort` and `QueueConsumer` from `app/ports/queue.ts`.

The adapter:
- Producer: accepts a `Queue` binding in its constructor
  - Maps `send()` to `queue.send(message)`
  - Maps `sendBatch()` to `queue.sendBatch(messages.map(body => ({ body })))`
- Consumer: exports a `queue` handler function for `wrangler.toml`
  - Maps `process()` to the `queue(batch, env)` export handler

### 2. Update `wrangler.toml`

Add the Queue producer binding:

```toml
[[queues.producers]]
queue = "<app-name>-queue"
binding = "QUEUE"

[[queues.consumers]]
queue = "<app-name>-queue"
max_batch_size = 10
max_batch_timeout = 30
```

### 3. Update Configuration

Add to `.env.example`:
```
# Queue
# Created with: npx wrangler queues create <app-name>-queue
QUEUE_NAME=
```

Add to `config.toml`:
```toml
[queue]
name = "<app-name>-queue"
max_batch_size = 10
max_batch_timeout = 30
```

### 4. Commit

```bash
git add app/adapters/cloudflare/queue.ts wrangler.toml .env.example config.toml
git commit -m "feat: wire up Queues with QueuePort adapter"
```

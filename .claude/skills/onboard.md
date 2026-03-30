---
name: onboard
description: First-run experience -- install plugins, authenticate with Cloudflare, and gather the user's application idea
---

# Onboard

This skill runs when a user opens the template for the first time.

## Trigger

Run this skill when the project has no `package.json` and no `wrangler.toml`. These files are absent in a fresh clone and are only created during scaffolding.

## Steps

### 1. Install Required Plugins

Check which plugins are already installed. For each missing plugin, run the install command. The user will be prompted to approve each installation.

```bash
claude plugin install cloudflare@cloudflare
claude plugin install superpowers@claude-plugins-official
claude plugin install context7@claude-plugins-official
claude plugin install playwright@claude-plugins-official
```

If a plugin is already installed, skip it. Do not reinstall.

### 2. Check Prerequisites

Verify that Node.js (v18+) and npm are available:

```bash
node --version
npm --version
```

If Node.js is not installed, explain that it is required and guide the user to https://nodejs.org/ or suggest using nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install --lts
```

Wait for the user to confirm Node.js is installed before continuing.

### 3. Authenticate with Cloudflare

Run wrangler login. This opens a browser window for the user to log in to their Cloudflare account.

```bash
npx wrangler login
```

Explain to the user: "A browser window will open. Log in to your Cloudflare account (or create one -- the free tier is sufficient). Once you have authorised wrangler, come back here."

Verify the login succeeded:

```bash
npx wrangler whoami
```

If it fails, ask the user to try again.

### 4. Gather the Application Idea

Ask the user to describe their application. Use open-ended prompting:

> "What application would you like to build? Describe the idea in your own words -- what it does, who it is for, and any features you have in mind. Do not worry about technical details; I will handle those."

Listen for:
- The core purpose of the application
- Who the target users are
- Key features and functionality
- Any specific requirements (e.g., "needs real-time updates", "handles file uploads")

If the description is vague, ask one clarifying question at a time. Do not overwhelm with multiple questions.

### 5. Hand Off to Scaffold

Once you understand the application well enough to determine:
- Whether it needs a frontend, API, or both
- Which Cloudflare services it requires (D1, KV, R2, Queues, AI, Vectorize, Durable Objects)
- The core data model

Invoke the `/scaffold` skill with the gathered information.

# Cloudflare Development Template

Describe your application idea to Claude Code and it will build, test, and deploy it on Cloudflare.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) installed
- [Node.js](https://nodejs.org/) v18 or later
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (the free tier is sufficient)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cloudflare-development-template
   ```

2. **Start Claude Code**

   ```bash
   claude
   ```

3. **Follow the onboarding flow**

   Claude detects this is a fresh project and walks you through setup automatically:

   - **Plugin installation** -- Claude installs the required plugins (Cloudflare, Superpowers, Context7, Playwright). You will be asked to approve each one.
   - **Node.js check** -- Claude verifies Node.js is installed. If not, it guides you through installation.
   - **Cloudflare login** -- Claude runs `npx wrangler login`, which opens a browser window. Log in to your Cloudflare account (or create one) and authorise wrangler. Return to the terminal when done.
   - **Describe your app** -- Claude asks what you want to build. Describe your idea in plain language: what it does, who it is for, what features it needs. Do not worry about technical details.

4. **Claude builds your app**

   Based on your description, Claude generates the entire project: API, frontend, database schema, configuration, and Docker setup. It installs dependencies and starts the development server.

5. **View your app**

   Claude tells you the local URL (typically `http://localhost:8787`). Open it in your browser.

6. **Deploy when ready**

   Tell Claude "deploy my app" or run `/deploy`. Claude creates the required Cloudflare resources (databases, storage buckets, etc.), runs migrations, builds the project, and deploys it. It gives you the live URL when done.

## What Happens Behind the Scenes

Your application is built using a portable architecture. All Cloudflare-specific code is isolated behind abstract interfaces (called "ports"). Your application's business logic never touches Cloudflare directly -- it communicates through these interfaces.

This means you can migrate your application to AWS, Azure, or any other provider by writing new implementations of the same interfaces, without changing your application logic.

For a detailed explanation, see [docs/architecture.md](docs/architecture.md).

## Available Commands

Once the project is scaffolded, these commands are available via `make`:

| Command        | Description                        |
|----------------|------------------------------------|
| `make dev`     | Start the development server       |
| `make build`   | Build the frontend and worker      |
| `make deploy`  | Deploy to Cloudflare               |
| `make test`    | Run tests                          |
| `make lint`    | Run the linter                     |
| `make migrate` | Run database migrations            |
| `make clean`   | Remove build artifacts             |
| `make help`    | Show all available commands        |

## Installed Plugins

Claude installs these plugins automatically during setup:

| Plugin                              | Purpose                                |
|-------------------------------------|----------------------------------------|
| `cloudflare@cloudflare`             | Cloudflare CLI tools and best practices|
| `superpowers@claude-plugins-official`| Planning, debugging, and TDD workflows|
| `context7@claude-plugins-official`  | Up-to-date library documentation       |
| `playwright@claude-plugins-official`| Browser-based end-to-end testing       |

## Further Reading

- [Architecture Guide](docs/architecture.md) -- how the port/adapter pattern works and how to migrate

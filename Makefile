.PHONY: dev build deploy test lint migrate clean help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start the development server
	npx wrangler dev

build: ## Build the frontend and worker
	npm run build

deploy: ## Deploy to Cloudflare
	npx wrangler deploy

test: ## Run tests
	npm test

lint: ## Run linter
	npm run lint

migrate: ## Run D1 database migrations
	npx wrangler d1 migrations apply

clean: ## Remove build artifacts
	rm -rf dist/ node_modules/ .wrangler/

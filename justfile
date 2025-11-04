# Development tasks for boilerplate-base

# Use bash for all recipes to avoid zsh/sh incompatibilities
set shell := ["bash", "-c"]

# Common paths
edge_dir := "apps/edge"

# Show available commands
help:
    @just --list

# Setup development environment
setup:
    @echo "Setting up development environment..."
    brew bundle install
    @if command -v mise >/dev/null 2>&1; then \
        echo "→ Installing tools with mise..."; \
        eval "$(mise activate bash)"; \
        mise install; \
    else \
        echo "⚠ mise not found. Please run 'make bootstrap' first."; \
        exit 1; \
    fi
    prek install
    @if command -v pnpm >/dev/null 2>&1; then \
        echo "→ Installing JS dependencies with pnpm..."; \
        pnpm install; \
    else \
        echo "⚠ pnpm not found. Installing pnpm automatically..."; \
        npm install -g pnpm; \
        echo "→ Installing JS dependencies with pnpm..."; \
        pnpm install; \
    fi
    @echo "→ Installing Playwright browsers..."
    @pnpm exec playwright install --with-deps
    @echo "Setup complete!"

# Run prek hooks on all files
lint:
    prek run --all-files

# Run specific prek hook
lint-hook hook:
    prek run {{hook}}

# Fix common formatting issues
fix:
    prek run end-of-file-fixer --all-files
    prek run trailing-whitespace --all-files
    prek run markdownlint-cli2 --all-files

# Format all supported files with Prettier (via prek hook)
format:
    prek run prettier --all-files

# Format only staged files (typical git commit flow)
format-staged:
    prek run prettier

# Clean prek cache (if any)
clean:
    @echo "Cleaning prek cache..."
    @echo "Clean complete!"

# Show mise status
status:
    mise list

# Install mise tools
install:
    @echo "Installing tools with mise..."
    mise install
    @if command -v pnpm >/dev/null 2>&1; then \
        echo "→ Installing JS dependencies with pnpm..."; \
        pnpm install; \
    else \
        echo "⚠ pnpm not found. Installing pnpm automatically..."; \
        npm install -g pnpm; \
        echo "→ Installing JS dependencies with pnpm..."; \
        pnpm install; \
    fi

# Update mise tools
update:
    mise upgrade

# Update brew packages
update-brew:
    brew update
    brew bundle install
    brew upgrade

# Run rulesync with passthrough args
rulesync args='':
    @if [[ "{{args}}" =~ ^generate(\s|$) ]]; then \
        echo "Generating AI assistant configs from .rulesync/rules/agents.md"; \
        bash scripts/rulesync-generate.sh; \
    elif command -v rulesync >/dev/null 2>&1; then \
        echo "Running: rulesync {{args}}"; \
        rulesync {{args}}; \
    else \
        echo "⚠ rulesync が見つかりません。docs/RULESYNC.ja.md を参照してインストールしてください。"; \
        exit 1; \
    fi

# Run API and Web dev servers together (Node local)
dev-node:
    @echo "Starting API (8787) and Web (8788)..."
    bash -lc 'set -euo pipefail; \
      (pnpm --filter @edu-quest/api run dev & pid_api=$!; \
       pnpm --filter @edu-quest/web run dev & pid_web=$!; \
       trap "kill $$pid_api $$pid_web 2>/dev/null || true" INT TERM EXIT; \
       wait)'

# Run Edge SSR (Cloudflare Workers via Wrangler)
dev-edge:
    @echo "Starting Edge SSR (Wrangler dev)..."
    pnpm --filter @edu-quest/edge run dev

# Run E2E tests with Playwright (headless)
e2e:
    @echo "Running E2E tests with Playwright..."
    @echo "Checking if dev server is running on http://localhost:8788..."
    @if curl -s http://localhost:8788 > /dev/null 2>&1; then \
        echo "✓ Dev server is running"; \
        pnpm run test:e2e; \
    else \
        echo "✗ Dev server is not running on http://localhost:8788"; \
        echo ""; \
        echo "Please start the dev server first:"; \
        echo "  pnpm dev:edge"; \
        echo ""; \
        echo "Then run this command again."; \
        exit 1; \
    fi

# Open Playwright test runner (UI mode)
e2e-open:
    @echo "Opening Playwright UI..."
    @echo "Checking if dev server is running on http://localhost:8788..."
    @if curl -s http://localhost:8788 > /dev/null 2>&1; then \
        echo "✓ Dev server is running"; \
        pnpm run test:e2e:open; \
    else \
        echo "✗ Dev server is not running on http://localhost:8788"; \
        echo ""; \
        echo "Please start the dev server first:"; \
        echo "  pnpm dev:edge"; \
        echo ""; \
        echo "Then run this command again."; \
        exit 1; \
    fi

# Start dev server and run E2E tests (for CI or quick testing)
e2e-ci:
    @echo "Starting dev server and running E2E tests..."
    @bash -c 'set -euo pipefail; \
      pnpm --filter @edu-quest/edge run dev & pid_edge=$$!; \
      trap "kill $$pid_edge 2>/dev/null || true" INT TERM EXIT; \
      echo "Waiting for dev server to start..."; \
      for i in {1..30}; do \
        if curl -s http://localhost:8788 > /dev/null 2>&1; then \
          echo "✓ Dev server is ready"; \
          pnpm run test:e2e; \
          exit 0; \
        fi; \
        sleep 1; \
      done; \
      echo "✗ Dev server failed to start within 30 seconds"; \
      exit 1'

# Cloudflare D1 (local) utilities
d1-local-migrate:
    @echo "Applying local D1 migrations..."
    @cd {{edge_dir}} && pnpm exec wrangler d1 migrations apply DB --local

d1-local-query query="SELECT name FROM sqlite_master WHERE type='table';":
    @if [ -z "{{query}}" ]; then \
        echo "Usage: just d1-local-query \"<SQL>\"" && exit 1; \
    fi
    @cd {{edge_dir}} && pnpm exec wrangler d1 execute DB --local --command "{{query}}"

d1-local-reset:
    @echo "Resetting local D1 state (.wrangler/state)..."
    @cd {{edge_dir}} && rm -rf .wrangler/state && mkdir -p .wrangler/state

# Install JS dependencies with pnpm (can be run independently)
js-install:
    @if command -v pnpm >/dev/null 2>&1; then \
        echo "Installing JS dependencies with pnpm..."; \
        pnpm install; \
    else \
        echo "⚠ pnpm not found. Installing pnpm automatically..."; \
        npm install -g pnpm; \
        echo "Installing JS dependencies with pnpm..."; \
        pnpm install; \
    fi

# Wrap terraform with convenient -chdir handling
# Usage examples:
#   just tf -chdir=dev/bootstrap init -reconfigure
#   just tf -chdir=infra/terraform/envs/dev/bootstrap plan
#   just tf version
tf *args:
    @echo "→ make terraform-cf ARGS='{{args}}'"
    @exec make terraform-cf ARGS="{{args}}"

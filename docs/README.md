# EduQuest Document Overview

EduQuest is an arithmetic practice platform for elementary school students. It features a Hono-based SSR app running on Cloudflare Workers and a shared domain logic managed in a monorepo with pnpm workspaces.

The start screen allows users to select grade level, calculation type, and theme presets (e.g., "Addition up to 20" or "Subtraction up to 50"), and to toggle the number of questions, sound effects, and the display of intermediate steps. The play screen includes a keypad UI, a countdown sequence, streak display, and progress saving via local storage. Question generation and grading are handled by `@edu-quest/domain` and are reused by the API layer (`/apis/quiz`).

## Quick Start

### Prerequisites

The repository uses the following tools:

- **Homebrew**: Manages system-level development tools for macOS/Linux.
- **mise**: Manages versions of the execution environment, such as Node.js, pnpm, and Wrangler.
- **just**: A task runner for bundling setup and linting commands.
- **pnpm**: Manages the JavaScript/TypeScript workspace.

### Setup

**Important**: Before running `make bootstrap`, you need to complete the following steps:

#### 1. Set up Cloudflare credentials

```bash
# Add Cloudflare credentials (required before make bootstrap)
cf-vault add edu-quest
cf-vault list
```

#### 2. Initialize Terraform Bootstrap

Set up Cloudflare resources (D1, KV, Turnstile, etc.) for the development environment:

```bash
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

#### 3. Proceed with the standard setup

```bash
# 1. Install Homebrew (macOS/Linux)
make bootstrap

# 2. Set up dependent tools and npm packages together
just setup
```

If you already have Homebrew, run `brew bundle install` before `just setup`.

### Frequently Used Commands

```bash
# List all available just tasks
just help

# Run code quality checks (biome, cspell, vitest, etc.)
just lint

# Apply automatic formatting
just fix

# Clear the pre-commit cache
just clean

# Update runtimes and CLIs
just update-brew
just update
just update-hooks

# Check mise status
just status
```

## Repository Structure

- `apps/edge`: The Hono SSR app that runs on Cloudflare Workers. It contains the start/play screens in `routes/pages` and the question generation/grading API in `routes/apis/quiz.ts`.
- `apps/api` / `apps/web`: A Node server and web front-end for local development. Used for validation without Workers.
- `packages/domain`: The logic for question generation and grading. It also defines multi-step problems for different grade levels (e.g., addition then subtraction).
- `packages/app`: Manages quiz progression (question order, correct answer count, etc.) using the domain logic.
- `docs/`: Design and operational documents.
- `infra/`: Terraform and D1 migrations.
- `games/math-quiz`: The old browser-based game (static HTML/JS).

## Related Documents

- `AGENTS.md`: Overall design and module dependencies.
- `docs/local-dev.md`: Procedures for setting up a local validation environment.
- `docs/edu-quest-architecture.md`: Detailed architecture design.
- `docs/math-quiz.md`: Specifications for the old standalone mini-game.

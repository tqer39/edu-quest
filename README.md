# EduQuest Document Overview

EduQuest is a learning platform for elementary school students that provides various educational content through specialized "Quest" modules. Built with Hono for SSR on Cloudflare Workers, it features a shared domain logic managed in a monorepo with pnpm workspaces.

## Quest Modules

- **MathQuest** (`/math`): Arithmetic practice with grade-level presets and themed exercises. Users can select calculation types, toggle settings (sound effects, intermediate steps), and practice with a keypad UI.
- **KanjiQuest** (`/kanji`): Kanji learning organized by grade level (Coming Soon)
- **ClockQuest** (`/clock`): Time-reading practice with analog and digital clocks (Coming Soon)

The platform features an EduQuest hub page (`/`) where users can navigate to each Quest module. Question generation and grading are handled by `@edu-quest/domain` and are reused by the API layer (`/apis/quiz`).

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
# This also installs Cypress binary automatically
just setup
```

If you already have Homebrew, run `brew bundle install` before `just setup`.

**Note:** The `just setup` command automatically installs:

- mise tools (Node.js, pnpm, etc.)
- pnpm (if not already installed)
- All npm dependencies
- Cypress binary for E2E testing

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

# Run E2E tests with Cypress (headless)
just e2e

# Open Cypress test runner (interactive)
just e2e-open
```

## Testing

### Unit Tests

The project uses Vitest for unit testing:

```bash
# Run all unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### E2E Tests

The project uses Cypress for end-to-end testing to verify screen transitions and user flows.

#### Running E2E Tests

##### Option 1: Manual (recommended for development)

```bash
# 1. Start the Cloudflare Workers dev server in a separate terminal
pnpm dev:edge
# This starts the server on http://localhost:8788

# 2. Run E2E tests in headless mode
just e2e

# OR open Cypress test runner (interactive mode)
just e2e-open
```

##### Option 2: Automatic (for CI or quick testing)

```bash
# Automatically start dev server and run E2E tests
just e2e-ci
```

This command will:

1. Start the Cloudflare Workers dev server in the background
2. Wait for the server to be ready (max 30 seconds)
3. Run all E2E tests
4. Automatically shut down the server when done

**Important Notes:**

- **E2E tests MUST run against `@edu-quest/edge` (Cloudflare Workers), NOT `@edu-quest/web`**
- `@edu-quest/web` is a placeholder Node.js server without actual application routes
- All application routes (/, /math, /math/start, /math/play, etc.) exist only in `@edu-quest/edge`
- The `just e2e` and `just e2e-open` commands check if the server is running on `http://localhost:8788`
- **Always use `pnpm dev:edge` to start the server for E2E testing**

**E2E Test Coverage:**

- Navigation flows between pages (Home → MathQuest → Start → Play → Results)
- ClockQuest navigation
- Backward navigation (browser back button)
- Legacy URL redirects (`/start` → `/math/start`, `/play` → `/math/play`)

## Repository Structure

- `apps/edge`: The Hono SSR app that runs on Cloudflare Workers. It contains the start/play screens in `routes/pages` and the question generation/grading API in `routes/apis/quiz.ts`.
- `apps/api` / `apps/web`: A Node server and web front-end for local development. Used for validation without Workers.
- `packages/domain`: The logic for question generation and grading. It also defines multi-step problems for different grade levels (e.g., addition then subtraction).
- `packages/app`: Manages quiz progression (question order, correct answer count, etc.) using the domain logic.
- `docs/`: Design and operational documents.
- `infra/`: Terraform and D1 migrations.
- `games/math-quiz`: The old browser-based game (static HTML/JS).
- `games/clock-quest`: A prototype ClockQuest trainer with analog & digital clocks (static HTML/JS).

## Related Documents

- `AGENTS.md`: Overall design and module dependencies.
- `docs/local-dev.md`: Procedures for setting up a local validation environment.
- `docs/edu-quest-architecture.md`: Detailed architecture design.
- `docs/math-quiz.md`: Specifications for the old standalone mini-game.

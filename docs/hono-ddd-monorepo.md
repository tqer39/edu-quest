[🇯🇵 日本語](/docs/hono-ddd-monorepo.ja.md)

# Minimal Hono × DDD Monorepo Structure

> **Status**: This guide documents the original minimal tutorial for combining Hono and DDD in a monorepo. The production-ready implementation now lives primarily in `apps/edge`. For the authoritative layout, refer to [edu-quest-architecture.md](./edu-quest-architecture.md).

## Purpose of This Document

- Provide a small, easy-to-digest reference for the minimal three-layer setup (domain → application → interface).
- Highlight the naming conventions that inspired the current production repository.
- Offer context for contributors who encounter the historical `apps/api` / `apps/web` projects while reading old discussions or commits.

## Minimal Reference Structure

- `packages/domain`: domain layer
  - Entities, value objects, and domain services (in this project: generation and grading for the four arithmetic operations)
- `packages/app`: application layer
  - Terminology: use cases / application services (here: managing quiz progress)
- `apps/api`: interface layer (Hono)
  - REST API (problem generation and grading), CORS, and a small static page
- `apps/web`: frontend (static hosting via Hono)
  - A minimal UI that calls the API (arithmetic quiz)

## How the Production Repository Differs Today

- `apps/edge` is the primary interface + application layer. It handles SSR on Cloudflare Workers, renders quest pages, and exposes the `/apis/quiz/*` endpoints.
- `apps/api` / `apps/web` remain for local experiments, but they no longer ship to production.
- The repository also contains auxiliary directories that are absent from this minimal tutorial:
  - `infra/` for Terraform and D1 migrations
  - `tests/e2e/` for Playwright end-to-end specs
  - `scripts/` for maintenance utilities (for example, the documentation tree generator)
- The full directory map and dependency rules are maintained in [edu-quest-architecture.md](./edu-quest-architecture.md). Run `pnpm run docs:update-structure` whenever the layout changes to refresh the auto-generated tree in that document.

## Key Commands (local / pnpm)

- Initial setup: `just setup`
  - Installs prerequisites through Homebrew, sets up tools with mise (node, pnpm, etc.), and configures pre-commit hooks
- Install dependencies from the repository root: `pnpm install`
- Build all packages: `pnpm run build`
- Launch API server (local mode): `pnpm --filter @edu-quest/api dev`
- Launch web server (local mode): `pnpm --filter @edu-quest/web dev`
- Launch Edge SSR (Cloudflare Workers emulation): `pnpm --filter @edu-quest/edge dev`

## API Overview

- `POST /v1/questions/next`
  - Input: `{ mode: 'add'|'sub'|'mul'|'mix', max: number }`
  - Output: `{ question: { a, b, op, answer } }` (initial version returns the correct answer)
- `POST /v1/answers/check`
  - Input: `{ a, b, op, value }`
  - Output: `{ ok: boolean, correctAnswer: number }`

Future iterations can introduce session IDs so that question delivery and grading run per session while hiding the correct answers from the client.

## DDD Perspective

- The domain layer intentionally contains no framework dependencies. It exports pure TypeScript objects and functions.
- The application layer orchestrates the domain logic and coordinates persistence, sessions, and transport concerns.
- The interface layer (Hono) focuses on routing, request validation, and translating results into HTTP responses.
- Shared types live in `packages/domain` to prevent drift between layers.
- Keep the dependency direction one-way: interface → application → domain.

## Integrating with the existing frontend

The legacy static Math Quiz prototype (documented in [`docs/math-quiz.md`](./math-quiz.md)) runs entirely on the client. To migrate it to the API-driven version, replace the in-browser generation and grading logic with calls to the `/v1/...` endpoints described above. When working against the production stack (`apps/edge`), use the `/apis/quiz/generate` and `/apis/quiz/verify` handlers, which wrap the same domain logic.

## Installing pnpm

- **Via mise (recommended)**
  - Add `pnpm` to `.tool-versions` and run `mise install`.
- **Via npm**
  - `npm install -g pnpm`

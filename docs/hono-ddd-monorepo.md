# Minimal Hono × DDD Monorepo Structure

This document describes the minimal monorepo setup that combines Hono with Domain-Driven Design (DDD) layering.

## Structure

- `packages/domain`: domain layer
  - Entities, value objects, and domain services (in this project: generation and grading for the four arithmetic operations)
- `packages/app`: application layer
  - Terminology: use cases / application services (here: managing quiz progress)
- `apps/api`: interface layer (Hono)
  - REST API (problem generation and grading), CORS, and a small static page
- `apps/web`: frontend (static hosting via Hono)
  - A minimal UI that calls the API (arithmetic quiz)

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

The implementation under `games/math-quiz/` runs entirely on the client. To migrate it to the API-driven version, replace the in-browser generation and grading logic with calls to the `/v1/...` endpoints described above.

## Installing pnpm

- **Via mise (recommended)**
  - Add `pnpm` to `.tool-versions` and run `mise install`.
- **Via npm**
  - `npm install -g pnpm`

[🇯🇵 日本語](/docs/CLAUDE.ja.md)

# Claude Project Instructions

## 1. Overview

This document gives AI assistants (Claude, ChatGPT Codex, Gemini, Copilot, etc.) the **minimum, critical context** needed to work on the **EduQuest** project.

**EduQuest** is an educational platform for elementary school students to practice arithmetic and other subjects.
It is a monorepo built with a modern web stack, running primarily on the Cloudflare edge network with Hono SSR.

### Core Mission

- Provide a fun, engaging, and effective learning experience for young students.
- Keep the codebase **simple, maintainable, and high-performance**, using a layered architecture and SSR on Cloudflare Workers.
- Preserve a consistent UX across all “Quest” modules (Math, Kanji, Game, Clock, etc.).

---

## 2. Key Documentation

This file is only a hub. For details, always open the dedicated docs first.

- **Project & Architecture**
  - `docs/README.md` — Project overview, repo structure, and frequently used commands.
  - `docs/edu-quest-architecture.md` — Layered architecture, modules, data flow, and tech stack.
  - `docs/local-dev.md` — Local development and environment setup.

- **Design & UX**
  - `docs/ux-design-concept.md` — UX philosophy, target users, visual themes, gamification.
  - `docs/edu-quest-wireframe.md` — Wireframes for main screens.

- **AI & Workflow Rules**
  - `docs/AI_RULES.md` — Shared rules for all AI assistants.
  - `docs/CLAUDE.ja.md` — Japanese version of these instructions (more verbose, if needed).

- **Quest-specific Design**
  - `docs/kanji-quest-design.md` / `.ja.md` — KanjiQuest design.
  - `docs/game-quest-design.md` / `.ja.md` — GameQuest design.

When in doubt: **start from `docs/README.md` → `docs/edu-quest-architecture.md` → quest-specific docs.**

---

## 3. Documentation Localization Policy

EduQuest maintains documentation in **English + Japanese**.

### 3.1 File Naming

- Base English file: `*.md`
- Matching Japanese translation: `*.ja.md`
- Both files live in the **same directory**.

### 3.2 Synchronization Rules (CRITICAL)

When you modify any `.md` file, you **MUST** also update the corresponding `.ja.md` file **in the same directory**, if it exists.

This applies to:

- Project docs: `README.md`, `CONTRIBUTING.md`, etc.
- Technical docs: `docs/*.md`
- Design docs: `docs/edu-quest-*.md`, `docs/*-quest-design.md`
- Workflow docs: `docs/AI_RULES.md`, etc.

**Workflow:**

1. Check if `{filename}.ja.md` exists.
2. Update the English `.md` file.
3. Mirror the change in `{filename}.ja.md` with equivalent meaning.
4. If `{filename}.ja.md` does not exist, consider creating it (or ask the user).

**Note to AI Assistants:**

- Use `ls` / `find` to check for sibling `*.ja.md` files.
- If you are not confident about the Japanese translation, ask the user explicitly.
- **Do not leave English and Japanese versions out of sync.**

---

## 4. How Claude Should Work in This Repo

### 4.1 General Principles

When acting inside this repository, Claude should:

1. **Read before editing**
   - Always inspect existing code, docs, and architecture diagrams before proposing changes.
   - Prefer reading `docs/edu-quest-architecture.md` and quest-specific docs over guessing.

2. **Keep changes small and focused**
   - One concern per PR / change set.
   - Avoid unrelated refactors unless explicitly requested.

3. **Never run Git operations automatically**
   - **NEVER** auto-execute `git add`, `git commit`, `git push`, or similar.
   - Always wait for explicit user permission before touching Git.

4. **Follow existing conventions**
   - Match the existing TypeScript style, directory structure, and naming patterns.
   - Reuse existing utilities (e.g., `formatSchoolGradeLabelShort`, session helpers) instead of reinventing.

5. **Ask when requirements are unclear**
   - If there is ambiguity in UX, edge cases, or architecture, ask the user instead of guessing.

---

## 5. Architecture & Repository Overview (High-level)

You do **not** need every detail here; use this to know where to look.

- **Monorepo with pnpm workspaces**
  - `apps/`
    - `@edu-quest/edge` — Main SSR + BFF app on Cloudflare Workers (primary target of most changes).
    - `@edu-quest/api` — Local API server (primarily for development).
    - `@edu-quest/web` — Local web server placeholder (not the real app).
  - `packages/`
    - `@edu-quest/domain` — Core domain logic (problem generation, rules).
    - `@edu-quest/app` — Application logic built on top of the domain layer.
  - `infra/`
    - `terraform/` — Cloudflare infra (IaC).
    - `migrations/` — D1 schema and migration scripts.
  - `docs/`
    - Documentation for architecture, UX, quests, rules, etc.

For detailed diagrams and flows, always refer to `docs/edu-quest-architecture.md`.

---

## 6. Critical UX Rules

### 6.1 Answer Input Method (Platform-wide)

**CRITICAL: All Quests (math, clock, kanji, game, etc.) use button-based answer input.**

- **DO NOT** use `<input type="text">`, `<input type="number">`, `<select>`, etc. for quiz answers.
- **DO** use clickable/tappable `<button>` elements (one button per answer option).
- Prefer SSR-friendly `<form method="POST">` with hidden inputs + `<button>`.

Rationale:

- Target users are elementary school students with limited typing skills.
- Better mobile/tablet UX, fewer validation issues, more predictable interactions.

If you propose input changes and they involve text fields for answers, **you are doing it wrong**.

---

### 6.2 Navigation Design

EduQuest uses **minimal navigation** to reduce cognitive load.

- Prefer icons + short labels:
  - Use Quest icons (e.g., `🔢`) without verbose text labels.
  - Use short grade labels like `小1`, `小2` instead of full phrases.
- Keep navigation compact; maximize the area for learning content.
- Use helpers like `formatSchoolGradeLabelShort()` instead of hardcoding grade strings.

If you modify navigation:

- Check `docs/ux-design-concept.md` for detailed rules.
- Preserve minimal, icon-first design.

---

## 7. Session & Data Policies (High-level)

### 7.1 Session Management

**CRITICAL: Session data for Quests lives in Cloudflare KV, not in cookies or client storage.**

- Store session state in `KV_QUIZ_SESSION` (and related KV namespaces).
- Cookies hold only opaque session IDs (HttpOnly, Secure, SameSite).
- Never put quiz questions, answers, or sensitive state into localStorage or plain cookies.

When you add or change session logic:

- Follow existing patterns in `apps/edge` routes.
- Keep key naming consistent (e.g., `{quest_type}:{session_id}`).

### 7.2 Static Master Data (Kanji, etc.)

- Educational master data (e.g., Kanji lists) are stored as JSON under `packages/domain/src/data/`.
- This content is:
  - Versioned in Git.
  - Read-only at runtime.
- User-specific progress or analytics should **not** be stored in these JSON files (use DB when implemented).

Details live in dedicated docs; here you only need to remember the policy.

---

## 8. Development & Testing Workflow (Summary)

For concrete commands, see `docs/README.md` / `docs/local-dev.md`.
Claude should only remember the **important constraints**:

- Run lint/tests before proposing the final patch:
  - `just lint`
  - `pnpm test` / `pnpm test:coverage`
  - `just e2e` or `just e2e-ci` when working on flows/routes.
- Do **not** change CI workflows (GitHub Actions) unless the user asks.
- When changing test behavior, update tests and docs together.

---

## 9. Contribution Checklist for AI Assistants

Before you say “done” for any change:

1. **Read the relevant docs** (architecture, quest design, UX, rules).
2. **Locate the right code** in `apps/` / `packages/` instead of creating new random files.
3. **Propose a small, scoped change** with clear reasoning.
4. **Respect UX rules**:
   - Button-based answers.
   - Minimal navigation.
   - Quest-specific theming where applicable.
5. **Respect architecture rules**:
   - Keep domain logic in `@edu-quest/domain`.
   - Keep app orchestration in `@edu-quest/app` / `apps/edge`.
   - Use KV for sessions; no client-side session state.
6. **Update documentation** (and `.ja.md` siblings) when behavior changes.
7. **Never run Git commands automatically**; wait for user confirmation.

If any of these steps are unclear, **ask the user first** instead of guessing.

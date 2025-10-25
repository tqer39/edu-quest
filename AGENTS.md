# AGENTS.md (Master Document)

## 1. Overview

This document provides a comprehensive guide for AI assistants (like Gemini, Claude, Copilot) to understand and contribute to the **EduQuest** project.

**EduQuest** is an educational platform for elementary school students to practice arithmetic. It's a monorepo project built with a modern web stack, running on the Cloudflare edge network.

### Core Mission

- To provide a fun, engaging, and effective learning experience.
- To build a scalable, maintainable, and high-performance application using a server-side rendering (SSR) architecture with Hono on Cloudflare Workers.

## 2. Key Documentation

This file is the central hub. For detailed information, please refer to the specific documents below.

- **[Project Overview](./docs/README.md):** Quick start, repository structure, and frequently used commands.
- **[Architecture Design](./docs/edu-quest-architecture.md):** In-depth explanation of the layered architecture, module configuration, data flow, and technology stack.
- **[UI/UX Design Concept](./docs/ux-design-concept.md):** The design philosophy, target users, visual theme, color palette, and gamification strategy.
- **[Wireframes](./docs/edu-quest-wireframe.md):** Structural blueprints for the main application screens (Home, Stage Select, Game, Results, etc.).
- **[Local Development](./docs/local-dev.md):** Guide for setting up and running the project locally.
- **[AI Assistant Rules](./docs/AI_RULES.md):** Common rules and guidelines for AI assistants contributing to this repository.
- **[Claude-specific Instructions](./docs/CLAUDE.md):** Specific guidance for the Claude Code assistant.
- **[rulesync Guide](./docs/RULESYNC.md):** How to use the `rulesync` tool to keep configuration files up-to-date.

### 2.1. Documentation Localization Policy

- English files use the `.md` extension.
- Japanese translations use the matching filename with the `.ja.md` extension.
- Every document must have both English and Japanese versions. If you add or update content in one language, mirror the change in the counterpart file.

## 3. System Architecture

### 3.1. High-Level Diagram

```mermaid
graph TB
    subgraph "User Interface"
        Browser
    end

    subgraph "Cloudflare Edge"
        EdgeApp[Edge App<br/>Hono SSR]
        KV_Session[KV: Auth Session]
        KV_Trial[KV: Free Trial]
        KV_Rate[KV: Rate Limit]
        KV_Idempotency[KV: Idempotency]
        D1[D1 Database]
    end

    subgraph "Application Layer"
        UseCases[Application UseCases<br/>quiz.ts]
        Session[Session Management<br/>current-user.ts]
    end

    subgraph "Domain Layer"
        DomainLogic[Domain Logic<br/>@edu-quest/domain]
        AppLogic[App Logic<br/>@edu-quest/app]
    end

    subgraph "Infrastructure"
        Database[Database Client<br/>Drizzle ORM]
        Schema[Database Schema]
    end

    subgraph "Routes"
        Pages[Pages<br/>home, math-home, start, play]
        APIs[APIs<br/>/apis/quiz]
    end

    Browser --> EdgeApp
    EdgeApp --> Pages
    EdgeApp --> APIs
    EdgeApp --> UseCases
    UseCases --> AppLogic
    UseCases --> Session
    AppLogic --> DomainLogic
    EdgeApp --> KV_Session
    EdgeApp --> KV_Trial
    EdgeApp --> KV_Rate
    EdgeApp --> KV_Idempotency
    EdgeApp --> Database
    Database --> D1
    Database --> Schema
```

### 3.2. Monorepo Structure (pnpm workspaces)

The project is a monorepo managed with pnpm workspaces.

- **`apps/`**: Executable applications.
  - `@edu-quest/edge`: The main application (SSR + BFF API) running on Cloudflare Workers.
  - `@edu-quest/api`: A Node.js server for local API development.
  - `@edu-quest/web`: A Hono server for local web development.
- **`packages/`**: Shared libraries.
  - `@edu-quest/domain`: The core domain logic (problem generation, calculation rules). This is the heart of the application.
  - `@edu-quest/app`: Application logic that uses the domain layer (quiz session management, answer verification).
- **`infra/`**: Infrastructure as Code.
  - `terraform/`: Terraform configurations for Cloudflare resources.
  - `migrations/`: Database schemas and migration scripts for D1.
- **`docs/`**: All project documentation.

## 4. Development Workflow

### 4.1. Core Principles

- **Convention over Configuration:** Adhere to the established project conventions.
- **Linting is Law:** All code must pass linting checks (`just lint`) before submission.
- **Minimal Changes:** Make small, focused commits. Avoid unrelated refactoring.
- **No Automatic Git Operations:** **NEVER** execute `git add`, `git commit`, or `git push` automatically. Always wait for explicit user approval before making any Git operations.

### 4.2. Key Commands

- `just setup`: Installs all dependencies and sets up the environment.
- `just lint`: Runs all code quality checks.
- `just fix`: Applies automatic formatting and fixes.
- `pnpm dev:edge`: Starts the main application for local development.

### 4.3. UI/UX Guidelines

#### Answer Input Method

**CRITICAL: EduQuest uses button-based answer input across all content types (math, time, kanji).**

This is a fundamental platform-wide design decision that MUST be followed for all Quest implementations:

**Requirements:**

- **DO NOT use** standard browser input controls (`<input type="text">`, `<input type="number">`, `<select>`, etc.) for quiz answer submission
- **USE** dedicated answer buttons that users can click/tap to submit their answers
- **Implementation:** Each answer option should be a separate `<button>` within a `<form>` with hidden inputs for SSR compatibility

**Rationale:**

- **Target Audience:** Elementary school students (grades 1-4) who may struggle with keyboard input
- **Device Optimization:** Better mobile/tablet experience with large, tappable buttons
- **UX Benefits:**
  - Prevents input validation errors and IME-related issues
  - Provides immediate visual feedback on user interaction
  - Eliminates typing mistakes and frustration
  - Consistent interaction pattern across all Quest types

**Examples by Quest Type:**

- ✅ **MathQuest**: Number pad buttons (0-9) for numeric answers
- ✅ **ClockQuest**: Hour buttons (1-12) for time selection
- ✅ **KanjiQuest**: Multiple choice buttons for character selection
- ❌ **NEVER**: `<input type="number">`, `<input type="text">`, or other text input fields

**Implementation Pattern:**

```tsx
// Each button is a separate form for SSR compatibility
{
  Array.from({ length: 10 }, (_, i) => (
    <form method="POST" key={i}>
      <input type="hidden" name="answer" value={i} />
      <button type="submit">{i}</button>
    </form>
  ));
}
```

This approach maintains SSR compatibility while providing an optimal user experience for young learners.

## 5. How to Contribute

1.  **Understand the Goal:** Read the user's request carefully.
2.  **Consult the Docs:** Refer to the documents linked above to understand the relevant parts of the project. Start with the architecture and domain logic.
3.  **Locate the Code:** Use `glob` or `search_file_content` to find the relevant files. The directory structure is logical and should be your first guide.
4.  **Analyze, Don't Assume:** Read the existing code and its context before making changes.
5.  **Implement Changes:** Modify the code, adhering strictly to the project's style and conventions.
6.  **Verify:** Run `just lint` and any relevant tests to ensure your changes are correct and don't break anything.
7.  **Update Documentation:** If you change any behavior, tool, or workflow, update the corresponding documentation.

## 6. Multi-Quest Architecture

**EduQuest** is a multi-subject learning platform that provides various educational content through specialized "Quest" modules. The platform uses a **subdirectory-based routing structure** for simplicity and unified user experience.

### 6.1. Quest Modules

The platform currently supports and plans to support the following Quest modules:

- **MathQuest** (`/math`) - Arithmetic practice with grade-level presets and themed exercises (Available)
- **KanjiQuest** (`/kanji`) - Kanji learning organized by grade level (Coming Soon)
- **ClockQuest** (`/clock`) - Time-reading practice with analog and digital clocks (Coming Soon)

### 6.2. URL Structure

**Subdirectory-based routing:**

```text
Domain Structure:
  dev.edu-quest.app (development)
  edu-quest.app (production)

Route Structure:
  /                    → EduQuest hub (Quest selection portal)
  /math                → MathQuest landing page
  /math/start          → MathQuest configuration wizard
  /math/play           → MathQuest practice session
  /kanji               → KanjiQuest landing page (Coming Soon)
  /clock               → ClockQuest landing page (Coming Soon)
```

**Backward Compatibility:**

- `/start` → `/math/start` (301 redirect)
- `/play` → `/math/play` (301 redirect)

### 6.3. Design Principles

- **Subdirectory Routing:** Simpler infrastructure, unified sessions, and better SEO compared to subdomain approach
- **Theme Customization:** Each Quest module has its own color scheme applied via CSS variables
  - MathQuest: Blue theme (#6B9BD1)
  - KanjiQuest: Purple theme (#9B7EC8)
  - ClockQuest: Orange theme (#F5A85F)
- **Shared Domain Logic:** All Quest modules reuse `@edu-quest/domain` and `@edu-quest/app` packages
- **Consistent UX:** Unified navigation and authentication across all Quest modules

### 6.4. Naming Conventions

```text
Brand:       EduQuest
Domains:     dev.edu-quest.app (dev), edu-quest.app (prod)
Packages:    @edu-quest/*
Routes:
  - Portal:  /
  - Math:    /math, /math/start, /math/play
  - Kanji:   /kanji (Coming Soon)
  - Clock:   /clock (Coming Soon)
```

**Note to AI Assistants:** When implementing new Quest modules or features, ensure that subject-specific logic is properly isolated while leveraging shared domain logic for common functionality (question generation patterns, answer verification, etc.).

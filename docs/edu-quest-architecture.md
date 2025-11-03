[🇯🇵 日本語](/docs/edu-quest-architecture.ja.md)

# eduquest: Architecture Design and Project Structure

## 1. Purpose

EduQuest is a learning platform for elementary school students that provides various educational content through specialized "Quest" modules. Currently featuring MathQuest for arithmetic practice, with KanjiQuest (kanji learning), GameQuest (brain-training mini games), and ClockQuest (time-reading) planned for future releases. Built with Hono for SSR on Cloudflare Workers, it offers grade-level presets and themed exercises. Question generation and grading are centralized in a shared domain logic, structured for consistent reuse from the UI to the API.

### Quest Modules

- **MathQuest** (`/math`): Arithmetic practice with grade-level presets and themed exercises (e.g., "Addition up to 20," "Addition/Subtraction Mix")
- **KanjiQuest** (`/kanji`): Kanji learning organized by grade level (Coming Soon)
- **GameQuest** (`/game`): Brain-training mini games for pattern recognition, spatial reasoning, and memory (Stellar Balance tile puzzle + Sudoku presets)
- **ClockQuest** (`/clock`): Time-reading practice with analog and digital clocks (Coming Soon)

## 2. Architecture Overview

### Execution Environment

- **Edge Runtime:** Cloudflare Workers (Wrangler development mode / production environment)
- **Framework:** Hono + JSX (SSR + Islands)
- **Data Store:** Cloudflare D1 (planned), KV (quiz sessions, auth sessions, rate limiting, free trials, idempotency)
- **Build:** pnpm workspaces + Vite/Vitest (application)

### Layered Structure

- **Domain Layer (`packages/domain`)**
  - Question generation algorithms, multi-step calculations (e.g., addition then subtraction), inverse arithmetic problems (`? + 5 = 10`), answer checking, and display formatting.
- **Application Layer (`packages/app`, `apps/edge/src/application`)**
  - Manages quiz progression (number of questions, correct answers), use cases (`generateQuizQuestion`, `verifyAnswer`), and session handling.
- **Infrastructure Layer (`apps/edge/src/infrastructure`)**
  - D1 connection via Drizzle ORM, KV bindings, and environment variable management.
- **Interface Layer (`apps/edge/src/routes`)**
  - Pages: EduQuest hub (`/`), Quest-specific pages (`/math`, `/kanji`, `/game`, `/clock`), and practice screens (`/math/start`, `/math/play`)
  - BFF API (`/apis/quiz/generate`, `/apis/quiz/verify`), and client-side interaction logic.

Dependencies between layers are organized with inward-pointing arrows centered on the domain layer. This allows the domain logic to be reused as-is for UI modifications or the addition of new delivery channels (e.g., a dedicated API UI).

## 3. Module Configuration

```mermaid
graph LR
    subgraph "Apps"
        Edge[@edu-quest/edge]
        API[@edu-quest/api]
        Web[@edu-quest/web]
    end

    subgraph "Packages"
        Domain[@edu-quest/domain]
        App[@edu-quest/app]
    end

    Edge --> App
    Edge --> Domain
    API --> App
    API --> Domain
    App --> Domain
```

- `@edu-quest/edge`: The production Cloudflare Workers app. It embeds presets as JSON on the start screen, and a client script configures the dynamic UI (theme selection, progress saving, sound effect/show-working toggles).
- `@edu-quest/api` / `@edu-quest/web`: Node + Hono servers for local validation without Workers. Useful for checking domain/API logic or for Storybook-like purposes.
- `@edu-quest/app`: Handles the calculation of quiz progress objects (current question number, correct count, etc.), allowing the UI to manage state transitions without side effects.
- `@edu-quest/domain`: The rules for generating calculation problems. When a grade-level theme is specified, it calls composite logic like `generateGradeOneQuestion`. For inverse arithmetic problems, it uses `generateInverseQuestion`.

## 4. Directory Structure

The following snapshot is auto-generated. Run `pnpm run docs:update-structure` after adding or removing directories so the tree stays in sync with the repository.

<!-- AUTO-GENERATED:STRUCTURE:START -->

```txt
edu-quest/
├── apps/ - Application projects
│   ├── api/ - Local development API server
│   ├── edge/ - Cloudflare Workers SSR app
│   │   └── src/
│   │       ├── __tests__/ - Edge integration tests
│   │       ├── application/ - Use cases, session management
│   │       ├── components/ - UI islands and shared components
│   │       ├── infrastructure/ - Drizzle, environment variables
│   │       ├── middlewares/
│   │       ├── routes/
│   │       │   ├── apis/ - `/apis/quiz` handlers
│   │       │   └── pages/ - `/`, quest pages, client scripts
│   │       ├── styles/ - Shared Tailwind-like tokens
│   │       └── views/ - Layouts and templates
│   └── web/ - Local development web server
├── cypress/ - End-to-end tests
│   ├── e2e/ - Cypress spec files
│   └── support/ - Shared Cypress helpers
├── docs/ - Documentation
├── infra/ - Infrastructure as code
│   ├── migrations/ - D1 schema
│   └── terraform/ - Terraform configuration
├── packages/ - Shared libraries
│   ├── app/ - Quiz progression use cases
│   └── domain/ - Question generation & grading logic
└── scripts/ - Automation scripts
    └── docs/ - Documentation tooling
```

<!-- AUTO-GENERATED:STRUCTURE:END -->

## 5. Use Cases and Data Flow

### EduQuest Hub (`/`)

1.  The homepage displays available Quest modules as cards with theme colors:
    - **MathQuest** (blue theme): Available for use
    - **KanjiQuest** (purple theme): Coming Soon
    - **GameQuest** (green theme): Stellar Balance + Sudoku available
    - **ClockQuest** (orange theme): Coming Soon
2.  Users can navigate to a specific Quest by clicking the "はじめる" (Start) button.
3.  Each Quest has its own dedicated color scheme applied via CSS variables.

### MathQuest Top Page (`/math`)

1.  Displays MathQuest-specific information and features (grade presets, customization options, focus mode).
2.  Users can click "算数をはじめる" (Start Math) to navigate to `/math/start`.
3.  Theme color is blue (#6B9BD1).

### MathQuest Start Screen (`/math/start`)

1.  The page is rendered via SSR. The server embeds the grade list, calculation types, and theme presets as JSON into a `<script type="application/json">` tag.
2.  The client script (`start.client.ts`) initializes and restores the following state from local storage:
    - `eduquest:progress:v1`: Total answers, correct answers, last selected grade/theme.
    - `eduquest:sound-enabled` / `eduquest:show-working`: UI toggles.
    - `eduquest:question-count-default`: Default number of questions.
3.  When a grade is selected, it filters calculation types from `gradeCalculationTypes` and narrows down theme buttons by the minimum target grade.
4.  Pressing "Start Practice" saves the selected settings to session storage and navigates to `/math/play`.

### MathQuest Play Screen (`/math/play`)

1.  On screen load, settings are restored from `eduquest:pending-session` to update display labels.
2.  After a 3-second countdown via `countdown-overlay`, it fetches a question by POSTing to `/apis/quiz/generate`.
3.  The user's answer is sent to `/apis/quiz/verify`, which displays the correctness and the right answer. If correct, the streak is incremented, and progress in local storage is updated.
4.  When the remaining questions reach zero, a result card is displayed, providing a path back to `/math/start`.

### API Layer

- `POST /apis/quiz/generate`
  - Input: `mode`, `max`, `gradeId`, `themeId`, etc. (selections from the start screen)
  - Output: Question data (including the formula and intermediate steps `extras`)
- `POST /apis/quiz/verify`
  - Input: Question object + answer value
  - Output: Correctness judgment and the correct value

The API utilizes the logic from `@edu-quest/domain` via `apps/edge/src/application/usecases/quiz.ts`. This ensures that the same specification for questions is generated on both the UI and API sides, and tests can be written at the use-case level.

### Inverse Arithmetic Problems

Inverse arithmetic problems are questions where one operand is unknown (e.g., `? + 5 = 10` or `3 + ? = 9`).

**Implementation features:**

- **Question Generation**: The `generateInverseQuestion` function generates questions with `isInverse: true` and `inverseSide: 'left' | 'right'`.
- **Display Format**: The `formatQuestion` function displays questions in a format that includes the `?` symbol and the result (`= 10`).
- **Answer Verification**: For inverse problems, the `verifyAnswer` function uses the `answer` field (the value of the unknown) from the question object to determine correctness. Unlike regular arithmetic problems, the correct answer is the value of the unknown, not the calculation result.

**Data Structure:**

```typescript
type Question = {
  a: number;
  b: number;
  op: '+' | '-' | '×';
  answer: number; // For inverse problems, the value of the unknown
  isInverse?: boolean; // Inverse problem flag
  inverseSide?: 'left' | 'right'; // Position of the unknown
};
```

## 6. Technology Stack

- **UI:** Hono JSX, Tailwind-style utility classes (with custom CSS variables)
- **Client-side:** TypeScript, Islands architecture for script embedding
- **Logic:** Use-case testing with Vitest, pure functions for domain logic
- **Infrastructure:** Cloudflare Workers, KV, D1, Terraform
- **Tooling:** pnpm, mise, just, biome, cspell

## 7. Design Considerations

- **Reusability:** Domain logic and use cases are pure TypeScript, running on both Node and Workers, shared between the API and SSR.
- **Accessibility:** The keypad supports keyboard operations and communicates state with ARIA attributes. Theme selection uses `aria-pressed`.
- **Local Storage Strategy:** Progress and settings are saved to improve the UX on return visits. A version key is included to prepare for future migrations.
- **Future Expansion:** Plans include user management with Better Auth integration, full-fledged learning history persistence to D1, and AI coaching features.

## 8. Session Management

**EduQuest uses Cloudflare KV storage for secure server-side session management.**

### Philosophy

All Quest modules (MathQuest, KanjiQuest, GameQuest, ClockQuest) follow the **KV + Session ID pattern** for managing quiz sessions:

- **Session data is stored server-side** in Cloudflare KV with automatic TTL (Time To Live)
- **Only session IDs are stored client-side** in HttpOnly cookies
- **Never expose sensitive data** to the client (question answers, correct counts, etc.)

### Available KV Namespaces

| Namespace       | Purpose                      | Binding Name      |
| --------------- | ---------------------------- | ----------------- |
| KV_QUIZ_SESSION | Quiz/Quest session data      | `KV_QUIZ_SESSION` |
| KV_AUTH_SESSION | User authentication sessions | `KV_AUTH_SESSION` |
| KV_FREE_TRIAL   | Free trial tracking          | `KV_FREE_TRIAL`   |
| KV_RATE_LIMIT   | API rate limiting            | `KV_RATE_LIMIT`   |
| KV_IDEMPOTENCY  | Idempotency key management   | `KV_IDEMPOTENCY`  |

### Session Lifecycle Example (KanjiQuest)

```typescript
// 1. Start session - Generate ID and store in KV
const sessionId = crypto.randomUUID();
await c.env.KV_QUIZ_SESSION.put(
  `kanji:${sessionId}`,
  JSON.stringify(session),
  { expirationTtl: 1800 } // 30 minutes
);

// Set HttpOnly cookie with session ID only
response.headers.append(
  'Set-Cookie',
  `kanji_session_id=${sessionId}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax`
);

// 2. Retrieve session - Read from KV using ID from cookie
const sessionData = await c.env.KV_QUIZ_SESSION.get(`kanji:${sessionId}`);
const session = JSON.parse(sessionData);

// 3. Update session - Overwrite KV entry with new state
await c.env.KV_QUIZ_SESSION.put(
  `kanji:${sessionId}`,
  JSON.stringify(updatedSession),
  { expirationTtl: 1800 }
);

// 4. End session - Delete from KV when quiz completes
await c.env.KV_QUIZ_SESSION.delete(`kanji:${sessionId}`);
```

### Security Benefits

- **XSS Protection:** HttpOnly cookies prevent JavaScript access to session IDs
- **CSRF Mitigation:** SameSite=Lax prevents cross-site request forgery
- **Data Isolation:** Session data never leaves the server
- **Automatic Expiration:** TTL ensures sessions don't persist indefinitely

For detailed implementation guidelines, see [AGENTS.md Section 7: Session Management Policy](./AGENTS.md#7-session-management-policy).

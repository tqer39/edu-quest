# GameQuest Design Document

## Overview

GameQuest is a collection of brain-training mini games designed to reinforce foundational math skills, spatial awareness, and logical reasoning through playful challenges. Each game lasts 60–120 seconds to keep students motivated while providing rapid feedback loops.

## Target Users

- Elementary school students (Grades 1-6)
- Learners who prefer hands-on, game-based practice sessions
- Students who have completed MathQuest stages and want additional skill reinforcement

## Core Game Modes

### 1. Pattern Sprint

**Objective**: Strengthen mental arithmetic by identifying the missing number in a fast-paced sequence.

**Gameplay Loop**:

1. Display a 4-number sequence with one hidden tile (e.g., `3, 6, __, 12`).
2. Students choose the correct number from four options within 10 seconds.
3. Correct streaks trigger combo animations and bonus points.

**Difficulty Scaling**:

- Easy: Addition and subtraction with numbers up to 20
- Medium: Multiplication/division patterns up to 9×9
- Hard: Mixed operations and two-step sequences

---

### 2. Shape Builder

**Objective**: Improve spatial reasoning by assembling tangram-style silhouettes.

**Gameplay Loop**:

1. Display a target silhouette on the right side of the screen.
2. Provide draggable geometric tiles (triangles, squares, rectangles) on the left.
3. Students drag and rotate tiles to fill the silhouette before the timer expires.

**Hint System**:

- Hint 1: Highlight the correct tile outline
- Hint 2: Snap the selected tile into the correct rotation
- Hint 3: Show a translucent overlay of the full solution

---

### 3. Memory Match Quest

**Objective**: Reinforce vocabulary and math symbols through a timed memory card game.

**Gameplay Loop**:

1. Present a 4x4 grid of face-down cards.
2. Students flip two cards per turn to find matching pairs (e.g., number vs. equation, symbol vs. name).
3. Matches grant bonus time; mismatches briefly reveal educational hints.

**Card Themes**:

- Numbers & equations (e.g., `8` ↔ `4 + 4`)
- Clock faces & time expressions
- Geometric shapes & definitions

---

### 4. Sentinel Knights

**Objective**: Develop spatial reasoning and forward-planning by placing knight-style guardians on a shared board.

**Gameplay Loop**:

1. Display a 6×6 grid divided into color-coded regions with a handful of blocked cells.
2. Learners tap cells to cycle between "Guardian", "Note", and "Empty" states while keeping the knight movement constraints in mind.
3. The round ends when every row, column, and region contains exactly one guardian that cannot reach another via an L-shaped knight move.

**Unique Mechanics**:

- Knight conflict detection highlights invalid placements and explains the violation.
- Region quotas encourage learners to balance global and local reasoning.
- A progressive hint system guides students toward rows, columns, or regions that still lack a guardian.

---

## Progression & Rewards

- **Stage Levels**: Each mode offers Grade 1-6 presets with curated difficulty settings.
- **Daily Missions**: 3 rotating challenges encouraging variety ("Clear Shape Builder twice", etc.).
- **Achievement Badges**:
  - 🎯 Combo Captain – Earn a 10-question streak in Pattern Sprint
  - 🧩 Master Builder – Solve three Shape Builder puzzles without hints
  - 🧠 Memory Sage – Clear Memory Match Quest within 90 seconds

## Accessibility Considerations

- Adjustable timer length (30/60/90 seconds)
- Colorblind-friendly palettes and optional high-contrast mode
- Voice-over cues for critical events ("10 seconds left!", "Combo bonus!")

## Technical Notes

- Reuses the shared quiz session manager with a new `game` namespace in KV storage.
- Each mini game exposes a standardized scoring payload to `@edu-quest/domain` for analytics.
- Frontend components extend the existing Hono SSR layout and share the quest-level theming API.

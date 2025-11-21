---
description: Generate git commit message and commit changes
---

1. Run `git status` to see all staged and unstaged changes
2. Run `git diff --cached` to see staged changes (if any)
3. Run `git diff` to see unstaged changes
4. Run `git log --oneline -5` to understand recent commit message style

Based on the changes:

- Analyze what was modified, added, or deleted
- Generate a concise commit message following Conventional Commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for adding/updating tests
  - `chore:` for maintenance tasks

Present the suggested commit message and ask for user confirmation before executing any git commands.

IMPORTANT: Do NOT execute `git add` or `git commit` without explicit user approval.

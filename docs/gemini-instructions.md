[🇯🇵 日本語](/docs/gemini-instructions.ja.md)

# Notes for Gemini Code Assist

At the moment there is no official feature that automatically imports standard repository files. When necessary, copy the shared guidelines from `docs/AI_RULES.md` into the workspace-specific instructions.

Recommended defaults:

- Reply in English (or Japanese if explicitly requested).
- Keep diffs minimal and follow the existing style.
- Ensure all changes pass `just lint`.
- Primary commands: `brew bundle install` → `just setup` / `just lint` / `just fix`.

Refer to `docs/AI_RULES.md` for more details.

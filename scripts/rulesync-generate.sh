#!/usr/bin/env bash
#
# Generate AI assistant configuration files from .rulesync/rules/
#
# This script generates configuration files for:
# - GitHub Copilot (.github/copilot-instructions.md)
# - Cursor (.cursorrules)
# - Cline/Claude Code (via .claude/)
# - Codex CLI (.codex/)
#
# Source of truth: .rulesync/rules/agents.md (git-tracked)
# Generated files: tool-specific configuration files (gitignored)
#

set -euo pipefail

# Change to project root
cd "$(dirname "$0")/.."

# Guard: rulesync not installed
if ! command -v rulesync >/dev/null 2>&1; then
  echo "rulesync not installed; skipping generation (install to enable)."
  exit 0
fi

# Guard: .rulesync directory not found
if [ ! -d ".rulesync" ]; then
  echo "No .rulesync directory found; skipping generation."
  exit 0
fi

echo "Generating AI assistant configurations from .rulesync/rules/agents.md..."

# Generate for all supported tools
rulesync generate

# Create symlink to root AGENTS.md for backward compatibility with Codex CLI
if [ -f ".rulesync/rules/agents.md" ]; then
  if [ ! -L "AGENTS.md" ]; then
    echo "Creating symlink: AGENTS.md -> .rulesync/rules/agents.md (for Codex CLI compatibility)..."
    ln -sf .rulesync/rules/agents.md AGENTS.md
  fi
fi

echo "✓ Generated configuration files:"
echo "  - .github/copilot-instructions.md (GitHub Copilot)"
echo "  - .cursor/rules/agents.mdc (Cursor)"
echo "  - .claude/memories/agents.md (Claude Code)"
echo "  - .codex/memories/agents.md (Codex CLI)"
echo "  - ./AGENTS.md -> .rulesync/rules/agents.md (symlink for Codex CLI)"

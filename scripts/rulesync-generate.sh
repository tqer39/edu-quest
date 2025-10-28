#!/usr/bin/env bash
#
# Generate AI assistant configuration files from .rulesync/rules/
#
# This script generates configuration files for:
# - GitHub Copilot (.github/copilot-instructions.md)
# - Cursor (.cursorrules)
# - Cline/Claude Code (via .claude/)
#

set -euo pipefail

# Change to project root
cd "$(dirname "$0")/.."

echo "Syncing AGENTS.md to .rulesync/rules/agents.md..."
cp AGENTS.md .rulesync/rules/agents.md

echo "Generating AI assistant configurations from AGENTS.md..."

# Generate for all supported tools
rulesync generate

echo "✓ Generated configuration files:"
echo "  - .github/copilot-instructions.md (GitHub Copilot)"
echo "  - .cursor/rules/agents.mdc (Cursor)"
echo "  - .claude/memories/agents.md (Claude Code)"
echo "  - .codex/memories/agents.md (Codex CLI)"
echo ""
echo "Note: Codex also uses ./AGENTS.md directly"

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

echo "Generating AI assistant configurations from AGENTS.md..."

# Generate for all supported tools
rulesync generate --targets copilot,cursor,cline --features rules

echo "✓ Generated configuration files:"
echo "  - .github/copilot-instructions.md (GitHub Copilot)"
echo "  - .cursor/rules/agents.mdc (Cursor)"
echo "  - Claude Code uses CLAUDE.md directly"

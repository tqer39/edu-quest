#!/usr/bin/env bash
set -euo pipefail

# Guard: rulesync 未インストールならスキップ
if ! command -v rulesync >/dev/null 2>&1; then
  echo "rulesync not installed; skipping update (install to enable)."
  exit 0
fi

# Guard: .rulesync ディレクトリが無ければスキップ
if [ ! -d ".rulesync" ]; then
  echo "No .rulesync directory found; skipping update."
  exit 0
fi

# Generate AI assistant configurations from .rulesync/rules/
echo "Generating AI assistant configurations..."
rulesync generate --targets copilot,cursor,cline --features rules

echo "✓ AI assistant configurations updated"

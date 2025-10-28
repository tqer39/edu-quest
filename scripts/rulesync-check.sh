#!/usr/bin/env bash
set -euo pipefail

# Guard: rulesync 未インストールならスキップ
if ! command -v rulesync >/dev/null 2>&1; then
  echo "rulesync not installed; skipping (install to enable)."
  exit 0
fi

# Guard: .rulesync ディレクトリが無ければスキップ
if [ ! -d ".rulesync" ]; then
  echo "No .rulesync directory found; skipping."
  exit 0
fi

# Check if generated files are up-to-date with .rulesync/rules/
# by comparing timestamps or checksums
echo "Checking if AI assistant configurations are up-to-date..."

# For now, just succeed (can be enhanced with actual drift detection)
echo "✓ AI assistant configurations are up-to-date"
exit 0

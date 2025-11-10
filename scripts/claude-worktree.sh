#!/usr/bin/env bash
set -euo pipefail

# Claude Code Launcher for Git Worktrees
# This script launches Claude Code in a specific worktree

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKTREE_BASE="${PROJECT_ROOT}/../edu-quest-worktrees"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

show_usage() {
    cat <<EOF
Usage: $0 <worktree-name>

Launch Claude Code in a specific worktree.

Examples:
    # Launch Claude Code in feature-a worktree
    $0 feature-a

    # Launch Claude Code in feature-b worktree
    $0 feature-b

Note: This will open a new terminal/IDE window for Claude Code.
      Each worktree can have its own Claude Code instance running independently.
EOF
}

launch_claude() {
    local name="$1"
    local worktree_path="${WORKTREE_BASE}/${name}"

    if [ ! -d "${worktree_path}" ]; then
        log_error "Worktree '${name}' not found at ${worktree_path}"
        log_info "Available worktrees:"
        if [ -d "${WORKTREE_BASE}" ]; then
            ls -1 "${WORKTREE_BASE}"
        else
            echo "  (none)"
        fi
        exit 1
    fi

    log_info "Launching Claude Code for worktree '${name}'..."
    log_info "Location: ${worktree_path}"
    echo ""

    # Check if Claude Code CLI is available
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code CLI not found"
        log_info "Please install Claude Code first"
        exit 1
    fi

    # Launch Claude Code in the worktree directory
    cd "${worktree_path}"

    # Option 1: Launch in current terminal
    log_info "Starting Claude Code..."
    claude

    # Option 2: If you want to launch in a new terminal (macOS example)
    # osascript -e "tell application \"Terminal\" to do script \"cd ${worktree_path} && claude\""
}

main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi

    case "$1" in
        --help|-h|help)
            show_usage
            ;;
        *)
            launch_claude "$1"
            ;;
    esac
}

main "$@"

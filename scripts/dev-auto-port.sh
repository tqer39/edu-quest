#!/usr/bin/env bash
set -euo pipefail

# Start dev server with auto-assigned port
# This script can be run from within a worktree directory

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Get next available port starting from 8788
get_next_port() {
    local start_port=8788
    local port=$start_port
    while lsof -i ":$port" >/dev/null 2>&1; do
        ((port++))
        if [ $port -gt 8900 ]; then
            echo "Error: No available ports found between $start_port and 8900" >&2
            exit 1
        fi
    done
    echo "$port"
}

# Main
main() {
    local port
    port=$(get_next_port)

    log_info "Starting dev server on port ${port}..."
    log_success "Dev server will be available at http://localhost:${port}"
    echo ""

    PORT="${port}" pnpm dev:edge
}

main "$@"

#!/usr/bin/env bash
set -euo pipefail

# EduQuest Parallel Development with Git Worktree
# This script helps manage multiple worktrees for parallel feature development

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKTREE_BASE="${PROJECT_ROOT}/../edu-quest-worktrees"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Show usage
show_usage() {
    cat <<EOF
Usage: $0 <command> [options]

Commands:
    create <name> <base-branch>  Create a new worktree for feature development
    list                          List all worktrees
    remove <name>                 Remove a worktree
    dev <name> [port]            Start dev server for a worktree (default port: auto-assign)
    status                        Show status of all worktrees
    help                          Show this help message

Examples:
    # Create worktree for feature A (based on main branch)
    $0 create feature-a main

    # Create worktree for feature B (based on develop branch)
    $0 create feature-b develop

    # List all worktrees
    $0 list

    # Start dev server for feature-a on port 8788
    $0 dev feature-a 8788

    # Start dev server for feature-b on port 8789
    $0 dev feature-b 8789

    # Remove worktree
    $0 remove feature-a

    # Check status of all worktrees
    $0 status
EOF
}

# Get next available port starting from 8788
get_next_port() {
    local start_port=8788
    local port=$start_port
    while lsof -i ":$port" >/dev/null 2>&1; do
        ((port++))
        if [ $port -gt 8900 ]; then
            log_error "No available ports found between $start_port and 8900"
            exit 1
        fi
    done
    echo "$port"
}

# Create a new worktree
create_worktree() {
    local name="$1"
    local base_branch="${2:-main}"
    local branch_name="worktree/${name}"
    local worktree_path="${WORKTREE_BASE}/${name}"

    log_info "Creating worktree '${name}' based on '${base_branch}'..."

    # Create worktree base directory if it doesn't exist
    mkdir -p "${WORKTREE_BASE}"

    # Check if worktree already exists
    if [ -d "${worktree_path}" ]; then
        log_error "Worktree '${name}' already exists at ${worktree_path}"
        exit 1
    fi

    # Fetch latest changes
    log_info "Fetching latest changes..."
    git fetch origin "${base_branch}"

    # Create worktree and new branch
    log_info "Creating worktree at ${worktree_path}..."
    git worktree add -b "${branch_name}" "${worktree_path}" "origin/${base_branch}"

    # Setup dependencies in the worktree
    log_info "Setting up dependencies..."
    (cd "${worktree_path}" && pnpm install)

    log_success "Worktree '${name}' created successfully!"
    log_info "Location: ${worktree_path}"
    log_info "Branch: ${branch_name}"
    echo ""
    log_info "To start development:"
    echo "  cd ${worktree_path}"
    echo "  pnpm dev:edge"
    echo ""
    log_info "Or use:"
    echo "  $0 dev ${name}"
}

# List all worktrees
list_worktrees() {
    log_info "Git worktrees:"
    git worktree list
}

# Remove a worktree
remove_worktree() {
    local name="$1"
    local worktree_path="${WORKTREE_BASE}/${name}"

    if [ ! -d "${worktree_path}" ]; then
        log_error "Worktree '${name}' not found at ${worktree_path}"
        exit 1
    fi

    log_warn "This will remove the worktree '${name}' at ${worktree_path}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cancelled."
        exit 0
    fi

    log_info "Removing worktree '${name}'..."
    git worktree remove "${worktree_path}" --force

    log_success "Worktree '${name}' removed successfully!"
}

# Start dev server for a worktree
dev_worktree() {
    local name="$1"
    local port="${2:-$(get_next_port)}"
    local worktree_path="${WORKTREE_BASE}/${name}"

    if [ ! -d "${worktree_path}" ]; then
        log_error "Worktree '${name}' not found at ${worktree_path}"
        exit 1
    fi

    log_info "Starting dev server for '${name}' on port ${port}..."
    log_info "Location: ${worktree_path}"
    echo ""

    # Create a tmux session or screen session for the dev server
    if command -v tmux &> /dev/null; then
        local session_name="eduquest-${name}"
        if tmux has-session -t "${session_name}" 2>/dev/null; then
            log_warn "Tmux session '${session_name}' already exists"
            log_info "Attaching to existing session..."
            tmux attach-session -t "${session_name}"
        else
            log_info "Creating tmux session '${session_name}'..."
            cd "${worktree_path}"
            tmux new-session -s "${session_name}" -d
            tmux send-keys -t "${session_name}" "cd ${worktree_path}" C-m
            tmux send-keys -t "${session_name}" "export PORT=${port}" C-m
            tmux send-keys -t "${session_name}" "pnpm dev:edge" C-m
            log_success "Dev server started in tmux session '${session_name}'"
            log_info "Attach with: tmux attach-session -t ${session_name}"
            log_info "Detach with: Ctrl+B then D"
        fi
    else
        log_warn "tmux not found. Starting dev server in current terminal..."
        log_info "Tip: Install tmux for better session management:"
        log_info "  macOS: brew install tmux"
        log_info "  Linux: apt-get install tmux or yum install tmux"
        echo ""
        cd "${worktree_path}"
        PORT="${port}" pnpm dev:edge
    fi
}

# Show status of all worktrees
show_status() {
    log_info "Checking status of all worktrees..."
    echo ""

    # Get list of worktrees
    git worktree list --porcelain | while IFS= read -r line; do
        if [[ $line == worktree* ]]; then
            local path="${line#worktree }"
            if [[ -d "$path" ]]; then
                echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                log_info "Worktree: $(basename "$path")"
                echo "  Path: $path"

                # Check if dev server is running
                local port_found=false
                for port in {8788..8900}; do
                    if lsof -i ":$port" -P | grep -q "$(basename "$path")"; then
                        echo -e "  ${GREEN}Dev Server: Running on port $port${NC}"
                        port_found=true
                        break
                    fi
                done
                if [ "$port_found" = false ]; then
                    echo "  Dev Server: Not running"
                fi

                # Show git status
                (cd "$path" && git status -sb 2>/dev/null || echo "  Unable to get git status")
                echo ""
            fi
        fi
    done
}

# Main command dispatcher
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi

    local command="$1"
    shift

    case "$command" in
        create)
            if [ $# -lt 2 ]; then
                log_error "Usage: $0 create <name> <base-branch>"
                exit 1
            fi
            create_worktree "$1" "$2"
            ;;
        list)
            list_worktrees
            ;;
        remove)
            if [ $# -lt 1 ]; then
                log_error "Usage: $0 remove <name>"
                exit 1
            fi
            remove_worktree "$1"
            ;;
        dev)
            if [ $# -lt 1 ]; then
                log_error "Usage: $0 dev <name> [port]"
                exit 1
            fi
            dev_worktree "$@"
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"

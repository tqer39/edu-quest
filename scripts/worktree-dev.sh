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
    log_info "Open this worktree in VS Code with:"
    echo "  code ${worktree_path}"
    echo ""

    cd "${worktree_path}"
    PORT="${port}" pnpm dev:edge
}

# Show status of all worktrees
show_status() {
    log_info "Worktree Status Dashboard"
    echo ""

    # Summary header
    local total_worktrees=0
    local running_servers=0

    # Collect worktree information
    local worktree_info=()
    while IFS= read -r line; do
        if [[ $line == worktree* ]]; then
            local path="${line#worktree }"
            if [[ -d "$path" ]]; then
                ((total_worktrees++)) || true
                worktree_info+=("$path")
            fi
        fi
    done < <(git worktree list --porcelain)

    # Count running servers
    for port in {8788..8900}; do
        if lsof -i ":$port" >/dev/null 2>&1; then
            ((running_servers++)) || true
        fi
    done

    # Display summary
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│                     📊 Worktree Overview                        │"
    echo "├─────────────────────────────────────────────────────────────────┤"
    printf "│ %-30s %32s │\\n" "Total Worktrees:" "$total_worktrees"
    printf "│ %-30s %32s │\\n" "Running Dev Servers:" "$running_servers"
    echo "└─────────────────────────────────────────────────────────────────┘"
    echo ""

    # Detailed status for each worktree
    for path in "${worktree_info[@]}"; do
        local name
        name=$(basename "$path")

        echo "┌─────────────────────────────────────────────────────────────────┐"
        printf "│ 📁 %-60s │\\n" "$name"
        echo "├─────────────────────────────────────────────────────────────────┤"
        printf "│ Path: %-58s │\\n" "$path"

        # Get branch name
        local branch
        branch=$(cd "$path" && git branch --show-current 2>/dev/null) || branch="unknown"
        printf "│ Branch: %-56s │\\n" "$branch"

        # Check dev server status
        local server_status="Not running"
        local server_port=""
        for port in {8788..8900}; do
            if lsof -i ":$port" -P 2>/dev/null | grep -q "workerd\\|node"; then
                local process_path
                process_path=$(lsof -i ":$port" -P 2>/dev/null | grep "workerd\\|node" | head -1 | awk '{print $9}') || process_path=""
                if [[ "$process_path" == *"$name"* ]]; then
                    server_status="Running"
                    server_port="port $port"
                    break
                fi
            fi
        done

        if [[ "$server_status" == "Running" ]]; then
            echo -e "│ Dev Server: ${GREEN}${server_status} ${server_port}${NC}"
        else
            echo -e "│ Dev Server: ${RED}${server_status}${NC}"
        fi

        # Check if Claude Code might be running
        local claude_count
        # shellcheck disable=SC2009
        claude_count=$(ps aux | grep -i "claude" | grep -v grep | grep -c "$path") || claude_count="0"
        if [ "$claude_count" -gt 0 ]; then
            echo -e "│ ${GREEN}✓${NC} Claude Code: Possibly running ($claude_count process(es))"
        else
            echo -e "│ ${YELLOW}○${NC} Claude Code: Not detected"
        fi

        # Git status summary
        local git_status
        git_status=$(cd "$path" && git status --short 2>/dev/null) || git_status=""
        local modified
        local added
        local untracked
        modified=$(echo "$git_status" | grep -c "^ M" 2>/dev/null) || modified="0"
        added=$(echo "$git_status" | grep -c "^A" 2>/dev/null) || added="0"
        untracked=$(echo "$git_status" | grep -c "^??" 2>/dev/null) || untracked="0"

        if [ "$modified" -gt 0 ] || [ "$added" -gt 0 ] || [ "$untracked" -gt 0 ]; then
            echo -e "│ Changes: ${YELLOW}M:$modified A:$added U:$untracked${NC}"
        else
            echo -e "│ Changes: ${GREEN}Clean${NC}"
        fi

        # Last commit info
        local last_commit
        last_commit=$(cd "$path" && git log -1 --oneline 2>/dev/null | cut -c1-55) || last_commit="No commits"
        printf "│ Last commit: %-51s │\\n" "$last_commit"

        # Activity indicator (last modified time)
        local last_modified=""
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS - limit find to depth 3 for performance
            last_modified=$(find "$path" -maxdepth 3 -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.wrangler/*" -exec stat -f "%m" {} \; 2>/dev/null | sort -rn | head -1) || last_modified=""
        else
            # Linux - limit find to depth 3 for performance
            last_modified=$(find "$path" -maxdepth 3 -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.wrangler/*" -exec stat -c "%Y" {} \; 2>/dev/null | sort -rn | head -1) || last_modified=""
        fi

        if [ -n "$last_modified" ] && [ "$last_modified" != "" ]; then
            local now
            now=$(date +%s)
            local diff=$((now - last_modified))
            local activity=""
            if [ $diff -lt 300 ]; then
                activity="${GREEN}🔥 Active (< 5 min)${NC}"
            elif [ $diff -lt 3600 ]; then
                activity="${YELLOW}⚡ Recent (< 1 hour)${NC}"
            elif [ $diff -lt 86400 ]; then
                activity="📅 Today"
            else
                local days=$((diff / 86400))
                activity="📆 ${days} days ago"
            fi
            echo -e "│ Activity: $activity"
        fi

        echo "└─────────────────────────────────────────────────────────────────┘"
        echo ""
    done

    # Quick actions
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│                      🚀 Quick Actions                           │"
    echo "├─────────────────────────────────────────────────────────────────┤"
    echo "│ just worktree-dev <name>        - Start dev server              │"
    echo "│ just worktree-claude <name>     - Launch Claude Code            │"
    echo "│ just worktree-remove <name>     - Remove worktree               │"
    echo "└─────────────────────────────────────────────────────────────────┘"
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

# Git Worktree Quick Reference

A one-page cheat sheet for parallel development with git worktree.

## Quick Setup (3 Steps)

```bash
# 1. Create worktree
just worktree-create feature-name main

# 2. Start dev server
just worktree-dev feature-name

# 3. Launch Claude Code
just worktree-claude feature-name
```

## Essential Commands

| Command                                | Description                  |
| -------------------------------------- | ---------------------------- |
| `just worktree-create <name> <branch>` | Create new worktree          |
| `just worktree-list`                   | List all worktrees           |
| `just worktree-status`                 | Show status of all worktrees |
| `just worktree-dev <name> [port]`      | Start dev server             |
| `just worktree-claude <name>`          | Launch Claude Code           |
| `just worktree-remove <name>`          | Remove worktree              |

## Parallel Development Pattern

```text
┌─────────────────────────────────────────────────────────────────┐
│ Terminal 1: Feature A Dev Server                                │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-dev feature-a 8788                             │
│ ✓ Dev server running on http://localhost:8788                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Terminal 2: Feature B Dev Server                                │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-dev feature-b 8789                             │
│ ✓ Dev server running on http://localhost:8789                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Terminal 3: Claude Code for Feature A                           │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-claude feature-a                                │
│ > Working on feature A implementation...                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Terminal 4: Claude Code for Feature B                           │
├─────────────────────────────────────────────────────────────────┤
│ $ just worktree-claude feature-b                                │
│ > Working on feature B implementation...                        │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```text
workspace/
├── edu-quest/                    # Main repository (main branch)
│   ├── apps/
│   ├── packages/
│   ├── docs/
│   └── scripts/
│       ├── worktree-dev.sh      # Worktree management
│       └── claude-worktree.sh   # Claude launcher
│
└── edu-quest-worktrees/          # Worktrees directory
    ├── feature-a/                # Worktree for feature A
    │   ├── apps/
    │   ├── packages/
    │   └── node_modules/         # Independent dependencies
    │
    └── feature-b/                # Worktree for feature B
        ├── apps/
        ├── packages/
        └── node_modules/         # Independent dependencies
```

## Common Workflows

### Start New Feature

```bash
# Create worktree based on main
just worktree-create new-feature main

# Start development
just worktree-dev new-feature

# Launch Claude Code (in another terminal)
just worktree-claude new-feature
```

### Work on Multiple Features

```bash
# Terminal 1: Feature A
just worktree-dev feature-a 8788

# Terminal 2: Feature B
just worktree-dev feature-b 8789

# Terminal 3: Claude for A
just worktree-claude feature-a

# Terminal 4: Claude for B
just worktree-claude feature-b
```

### Check Status

```bash
# View all worktrees and their status
just worktree-status

# Output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ℹ Worktree: feature-a
#   Path: ../edu-quest-worktrees/feature-a
#   Dev Server: Running on port 8788
#   ## worktree/feature-a
#   M  apps/edge/src/routes/pages/kanji.tsx
```

### Finish and Cleanup

```bash
# Navigate to worktree
cd ../edu-quest-worktrees/feature-a

# Commit your changes
git add .
git commit -m "feat: add new feature"
git push origin worktree/feature-a

# Create PR
gh pr create --title "Add New Feature"

# After merging, remove worktree
just worktree-remove feature-a
```

## Port Management

| Port | Usage                          |
| ---- | ------------------------------ |
| 8788 | Default dev server port        |
| 8789 | Second feature                 |
| 8790 | Third feature                  |
| ...  | Auto-assigned if not specified |

**Auto-assign ports:**

```bash
just worktree-dev feature-name
# System finds next available port automatically
```

**Manual port assignment:**

```bash
just worktree-dev feature-a 8788
just worktree-dev feature-b 8789
```

## Tmux Sessions (Optional)

**Note:** tmux is optional. Install with `brew install tmux` (macOS) or `apt-get install tmux` (Linux).

If tmux is installed, worktree dev servers automatically create tmux sessions:

```bash
# Start dev server (creates tmux session if tmux is installed)
just worktree-dev feature-a

# Attach to tmux session
tmux attach-session -t eduquest-feature-a

# Detach from tmux
# Press: Ctrl+B, then D
```

**Without tmux:** Dev server runs in current terminal. Use separate terminal windows/tabs.

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8788

# Kill the process
kill <PID>

# Or use a different port
just worktree-dev feature-a 8790
```

### Worktree Already Exists

```bash
# List existing worktrees
just worktree-list

# Remove old worktree
just worktree-remove old-feature

# Create new worktree
just worktree-create new-feature main
```

### Dependencies Out of Sync

```bash
# Navigate to worktree
cd ../edu-quest-worktrees/feature-name

# Reinstall dependencies
pnpm install
```

### Branch Conflict

```bash
# Error: branch 'worktree/feature-a' already exists
# Solution: Delete the branch first
git branch -D worktree/feature-a

# Then create worktree again
just worktree-create feature-a main
```

## Best Practices

### ✅ Do

- Use descriptive worktree names (`add-kanji-dict`, not `test`)
- Create worktrees from up-to-date base branches
- Remove worktrees after merging PRs
- Let the system auto-assign ports when possible
- Keep worktrees focused on single features

### ❌ Don't

- Don't delete the main repository while worktrees exist
- Don't commit directly to the base branch from worktrees
- Don't share worktrees between different machines
- Don't create too many worktrees (2-4 is optimal)
- Don't forget to `git fetch` before creating worktrees

## Key Benefits

- ✅ No stashing needed
- ✅ No branch switching overhead
- ✅ Parallel development and testing
- ✅ Independent Claude Code contexts
- ✅ Side-by-side feature comparison
- ✅ Isolated dependency management

## Full Documentation

For complete guide, see: [docs/parallel-development.md](./parallel-development.md)

## Support

If something goes wrong:

1. Run `just worktree-status` to check current state
2. Try removing and recreating the worktree
3. Check `.git/worktrees/` directory
4. Review the full documentation

---

**Quick Start Template:**

```bash
# Copy and customize this template for your feature
export FEATURE_NAME="your-feature-name"
export BASE_BRANCH="main"
export DEV_PORT="8788"

just worktree-create $FEATURE_NAME $BASE_BRANCH
just worktree-dev $FEATURE_NAME $DEV_PORT
just worktree-claude $FEATURE_NAME
```

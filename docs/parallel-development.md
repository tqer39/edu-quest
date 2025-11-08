# Parallel Development with Git Worktree

This guide explains how to use git worktree to develop multiple features in parallel with separate Claude Code instances.

## Overview

Git worktree allows you to have multiple working directories (worktrees) for the same repository, each on a different branch. This enables:

- **Parallel Feature Development**: Work on feature A and feature B simultaneously
- **Isolated Environments**: Each worktree has its own dev server, dependencies, and state
- **Independent Claude Code Instances**: Run separate Claude Code sessions for each feature
- **Easy Context Switching**: Switch between features without stashing or committing incomplete work

## Architecture

```text
edu-quest/                           # Main worktree (main branch)
├── apps/
├── packages/
└── docs/

edu-quest-worktrees/                 # Worktrees directory
├── feature-a/                       # Worktree for feature A
│   ├── apps/
│   ├── packages/
│   └── .git -> main repo .git
├── feature-b/                       # Worktree for feature B
│   ├── apps/
│   ├── packages/
│   └── .git -> main repo .git
└── bugfix-x/                        # Worktree for bugfix X
    ├── apps/
    ├── packages/
    └── .git -> main repo .git
```

## Quick Start

### 1. Create Worktrees for Parallel Features

```bash
# Create worktree for feature A (based on main)
just worktree-create feature-a main

# Create worktree for feature B (based on main)
just worktree-create feature-b main

# Create worktree for bugfix (based on develop)
just worktree-create bugfix-x develop
```

### 2. Start Development Servers

Each worktree can run its own dev server on a different port:

```bash
# Terminal 1: Start dev server for feature-a on port 8788
just worktree-dev feature-a 8788

# Terminal 2: Start dev server for feature-b on port 8789
just worktree-dev feature-b 8789

# Or let the system auto-assign ports
just worktree-dev feature-a
```

### 3. Launch Claude Code for Each Worktree

```bash
# Terminal 3: Launch Claude Code for feature-a
just worktree-claude feature-a

# Terminal 4: Launch Claude Code for feature-b
just worktree-claude feature-b
```

Now you have:

- Feature A: Dev server on port 8788, Claude Code instance 1
- Feature B: Dev server on port 8789, Claude Code instance 2

## Complete Workflow Example

Let's say you want to work on two features in parallel:

1. Add Kanji dictionary feature
2. Improve MathQuest UI

### Step 1: Create Worktrees

```bash
# Create worktree for kanji dictionary
just worktree-create add-kanji-dict main

# Create worktree for mathquest UI
just worktree-create improve-mathquest-ui main
```

### Step 2: Open Two Terminal Windows

**Terminal Window 1 (Kanji Dictionary):**

```bash
cd ../edu-quest-worktrees/add-kanji-dict
pnpm dev:edge  # Starts on port 8788
```

**Terminal Window 2 (MathQuest UI):**

```bash
cd ../edu-quest-worktrees/improve-mathquest-ui
pnpm dev:edge  # Starts on port 8789 (auto-detected)
```

### Step 3: Launch Claude Code for Each

**Terminal 3:**

```bash
just worktree-claude add-kanji-dict
# Claude Code opens in the add-kanji-dict worktree
```

**Terminal 4:**

```bash
just worktree-claude improve-mathquest-ui
# Claude Code opens in the improve-mathquest-ui worktree
```

### Step 4: Work in Parallel

Now you can:

- Ask Claude in worktree 1 to implement kanji dictionary
- Ask Claude in worktree 2 to improve MathQuest UI
- Both features develop independently
- Test at <http://localhost:8788> (kanji) and <http://localhost:8789> (mathquest)

### Step 5: Check Status

```bash
just worktree-status
```

This shows:

- List of all worktrees
- Current branch for each
- Whether dev server is running
- Git status (staged/unstaged changes)

### Step 6: Create Pull Requests

When a feature is ready:

```bash
# In the worktree directory
cd ../edu-quest-worktrees/add-kanji-dict
git add .
git commit -m "feat: add kanji dictionary feature"
git push origin worktree/add-kanji-dict

# Then create PR on GitHub
gh pr create --title "Add Kanji Dictionary Feature"
```

### Step 7: Clean Up

After merging:

```bash
# Remove the worktree
just worktree-remove add-kanji-dict
```

## Available Commands

### Worktree Management

```bash
# Create a new worktree
just worktree-create <name> [base-branch]

# List all worktrees
just worktree-list

# Remove a worktree
just worktree-remove <name>

# Show status of all worktrees
just worktree-status
```

### Development

```bash
# Start dev server (auto-assign port)
just worktree-dev <name>

# Start dev server on specific port
just worktree-dev <name> <port>

# Launch Claude Code
just worktree-claude <name>
```

### Direct Script Usage

You can also use the scripts directly:

```bash
# Worktree management
./scripts/worktree-dev.sh create feature-x main
./scripts/worktree-dev.sh list
./scripts/worktree-dev.sh status
./scripts/worktree-dev.sh remove feature-x

# Claude Code launcher
./scripts/claude-worktree.sh feature-x
```

## Advanced Usage

### Using tmux for Dev Servers (Optional)

**Note:** tmux is optional. If not installed, the dev server will run in the current terminal.

To install tmux:

```bash
# macOS
brew install tmux

# Linux (Ubuntu/Debian)
sudo apt-get install tmux

# Linux (CentOS/RHEL)
sudo yum install tmux
```

If tmux is installed, the `worktree-dev` command automatically creates tmux sessions:

```bash
# Start dev server in tmux (if installed)
just worktree-dev feature-a

# Attach to the tmux session
tmux attach-session -t eduquest-feature-a

# Detach from tmux: Ctrl+B then D
```

**Without tmux:**
The dev server runs in the current terminal. Use separate terminal windows/tabs for each worktree.

### Multiple Features with Different Base Branches

```bash
# Feature from main
just worktree-create new-feature main

# Hotfix from production
just worktree-create urgent-fix production

# Experimental feature from develop
just worktree-create experiment develop
```

### Syncing with Remote

Each worktree shares the same .git directory:

```bash
# In any worktree
git fetch origin

# Pull latest changes for your branch
git pull origin worktree/your-branch

# Push your changes
git push origin worktree/your-branch
```

## Best Practices

### 1. Naming Convention

Use descriptive names for worktrees:

```bash
# Good
just worktree-create add-kanji-dictionary main
just worktree-create fix-clock-quest-bug main

# Avoid
just worktree-create test main
just worktree-create new main
```

### 2. Port Management

- Let the system auto-assign ports for dev servers
- Or manually assign: 8788 (feature-a), 8789 (feature-b), 8790 (feature-c)

### 3. Regular Cleanup

Remove worktrees after merging:

```bash
just worktree-list
just worktree-remove merged-feature
```

### 4. Independent Dependencies

Each worktree has its own `node_modules`:

- Changes to dependencies in one worktree don't affect others
- You can test dependency upgrades in isolation

### 5. Claude Code Context

Each Claude Code instance has its own:

- Conversation history
- Context window
- File state
- Todo lists

This prevents context confusion when working on multiple features.

## Troubleshooting

### Worktree Creation Fails

```bash
# If branch already exists
git branch -D worktree/feature-name

# If worktree directory exists
rm -rf ../edu-quest-worktrees/feature-name
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8788

# Kill the process
kill <PID>

# Or use a different port
just worktree-dev feature-a 8790
```

### Dependencies Out of Sync

```bash
# In the worktree directory
cd ../edu-quest-worktrees/feature-name
pnpm install
```

### Claude Code Won't Start

```bash
# Check if Claude CLI is installed
which claude

# If not, install Claude Code first
# Then try again
just worktree-claude feature-name
```

## Architecture Benefits

### 1. No Context Switching Overhead

- No need to stash changes
- No need to checkout different branches
- No mental overhead from switching contexts

### 2. Parallel Testing

- Run tests for feature A while developing feature B
- Compare behavior between branches side-by-side

### 3. Code Review in Progress

- Show work-in-progress to team members
- Demo feature A while feature B is still in development

### 4. Risk Isolation

- Breaking changes in one worktree don't affect others
- Experimental features can be tested safely

### 5. Efficient CI/CD

- Each worktree can have its own preview deployment
- Parallel CI runs for different features

## Comparison with Traditional Workflow

### Traditional (Single Working Directory)

```bash
# Work on feature A
git checkout -b feature-a
# ... make changes ...
git stash  # Need to switch

# Work on feature B
git checkout -b feature-b
# ... make changes ...
git stash  # Need to switch back

# Back to feature A
git checkout feature-a
git stash pop
# ... continue work ...
```

### With Worktrees

```bash
# Work on both simultaneously
cd ../edu-quest-worktrees/feature-a
# ... make changes ...

cd ../edu-quest-worktrees/feature-b
# ... make changes ...

# No stashing, no switching, both running in parallel
```

## Related Documentation

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Local Development Guide](./local-dev.md)
- [Project Overview](./README.md)

## FAQ

### Q: How many worktrees can I have?

A: As many as your disk space allows. Practically, 2-4 active worktrees is common.

### Q: Do worktrees share commits?

A: Yes! They share the same .git directory. Commits in one worktree are visible in others.

### Q: Can I have the same branch in multiple worktrees?

A: No. Git prevents checking out the same branch in multiple worktrees to avoid conflicts.

### Q: What happens to worktrees if I delete the main repo?

A: Don't delete the main repo while worktrees exist. Always remove worktrees first with `just worktree-remove`.

### Q: Can I use this with GitHub Codespaces?

A: Yes, but you'll need to adjust paths and may not need separate dev servers.

## Support

If you encounter issues:

1. Check `just worktree-status` for current state
2. Review logs in each worktree's `.wrangler/logs`
3. Try removing and recreating the worktree
4. Check the main repository's `.git/worktrees/` directory

For questions, ask in the team chat or create an issue.

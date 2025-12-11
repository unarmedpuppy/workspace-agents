# Workspace Agents - Agent Instructions

**Read this file first.** This is your entry point for understanding and contributing to the project.

## Project Summary

A framework for scaffolding structured context for workspace AI workflows. This is a meta-project that documents best practices for organizing AI assistant documentation across vendors (Claude, Copilot, Cursor, Gemini).

**Tech Stack**: Markdown documentation, Git-based task management, Vendor-agnostic patterns

## Quick Start

```bash
npx workspace-agents init      # Initialize framework in your project
```

Or for development of this repo:

```bash
git clone <repo-url>        # Clone the repository
git pull origin main        # Get latest changes
git checkout -b feature/x   # Create feature branch
```

## Architecture Overview

This project is a documentation framework with **executable skills** for deterministic setup. The structure follows a progressive disclosure pattern:

**Key Directories**:
```
/
├── AGENTS.md                    # This file - universal entrypoint
├── CLAUDE.md                    # Breadcrumb for Claude Code
├── GEMINI.md                    # Breadcrumb for Gemini
├── .cursor/rules/               # Breadcrumbs for Cursor
├── .github/                     # Breadcrumbs and agents for Copilot
├── .claude/skills/              # Symlinks to agents/skills/* (Claude Skills)
└── agents/                      # Deep documentation
    ├── README.md                # Directory index
    ├── reference/               # Topic-focused documentation
    ├── plans/                   # Unified workflow (plans + tasks)
    │   ├── tasks.md             # Active work tracking
    │   └── local/               # Ephemeral plans (gitignored)
    ├── personas/                # Reusable agent personalities
    ├── skills/                  # Executable skills (was tools/)
    │   ├── skill-creator/       # Create Anthropic-compliant skills
    │   ├── scaffold-workflow/   # Initialize framework
    │   └── upgrade-workflow/    # Migrate existing structure
    └── legacy/                  # Migrated files
```

**Skills vs Personas**:
- **Skills** (`agents/skills/`) - Executable, deterministic actions (create, validate, package)
- **Personas** (`agents/personas/`) - Contextual guidance for orchestrating skills and workflows

## Code Style

This project is documentation-focused. Follow these rules:

- Use clear, concise language optimized for AI agent comprehension
- Keep AGENTS.md under 300 lines; move details to `agents/reference/`
- Use YAML frontmatter for tool/persona/plan discovery
- Follow markdown best practices (ATX headers, fenced code blocks)
- Include concrete examples in all documentation

See `agents/reference/documentation-style.md` for complete guidelines.

## Boundaries

### Always Do
- Update task status when claiming/completing work (see `agents/plans/tasks.md`)
- Keep AGENTS.md concise; move deep docs to `agents/reference/`
- Use YAML frontmatter for discoverable resources
- Test documentation changes by reading as an AI agent would
- Commit after each logical documentation update

### Ask First
- Major structural changes to the framework
- New vendor-specific patterns not yet validated
- Changes to the task claiming protocol
- Adding new top-level directories

### Never Do
- Commit to main branch directly (use feature branches)
- Delete documented patterns without archiving
- Make vendor-specific assumptions in AGENTS.md
- Commit local scratch work from `agents/plans/local/`
- Skip updating the README when adding new patterns

## Workflow

### Plan → Act → Test

1. **Plan**: Understand requirements, explore existing docs, ask clarifying questions
2. **Act**: Update documentation incrementally, commit often, follow style guide
3. **Test**: Verify all links work, check formatting, ensure agent-readable

### Planning Documentation

Store plans in `agents/plans/` (shared) or `agents/plans/local/` (local only):

- **`agents/plans/`** - Committed plans for framework enhancements, new patterns, multi-session work
  - Organize by feature: `agents/plans/feature-name/` for complex features with multiple files
  - Simple plans: `agents/plans/feature-name.md` for single-file plans
  - `tasks.md` - Active work tracking (unified with plans)
- **`agents/plans/local/`** - Gitignored scratch work, session notes, exploratory analysis

See `agents/reference/plan_act.md` for plan templates and workflow details.

### Task Claiming (Multi-Agent)

See `agents/plans/tasks.md` for available work. Simplified protocol:

1. Edit `agents/plans/tasks.md` frontmatter: `claimed_by: @agent-id-@git-username`
2. Commit and push
3. Create feature branch
4. Do the work
5. Update status to `completed` when done

## Skill Documentation

Agent-discoverable skill guides are in `agents/skills/`:

| Skill | Purpose |
|-------|---------|
| [skill-creator](agents/skills/skill-creator/) | Create, validate, and package Anthropic-compliant skills |
| [scaffold-workflow](agents/skills/scaffold-workflow/) | Initialize complete framework in new projects |
| [upgrade-workflow](agents/skills/upgrade-workflow/) | Migrate existing frameworks to latest structure |
| [plan-creator](agents/skills/plan-creator/) | Create consistent implementation plans |

Each skill contains:
- `SKILL.md` - Documentation with YAML frontmatter (Anthropic standard)
- `package.json` - Dependencies and scripts
- `scripts/` - Executable implementations
- `references/` - Deep documentation (loaded as needed)

## Deep-Dive Documentation

| Document | Purpose |
|----------|---------|
| `agents/README.md` | Directory index explaining all subdirectories |
| `agents/reference/` | Topic-focused deep documentation |
| `agents/plans/tasks.md` | Active work tracking (was agents/plans/tasks.md) |
| `agents/plans/` | Shared implementation plans (committed) |
| `agents/plans/local/` | Local scratch work (gitignored, was plans-local/) |
| `agents/legacy/` | Migrated legacy files |
| `agents/personas/` | Reusable agent personalities |
| `agents/personas/documentation-agent.md` | Maintains documentation standards |
| `agents/skills/` | Skill-specific guides with YAML frontmatter (was tools/) |

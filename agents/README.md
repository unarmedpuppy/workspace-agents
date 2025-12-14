# Agents Directory

This directory contains deep docume### plans/
Shared implementation plans (committed):

- Use for: Multi-session features, team collaboration, architectural decisions
- Organization: Use subdirectories for features (`plans/feature-name/`) or flat files (`plans/feature-name.md`)
- Format: YAML frontmatter + structured markdown
- Status tracking: draft | in_progress | approved | completen, task management, implementation plans, agent personas, and tool guides for AI-assisted development.

## Directory Structure

```
agents/
├── README.md                # This file - directory index
├── reference/               # Topic-focused deep documentation
│   ├── documentation-style.md   # Documentation writing standards
│   ├── typescript.md            # TypeScript/JavaScript patterns
│   ├── agent-patterns.md        # Agent development patterns
│   ├── skill-patterns.md        # Skill development patterns
│   └── plan_act.md              # Plan → Act → Test workflow
├── plans/                   # Implementation plans and active work
│   ├── tasks.md                 # Active task tracking (unified with plans)
│   ├── local/                   # Local scratch plans (gitignored)
│   ├── archive/                 # Completed phase archives
│   └── templates/
│       └── task-template.md     # Template for new tasks
├── legacy/                  # Migrated legacy files
│   ├── .gitkeep
│   ├── README.md            # Explanation and migration guide
│   └── MIGRATION.md         # Optional: migration documentation
├── personas/                # Reusable agent personalities
│   ├── meta-agent.md            # Agent for creating new personas
│   ├── documentation-agent.md   # Agent for maintaining doc standards
│   └── framework-agent.md       # Framework documentation specialist
└── skills/                  # Executable skills (was tools/)
    ├── README.md                # Skills directory index
    ├── skill-creator/           # Create Anthropic-compliant skills
    ├── scaffold-workspace/       # Initialize framework in new projects
    ├── upgrade-workspace/        # Migrate existing frameworks
    └── git/                     # Git workflow and coordination
        └── SKILL.md             # Git skill documentation
```

## Purpose of Each Directory

### reference/
Deep, topic-focused documentation that keeps AGENTS.md concise. Each file covers a specific domain:

- **documentation-style.md** - Standards for writing agent-readable docs
- **typescript.md** - Language-specific coding patterns
- **agent-patterns.md** - Best practices for agent development
- **skill-patterns.md** - Best practices for skill development
- **plan_act.md** - Complete workflow guide (Plan → Act → Test)

### plans/
Unified workflow combining implementation plans and active task tracking:

- **tasks.md** - Active work tracking (index of current tasks)
- **local/** - Gitignored scratch work, session notes, exploratory analysis
- **archive/** - Completed phases to keep tasks.md manageable
- **templates/** - Standardized task format
- **[feature-name].md** - Shared plans (committed to git)
- Organization: Use subdirectories for complex features (`plans/feature-name/`)
- Format: YAML frontmatter + structured markdown

### legacy/
Migrated legacy files from structural changes:

- Use for: Files from old structure that don't fit new patterns
- Store temporarily during migrations
- Document what was moved and why in MIGRATION.md
- README.md explains purpose and provides migration guidance
- Review and integrate or delete over time

### personas/
Reusable agent personalities with specialized expertise:

- **meta-agent.md** - Creates new personas on demand
- **documentation-agent.md** - Maintains documentation standards and framework compliance
- **framework-agent.md** - Framework specialist for setup and configuration
- **[domain]-agent.md** - Domain specialists (database, auth, testing, etc.)
- Format: YAML frontmatter + expertise areas + key files + quick reference

### skills/
Executable skills with scripts and dependencies (was tools/):

- Each skill gets a subdirectory: `skills/<name>/`
- Required: `SKILL.md` with YAML frontmatter (Anthropic standard)
- Optional: `package.json` for dependencies and npm scripts
- Optional: `scripts/` directory for executable implementations
- Optional: `references/` for deep documentation
- Examples: skill-creator, scaffold-workspace, upgrade-workspace, git

## Discovery Pattern

This structure follows a progressive disclosure pattern:

1. **AGENTS.md** - High-level overview (always read)
2. **agents/README.md** - Directory map (this file)
3. **agents/reference/** - Deep dives (read on demand)

YAML frontmatter in tools, personas, and plans enables semantic discovery without reading full files.

## When to Use Each Directory

| Scenario | Directory | Example |
|----------|-----------|---------|
| Need TypeScript guidelines | `reference/typescript.md` | How to structure React components |
| Starting a new feature | `plans/local/` first, then `plans/` | Feature exploration → refined spec |
| Multi-agent task coordination | `plans/tasks.md` | Claim task, track status, mark complete |
| Git workflow question | `reference/agent-patterns.md` | Branching strategy, commit messages, task claiming |
| Need a domain specialist | `personas/[domain]-agent.md` | Invoke testing expert for test strategy |
| Create new persona | `personas/meta-agent.md` | Bootstrap a new domain specialist |
| Audit documentation standards | `personas/documentation-agent.md` | Check YAML frontmatter, fix formatting |
| Migrate old structure | `legacy/` + `personas/documentation-agent.md` | Store old files, document migration |
| Create new skill | `skills/skill-creator/` | Initialize Anthropic-compliant skill |
| Scaffold new project | `skills/scaffold-workspace/` | Set up complete framework |
| Upgrade existing project | `skills/upgrade-workspace/` | Migrate to latest structure |

## Maintenance

- Keep `plans/tasks.md` < 500 lines (archive completed phases)
- Move refined local plans from `plans/local/` to `plans/` for sharing
- Update this README when adding new directories
- Use YAML frontmatter for all discoverable resources

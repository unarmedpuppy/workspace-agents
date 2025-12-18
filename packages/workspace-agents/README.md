# workspace-agents

Initialize AI agent workflow framework in any project.

## Quick Start

```bash
npx workspace-agents            # Shows welcome screen, prompts to continue
npx workspace-agents init       # Fresh install or upgrade existing
npx workspace-agents update     # Same as init (semantic alias)
```

## What It Does

Workspace Agents sets up a structured documentation framework for AI assistants (Claude, Copilot, Cursor, Gemini) in your project:

- **Fresh project**: Creates complete framework structure with AGENTS.md, vendor breadcrumbs, skills, personas, and plans
- **Existing framework**: Upgrades to latest version, syncs new skills/templates, fixes broken symlinks
- **Preview before apply**: Shows all changes and asks for confirmation
- **Never overwrites**: Existing files are preserved (use `--force` to override)

## Options

```
-y, --yes         Skip confirmation prompts
--force           Overwrite existing files
--skip-symlinks   Skip Claude Skills symlink creation
```

## What Gets Created

```
your-project/
├── AGENTS.md                    # Universal AI agent entrypoint
├── CLAUDE.md                    # Claude Code breadcrumb
├── GEMINI.md                    # Gemini breadcrumb
├── .cursor/rules/               # Cursor rules
├── .github/                     # Copilot instructions
├── .claude/skills/              # Symlinks to skills (Claude Code)
└── agents/
    ├── README.md                # Directory index
    ├── reference/               # Deep documentation
    │   ├── plan_act.md          # Plan → Act → Test workflow
    │   ├── documentation-style.md
    │   └── ...
    ├── plans/                   # Implementation plans
    │   ├── tasks.md             # Work tracking
    │   ├── getting-started.md   # Customization guide
    │   └── local/               # Gitignored scratch (local only)
    ├── personas/                # Agent personalities
    │   ├── workspace-builder.md # Run first! Customizes everything
    │   ├── documentation-agent.md
    │   └── framework-agent.md
    ├── skills/                  # Executable skills
    │   ├── skill-creator/       # Create new skills
    │   ├── plan-creator/        # Create implementation plans
    │   └── persona-creator/     # Create new personas
    └── legacy/                  # Migrated files
```

## Next Steps After Setup

### 1. Customize Your Workspace

Start a new AI session and ask:

```
@workspace-builder enhance my workspace
```

This analyzes your codebase and customizes:
- AGENTS.md with real project info
- Creates relevant reference documents
- Builds a development-agent.md persona
- Populates tasks.md with recommendations

### 2. Use Skills

After initialization, use Claude Code's `/skill` command:

```
/skill skill-creator     # Create a new skill
/skill plan-creator      # Create an implementation plan
/skill persona-creator   # Create a new persona
```

### 3. Periodic Updates

Run `npx workspace-agents` periodically to:
- Sync new skills from the framework
- Fix broken symlinks
- Add new template files

## Example Output

```
$ npx workspace-agents init

  ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗██████╗  █████╗  ██████╗███████╗
  ...
                     █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
  ...

┌───────────────────────────────────────────────────────┐
│ You are in: /Users/you/repos/my-project               │
└───────────────────────────────────────────────────────┘

Project: my-project
Action: scaffold (No existing framework detected)

Scaffolding Workspace Agents...

CREATE DIR  agents/
CREATE DIR  agents/plans/
CREATE DIR  agents/skills/
...

CREATE      AGENTS.md
CREATE      CLAUDE.md
CREATE      agents/personas/workspace-builder.md
...

SYMLINK     .claude/skills/skill-creator → ../../agents/skills/skill-creator

Summary: 10 directories, 20 files, 5 symlinks

Apply these changes? (y/N) y

✓ Workspace Agents scaffolded successfully!

Next steps:
1. Customize your workspace - Start a new AI session and ask:
   @workspace-builder enhance my workspace
   This will analyze your codebase and customize all documentation.

2. Create skills - Use /skill skill-creator
3. Create plans - Use /skill plan-creator

Optional: Periodically run npx workspace-agents to update skill
          symlinks, refine directory structure, and sync with latest features.
```

## Upgrading Existing Projects

If you have an existing framework, running `init` or `update` will:

1. Detect missing skills and template files
2. Move directories with git history preservation
3. Update terminology in documentation files
4. Create missing files (new personas, plans, etc.)
5. Fix broken or missing symlinks

```
$ npx workspace-agents update

Upgrading Workspace Agents...

COPY SKILL  agents/skills/persona-creator

CREATE      agents/plans/getting-started.md
CREATE      agents/personas/workspace-builder.md

SYMLINK     .claude/skills/persona-creator → ../../agents/skills/persona-creator

Summary: 1 skill, 2 new files, 1 symlink

Apply these changes? (y/N) y

✓ Workspace Agents upgraded successfully!
```

## Bundled Skills

| Skill | Purpose |
|-------|---------|
| **skill-creator** | Create, validate, and package Anthropic-compliant skills |
| **plan-creator** | Create consistent implementation plans (feature, bug-fix, refactor) |
| **persona-creator** | Create domain-specific agent personas |

## Bundled Personas

| Persona | Purpose |
|---------|---------|
| **workspace-builder** | Run first! Comprehensive onboarding that customizes the framework |
| **documentation-agent** | Maintains documentation quality and standards |
| **framework-agent** | Workspace Agents framework specialist |

## Requirements

- Node.js 14+
- Works on macOS, Linux, Windows

## License

MIT

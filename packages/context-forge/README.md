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

- **Fresh project**: Creates complete framework structure with AGENTS.md, vendor breadcrumbs, skills, and plans directories
- **Existing framework**: Upgrades to latest version, migrating old structure (tools → skills, etc.)
- **Preview before apply**: Shows all changes and asks for confirmation

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
    ├── plans/                   # Implementation plans
    │   ├── tasks.md             # Work tracking
    │   └── local/               # Gitignored scratch (local only)
    ├── personas/                # Agent personalities
    ├── skills/                  # Executable skills
    │   ├── skill-creator/       # Create new skills
    │   └── plan-creator/        # Create implementation plans
    └── legacy/                  # Migrated files
```

## Post-Setup: Using Skills

After initialization, use Claude Code's `/skill` command:

```
/skill skill-creator    # Create a new skill
/skill plan-creator     # Create an implementation plan
```

Skills are scaffolded into your project and understand your specific codebase.

## Example Output

```
$ npx workspace-agents init

  ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗██████╗  █████╗  ██████╗███████╗
  ██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ ███████╗██████╔╝███████║██║     █████╗
  ...
                     █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
                    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
                    ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
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
CREATE      agents/README.md
...

SYMLINK     .claude/skills/skill-creator → ../../agents/skills/skill-creator

Summary: 10 directories, 17 files, 2 symlinks

Apply these changes? (y/N) y

✓ Workspace Agents scaffolded successfully!

Next steps:
1. Review AGENTS.md and customize for your project
2. Use /skill skill-creator to create new skills
3. Use /skill plan-creator to create implementation plans
```

## Upgrading Existing Projects

If you have an older framework structure (e.g., `agents/tools/` instead of `agents/skills/`), running `init` or `update` will:

1. Move directories with git history preservation
2. Update terminology in documentation files
3. Create missing files (vendor breadcrumbs, etc.)
4. Set up symlinks for Claude Skills

```
$ npx workspace-agents update

Upgrading Workspace Agents...

MOVE        agents/tools/ → agents/skills/

MODIFY      AGENTS.md
  - agents/tools/
  + agents/skills/

CREATE      .claude/skills/README.md
SYMLINK     .claude/skills/skill-creator → ../../agents/skills/skill-creator

Summary: 1 move, 1 modification, 1 create, 1 symlink

Apply these changes? (y/N) y

✓ Workspace Agents upgraded successfully!
```

## Requirements

- Node.js 14+
- Works on macOS, Linux, Windows

## License

MIT

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

- **Fresh project**: Creates framework structure with AGENTS.md and vendor breadcrumbs
- **Existing framework**: Upgrades to latest version, syncs bundled skills, fixes symlinks
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
    ├── reference/               # Project-specific documentation
    ├── plans/                   # Implementation plans
    │   └── local/               # Gitignored scratch (local only)
    ├── personas/                # Agent personalities
    └── skills/                  # Executable skills
        └── skill-creator/       # Create new skills
```

## Philosophy

This framework is **lean by design**:

- **Structure over content**: Provides directories and templates, you add project-specific content
- **One bundled skill**: `skill-creator` helps you build Anthropic-compliant skills
- **No meta-documentation**: No framework docs that don't describe your project
- **Progressive disclosure**: AGENTS.md → agents/README.md → subdirectories

## Next Steps After Setup

### 1. Customize AGENTS.md

Edit `AGENTS.md` with your project's:
- Tech stack and architecture
- Code style and patterns
- Key directories and files
- Workflow boundaries

### 2. Add Project Documentation

Create content as needed:

```
agents/reference/api-patterns.md    # Your API conventions
agents/reference/testing.md         # Your testing approach
agents/personas/reviewer.md         # Code review specialist
agents/plans/feature-x.md           # Multi-session work tracking
```

### 3. Create Skills

Use Claude Code's `/skill` command:

```
/skill skill-creator     # Create a new Anthropic-compliant skill
```

### 4. Periodic Updates

Run `npx workspace-agents` periodically to:
- Update bundled skills to latest version
- Fix broken symlinks
- Add new template files

## Example Output

```
$ npx workspace-agents init

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
...

COPY SKILL  agents/skills/skill-creator

SYMLINK     .claude/skills/skill-creator → ../../agents/skills/skill-creator

Summary: 8 directories, 12 files, 1 skill, 1 symlink

Apply these changes? (y/N) y

✓ Workspace Agents scaffolded successfully!
```

## Upgrading Existing Projects

Running `init` or `update` on existing frameworks will:

1. Update bundled skills to latest version
2. Fix broken or missing symlinks
3. Add new template files

```
$ npx workspace-agents update

Upgrading Workspace Agents...

UPDATE SKILL  agents/skills/skill-creator

Summary: 1 skill updated

Apply these changes? (y/N) y

✓ Workspace Agents upgraded successfully!
```

## Bundled Skills

| Skill | Purpose |
|-------|---------|
| **skill-creator** | Create, validate, and package Anthropic-compliant skills |

## Requirements

- Node.js 14+
- Works on macOS, Linux, Windows

## License

MIT

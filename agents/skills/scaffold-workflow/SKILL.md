---
name: scaffold-workflow
description: Initialize complete ContextForge structure in a project. Use when setting up agent framework in a new project with no existing agents/ directory. Creates directory structure, file templates, symlinks for Claude Skills integration, and git configuration.
---

# scaffold-workflow

Initialize the ContextForge framework in a new project.

## Overview

Create a complete, production-ready agent workflow structure including:
- Directory structure (`agents/`, `.claude/skills/`, vendor breadcrumbs)
- Documentation templates (AGENTS.md, README.md, reference docs)
- Skill scaffolding with Anthropic compliance
- Persona templates for specialized agents
- Git configuration for ephemeral plan storage
- Claude Skills symlinks for auto-detection

## What Gets Created

```
project-root/
├── AGENTS.md                    # Universal agent entrypoint
├── README.md                    # Project overview
├── CLAUDE.md                    # Breadcrumb → AGENTS.md
├── GEMINI.md                    # Breadcrumb → AGENTS.md
├── .cursor/
│   └── rules/
│       └── project.mdc          # Breadcrumb → AGENTS.md
├── .github/
│   └── copilot-instructions.md  # Breadcrumb → AGENTS.md
├── .claude/
│   └── skills/                  # Symlinks to agents/skills/*
│       ├── README.md
│       └── <skill-name> → ../../agents/skills/<skill-name>
└── agents/
    ├── README.md                # Directory index
    ├── reference/               # Topic-focused documentation
    │   ├── agent-patterns.md
    │   ├── documentation-style.md
    │   ├── plan_act.md
    │   ├── skill-patterns.md
    │   └── typescript.md
    ├── plans/                   # Implementation plans
    │   ├── tasks.md             # Active work index
    │   └── local/               # Ephemeral plans (gitignored)
    ├── personas/                # Agent personalities
    │   ├── documentation-agent.md
    │   ├── framework-agent.md
    │   └── meta-agent.md
    ├── skills/                  # Executable skills
    │   └── README.md
    └── legacy/                  # Migration artifacts
        └── README.md
```

## Usage

### Prerequisites

- Node.js 14 or higher
- Git initialized in project
- No existing `agents/` directory

### Run Scaffold

```bash
cd agents/skills/scaffold
npm install
npm run scaffold
```

### What Happens

1. **Validate preconditions**: Check no existing `agents/` directory
2. **Create structure**: All directories from template
3. **Generate files**: Documentation from templates with project variables
4. **Configure git**: Add `.gitignore` rules for `agents/plans/local/`
5. **Create symlinks**: Link `.claude/skills/` → `agents/skills/`
6. **Validate output**: Run skill-creator validation on generated structure
7. **Print summary**: Show what was created and next steps

### Post-Scaffold Steps

1. Review generated `AGENTS.md` - customize for your project
2. Update `README.md` with project-specific content
3. Add your first skill using `agents/skills/skill-creator`
4. Commit the framework structure to git
5. Share with your team

## Configuration

### Template Variables

The scaffold uses these variables when generating files:

- `{{PROJECT_NAME}}` - From package.json or directory name
- `{{CREATION_DATE}}` - Current date (YYYY-MM-DD)
- `{{FRAMEWORK_VERSION}}` - Scaffold version

### Customization

After scaffolding, customize:
- `AGENTS.md` - Add project-specific context
- `README.md` - Project overview and quick start
- Reference docs - Add domain-specific patterns
- Personas - Create project-specific agents

## Symlink Strategy

### Claude Skills (.claude/skills/)

**Type**: Committed symlinks  
**Target**: `../../agents/skills/<skill-name>`  
**Purpose**: Claude Code auto-detection  
**Benefit**: Skills immediately discoverable

### Vendor Breadcrumbs

**Type**: Regular committed files  
**Purpose**: Tool entry points → AGENTS.md  
**Files**: CLAUDE.md, GEMINI.md, copilot-instructions.md, etc.  
**Benefit**: "Just clone and go" experience

### Windows Support

Windows users need Git symlink support:

```bash
git config core.symlinks true
```

Alternative: Use junctions (manual fallback provided by scaffold)

## Requirements

- **Node.js**: 14 or higher
- **Git**: For version control and symlink support
- **npm**: For dependency management
- **Disk space**: ~5MB for framework files

## Troubleshooting

### "agents/ directory already exists"

**Cause**: Project already has agent framework  
**Solution**: Use `upgrade-workflow` skill instead, or remove existing `agents/`

### Symlinks not working

**Cause**: Git symlink support disabled (Windows)  
**Solution**: Run `git config core.symlinks true` then re-scaffold

### Template variables not replaced

**Cause**: Missing package.json or invalid format  
**Solution**: Create package.json with `name` field, or scaffold will use directory name

### Validation errors after scaffold

**Cause**: Generated files don't meet Anthropic standards  
**Solution**: Check scaffold output, file an issue with details

## Resources

- Scripts: `scripts/` - Implementation details
- Templates: `templates/` - File templates used
- skill-creator: `../skill-creator/` - Validates output
- Framework docs: `../../reference/` - Patterns and guides

## Related Skills

- **skill-creator** - Create new skills after scaffolding
- **upgrade-workflow** - Migrate existing frameworks
- **plan-creator** - Create implementation plans

## Examples

### Basic Scaffold

```bash
cd my-new-project
cd agents/skills/scaffold
npm install
npm run scaffold
```

### With Custom Variables

Edit `package.json` first:
```json
{
  "name": "my-awesome-project",
  "version": "1.0.0"
}
```

Then run scaffold - `{{PROJECT_NAME}}` becomes "my-awesome-project"

### Verify Output

```bash
# Check structure
ls -la agents/

# Check symlinks
ls -la .claude/skills/

# Validate (using skill-creator)
cd agents/skills/skill-creator
npm run validate ../scaffold
```

## Version

Current: 1.0.0  
Framework: 2.0.0 (skills-based)

## License

MIT

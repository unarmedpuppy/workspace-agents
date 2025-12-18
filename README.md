# Workspace Agents

> **🎯 Stop copy-pasting AI prompts.** Use executable skills instead. One command scaffolds your entire agent workflow, complete with documentation, task management, and vendor integrations.

## Quick Start

```bash
# Initialize Workspace Agents in your project (one command!)
npx workspace-agents init
```

That's it! The CLI will:
- Detect if you're in a fresh project or have an existing framework
- Show you what changes will be made
- Ask for confirmation before applying

### Options

```bash
npx workspace-agents init          # Interactive mode (recommended)
npx workspace-agents init -y       # Skip confirmation prompts
npx workspace-agents update        # Same as init (semantic alias)
```

## Overview

This framework provides a **deterministic, executable approach** to setting up AI agent workflows:

### Key Features

✅ **Executable Skills** - No more copy-paste prompts, run scripts instead  
✅ **Anthropic Compliant** - Follows official Agent Skills specification  
✅ **Cross-Platform** - Works on Unix, macOS, and Windows  
✅ **Git History Preservation** - Uses `git mv` when migrating structures  
✅ **Claude Skills Integration** - Auto-detected via `.claude/skills/` symlinks  
✅ **Vendor Agnostic** - Works with Claude, Copilot, Cursor, Gemini, and others  

### What You Get

- **scaffold-workspace** skill - Initialize complete framework in new projects
- **upgrade-workspace** skill - Migrate existing frameworks to new structure
- **skill-creator** skill - Create new Anthropic-compliant skills
- **plan-creator** skill - Create implementation plans (feature, bug-fix, refactor)
- **persona-creator** skill - Create domain-specific agent personas
- **reference-creator** skill - Create focused reference documentation
- **workspace-builder** persona - Comprehensive onboarding that customizes everything
- Complete documentation structure with progressive disclosure
- Task management and planning workflows
- Persona system for specialized agent behaviors

**Key Principle**: One source of truth (`AGENTS.md`) with vendor-specific breadcrumbs that point to it.

---

## Directory Structure

```
your-project/
├── AGENTS.md                    # Universal entrypoint (all agents read this)
├── CLAUDE.md                    # Breadcrumb → AGENTS.md
├── GEMINI.md                    # Breadcrumb → AGENTS.md
├── .cursor/
│   └── rules/
│       └── project.mdc          # Breadcrumb → AGENTS.md
├── .github/
│   ├── copilot-instructions.md  # Breadcrumb → AGENTS.md
│   └── agents/                  # Optional: specialized Copilot agents
│       └── <name>.md
├── .claude/
│   └── skills/                  # Symlinks to agents/skills/* (for auto-detection)
│       ├── README.md
│       └── <skill-name> → ../../agents/skills/<skill-name>
└── agents/
    ├── README.md                # Directory index explaining all subdirectories
    ├── reference/               # Deep documentation (split by topic)
    │   ├── typescript.md        # Language-specific standards
    │   ├── agent-patterns.md    # Agent development patterns
    │   ├── documentation-style.md # Documentation standards
    │   └── plan_act.md          # Plan → Act → Test workflow
    ├── plans/                   # Implementation plans and active work
    │   ├── tasks.md             # Active task tracking
    │   ├── getting-started.md   # Workspace customization guide
    │   ├── local/               # Local scratch plans (gitignored)
    │   └── <feature-name>.md    # Shared plans (committed)
    ├── personas/                # Reusable agent personalities
    │   ├── workspace-builder.md # Run first! Customizes framework to your project
    │   ├── documentation-agent.md  # Maintains documentation standards
    │   ├── framework-agent.md   # Framework specialist
    │   └── <domain>-agent.md    # Created via persona-creator skill
    ├── skills/                  # Executable skills
    │   ├── README.md
    │   ├── skill-creator/       # Create new Anthropic-compliant skills
    │   │   ├── SKILL.md         # Skill documentation with YAML frontmatter
    │   │   ├── package.json     # Dependencies and scripts
    │   │   ├── scripts/         # Executable scripts
    │   │   └── references/      # Deep documentation
    │   ├── plan-creator/        # Create implementation plans
    │   ├── persona-creator/     # Create domain-specific personas
    │   ├── scaffold-workspace/  # Initialize framework in new projects
    │   └── upgrade-workspace/   # Migrate existing frameworks
    └── legacy/                  # Migrated legacy files
        ├── .gitkeep
        ├── README.md            # Legacy directory explanation
        └── MIGRATION.md         # Migration documentation (when applicable)
```

### Key Changes from Old Structure

| Old Path | New Path | Reason |
|----------|----------|--------|
| `agents/tools/` | `agents/skills/` | Aligns with Anthropic Agent Skills terminology |
| `agents/tasks.md` | `agents/plans/tasks.md` | Unified workflow (plans contain tasks) |
| `plans-local/` | `agents/plans/local/` | Clearer hierarchy (ephemeral plans under plans/) |
| `agents/personas/meta-agent.md` | `agents/personas/workspace-builder.md` | More descriptive, action-oriented persona |

---

## Core Files

### AGENTS.md - The Universal Entrypoint

This is the primary documentation file that all AI assistants read. Keep it concise (<300 lines recommended), focused, and actionable.

```markdown
# Project Name - Agent Instructions

**Read this file first.** This is your entry point for understanding and contributing to the project.

## Project Summary

[2-3 sentences: What does this project do? What's the tech stack?]

**Tech Stack**: [Language] [Framework] [Key Dependencies with versions]

## Quick Commands

```bash
npm install          # Install dependencies
npm run build        # Build the project
npm test             # Run tests
npm run lint         # Check code style
```

## Architecture Overview

[Brief description or ASCII diagram of how the system works]

**Key Directories**:
```
src/
├── [dir]/           # [purpose]
├── [dir]/           # [purpose]
└── [dir]/           # [purpose]
```

## Code Style

[3-5 critical rules. Link to detailed guide if needed.]

- [Rule 1 - most important]
- [Rule 2]
- [Rule 3]

See `agents/code_style_guide.md` for complete guidelines.

## Boundaries

### Always Do
- Run tests before committing
- Follow the code style guide
- Commit after each logical unit of work

### Ask First
- Architectural changes affecting multiple modules
- Adding new dependencies
- Changing public APIs
- Modifying CI/CD configuration

### Never Do
- Commit secrets or credentials
- Push directly to main/master
- Skip tests for "quick fixes"
- Make unrelated changes in a PR
- Delete files without understanding dependencies

## Workflow

### Plan → Act → Test

1. **Plan**: Understand requirements, explore code, ask clarifying questions
2. **Act**: Implement incrementally, commit often, follow code style
3. **Test**: Verify all tests pass, check types, update docs

### Planning Documentation

Store plans in `agents/plans/` (shared) or `agents/plans/local/` (local only):

- **`agents/plans/`** - Committed plans for multi-session features, team collaboration, architectural decisions
  - Organize by feature: `agents/plans/feature-name/` for complex features with multiple files
  - Simple plans: `agents/plans/feature-name.md` for single-file plans
- **`agents/plans/local/`** - Gitignored scratch work, session notes, exploratory analysis

See `agents/reference/plan_act.md` for plan templates and workflow details.

## Skill Documentation

Agent-discoverable skill guides are in `agents/skills/`:

| Skill | Purpose |
|-------|---------|
| [skill-creator](agents/skills/skill-creator/) | Create, validate, and package Anthropic-compliant skills |
| [plan-creator](agents/skills/plan-creator/) | Create consistent implementation plans |
| [persona-creator](agents/skills/persona-creator/) | Create domain-specific agent personas |
| [reference-creator](agents/skills/reference-creator/) | Create focused reference documentation |
| [scaffold-workspace](agents/skills/scaffold-workspace/) | Initialize complete framework in new projects |
| [upgrade-workspace](agents/skills/upgrade-workspace/) | Migrate existing frameworks to latest structure |

Each skill contains:
- `SKILL.md` - Documentation with YAML frontmatter (Anthropic standard)
- `package.json` - Dependencies and npm scripts
- `scripts/` - Executable JavaScript/Node.js scripts
- `references/` - Deep documentation (loaded as needed)

## Deep-Dive Documentation

| Document | Purpose |
|----------|---------|
| `agents/plans/tasks.md` | Active work tracking |
| `agents/plans/getting-started.md` | Workspace customization guide |
| `agents/reference/plan_act.md` | Plan → Act → Test workflow |
| `agents/skills/` | Skill-specific guides |
```

---

### Vendor Breadcrumb Files

These files point to `AGENTS.md` so each vendor's agent finds your documentation.

#### CLAUDE.md (Anthropic Claude Code)

```markdown
@AGENTS.md
```

That's it. Claude Code's `@` syntax includes the referenced file.

#### GEMINI.md (Google Gemini)

```markdown
# Project Instructions

See [AGENTS.md](AGENTS.md) for complete project documentation.

Follow all instructions in AGENTS.md strictly.
```

#### .github/copilot-instructions.md (GitHub Copilot)

```markdown
# Project Instructions

This project uses a shared documentation structure across AI assistants.

## Entry Point

See [AGENTS.md](../AGENTS.md) for the primary project documentation.

## Quick Reference

[Optional: Include most critical rules here for quick context]

- [Critical rule 1]
- [Critical rule 2]

## Custom Agents

Custom agents are available in `.github/agents/`:

| Agent | Description |
|-------|-------------|
| `@agent-name` | [purpose] |
```

#### .cursor/rules/project.mdc (Cursor)

```markdown
---
description: Project-wide coding rules
globs:
  - "**/*"
---

# Project Instructions

See [AGENTS.md](../../AGENTS.md) for complete project documentation.

Follow all instructions in AGENTS.md strictly.
```

---

## Tool Documentation Structure

Tools live in `agents/skills/<tool-name>/` with standardized structure:

```
agents/skills/
├── git/
│   ├── SKILL.md         # Main documentation
│   ├── package.json     # Dependencies and configuration
│   └── scripts/         # Executable scripts
├── docker/
│   ├── SKILL.md
│   ├── package.json
│   └── scripts/
└── api-client/
    ├── SKILL.md
    ├── package.json     # e.g., {"dependencies": {"axios": "^1.6.0"}}
    └── scripts/         # Implementation scripts
        ├── fetch.js
        └── upload.js
```

### Tool SKILL.md Format

Use YAML frontmatter for agent discovery:

```markdown
---
name: git
description: Git workflow and version control
when_to_use: Version control, branching, committing
---

# Git Workflow

[Tool-specific documentation]

## Quick Reference

```bash
# Most common commands
[command 1]
[command 2]
```

## When to Use

- [Scenario 1]
- [Scenario 2]

## Examples

[Concrete examples with commands and expected output]

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| [error] | [cause] | [fix] |
```

### Tool package.json Format

Include dependencies and scripts for the tool:

```json
{
  "name": "@agents/tool-name",
  "description": "Brief description for agent discovery",
  "dependencies": {
    "dependency-name": "^version"
  },
  "scripts": {
    "execute": "node scripts/main.js",
    "test": "jest"
  }
}
```

### Tool scripts/ Directory

The `scripts/` directory contains executable implementations:

```
agents/skills/tool-name/
└── scripts/
    ├── main.js          # Primary tool script
    ├── helper.js        # Supporting utilities
    └── README.md        # Script documentation (optional)
```

---

## Task Management

### Task Directory Structure

```
agents/plans/
├── tasks.md              # Current active tasks
└── local/                # Gitignored scratch work
```

### agents/plans/tasks.md Structure

```markdown
# Active Tasks

Track current work items and their status.

## Tasks

### Task Name

**Status**: `TODO` | **Priority**: Medium

**Description**: What needs to be done

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

**Files to Modify**:
- `path/to/file.ts`

## Status Values

- `TODO` - Ready to start
- `IN PROGRESS` - Currently being worked on
- `DONE` - Completed
- `BLOCKED` - Waiting on dependencies
```

---

## Plan Management

Plans separate collaborative documentation from local scratch work, preventing every agent thought from being committed to git.

### Directory Structure

```
agents/
└── plans/                    # Implementation plans
    ├── tasks.md              # Active work tracking
    ├── getting-started.md    # Workspace customization guide
    ├── auth-system.md        # Committed - shared plans
    ├── api-redesign.md
    └── local/                # Gitignored - local scratch
        ├── session-2024-01-15.md
        └── exploration-notes.md
```

### When to Use Each

| Directory | Use For | Committed |
|-----------|---------|-----------|
| `agents/plans/` | Multi-session features, team collaboration, architectural decisions, implementation specs | ✅ Yes |
| `agents/plans/local/` | Session scratch work, exploratory analysis, intermediate thoughts, context handoff | ❌ No |

### Plan File Format

Use consistent frontmatter for agent discovery:

```markdown
---
title: Feature Name
created: YYYY-MM-DD
status: draft | in_progress | approved | complete
author: @agent-id
---

# Plan: Feature Name

## Objective

[What problem does this solve? What's the goal?]

## Approach

[High-level strategy]

## Tasks

1. [ ] Task 1 - [description]
2. [ ] Task 2 - [description]
3. [ ] Task 3 - [description]

## Files to Modify

- `src/path/file.ts` - [what changes]
- `tests/path/file.test.ts` - [what tests]

## Test Strategy

- Unit tests for [components]
- Integration test for [workflow]

## Open Questions

- [ ] Question 1?
- [x] Resolved: Chose option A because...

## Session Notes

### YYYY-MM-DD
- [Progress update]
- [Decisions made]
```

### Workflow

1. **Starting a feature**: Create plan in `agents/plans/local/` for exploration
2. **Plan solidifies**: Move refined plan to `agents/plans/` and commit
3. **During implementation**: Update plan status, add session notes
4. **Completion**: Mark plan as `complete`, reference in PR

### .gitignore Addition

Add to project `.gitignore`:

```gitignore
# Agent local plans (not committed)
agents/plans/local/
```

Keep a `.gitkeep` in `agents/plans/local/` so the directory exists:

```bash
mkdir -p agents/plans-local
touch agents/plans/local/.gitkeep
echo "agents/plans/local/*" >> .gitignore
echo "!agents/plans/local/.gitkeep" >> .gitignore
```

---

## Agent Personas

Personas are reusable agent personalities that provide specialized expertise. They can be invoked by users or referenced by other agents.

### Naming Convention

**Always name new personas `[domain]-agent.md`**

Examples: `database-agent.md`, `auth-agent.md`, `api-agent.md`, `deploy-agent.md`

### Directory Structure

```
agents/personas/
├── workspace-builder.md    # Run first! Customizes framework to your project
├── documentation-agent.md  # Documentation standards expert
├── framework-agent.md      # Framework specialist
└── [domain]-agent.md       # Created via persona-creator skill
```

### Persona File Format

Use YAML frontmatter for agent discovery:

```markdown
---
name: [domain]-agent
description: One-line description of expertise
---

You are the [domain] specialist. Your expertise includes:

- [Area of expertise 1]
- [Area of expertise 2]
- [Area of expertise 3]

## Key Files

- `path/to/relevant/file.md` - [purpose]
- `path/to/another/file.ts` - [purpose]

## [Domain] Requirements

[Critical rules or patterns this persona enforces]

## Quick Reference

[Commands, patterns, or examples relevant to this persona]

See [agents/](../) for complete documentation.
```

### The Workspace Builder Persona

The `workspace-builder.md` persona is designed to run first after scaffolding. It analyzes your codebase and customizes all framework documentation:

```markdown
---
name: workspace-builder
description: Comprehensive workspace onboarding and customization
---

You are the Workspace Builder, responsible for customizing the Workspace Agents
framework to match the specific needs of this project.

## What You Do

1. Analyze the codebase structure, language, and frameworks
2. Customize AGENTS.md with real project information
3. Create relevant reference documents in agents/reference/
4. Build a development-agent.md persona tailored to the project
5. Populate tasks.md with actionable recommendations
6. Update all documentation to reflect actual project patterns
```

### When to Use Personas

- **Workspace Builder**: Run first to customize the framework for your project
- **Domain personas**: Expertise in specific areas (e.g., `documentation-agent.md`, `framework-agent.md`)
- **persona-creator skill**: Create new personas via `/skill persona-creator`

### Integration with Copilot Agents

Personas in `agents/personas/` can be mirrored to `.github/agents/` for Copilot compatibility:

```
agents/personas/code-style-agent.md  →  .github/agents/code-style-agent.md
```

---

## Code Style Guide Template

### agents/code_style_guide.md

```markdown
# Code Style Guide

Coding standards for [Project Name].

## Language & Framework

- **Language**: [TypeScript/Python/etc.] [version]
- **Framework**: [React/FastAPI/etc.] [version]
- **Style**: [ESLint config/Black/etc.]

## Critical Rules

### 1. [Most Important Rule]

```[language]
// Good
[example]

// Bad
[example]
```

### 2. [Second Rule]

[explanation and examples]

## File Organization

```
src/
├── [pattern description]
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | [convention] | `example.ts` |
| Functions | [convention] | `doSomething()` |
| Classes | [convention] | `MyClass` |

## Error Handling

[Project-specific error handling patterns]

## Testing

[Testing conventions and patterns]
```

---

## Workflow: Plan → Act → Test

Embed this workflow in your AGENTS.md or reference it from `agents/plan_act.md`.

### Plan Phase

**When**: Starting a new feature, complex changes, unclear requirements

1. **Understand Requirements**
   - What is being asked?
   - What problem does this solve?
   - What are the acceptance criteria?

2. **Explore the Codebase**
   - Read relevant existing code
   - Understand current patterns
   - Identify files that need changes

3. **Ask Clarifying Questions**
   - Resolve ambiguities before building
   - Confirm assumptions
   - Discuss tradeoffs

4. **Create Implementation Plan**
   - Break into actionable tasks
   - Identify dependencies
   - Note files to create/modify

5. **Define Test Strategy**
   - What tests are needed?
   - What edge cases to cover?

### Act Phase

**When**: Plan approved, simple changes that don't need planning

1. Create feature branch
2. Implement incrementally
3. Commit after each logical unit
4. Run tests frequently
5. Follow code style guide

**Rules**:
- DO implement the approved plan
- DO make small, focused commits
- DON'T make unplanned changes
- DON'T skip tests
- DON'T commit broken code

### Test Phase

**When**: Implementation complete

1. Run full test suite
2. Verify type checking passes
3. Run linter
4. Check test coverage
5. Update documentation
6. Create pull request

---

## Directory Reference

| Path | Purpose | Required |
|------|---------|----------|
| `AGENTS.md` | Universal entrypoint | Yes |
| `CLAUDE.md` | Claude Code breadcrumb | If using Claude |
| `GEMINI.md` | Gemini breadcrumb | If using Gemini |
| `.cursor/rules/project.mdc` | Cursor breadcrumb | If using Cursor |
| `.github/copilot-instructions.md` | Copilot breadcrumb | If using Copilot |
| `.github/agents/*.md` | Copilot specialized agents | Optional |
| `agents/README.md` | Directory index explaining subdirectories | Recommended |
| `agents/reference/` | Deep documentation split by topic | Recommended |
| `agents/reference/typescript.md` | Language-specific patterns | Recommended |
| `agents/reference/agent-patterns.md` | Agent development patterns | As needed |
| `agents/reference/plan_act.md` | Plan → Act → Test workflow | Recommended |
| `agents/plans/tasks.md` | Active task tracking | Recommended |
| `agents/plans/getting-started.md` | Workspace customization guide | Recommended |
| `agents/plans/archive/` | Completed task phases | Recommended |
| `agents/plans/templates/` | Task templates | Recommended |
| `agents/plans/` | Shared implementation plans | Recommended |
| `agents/plans/local/` | Local scratch plans (gitignored) | Recommended |
| `agents/legacy/` | Migrated legacy files (gitignored except MIGRATION.md) | As needed |
| `agents/legacy/README.md` | Legacy directory explanation and migration guide | If legacy exists |
| `agents/legacy/MIGRATION.md` | Migration history and recommendations | If legacy exists |
| `agents/personas/` | Reusable agent personalities | Recommended |
| `agents/personas/workspace-builder.md` | Customizes framework for your project | Recommended |
| `agents/personas/documentation-agent.md` | Maintains documentation standards | Recommended |
| `agents/personas/<domain>-agent.md` | Domain specialists (via persona-creator) | As needed |
| `agents/skills/<name>/SKILL.md` | Tool documentation | As needed |
| `agents/skills/<name>/package.json` | Tool dependencies | As needed |
| `agents/skills/<name>/scripts/` | Tool implementation scripts | As needed |

---

## Vendor Compatibility Matrix

| Feature | Claude | Copilot | Cursor | Gemini |
|---------|--------|---------|--------|--------|
| AGENTS.md | ✅ | ✅ | ✅ | ✅ |
| Custom breadcrumb | CLAUDE.md | .github/*.md | .cursor/rules/ | GEMINI.md |
| Specialized agents | - | .github/agents/ | - | - |
| File pattern scoping | - | applyTo | globs | - |
| YAML frontmatter | ✅ | ✅ | ✅ | ✅ |

---

## Recommendations & Variations

### For Solo Developers

- Keep `agents/plans/tasks.md` as a personal todo list
- Skill directories optional - flat files work fine for small projects

### For Teams

- Add PR templates referencing task IDs
- Consider adding `agents/decisions.md` for architectural decision records

### For Open Source Projects

- Keep AGENTS.md beginner-friendly
- Add `agents/contributing.md` for contributor onboarding
- Include setup troubleshooting in tool docs

### Advanced Patterns

#### Progressive Disclosure (from Anthropic's Skills pattern)

Structure documentation in layers:
1. **Level 1**: Name + description in YAML frontmatter (always loaded)
2. **Level 2**: Main README content (loaded when relevant)
3. **Level 3**: Supplementary files in subdirectories (loaded on demand)

#### Scoped Rules (Cursor/Copilot)

Create file-pattern-specific rules:

**Cursor** (`.cursor/rules/components.mdc`):
```markdown
---
description: React component rules
globs:
  - "src/components/**/*.tsx"
---

# Component Rules

- Use functional components with hooks
- Props interface named `{ComponentName}Props`
```

**Copilot** (`.github/agents/components.md`):
```markdown
---
description: React component rules
applyTo:
  - "src/components/**/*.tsx"
---

# Component Rules

- Use functional components with hooks
- Props interface named `{ComponentName}Props`
```

---

## Using the Skills

### Installation via npm (Recommended)

```bash
npx workspace-agents init    # Scaffolds or upgrades your project
```

The CLI handles both scaffolding new projects and upgrading existing ones automatically.

### Post-Installation Skills

After `workspace-agents init`, use Claude Code's `/skill` command for ongoing tasks:

```
/skill skill-creator     # Create new Anthropic-compliant skills
/skill plan-creator      # Create implementation plans
/skill persona-creator   # Create domain-specific personas
/skill reference-creator # Create reference documentation
```

### Direct Script Usage (Development)

For developing the framework itself:

```bash
# Scaffold
node agents/skills/scaffold-workspace/scripts/scaffold.js [project-root]

# Upgrade
node agents/skills/upgrade-workspace/scripts/upgrade.js [project-root]

# Create skill
npm run init --prefix agents/skills/skill-creator
```

**See**: Individual skill documentation in `agents/skills/*/SKILL.md`

---

## Sources & Further Reading

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)
- [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Improve your AI code output with AGENTS.md](https://www.builder.io/blog/agents-md)
- [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [GitHub Copilot Custom Instructions](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/)

---

## Validation Against Best Practices

This guide was validated against publicly documented best practices from major AI coding assistant vendors (December 2025).

### Industry Alignment

| Best Practice | Source | Status | Implementation |
|--------------|--------|--------|----------------|
| AGENTS.md as universal entrypoint | [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/), [Builder.io](https://www.builder.io/blog/agents-md) | ✅ | `AGENTS.md` at project root |
| Breadcrumb files pointing to single source | [Builder.io](https://www.builder.io/blog/agents-md), [agents.md](https://agents.md/) | ✅ | `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md` |
| Keep instructions <300-500 lines | [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | ✅ | AGENTS.md ~200 lines, deep docs in `agents/reference/` |
| Three-tier boundaries (Always/Ask/Never) | [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | ✅ | Boundaries section in AGENTS.md template |
| Six core areas (commands, testing, structure, style, git, boundaries) | [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | ✅ | All six areas covered in AGENTS.md |
| Explore → Plan → Code → Commit workflow | [Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices) | ✅ | Plan → Act → Test in `agents/reference/plan_act.md` |
| YAML frontmatter for discovery | [Anthropic Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | ✅ | All tools, personas, plans use frontmatter |
| Progressive disclosure (layered docs) | [Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices) | ✅ | AGENTS.md → agents/README.md → agents/reference/ |
| File-scoped rules | [Cursor](https://docs.cursor.com/context/rules), [GitHub](https://github.blog/changelog/2025-11-12-copilot-code-review-and-coding-agent-now-support-agent-specific-instructions/) | ✅ | `.cursor/rules/*.mdc` with globs, `.github/instructions/*.md` with applyTo |
| MDC format for Cursor | [Cursor](https://docs.cursor.com/context/rules) | ✅ | `.cursor/rules/project.mdc` |
| Modular docs for large projects | [agents.md](https://agents.md/), [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | ✅ | Nested AGENTS.md supported, `agents/` subdirectories |
| Specific personas with operating manuals | [GitHub](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | ✅ | `agents/personas/<domain>-agent.md` with clear roles |
| Custom agents for specialized tasks | [GitHub](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/) | ✅ | `.github/agents/` with YAML frontmatter |
| Organization-level instructions | [GitHub](https://github.blog/changelog/2025-11-05-copilot-coding-agent-supports-organization-custom-instructions/) | ✅ | Pattern documented in Vendor Compatibility Matrix |
| Test-driven development support | [Anthropic](https://www.anthropic.com/engineering/claude-code-best-practices) | ✅ | TDD workflow in plan_act.md |

**Legend**: ✅ Fully implemented | ⚡ Partially/optionally implemented | ❌ Not implemented

### Unique Enhancements Beyond Industry Standard

| # | Enhancement | Description | Benefit |
|---|-------------|-------------|---------|
| 1 | **Skill directory structure** | `agents/skills/<name>/` with SKILL.md + optional package.json | Discoverable skill docs with dependency tracking |
| 2 | **Integrated Plan → Act → Test** | Combines planning with task tracking and commit strategy | End-to-end workflow guidance |
| 3 | **Comprehensive vendor matrix** | Single reference for Claude, Copilot, Cursor, Gemini | Easy multi-tool adoption |
| 4 | **Public/local plan separation** | `agents/plans/` (committed) vs `agents/plans/local/` (gitignored) | Prevents committing every agent thought |
| 5 | **Agent personas with workspace-builder** | Reusable personalities + customization agent | Self-customizing persona system |
| 6 | **Split reference documentation** | `agents/reference/` with topic-focused files | Reduces context bloat, faster lookups |
| 7 | **Creator skills** | Bundled skills for creating skills, plans, personas, references | Consistent formatting across artifacts |
| 8 | **Directory index** | `agents/README.md` explaining all subdirectories | Quick orientation for agents and humans |

### Coverage Summary

```
Industry Best Practices:     15/15 (100%)
Unique Enhancements:         8 beyond standard
Vendor Support:              4 major tools (Claude, Copilot, Cursor, Gemini)
```

### Conclusion

This framework achieves **100% alignment** with industry best practices while adding **8 unique enhancements** for local development workflows. The single-source-of-truth approach (AGENTS.md with vendor breadcrumbs) ensures consistency across tools without duplication.

Key differentiators:
- **Progressive disclosure** - Three-layer documentation (AGENTS.md → agents/README.md → agents/reference/)
- **Context efficiency** - Split reference docs reduce token usage
- **Self-customizing** - Workspace-builder adapts framework to your project
- **Creator skills** - Bundled skills ensure consistent artifact formatting

### Sources

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices) - Anthropic
- [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) - GitHub
- [Improve your AI code output with AGENTS.md](https://www.builder.io/blog/agents-md) - Builder.io
- [AGENTS.md Standard](https://agents.md/) - OpenAI, Sourcegraph, Google collaboration
- [Custom agents for GitHub Copilot](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/) - GitHub
- [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - Anthropic
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules) - Cursor
- [5 tips for writing better custom instructions](https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/) - GitHub

---

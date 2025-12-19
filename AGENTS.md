# Workspace Agents - Agent Instructions

**Read this file first.** This is your entry point for understanding and contributing to the project.

## Project Summary

A framework for scaffolding structured context for workspace AI workflows. This is a meta-project that documents best practices for organizing AI assistant documentation across vendors (Claude, Copilot, Cursor, Gemini).

**Tech Stack**: Node.js CLI, Markdown documentation, Vendor-agnostic patterns

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

This project is a documentation framework with **one bundled skill** for deterministic setup. The structure follows a progressive disclosure pattern:

**Key Directories**:
```
/
├── AGENTS.md                    # This file - universal entrypoint
├── CLAUDE.md                    # Breadcrumb for Claude Code
├── GEMINI.md                    # Breadcrumb for Gemini
├── .cursor/rules/               # Breadcrumbs for Cursor
├── .github/                     # Breadcrumbs and agents for Copilot
├── .claude/skills/              # Symlinks to agents/skills/* (Claude Skills)
├── packages/workspace-agents/   # npm package source
│   ├── src/lib/                 # Core logic (scaffold, upgrade, init)
│   └── src/templates/           # Templates and bundled skills
└── agents/                      # This repo's own agent documentation
    ├── README.md                # Directory index
    ├── reference/               # Project-specific documentation
    ├── plans/                   # Implementation plans
    │   └── local/               # Ephemeral plans (gitignored)
    ├── personas/                # Agent personalities (user-created)
    └── skills/                  # Executable skills
        └── skill-creator/       # Create Anthropic-compliant skills
```

**Philosophy**: Lean by design
- **Structure over content**: Provides directories and templates, users add project-specific content
- **One bundled skill**: `skill-creator` helps users build Anthropic-compliant skills
- **No meta-documentation**: No framework docs that don't describe the user's project

## Code Style

- Use clear, concise language optimized for AI agent comprehension
- Keep AGENTS.md under 300 lines; move details to `agents/reference/`
- Follow markdown best practices (ATX headers, fenced code blocks)
- Include concrete examples in all documentation

## Boundaries

### Always Do
- Keep AGENTS.md concise; move deep docs to `agents/reference/`
- Test documentation changes by reading as an AI agent would
- Commit after each logical update

### Ask First
- Major structural changes to the framework
- New vendor-specific patterns not yet validated
- Adding new top-level directories

### Never Do
- Commit to main branch directly (use feature branches)
- Delete documented patterns without discussion
- Make vendor-specific assumptions in AGENTS.md
- Commit local scratch work from `agents/plans/local/`

## Workflow

### Plan → Act → Test

1. **Plan**: Understand requirements, explore existing docs, ask clarifying questions
2. **Act**: Update documentation incrementally, commit often
3. **Test**: Verify all links work, check formatting, ensure agent-readable

### Planning Documentation

Store plans in `agents/plans/` (shared) or `agents/plans/local/` (local only):

- **`agents/plans/`** - Committed plans for framework enhancements, multi-session work
- **`agents/plans/local/`** - Gitignored scratch work, session notes, exploratory analysis

## Skill Documentation

Agent-discoverable skill guides are in `agents/skills/`:

| Skill | Purpose |
|-------|---------|
| [skill-creator](agents/skills/skill-creator/) | Create, validate, and package Anthropic-compliant skills |

Each skill contains:
- `SKILL.md` - Documentation with YAML frontmatter (Anthropic standard)
- `package.json` - Dependencies and scripts
- `scripts/` - Executable implementations

## Deep-Dive Documentation

| Directory | Purpose |
|-----------|---------|
| `agents/README.md` | Directory index explaining all subdirectories |
| `agents/reference/` | Project-specific documentation (add as needed) |
| `agents/plans/` | Shared implementation plans (committed) |
| `agents/plans/local/` | Local scratch work (gitignored) |
| `agents/personas/` | Agent personalities (add as needed) |
| `agents/skills/` | Skill-specific guides with YAML frontmatter |

# Agent Development Patterns

Best practices for developing AI agents and agent-readable documentation.

## Core Principles

### 1. Progressive Disclosure

Layer information so agents can discover what they need without context overload:

**Layer 1**: YAML frontmatter (name, description, when to use)
**Layer 2**: Quick reference and overview
**Layer 3**: Deep documentation and examples

```markdown
---
name: database-agent
description: Database schema and query optimization specialist
---

# Database Agent

## Quick Reference

[Most common commands and patterns]

## When to Use

[Specific scenarios]

## Deep Dive

[Detailed documentation]
```

### 2. Semantic Discovery

Use structured frontmatter to enable discovery without full reads:

```yaml
---
name: authentication
description: User authentication and session management
when_to_use: Login, logout, session handling, token management
related_tools: [jwt, oauth, session-store]
---
```

Agents can scan frontmatter to decide if the full document is relevant.

### 3. Contextual Boundaries

Define clear "Always Do", "Ask First", and "Never Do" boundaries:

```markdown
## Boundaries

### Always Do
- Run tests before committing
- Follow the code style guide
- Update task status

### Ask First
- Architectural changes
- Adding dependencies

### Never Do
- Commit secrets
- Skip tests
```

## Agent Persona Patterns

### Specialized Domain Agents

Create domain-specific agents for recurring expertise needs:

```markdown
---
name: testing-agent
description: Test strategy, coverage, and quality assurance specialist
---

You are the Testing Agent. Your expertise includes:

- Unit test design and implementation
- Integration test strategies
- Test coverage analysis
- Mocking and stubbing patterns
- TDD workflow

## Key Files

- `tests/` - Test suite
- `jest.config.js` - Test configuration
- `agents/reference/typescript.md` - Testing patterns section

## Testing Requirements

[Domain-specific rules]
```

### Meta-Agent Pattern

Include a meta-agent that can create new personas:

```markdown
---
name: meta-agent
description: Creates new agent personas for specialized domains
---

You are the Meta-Agent. When asked to create a new persona:

1. Identify the domain and expertise needed
2. Gather context from relevant files
3. Define 3-5 key areas of knowledge
4. List relevant files and patterns
5. Create persona file using standard format
6. Always name files `[domain]-agent.md`
```

### Agent Invocation

Users can invoke specialized agents:

```bash
# In chat with AI assistant
"@testing-agent, review the test coverage for the auth module"
```

Agents can reference other agents:

```markdown
For test strategy, consult the testing-agent persona in `agents/personas/testing-agent.md`.
```

## Task Management Patterns

### Multi-Agent Task Claiming

Git-based locking protocol prevents conflicts:

```markdown
## Task 1.1: Implement User Authentication

**Status**: [AVAILABLE]
**Priority**: P0
**Effort**: 4 hours

[Details...]
```

**Claiming protocol**:

1. Pull latest: `git pull origin main`
2. Edit task status: `[AVAILABLE]` → `[CLAIMED by @agent-id]`
3. Commit within 1 minute: `git commit -m "claim: Task 1.1 - Auth"`
4. Push: `git push origin main`
5. Create feature branch

**Why this works**:
- Git prevents concurrent edits to same line
- 1-minute rule creates "lock" via push
- Feature branch isolates work

### Task Archiving

Keep active tasks manageable:

```
agents/plans/
├── tasks.md              # Active tasks (< 500 lines)
├── archive/
│   ├── phase-1.md       # Completed: Initial setup
│   ├── phase-2.md       # Completed: Core features
│   └── phase-3.md       # Completed: Polish
└── templates/
    └── task-template.md
```

Archive when:
- Major milestone complete
- tasks.md > 500 lines
- Starting new project phase

## Plan Management Patterns

### Public vs Local Plans

```
agents/
├── plans/                # Committed - collaboration
│   ├── tasks.md         # Active task tracking
│   ├── auth-system.md   # Multi-session feature
│   ├── api-v2.md        # Architectural change
│   └── local/           # Gitignored - scratch
│       ├── session-notes.md # Daily notes
│       └── exploration.md   # Experimental ideas
```

**Decision tree**:

```
Is this plan:
├─ Multi-session? ─────────────────> plans/
├─ Needs team review? ─────────────> plans/
├─ Architectural decision? ────────> plans/
├─ Just exploring? ────────────────> plans/local/
└─ Session scratch work? ──────────> plans/local/
```

### Plan Lifecycle

```markdown
---
title: User Authentication System
created: 2025-01-15
status: draft
author: @agent-1
---

# Plan: User Authentication

## Status History

- 2025-01-15: Initial draft (@agent-1)
- 2025-01-16: Refined approach (@agent-2)
- 2025-01-17: Approved, moved to in_progress
- 2025-01-20: Implementation complete

## Objective

[What problem does this solve?]

## Approach

[High-level strategy]

## Tasks

- [x] Task 1 - Complete
- [ ] Task 2 - In progress
- [ ] Task 3 - Not started

## Session Notes

### 2025-01-20
- Completed JWT integration
- Discovered edge case with refresh tokens
- Updated approach in section 3
```

## Tool Documentation Patterns

### Discoverable Tool Structure

```
agents/skills/
└── docker/
    ├── SKILL.md         # Main documentation with YAML frontmatter
    ├── package.json     # Dependencies and scripts
    └── scripts/         # Executable implementations
        ├── build.js
        └── run.js
```

**SKILL.md format**:

```markdown
---
name: docker
description: Container builds, deployment, and orchestration
when_to_use: Building images, running containers, docker-compose
---

# Docker Workflow

## Quick Reference

```bash
# Most common commands
docker build -t myapp .
docker run -p 3000:3000 myapp
docker-compose up -d
```

## When to Use

- Building container images
- Local development with docker-compose
- Debugging container issues

## Common Tasks

### Build and Run

[Step-by-step examples]

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| Port in use | Conflicting service | Stop other service |
```

### Tool Dependencies

If a tool requires specific packages:

```json
{
  "name": "@agents/docker",
  "description": "Docker container management",
  "dependencies": {
    "dockerode": "^3.3.0"
  },
  "scripts": {
    "example": "node examples/build.js"
  }
}
```

## Workflow Integration

### Plan → Act → Test

Embed workflow guidance in task and plan templates:

```markdown
## Workflow

### Plan Phase
1. Understand requirements
2. Explore codebase
3. Ask clarifying questions
4. Create implementation plan
5. Define test strategy

### Act Phase
1. Create feature branch
2. Implement incrementally
3. Commit after each logical unit
4. Run tests frequently

### Test Phase
1. Run full test suite
2. Check linting
3. Verify types
4. Update docs
5. Create PR
```

## Context Management

### Token Efficiency

Keep primary docs concise to fit in context:

- **AGENTS.md**: < 300 lines
- **agents/README.md**: < 200 lines
- **Tool READMEs**: < 300 lines each
- **Personas**: < 200 lines each

Use YAML frontmatter for discovery without full reads.

### Smart Linking

Link to deep dives rather than inlining:

```markdown
<!-- Good - concise with link -->
Follow React patterns. See `agents/reference/typescript.md#react-router-patterns` for routing.

<!-- Bad - inlined details -->
For React Router, you should use useParams to get route parameters,
and you need to type them like this... [500 lines of examples]
```

### Structured Cross-References

Create navigable documentation graphs:

```markdown
# In AGENTS.md
See `agents/plans/tasks.md` for available work.

# In agents/plans/tasks.md
See `agents/reference/plan_act.md` for planning templates and workflow details.

# In agents/reference/plan_act.md and agent-patterns.md
Complete git workflow, branching strategy, and multi-agent coordination patterns.
```

## Validation Patterns

### Documentation Testing

Test docs by reading as an agent would:

1. Start at AGENTS.md
2. Follow links to needed info
3. Check if you can complete a task
4. Verify examples are runnable
5. Confirm no dead ends

### Feedback Loops

Learn from agent behavior:

```markdown
## Session Notes (plans/local/)

### 2025-01-15
Agent struggled to find database migration docs.
**Action**: Add `agents/skills/migrations/SKILL.md`

### 2025-01-16
Agent asked same testing questions 3 times.
**Action**: Create `agents/personas/testing-agent.md`
```

## Advanced Patterns

### Scoped Context Rules

For Cursor and Copilot, create file-pattern-specific rules:

```markdown
---
description: React component rules
globs:
  - "src/components/**/*.tsx"
---

# Component Rules

- Functional components only
- Props interface named `{ComponentName}Props`
- Export with `export const`
```

### Multi-Repository Agents

For projects spanning multiple repos:

```
org/
├── backend/
│   └── AGENTS.md → points to org/docs/AGENTS.md
├── frontend/
│   └── AGENTS.md → points to org/docs/AGENTS.md
└── docs/
    └── AGENTS.md    # Canonical source
```

### Staged Context Loading

Load context in stages to manage tokens:

```typescript
/**
 * Stage 1: Load AGENTS.md + frontmatter of all skills/personas
 * Stage 2: Load relevant tool/persona based on query
 * Stage 3: Load deep reference docs if needed
 */
```

Agents should:
1. Always read AGENTS.md
2. Scan YAML frontmatter to find relevant resources
3. Only load full documents when needed

## Anti-Patterns to Avoid

### ❌ Verbose Instructions

```markdown
<!-- Bad -->
When you want to implement a new feature, you should probably start
by thinking about what you're trying to accomplish, and then you might
want to consider looking at the existing code to understand the patterns...
```

```markdown
<!-- Good -->
## Starting a Feature

1. Understand requirements
2. Explore existing code
3. Create plan in `agents/plans/local/`
4. Refine and move to `agents/plans/`
```

### ❌ Implicit Knowledge

```markdown
<!-- Bad -->
Follow the usual patterns for components.
```

```markdown
<!-- Good -->
See `agents/reference/typescript.md#component-structure` for component patterns.
```

### ❌ Scattered Documentation

```markdown
<!-- Bad -->
README.md has some rules
CONTRIBUTING.md has other rules
docs/style.md has more rules
.eslintrc.js has even more rules
```

```markdown
<!-- Good -->
AGENTS.md → agents/README.md → agents/reference/typescript.md
```

### ❌ No Versioning

```markdown
<!-- Bad -->
Use React Router for routing.
```

```markdown
<!-- Good -->
**Framework**: React Router 6.x (v6 API, not v5)
See: https://reactrouter.com/en/main/upgrading/v5
```

## Checklist for Agent-Friendly Docs

- [ ] AGENTS.md is concise (< 300 lines)
- [ ] All skills/personas have YAML frontmatter
- [ ] Progressive disclosure pattern used
- [ ] Clear boundaries defined (Always/Ask/Never)
- [ ] Task claiming protocol documented
- [ ] Plans split between public/local
- [ ] Examples are concrete and runnable
- [ ] Links use descriptive text
- [ ] No dead ends in documentation graph
- [ ] Versioning info included for dependencies

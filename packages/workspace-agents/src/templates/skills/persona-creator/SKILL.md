---
name: persona-creator
description: Create new agent personas for specialized domains. Use when a new domain requires recurring expertise, complex subsystem needs specialized knowledge, or team identifies a knowledge gap.
---

# Persona Creator

Create focused, reusable agent personas that provide domain-specific guidance for AI assistants.

## Overview

This skill provides tools to create well-structured personas following the framework's persona patterns.

**Core capabilities**:
1. **create** - Generate new persona from template
2. **validate** - Check persona completeness

## Commands

### Create a New Persona

Generate a persona with interactive prompts:

```bash
cd agents/skills/persona-creator
npm run create
```

**Prompts**:
- Domain name (e.g., testing, database, security)
- Brief description
- Key expertise areas (3-5)
- Related files in the codebase

**Output**: Creates persona file at `agents/personas/<domain>-agent.md`

### Validate a Persona

Check persona completeness and structure:

```bash
cd agents/skills/persona-creator
npm run validate path/to/persona.md
```

**Validation checks**:
- YAML frontmatter present and valid
- Required fields: name, description
- Name follows `<domain>-agent` convention
- Key sections present
- Links are valid

## When to Create a Persona

Create a new persona when:
- A new domain requires recurring expertise (e.g., database, security, deployment)
- Complex subsystem needs specialized knowledge
- Team identifies a knowledge gap
- Same questions are asked repeatedly about a domain
- New technology/framework is adopted

**Don't create personas for**:
- One-off tasks (use plans instead)
- General programming questions
- Simple clarifications
- Executable actions (use skills instead)

## Persona Template

```markdown
---
name: domain-agent
description: One-line description of expertise
---

You are the [Domain] Agent. Your expertise includes:

- [Area of expertise 1]
- [Area of expertise 2]
- [Area of expertise 3]

## Key Files

- `path/to/relevant/file.ts` - [purpose]
- `agents/reference/[domain].md` - [purpose]

## [Domain] Requirements

### Critical Rules

1. **[Most important rule]**
   - [Explanation]

2. **[Second rule]**
   - [Explanation]

### Common Patterns

[Provide 2-3 common patterns for this domain]

### Anti-Patterns

[What to avoid]

## Quick Reference

[Most common commands/operations for this domain]

## When to Consult This Persona

Invoke this persona when:
- [Scenario 1]
- [Scenario 2]

## Related Resources

- [Skill Name](../skills/[skill]/) - [relationship]

See [agents/](../) for complete documentation.
```

## Naming Convention

**Always use kebab-case with `-agent` suffix**:

- `testing-agent.md`
- `database-agent.md`
- `auth-agent.md`
- `api-design-agent.md`

## Personas vs Skills

**Skills** (`../skills/`):
- Executable, deterministic actions
- "DO things" - create files, validate, package
- Invoked directly via scripts
- Example: `persona-creator/scripts/create.js`

**Personas** (`agents/personas/`):
- Contextual guidance and orchestration
- "GUIDE how and when" to use skills
- Read by agents for behavioral context
- Example: "documentation-agent knows when to validate docs"

## Validation Checklist

Before finalizing a persona:

- [ ] YAML frontmatter is complete
- [ ] Name follows `[domain]-agent` convention
- [ ] Description is clear and concise
- [ ] 3-5 expertise areas listed
- [ ] Key files are documented
- [ ] Critical rules are specific
- [ ] Examples are concrete
- [ ] "When to consult" is clear
- [ ] Related resources are linked

## Requirements

- Node.js 14 or higher
- npm or yarn

## Related Documentation

- `agents/personas/README.md` - Persona directory guide
- `agents/reference/agent-patterns.md` - Agent development patterns
- `agents/reference/documentation-style.md` - Documentation standards

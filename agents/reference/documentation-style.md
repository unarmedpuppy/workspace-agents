# Documentation Style Guide

Standards for writing AI agent-readable documentation.

## Core Principles

1. **Optimize for comprehension, not prose** - Clear and direct over eloquent
2. **Progressive disclosure** - Layer information (overview → details → deep dives)
3. **Concrete over abstract** - Show examples, not just descriptions
4. **Scannable structure** - Use headers, tables, lists for quick navigation
5. **YAML frontmatter** - Enable semantic discovery without reading full content

## File Organization

### Headers

Use ATX-style headers (`#`) with clear hierarchy:

```markdown
# Main Title (H1) - One per file

## Major Section (H2)

### Subsection (H3)

#### Detail Level (H4)
```

**Rules**:
- Only one H1 per file
- Don't skip levels (H2 → H4)
- Keep headers concise (3-7 words)
- Use action verbs where appropriate

### Code Blocks

Always use fenced code blocks with language identifiers:

````markdown
```typescript
// Good - language specified
const greeting: string = "Hello";
```

```
# Bad - no language
const greeting = "Hello"
```
````

**Common languages**: `typescript`, `javascript`, `python`, `bash`, `json`, `yaml`, `markdown`

### Lists

**Unordered lists** - Use `-` for consistency:

```markdown
- Item one
- Item two
  - Nested item (2 spaces)
- Item three
```

**Ordered lists** - Use `1.` for all items (auto-numbered):

```markdown
1. First step
1. Second step
1. Third step
```

### Tables

Use tables for structured comparisons:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
```

**Best for**: Status indicators, feature matrices, quick references

### Links

Use descriptive link text:

```markdown
<!-- Good -->
See the [Plan → Act → Test workflow](plan_act.md) for details.

<!-- Bad -->
Click [here](plan_act.md) for details.
```

## YAML Frontmatter

Use frontmatter for discoverable resources (tools, personas, plans):

### Tool Documentation

```yaml
---
name: tool-name
description: One-line description of what the tool does
when_to_use: Primary use cases
---
```

### Persona Files

```yaml
---
name: domain-agent
description: One-line description of expertise
---
```

### Plan Files

```yaml
---
title: Feature Name
created: YYYY-MM-DD
status: draft | in_progress | approved | complete
author: @agent-id
---
```

## Writing Style

### Voice

- **Active voice**: "Run the tests" (not "Tests should be run")
- **Present tense**: "The function returns" (not "The function will return")
- **Direct commands**: "Create a file" (not "You should create a file")
- **Inclusive pronouns**: Use "we" for collaborative work

### Sentence Structure

- Keep sentences short (15-25 words max)
- One idea per sentence
- Use parallel structure in lists
- Front-load important information

### Technical Terms

- Define acronyms on first use: "Model Context Protocol (MCP)"
- Use consistent terminology throughout
- Prefer industry-standard terms over internal jargon
- Capitalize proper nouns (TypeScript, React, Git)

## Examples

### Good Documentation Pattern

```markdown
---
name: authentication
description: User authentication and session management
---

# Authentication System

## Overview

The authentication system uses JWT tokens with refresh token rotation.

## Quick Start

```typescript
// Initialize auth client
const auth = new AuthClient({
  apiUrl: process.env.API_URL
});

// Login user
const session = await auth.login(email, password);
```

## Key Files

- `src/auth/client.ts` - Authentication client
- `src/auth/session.ts` - Session management
- `src/auth/tokens.ts` - JWT utilities

## Common Tasks

### Refresh Expired Token

```typescript
if (session.isExpired()) {
  await session.refresh();
}
```
```

### Anti-Pattern

```markdown
# Auth Stuff

This is the authentication system. It's pretty complicated but basically
you need to use JWT tokens. There's a bunch of files that handle this
and you should probably read them if you want to understand how it works.

To use it, just import the stuff you need and call the functions.
```

**Problems**:
- No frontmatter
- Vague language ("stuff", "basically")
- No code examples
- No file references
- No structure

## Agent-Specific Considerations

### Token Efficiency

- Keep AGENTS.md < 300 lines
- Split deep docs into `reference/` by topic
- Use YAML frontmatter for discovery without full reads
- Link to deep dives rather than inlining

### Scannability

Agents scan documents quickly. Help them:

- Use consistent heading patterns
- Put critical info first
- Use tables for comparisons
- Include "Quick Reference" sections

### Actionability

Every section should answer:
- **What** is this?
- **When** should I use it?
- **How** do I use it?
- **Where** are the relevant files?

## Validation Checklist

Before committing documentation:

- [ ] YAML frontmatter present (if tool/persona/plan)
- [ ] Code blocks have language identifiers
- [ ] Headers follow hierarchy (no skipped levels)
- [ ] Examples are concrete and runnable
- [ ] Links use descriptive text
- [ ] File is scannable (headers, lists, tables)
- [ ] Critical info is front-loaded
- [ ] No undefined acronyms
- [ ] Follows progressive disclosure pattern

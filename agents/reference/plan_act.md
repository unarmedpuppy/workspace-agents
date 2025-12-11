# Plan → Act → Test Workflow

Complete workflow guide for AI-assisted development.

## Overview

The Plan → Act → Test workflow provides structure for feature development while maintaining code quality and preventing rework.

```
┌─────────┐
│  PLAN   │ → Understand requirements, explore code, create implementation plan
└────┬────┘
     │
┌────▼────┐
│   ACT   │ → Implement incrementally, commit often, follow patterns
└────┬────┘
     │
┌────▼────┐
│  TEST   │ → Verify correctness, run tests, update docs, create PR
└─────────┘
```

## Plan Storage and Organization

### Where to Store Plans

- **`agents/plans/`** - Committed plans for multi-session work, team collaboration, architectural decisions
- **`agents/plans/local/`** - Local scratch work, session notes, exploratory analysis (gitignored)
- **`agents/plans/tasks.md`** - Active work tracking (unified task list)

### Plan Organization

**Simple plans** (single file):
```
agents/plans/add-user-search.md
agents/plans/fix-auth-bug.md
```

**Complex features** (subdirectory with multiple files):
```
agents/plans/user-authentication/
├── overview.md          # High-level plan
├── phase-1-backend.md   # Backend implementation
├── phase-2-frontend.md  # Frontend implementation
├── api-design.md        # API specifications
└── testing-strategy.md  # Testing approach
```

**When to use subdirectories**:
- Feature spans multiple files/phases
- Need separate specs (API design, data models, etc.)
- Multi-session work requiring detailed documentation
- Team collaboration requiring clear breakdown

**When to use single file**:
- Simple features or bug fixes
- Single-session work
- Self-contained changes

### Task Claiming (Multi-Agent)

For coordinated work across multiple agents, use the simplified frontmatter protocol:

```markdown
---
title: Implement User Authentication
created: 2025-12-10
status: in_progress
claimed_by: @copilot-@username
priority: high
---
```

**Protocol**:
1. Edit `agents/plans/tasks.md` frontmatter
2. Add `claimed_by: @agent-id-@git-username`
3. Commit and push
4. Create feature branch
5. Update `status` as you progress
6. Mark `completed` when done

## Plan Phase

**When to use**: Starting new features, complex changes, unclear requirements

### 1. Understand Requirements

**Questions to answer**:
- What problem does this solve?
- What are the acceptance criteria?
- What are the edge cases?
- What is out of scope?

**Action**: Document in plan file

```markdown
---
title: Feature Name
created: YYYY-MM-DD
status: draft
---

# Plan: Feature Name

## Objective

Implement user authentication system with JWT tokens.

## Requirements

- Users can login with email/password
- JWT tokens expire after 1 hour
- Refresh tokens valid for 30 days
- Support logout (invalidate tokens)

## Out of Scope

- Social login (OAuth)
- Two-factor authentication
- Password reset flow
```

### 2. Explore the Codebase

**Questions to answer**:
- How is similar functionality implemented?
- What patterns does the codebase use?
- What files need to be modified?
- What dependencies exist?

**Actions**:
- Read existing related code
- Identify patterns and conventions
- Note relevant files and functions
- Check for similar implementations

```markdown
## Current State

### Existing Authentication

- No authentication currently implemented
- API endpoints are unprotected
- User model exists in `src/models/User.ts`

### Relevant Files

- `src/models/User.ts` - User data model
- `src/routes/api.ts` - API routes to protect
- `src/middleware/` - Middleware directory (create)
```

### 3. Ask Clarifying Questions

**Before implementing, resolve**:
- Ambiguous requirements
- Technical approach decisions
- Tradeoffs between options
- Integration points

**Example questions**:

```markdown
## Open Questions

- [ ] Should passwords be hashed with bcrypt or argon2?
  - Decision: Use bcrypt (already in dependencies)

- [ ] Where should JWT secrets be stored?
  - Decision: Environment variables (.env file)

- [ ] Should we use a token blacklist for logout?
  - Decision: Yes, use Redis for blacklist
```

### 4. Create Implementation Plan

**Break into actionable tasks**:

```markdown
## Implementation Plan

### Phase 1: User Model Enhancement
1. [ ] Add password hashing to User model
2. [ ] Add password verification method
3. [ ] Write tests for User model

### Phase 2: Authentication Logic
4. [ ] Create JWT utility functions (sign, verify)
5. [ ] Create authentication middleware
6. [ ] Write tests for JWT utilities

### Phase 3: API Integration
7. [ ] Add login endpoint
8. [ ] Add logout endpoint
9. [ ] Add token refresh endpoint
10. [ ] Protect existing API endpoints
11. [ ] Write integration tests

### Phase 4: Documentation
12. [ ] Update API documentation
13. [ ] Add usage examples
```

### 5. Define Test Strategy

**What to test**:

```markdown
## Test Strategy

### Unit Tests
- User password hashing and verification
- JWT token generation and validation
- Token expiration handling

### Integration Tests
- Login flow (successful and failed)
- Protected endpoint access
- Token refresh flow
- Logout flow

### Edge Cases
- Expired tokens
- Invalid tokens
- Missing tokens
- Malformed requests
```

### 6. Get Plan Approval

**Before implementing**:
- Review plan with stakeholders if needed
- Confirm approach is sound
- Identify any missed considerations
- Move plan from `plans-local/` to `plans/` if collaborative

## Act Phase

**When to use**: After plan is approved, or for simple/clear changes

### 1. Create Feature Branch

```bash
# Pull latest
git pull origin main

# Create branch from main
git checkout -b feature/user-authentication

# Verify branch
git branch --show-current
```

### 2. Implement Incrementally

**Follow the plan, one task at a time**:

```bash
# Implement task 1: Add password hashing
# Edit src/models/User.ts
# Test manually
# Commit

git add src/models/User.ts
git commit -m "feat: add password hashing to User model"

# Implement task 2: Add password verification
# Edit src/models/User.ts
# Test manually
# Commit

git add src/models/User.ts
git commit -m "feat: add password verification method"
```

**Commit guidelines**:
- Commit after each logical unit of work
- Write descriptive commit messages
- Follow conventional commit format: `type(scope): description`
- Don't commit broken code

**Commit types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 3. Run Tests Frequently

```bash
# After each commit
npm test

# Or run specific test file
npm test -- User.test.ts

# Watch mode during development
npm test -- --watch
```

### 4. Follow Code Style Guide

- Respect project conventions (see AGENTS.md)
- Run linter: `npm run lint`
- Format code: `npm run format`
- Follow patterns in `agents/reference/typescript.md`

### 5. Update Plan Progress

Mark tasks as complete in your plan:

```markdown
## Implementation Plan

### Phase 1: User Model Enhancement
- [x] Add password hashing to User model
- [x] Add password verification method
- [ ] Write tests for User model  ← Current task
```

### Rules for Act Phase

**DO**:
- Implement the approved plan
- Make small, focused commits
- Run tests after changes
- Follow code style guide
- Ask questions if stuck

**DON'T**:
- Make unplanned changes without discussing
- Skip tests "just this once"
- Commit broken code
- Mix unrelated changes in one commit
- Push directly to main branch

## Test Phase

**When to use**: After implementation is complete

### 1. Run Full Test Suite

```bash
# All tests
npm test

# With coverage
npm test -- --coverage

# Check coverage threshold
# Should pass project minimum (usually 80%)
```

### 2. Verify Type Checking

```bash
# TypeScript projects
npm run type-check
# or
npx tsc --noEmit
```

### 3. Run Linter

```bash
npm run lint

# Auto-fix if possible
npm run lint -- --fix
```

### 4. Check Build

```bash
# Ensure production build works
npm run build

# Test production build locally if applicable
npm run preview
```

### 5. Manual Testing

**Test the happy path**:
- [ ] Feature works as expected
- [ ] UI is responsive (if applicable)
- [ ] Error messages are clear
- [ ] Edge cases handled gracefully

### 6. Update Documentation

```markdown
## Documentation Checklist

- [ ] Update README if needed
- [ ] Update API documentation
- [ ] Add/update code comments
- [ ] Update AGENTS.md if workflow changed
- [ ] Update relevant `agents/reference/` docs
```

### 7. Update Task Status

If using `agents/plans/tasks.md`:

```markdown
## Task 1.1: Implement User Authentication

**Status**: [COMPLETE] ✅
**Priority**: P0
**Completed**: 2025-01-20

### Implementation Notes

- Used bcrypt for password hashing
- JWT tokens stored in httpOnly cookies
- Redis blacklist for logout
- 94% test coverage achieved
```

### 8. Create Pull Request

```bash
# Push feature branch
git push origin feature/user-authentication
```

**PR description template**:

```markdown
## Description

Implements user authentication system with JWT tokens.

## Changes

- Added password hashing to User model
- Created JWT utilities for token management
- Added login, logout, and refresh endpoints
- Protected existing API endpoints with auth middleware
- Added comprehensive test coverage (94%)

## Related

- Closes #123
- Implements plan in `agents/plans/auth-system.md`

## Testing

- [x] All tests pass
- [x] Linter passes
- [x] Type check passes
- [x] Manual testing completed
- [x] Documentation updated

## Screenshots

[If UI changes, include screenshots]
```

## Workflow Variations

### Simple Changes (Skip Planning)

For trivial changes, go straight to Act:

**Examples**:
- Fix typo in documentation
- Update dependency version
- Add missing semicolon
- Adjust styling

```bash
# Quick fix workflow
git checkout -b fix/typo-in-readme
# Edit file
git commit -m "docs: fix typo in README"
git push origin fix/typo-in-readme
# Create PR
```

### Exploratory Work (Local Planning)

For uncertain implementation:

1. Start in `agents/plans/local/exploration.md`
2. Try different approaches
3. Document findings
4. Once clear, create formal plan in `agents/plans/`
5. Proceed with Act phase

### Hotfix Workflow

For critical production issues:

1. **Minimal planning**: Understand the bug, identify fix
2. **Quick implementation**: Create hotfix branch from main
3. **Thorough testing**: Extra verification given urgency
4. **Fast-track review**: Get expedited PR approval
5. **Monitor**: Watch production after deployment

```bash
# Hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-bug

# Implement fix
git commit -m "fix: resolve authentication token expiration bug"

# Test thoroughly
npm test
npm run build

# Push and create urgent PR
git push origin hotfix/critical-auth-bug
```

## Plan Templates

### Feature Implementation

```markdown
---
title: [Feature Name]
created: YYYY-MM-DD
status: draft
author: @agent-id
---

# Plan: [Feature Name]

## Objective

[What problem does this solve?]

## Requirements

- Requirement 1
- Requirement 2

## Out of Scope

- Item 1
- Item 2

## Current State

[What exists today?]

## Approach

[High-level strategy]

## Implementation Plan

### Phase 1: [Phase Name]
1. [ ] Task 1
2. [ ] Task 2

### Phase 2: [Phase Name]
3. [ ] Task 3
4. [ ] Task 4

## Files to Modify

- `path/to/file.ts` - [what changes]
- `tests/path/test.ts` - [what tests]

## Test Strategy

### Unit Tests
- [What to test]

### Integration Tests
- [What to test]

## Open Questions

- [ ] Question 1?
- [ ] Question 2?

## Session Notes

### YYYY-MM-DD
- [Progress update]
- [Decisions made]
```

### Bug Fix

```markdown
---
title: Fix [Bug Description]
created: YYYY-MM-DD
status: draft
author: @agent-id
---

# Plan: Fix [Bug Description]

## Bug Description

[What's broken?]

## Steps to Reproduce

1. Step 1
2. Step 2
3. Expected: X, Actual: Y

## Root Cause

[What's causing the bug?]

## Proposed Fix

[How to fix it?]

## Testing Plan

- [ ] Verify fix resolves issue
- [ ] Check for regressions
- [ ] Add test to prevent recurrence

## Files to Modify

- `path/to/buggy/file.ts` - [fix]
- `tests/path/test.ts` - [regression test]
```

### Refactoring

```markdown
---
title: Refactor [Component/Module]
created: YYYY-MM-DD
status: draft
author: @agent-id
---

# Plan: Refactor [Component/Module]

## Motivation

[Why refactor?]

## Current Problems

- Problem 1
- Problem 2

## Proposed Changes

[What will change?]

## Migration Strategy

[How to migrate without breaking things?]

## Testing Strategy

- [ ] All existing tests still pass
- [ ] No behavior changes
- [ ] Performance not degraded

## Rollback Plan

[How to revert if needed?]
```

## Best Practices

### Planning

- **Start small**: Break large features into phases
- **Be specific**: Vague plans lead to confusion
- **Document decisions**: Record why choices were made
- **Update as you go**: Plans evolve during implementation

### Acting

- **Commit often**: Small commits are easier to review and revert
- **Test continuously**: Catch issues early
- **Follow patterns**: Consistency matters
- **Ask questions**: Better to ask than guess wrong

### Testing

- **Test edge cases**: Not just happy path
- **Automate**: Manual testing doesn't scale
- **Maintain coverage**: Don't let it slip
- **Test before PR**: Don't waste reviewer time

## Troubleshooting

### "I don't know where to start"

→ Go to Plan phase, explore codebase first

### "The plan isn't working"

→ Pause, update plan with new understanding, continue

### "Tests are failing"

→ Don't skip Test phase, fix tests before moving on

### "Code review found issues"

→ Address feedback, update plan if needed, learn for next time

## Workflow Checklist

### Plan Phase
- [ ] Requirements documented
- [ ] Codebase explored
- [ ] Questions answered
- [ ] Implementation plan created
- [ ] Test strategy defined
- [ ] Plan approved (if needed)

### Act Phase
- [ ] Feature branch created
- [ ] Implementation follows plan
- [ ] Small, focused commits
- [ ] Tests run frequently
- [ ] Code style followed
- [ ] Plan updated with progress

### Test Phase
- [ ] Full test suite passes
- [ ] Type checking passes
- [ ] Linter passes
- [ ] Build succeeds
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Task marked complete
- [ ] PR created

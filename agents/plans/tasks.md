# Tasks

  Task tracking for ContextForge project.**Status**: Initial Setup
**Last Updated**: 2025-12-05

## Task Claiming Protocol

```bash
# 1. Pull latest
git pull origin main

# 2. Check task status - only claim [AVAILABLE] tasks

# 3. Edit this file: change [AVAILABLE] → [CLAIMED by @your-id]

# 4. Commit and push within 1 minute (creates "lock")
git add agents/plans/tasks.md
git commit -m "claim: Task X - Description"
git push origin main

# 5. Create feature branch
git checkout -b feature/task-x-description
```

## Task Status Legend

- `[AVAILABLE]` - Ready to claim
- `[CLAIMED by @id]` - Locked by an agent
- `[IN PROGRESS - X%]` - Work underway
- `[COMPLETE]` - Finished
- `[BLOCKED]` - Waiting on dependency

---

## Current Tasks

| Task | Description | Status | Priority |
|------|-------------|--------|----------|
| 1.1 | Create example project structure | [AVAILABLE] | P1 |
| 1.2 | Add GitHub Actions workflow examples | [AVAILABLE] | P2 |
| 1.3 | Create video tutorial script | [AVAILABLE] | P2 |

---

### Task 1.1: Create Example Project Structure

**Priority**: P1
**Dependencies**: None
**Effort**: 2 hours

**Objective**: Create a sample project that demonstrates the meta-agent structure in action.

**Details**:
- Create `examples/` directory
- Set up a minimal TypeScript/React project
- Include all meta-agent documentation files
- Add realistic task examples
- Include sample personas (testing-agent, database-agent)
- Add sample tool documentation (git, docker, jest)

**Files to create**:
- `examples/sample-project/`
  - AGENTS.md
  - Package.json
  - All breadcrumb files
  - Full `agents/` structure

**Success Criteria**:
- [ ] Example project has complete structure
- [ ] All documentation files are present
- [ ] Example demonstrates real-world usage
- [ ] README explains how to use the example

---

### Task 1.2: Add GitHub Actions Workflow Examples

**Priority**: P2
**Dependencies**: None
**Effort**: 1 hour

**Objective**: Provide example CI/CD workflows for projects using this framework.

**Details**:
- Create `.github/workflows/examples/` directory
- Add workflow for linting AGENTS.md
- Add workflow for validating task format
- Add workflow for checking broken links in documentation
- Add workflow for testing documentation with AI agents

**Files to create**:
- `.github/workflows/examples/lint-agents.yml`
- `.github/workflows/examples/validate-tasks.yml`
- `.github/workflows/examples/check-links.yml`

**Success Criteria**:
- [ ] Example workflows are functional
- [ ] Workflows are well-documented
- [ ] Workflows can be copied to projects
- [ ] README explains how to use workflows

---

### Task 1.3: Create Video Tutorial Script

**Priority**: P2
**Dependencies**: Task 1.1
**Effort**: 3 hours

**Objective**: Create a script for a video tutorial demonstrating framework setup.

**Details**:
- Write step-by-step tutorial script
- Include scaffolding prompt walkthrough
- Show vendor-specific integration (Claude, Copilot, Cursor, Gemini)
- Demonstrate task claiming workflow
- Show plan management workflow

**Files to create**:
- `docs/video-tutorial-script.md`

**Success Criteria**:
- [ ] Script covers complete setup process
- [ ] Script demonstrates key workflows
- [ ] Script is clear and beginner-friendly
- [ ] Timing estimates included for each section

---

## Completed Tasks

None yet.

---

## Blocked Tasks

None yet.

---

## Task Archive

When major milestones are complete, archive completed tasks to `agents/tasks/archive/phase-X.md` to keep this file manageable.

Archive when:
- A major phase is complete
- This file exceeds 500 lines
- Starting a new project phase

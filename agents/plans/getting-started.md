# Plan: Getting Started

Customize workspace-agents for workflow-agents.

## Objective

Transform the scaffolded templates into project-specific documentation that helps AI agents understand and work effectively in this codebase.

## Phase 1: Customize AGENTS.md

- [ ] Update one-line mission with what this project does
- [ ] Set allowed operations (what agents can freely do)
- [ ] Set forbidden operations (what requires asking first)
- [ ] Update setup commands for this project
- [ ] Update test/lint/dev commands
- [ ] Update repo map with actual directory structure
- [ ] Set definition of done criteria
- [ ] List anti-goals (code not to touch)

## Phase 2: Add Reference Documentation

Create docs in `agents/reference/` for complex topics:

- [ ] Architecture decisions (if non-obvious)
- [ ] API patterns (if custom conventions exist)
- [ ] Testing patterns (if complex setup required)
- [ ] Framework-specific guides (if using unfamiliar frameworks)

Skip this phase if the codebase is straightforward.

## Phase 3: Create Personas (Optional)

Create specialists in `agents/personas/` for recurring workflows:

- [ ] Code reviewer (if specific review criteria)
- [ ] Security reviewer (if security-sensitive)
- [ ] Performance specialist (if performance-critical)
- [ ] Domain expert (if complex business logic)

Skip this phase until you identify repeated workflows that need specialized guidance.

## Phase 4: Create Skills (Optional)

Use `/skill skill-creator` to build repeatable processes:

- [ ] Deployment skill (if complex deploy process)
- [ ] Migration skill (if database migrations needed)
- [ ] Release skill (if specific release workflow)

Skip this phase until you identify processes that benefit from deterministic execution.

## Success Criteria

- [ ] AGENTS.md accurately describes the project
- [ ] An AI agent can set up and run the project using AGENTS.md
- [ ] An AI agent knows what it can/cannot modify
- [ ] Complex topics have reference docs (if needed)

## Notes

Delete this plan after completing customization, or keep it as a checklist for onboarding new team members.

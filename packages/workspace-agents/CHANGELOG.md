# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-11

### Added

- Initial release of workspace-agents npm package
- `init` command for scaffolding new projects or upgrading existing ones
- `update` command as semantic alias for `init`
- Welcome screen with ASCII art and version check
- Auto-detection of existing framework structure
- Two-phase plan/apply architecture (preview changes before applying)
- Template system with variable substitution
- Cross-platform symlink support for Claude Skills
- Git history preservation during upgrades (using `git mv`)
- Bundled skills: skill-creator, plan-creator

### Framework Structure

- AGENTS.md as universal AI agent entrypoint
- Vendor breadcrumbs: CLAUDE.md, GEMINI.md, .cursor/rules/, .github/
- agents/ directory with reference/, plans/, personas/, skills/, legacy/
- .claude/skills/ symlinks for Claude Code integration

### Upgrade Support

- Migrate agents/tools/ → agents/skills/
- Migrate plans-local/ → agents/plans/local/
- Update terminology in documentation files
- Move unmapped files to agents/legacy/

# Skills

Anthropic-compliant skills for AI agents. Each skill follows the Anthropic Skills Specification with executable implementations.

## Available Skills

| Skill | Description | Commands |
|-------|-------------|----------|
| [skill-creator](skill-creator/) | Create, validate, and package Anthropic-compliant skills | `init`, `validate`, `package` |
| [scaffold-workflow](scaffold-workflow/) | Initialize complete framework structure in new projects | `scaffold` |
| [upgrade-workflow](upgrade-workflow/) | Migrate existing frameworks to latest structure | `upgrade` |
| [plan-creator](plan-creator/) | Create consistent implementation plans for AI agents | `create`, `validate`, `export` |

## Quick Start

Each skill is a self-contained Node.js project:

```bash
# Navigate to skill directory
cd agents/skills/skill-creator

# Install dependencies
npm install

# Run commands
npm run init
npm run validate path/to/skill
npm run package path/to/skill
```

## Skill Structure

Every skill follows this pattern:

```
skill-name/
├── SKILL.md              # Required: Skill documentation with YAML frontmatter
├── package.json          # Dependencies and npm scripts
├── README.md             # Quick start guide
├── scripts/              # Executable implementations
│   ├── command1.js
│   └── command2.js
├── templates/            # Optional: Templates or examples
└── references/           # Optional: Reference documentation
```

## Creating New Skills

Use the skill-creator to scaffold new skills:

```bash
cd agents/skills/skill-creator
npm run init
```

See [skill-creator/SKILL.md](skill-creator/SKILL.md) for details.

## Anthropic Standards

All skills follow the [Anthropic Skills Specification](skill-creator/references/anthropic-spec.md):

- **SKILL.md required**: Single source of truth with YAML frontmatter
- **Progressive disclosure**: Keep main doc concise, details in subdirectories
- **Executable focus**: Skills provide working implementations, not just docs
- **No auxiliary files**: No README.md, CHANGELOG.md in distributed skills (allowed in source)

## Skill Development

### 1. Plan Your Skill

Use plan-creator to create an implementation plan:

```bash
cd agents/skills/plan-creator
npm run create
```

### 2. Create Skill Scaffold

Use skill-creator to initialize structure:

```bash
cd agents/skills/skill-creator
npm run init
```

### 3. Implement Commands

Add executable scripts to `scripts/` directory. Each command should:
- Have clear input/output
- Include error handling
- Provide helpful CLI feedback
- Include JSDoc comments

### 4. Validate Your Skill

```bash
cd agents/skills/skill-creator
npm run validate ../your-skill-name
```

### 5. Test Thoroughly

- Test all commands
- Verify error cases
- Check cross-platform compatibility
- Ensure dependencies are declared

### 6. Document

Update SKILL.md with:
- Clear usage examples
- Command descriptions
- Requirements
- Related documentation

## Dependencies

Skills use Node.js for offline capability and cross-platform support. Common dependencies:

- `inquirer` - Interactive prompts
- `chalk` - Terminal colors
- `fs-extra` - File system operations
- `js-yaml` - YAML parsing

## Related Documentation

- `agents/reference/skill-patterns.md` - Tool design patterns
- `agents/reference/plan_act.md` - Plan → Act → Test workflow
- `skill-creator/references/anthropic-spec.md` - Anthropic Skills Specification

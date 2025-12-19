# Skills

Executable skills following [Anthropic's skill standard](https://docs.anthropic.com/en/docs/claude-code/skills).

## Available Skills

| Skill | Purpose |
|-------|---------|
| [skill-creator](skill-creator/) | Create new Anthropic-compliant skills |

## Creating Skills

```bash
/skill skill-creator
```

## Skill Structure

```
skill-name/
├── SKILL.md       # Documentation with YAML frontmatter (required)
├── package.json   # Dependencies and scripts
└── scripts/       # Executable implementations
```

## Claude Code Integration

Skills in this directory are symlinked to `.claude/skills/` for auto-detection.

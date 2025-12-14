# Claude Skills

This directory contains symlinks to skills in `agents/skills/` for Claude Code auto-detection.

## Auto-Detection

Claude Code (Anthropic's AI-powered IDE) automatically detects and loads skills from this directory. Each symlink points to a skill in the main `agents/skills/` directory.

## Available Skills

| Skill | Description | Link Target |
|-------|-------------|-------------|
| skill-creator | Create, validate, and package Anthropic-compliant skills | ../../agents/skills/skill-creator |
| scaffold-workspace | Initialize complete framework structure in new projects | ../../agents/skills/scaffold-workspace |
| upgrade-workspace | Migrate existing frameworks to latest structure | ../../agents/skills/upgrade-workspace |
| plan-creator | Create consistent implementation plans for AI agents | ../../agents/skills/plan-creator |

## How It Works

**Symlinks** (symbolic links) allow multiple directory paths to reference the same files:

```bash
.claude/skills/skill-creator -> ../../agents/skills/skill-creator
```

This means:
- Claude Code finds skills in `.claude/skills/`
- Skills are actually stored in `agents/skills/`
- Single source of truth - no duplication
- Changes to `agents/skills/` are immediately visible to Claude

## Enabling Claude Skills

In VS Code settings:

```json
{
  "chat.useClaudeSkills": true
}
```

Or via VS Code UI:
1. Open Settings (⌘,)
2. Search for "Claude Skills"
3. Enable "Chat: Use Claude Skills"

## Verifying Symlinks

Check that symlinks are working:

```bash
# List symlinks
ls -la .claude/skills/

# Verify each symlink points to existing directory
readlink .claude/skills/skill-creator
# Should output: ../../agents/skills/skill-creator

# Test symlink works
cat .claude/skills/skill-creator/SKILL.md | head -5
# Should display skill documentation
```

## Windows Support

Windows requires special configuration for symlinks:

### Option 1: Enable Developer Mode
1. Windows Settings → Update & Security → For developers
2. Enable "Developer Mode"
3. Restart terminal

### Option 2: Run as Administrator
```bash
# Run git clone as administrator
git clone <repo-url>
```

### Option 3: Configure Git
```bash
git config --global core.symlinks true
```

### Option 4: Use Directory Junctions (Fallback)
If symlinks fail, manually create junctions:

```cmd
mklink /J .claude\skills\skill-creator ..\..\agents\skills\skill-creator
mklink /J .claude\skills\scaffold-workspace ..\..\agents\skills\scaffold-workspace
mklink /J .claude\skills\upgrade-workspace ..\..\agents\skills\upgrade-workspace
mklink /J .claude\skills\plan-creator ..\..\agents\skills\plan-creator
```

## Adding New Skills

When creating a new skill in `agents/skills/`, add a symlink:

```bash
# From project root
cd .claude/skills
ln -s ../../agents/skills/your-new-skill your-new-skill
```

Or use the scaffold/upgrade skills which create symlinks automatically.

## Troubleshooting

### "Symlinks not working"

**Check if symlinks are enabled:**
```bash
git config --get core.symlinks
# Should return: true
```

**Enable if needed:**
```bash
git config core.symlinks true
```

### "Skills not detected by Claude"

**1. Verify setting enabled:**
- Check VS Code settings: `"chat.useClaudeSkills": true`

**2. Restart VS Code:**
- Sometimes requires restart to detect new skills

**3. Check symlink validity:**
```bash
ls -la .claude/skills/skill-creator/SKILL.md
# Should show file contents, not "No such file"
```

### "Permission denied"

**macOS/Linux:**
Symlinks should work by default.

**Windows:**
Requires Developer Mode or Admin privileges. See Windows Support section above.

## Benefits of Symlink Approach

1. **Single Source of Truth** - Skills defined once in `agents/skills/`
2. **Claude Auto-Detection** - Works seamlessly with Claude Code
3. **Version Control** - Symlinks committed to git (portable)
4. **No Duplication** - No need to copy files
5. **Easy Maintenance** - Update skill once, visible everywhere

## Related Documentation

- [agents/skills/README.md](../../agents/skills/README.md) - Complete skills documentation
- [agents/skills/TESTING.md](../../agents/skills/TESTING.md) - Testing guide
- [Anthropic Skills Specification](../../agents/skills/skill-creator/references/anthropic-spec.md) - Official standard

## Learn More

- [Claude Code Documentation](https://claude.ai/docs) - Official Claude Code guide
- [Anthropic Skills Blog Post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - Background on Agent Skills

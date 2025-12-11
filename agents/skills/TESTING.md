# Testing Guide

Comprehensive testing documentation for scaffold-workflow and upgrade-workflow skills.

## Overview

Both skills include dry-run test scripts that validate functionality without modifying your actual project files. These tests are essential for:

- **Pre-deployment validation** - Ensure skills work before using in production
- **Development testing** - Validate changes when modifying skill logic
- **Documentation examples** - See what the skills actually do
- **Debugging** - Understand behavior without side effects

## Quick Start

### Test Scaffold Workflow

```bash
cd agents/skills/scaffold-workflow
npm test
```

This validates:
- ✅ Directory structure creation
- ✅ Template file generation
- ✅ Symlink creation for Claude Skills
- ✅ Error handling for existing directories
- ✅ Project metadata detection

### Test Upgrade Workflow

```bash
cd agents/skills/upgrade-workflow
npm test
```

This validates:
- ✅ Old structure detection
- ✅ Migration plan generation
- ✅ File movement logic (git mv)
- ✅ Reference updates across files
- ✅ Legacy file handling
- ✅ Migration report creation

## Test Details

### Scaffold Test (test-scaffold.js)

**What it does:**
1. Creates a temporary test directory
2. Simulates scaffold process in dry-run mode
3. Shows what directories and files would be created
4. Tests error handling for existing agents/ directory
5. Validates project metadata detection from package.json

**Output:**
```
🧪 Testing scaffold-workflow (dry-run mode)

📦 Test 1: Clean directory scaffold
  ✓ Would create directories:
    - agents/
    - agents/reference/
    - agents/plans/
    - agents/plans/local/
    - agents/personas/
    - agents/skills/
    - agents/legacy/
    - .claude/skills/

  ✓ Would create files:
    - AGENTS.md
    - CLAUDE.md
    - agents/README.md
    - ... (full list)

  ✓ Would create symlinks:
    - .claude/skills/skill-creator → ../../agents/skills/skill-creator
    - ... (full list)

📦 Test 2: Existing agents/ directory (should fail)
  ✓ Would detect existing agents/ directory
  ✓ Would suggest: Use upgrade-workflow skill instead

📦 Test 3: Project metadata detection
  ✓ Would detect project name: test-scaffold-project
  ✓ Would use creation date: 2025-12-10
  ✓ Would replace template variables

✅ All scaffold-workflow tests passed!
```

**Custom test directory:**
```bash
npm test -- /tmp/my-custom-test-dir
```

### Upgrade Test (test-upgrade.js)

**What it does:**
1. Creates old framework structure for testing
2. Detects what needs to be migrated
3. Generates migration plan
4. Shows what references would be updated
5. Demonstrates legacy file handling
6. Displays sample migration report

**Output:**
```
🧪 Testing upgrade-workflow (dry-run mode)

🔧 Setup: Creating old framework structure
  ✓ Created old structure:
    - agents/tools/
    - agents/tasks/
    - agents/plans-local/

📦 Test 1: Structure detection
  ✓ Would detect old structure:
    - agents/tools/ exists (should be agents/skills/)
    - agents/tasks/tasks.md exists (should be agents/plans/tasks.md)
    - agents/plans-local/ exists (should be agents/plans/local/)

📦 Test 2: Migration plan generation
  ✓ Would generate migration plan:
    1. agents/tools/ → agents/skills/
       Method: git mv
       Reason: Align with Anthropic Agent Skills terminology
    ... (full plan)

📦 Test 3: Reference updates
  ✓ Would update references in files:
    - agents/reference/guide.md (2 changes)
    - agents/tasks/tasks.md (1 change)
  ✓ Would update 4 references across 3 files

📦 Test 4: Legacy file handling
  ✓ Would move unmapped files to legacy/
  ✓ Would create agents/legacy/MIGRATION.md with:
    - Migration timestamp
    - Files moved (old → new paths)
    - Rollback instructions

✅ All upgrade-workflow tests passed!
```

**Custom test directory:**
```bash
npm test -- /tmp/my-upgrade-test-dir
```

## Test Architecture

### Scaffold Test Flow

```
test-scaffold.js
├── Test 1: Clean scaffold
│   ├── Create temp directory
│   ├── Add package.json
│   └── Validate expected structure
├── Test 2: Existing agents/ dir
│   ├── Create agents/ directory
│   └── Validate error handling
└── Test 3: Metadata detection
    ├── Read package.json
    └── Validate template variables
```

### Upgrade Test Flow

```
test-upgrade.js
├── Setup: Create old structure
│   ├── agents/tools/
│   ├── agents/tasks/
│   └── agents/plans-local/
├── Test 1: Structure detection
│   └── Identify migration needs
├── Test 2: Migration plan
│   └── Generate file movements
├── Test 3: Reference updates
│   └── Show path replacements
└── Test 4: Legacy handling
    └── Unmapped file processing
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Test Skills
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install scaffold dependencies
        working-directory: agents/skills/scaffold-workflow
        run: npm install
      
      - name: Test scaffold-workflow
        working-directory: agents/skills/scaffold-workflow
        run: npm test
      
      - name: Install upgrade dependencies
        working-directory: agents/skills/upgrade-workflow
        run: npm install
      
      - name: Test upgrade-workflow
        working-directory: agents/skills/upgrade-workflow
        run: npm test
```

## Cleanup

Test scripts create temporary directories. To clean up:

```bash
# Clean all test directories
rm -rf /tmp/test-scaffold-*
rm -rf /tmp/test-upgrade-*

# Or use specific directory from test output
rm -rf /tmp/test-scaffold-1702234567890
```

## Extending Tests

### Adding New Test Cases

**Scaffold tests** (`test-scaffold.js`):
1. Add new test function following existing pattern
2. Call from `runTests()` function
3. Use `console.log(chalk.green('✓ ...'))` for success
4. Use `chalk.gray()` for details

**Upgrade tests** (`test-upgrade.js`):
1. Add to `setupOldStructure()` for new old patterns
2. Create new test function for validation
3. Follow existing pattern for output formatting

### Example: Add New Scaffold Test

```javascript
async function testGitIgnoreCreation(testDir) {
  console.log(chalk.bold('\n📦 Test 4: .gitignore creation'));
  
  const expectedPatterns = [
    'agents/plans/local/',
    '!agents/plans/local/.gitkeep'
  ];
  
  console.log(chalk.green('  ✓ Would add to .gitignore:'));
  expectedPatterns.forEach(pattern => 
    console.log(chalk.gray(`    - ${pattern}`))
  );
  
  console.log(chalk.green('\n  ✓ Test 4 passed'));
}

// Add to runTests()
await testGitIgnoreCreation(testDir);
```

## Troubleshooting

### Test Fails: "Module not found"

**Cause**: Dependencies not installed

**Solution**:
```bash
cd agents/skills/scaffold-workflow  # or upgrade-workflow
npm install
```

### Test Shows Actual File Creation

**Cause**: Running actual script instead of test

**Solution**: Use `npm test`, not `npm run scaffold` or `npm run upgrade`

### Permission Denied

**Cause**: Test script not executable

**Solution**:
```bash
chmod +x agents/skills/*/scripts/test-*.js
```

## Related Documentation

- [scaffold-workflow/SKILL.md](../scaffold-workflow/SKILL.md) - Full scaffold documentation
- [upgrade-workflow/SKILL.md](../upgrade-workflow/SKILL.md) - Full upgrade documentation
- [skill-creator/SKILL.md](../skill-creator/SKILL.md) - Creating new skills

## Validation

After running tests, validate the skills themselves:

```bash
# Validate scaffold skill
cd agents/skills/skill-creator
npm run validate ../scaffold-workflow

# Validate upgrade skill
npm run validate ../upgrade-workflow
```

## Next Steps

1. **Run tests locally** - Validate both skills work
2. **Review output** - Understand what each skill does
3. **Add to CI/CD** - Automate testing in your pipeline
4. **Extend tests** - Add project-specific test cases
5. **Document findings** - Update skill documentation with learnings

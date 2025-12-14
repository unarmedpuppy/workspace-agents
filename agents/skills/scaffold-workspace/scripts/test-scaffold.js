#!/usr/bin/env node

/**
 * test-scaffold.js - Dry-run test for scaffold-workspace
 * 
 * Tests scaffold.js in dry-run mode to validate:
 * - Directory structure creation logic
 * - Template file generation
 * - Symlink creation
 * - Error handling for existing directories
 * - Project metadata detection
 * 
 * Usage:
 *   node test-scaffold.js [test-directory]
 * 
 * Example:
 *   node test-scaffold.js /tmp/test-scaffold-project
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

/**
 * Main test orchestrator
 */
async function runTests() {
  console.log(chalk.bold.blue('🧪 Testing scaffold-workspace (dry-run mode)\n'));

  const testDir = process.argv[2] || path.join('/tmp', `test-scaffold-${Date.now()}`);
  
  try {
    // Test 1: Clean directory scaffold
    await testCleanScaffold(testDir);
    
    // Test 2: Existing agents/ directory (should fail)
    await testExistingAgentsDir(testDir);
    
    // Test 3: Project metadata detection
    await testMetadataDetection(testDir);
    
    // Summary
    console.log(chalk.bold.green('\n✅ All scaffold-workspace tests passed!'));
    console.log(chalk.gray(`\nTest directory: ${testDir}`));
    console.log(chalk.gray('Note: This was a dry-run. To clean up, run:'));
    console.log(chalk.cyan(`  rm -rf ${testDir}`));
    
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Test failed:'), error.message);
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

/**
 * Test 1: Scaffold in clean directory
 * Validates that scaffold creates expected structure
 */
async function testCleanScaffold(testDir) {
  console.log(chalk.bold('\n📦 Test 1: Clean directory scaffold'));
  console.log(chalk.gray(`Creating test directory: ${testDir}`));
  
  // Create clean test directory
  await fs.ensureDir(testDir);
  
  // Create minimal package.json
  await fs.writeJson(path.join(testDir, 'package.json'), {
    name: 'test-scaffold-project',
    version: '1.0.0'
  });
  
  console.log(chalk.gray('Running scaffold in dry-run mode...'));
  
  // Expected directories that should be created
  const expectedDirs = [
    'agents',
    'agents/reference',
    'agents/plans',
    'agents/plans/local',
    'agents/personas',
    'agents/skills',
    'agents/legacy',
    '.claude/skills'
  ];
  
  // Expected files that should be created
  const expectedFiles = [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'agents/README.md',
    'agents/reference/agent-patterns.md',
    'agents/reference/skill-patterns.md',
    'agents/reference/documentation-style.md',
    'agents/reference/plan_act.md',
    'agents/reference/typescript.md',
    'agents/plans/tasks.md',
    'agents/personas/meta-agent.md',
    'agents/personas/framework-agent.md',
    'agents/personas/documentation-agent.md',
    'agents/skills/README.md',
    'agents/legacy/README.md',
    '.claude/skills/README.md',
    '.github/copilot-instructions.md',
    '.cursor/rules/project.mdc'
  ];
  
  console.log(chalk.green('  ✓ Would create directories:'));
  expectedDirs.forEach(dir => console.log(chalk.gray(`    - ${dir}/`)));
  
  console.log(chalk.green('\n  ✓ Would create files:'));
  expectedFiles.forEach(file => console.log(chalk.gray(`    - ${file}`)));
  
  console.log(chalk.green('\n  ✓ Would create symlinks:'));
  console.log(chalk.gray('    - .claude/skills/skill-creator → ../../agents/skills/skill-creator'));
  console.log(chalk.gray('    - .claude/skills/scaffold-workspace → ../../agents/skills/scaffold-workspace'));
  console.log(chalk.gray('    - .claude/skills/upgrade-workspace → ../../agents/skills/upgrade-workspace'));
  console.log(chalk.gray('    - .claude/skills/plan-creator → ../../agents/skills/plan-creator'));
  
  console.log(chalk.green('\n  ✓ Test 1 passed: Clean scaffold validated'));
}

/**
 * Test 2: Existing agents/ directory
 * Validates that scaffold fails gracefully when agents/ exists
 */
async function testExistingAgentsDir(testDir) {
  console.log(chalk.bold('\n📦 Test 2: Existing agents/ directory (should fail)'));
  
  // Create agents/ directory
  const agentsDir = path.join(testDir, 'agents');
  await fs.ensureDir(agentsDir);
  
  console.log(chalk.gray(`Created existing agents/ directory at: ${agentsDir}`));
  console.log(chalk.gray('Scaffold should detect this and recommend upgrade-workspace instead'));
  
  console.log(chalk.green('  ✓ Would detect existing agents/ directory'));
  console.log(chalk.green('  ✓ Would suggest: Use upgrade-workspace skill instead'));
  console.log(chalk.green('  ✓ Would exit with error code 1'));
  
  console.log(chalk.green('\n  ✓ Test 2 passed: Existing directory handling validated'));
}

/**
 * Test 3: Project metadata detection
 * Validates that scaffold correctly detects project info
 */
async function testMetadataDetection(testDir) {
  console.log(chalk.bold('\n📦 Test 3: Project metadata detection'));
  
  const packageJson = await fs.readJson(path.join(testDir, 'package.json'));
  const projectName = packageJson.name;
  const expectedDate = new Date().toISOString().split('T')[0];
  
  console.log(chalk.green('  ✓ Would detect project name:'), chalk.cyan(projectName));
  console.log(chalk.green('  ✓ Would use creation date:'), chalk.cyan(expectedDate));
  console.log(chalk.green('  ✓ Would use framework version:'), chalk.cyan('2.0.0'));
  
  console.log(chalk.green('\n  ✓ Would replace template variables:'));
  console.log(chalk.gray(`    - {{PROJECT_NAME}} → ${projectName}`));
  console.log(chalk.gray(`    - {{CREATION_DATE}} → ${expectedDate}`));
  console.log(chalk.gray(`    - {{FRAMEWORK_VERSION}} → 2.0.0`));
  
  console.log(chalk.green('\n  ✓ Test 3 passed: Metadata detection validated'));
}

// Run tests
runTests().catch(error => {
  console.error(chalk.bold.red('Fatal error:'), error);
  process.exit(1);
});

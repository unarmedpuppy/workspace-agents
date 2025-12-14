#!/usr/bin/env node

/**
 * create-structure.js - Creates the complete directory structure for the framework
 * 
 * Creates all required directories and updates .gitignore to exclude ephemeral content
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Directory structure to create
 * Each entry is relative to project root
 */
const DIRECTORIES = [
  'agents',
  'agents/reference',
  'agents/plans',
  'agents/plans/local',
  'agents/personas',
  'agents/skills',
  'agents/legacy',
  '.github',
  '.cursor/rules',
  '.claude/skills'
];

/**
 * Directories that should have .gitkeep files
 * (to ensure empty directories are tracked in git)
 */
const GITKEEP_DIRS = [
  'agents/legacy',
  'agents/skills'
];

/**
 * .gitignore patterns to add for ephemeral content
 */
const GITIGNORE_PATTERNS = [
  '# ContextForge - ephemeral plans',
  'agents/plans/local/*',
  '!agents/plans/local/.gitkeep',
  ''
];

/**
 * Create all directories in the structure
 * @param {string} projectRoot - Root directory of the project
 */
async function createDirectories(projectRoot) {
  for (const dir of DIRECTORIES) {
    const dirPath = path.join(projectRoot, dir);
    await fs.ensureDir(dirPath);
    console.log(chalk.gray(`   Created: ${dir}/`));
  }
}

/**
 * Add .gitkeep files to specified directories
 * @param {string} projectRoot - Root directory of the project
 */
async function addGitkeepFiles(projectRoot) {
  for (const dir of GITKEEP_DIRS) {
    const gitkeepPath = path.join(projectRoot, dir, '.gitkeep');
    await fs.writeFile(gitkeepPath, '');
    console.log(chalk.gray(`   Created: ${dir}/.gitkeep`));
  }

  // Special case: plans/local/.gitkeep to track the directory
  const localGitkeepPath = path.join(projectRoot, 'agents/plans/local', '.gitkeep');
  await fs.writeFile(localGitkeepPath, '');
  console.log(chalk.gray(`   Created: agents/plans/local/.gitkeep`));
}

/**
 * Update .gitignore with framework-specific patterns
 * @param {string} projectRoot - Root directory of the project
 */
async function updateGitignore(projectRoot) {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  let existingContent = '';

  // Read existing .gitignore if it exists
  if (await fs.pathExists(gitignorePath)) {
    existingContent = await fs.readFile(gitignorePath, 'utf-8');
  }

  // Check if our patterns are already present
  if (existingContent.includes('agents/plans/local/*')) {
    console.log(chalk.gray('   .gitignore already contains framework patterns'));
    return;
  }

  // Append our patterns
  const newContent = existingContent
    ? existingContent.trimEnd() + '\n\n' + GITIGNORE_PATTERNS.join('\n')
    : GITIGNORE_PATTERNS.join('\n');

  await fs.writeFile(gitignorePath, newContent);
  console.log(chalk.gray('   Updated: .gitignore'));
}

/**
 * Main function to create the complete directory structure
 * @param {string} projectRoot - Root directory of the project
 */
async function createStructure(projectRoot) {
  await createDirectories(projectRoot);
  await addGitkeepFiles(projectRoot);
  await updateGitignore(projectRoot);
}

// Allow direct execution for testing
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  createStructure(projectRoot)
    .then(() => console.log(chalk.green('✓ Structure created successfully')))
    .catch(error => {
      console.error(chalk.red('Error creating structure:'), error);
      process.exit(1);
    });
}

module.exports = createStructure;

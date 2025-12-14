#!/usr/bin/env node

/**
 * scaffold.js - Main entry point for scaffold-workspace skill
 * 
 * Orchestrates the complete framework scaffolding process:
 * 1. Validates preconditions (no existing agents/ directory)
 * 2. Detects project information (name, etc.)
 * 3. Creates directory structure
 * 4. Generates files from templates
 * 5. Creates symlinks for Claude Skills integration
 * 6. Prints success message with next steps
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const createStructure = require('./create-structure');
const createFiles = require('./create-files');
const createSymlinks = require('./create-symlinks');

/**
 * Detect project information from package.json or directory name
 * @param {string} projectRoot - Root directory of the project
 * @returns {object} Project metadata
 */
function detectProjectInfo(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const projectName = path.basename(projectRoot);
  const creationDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const frameworkVersion = '2.0.0'; // From this framework's version

  let detectedName = projectName;

  // Try to read from package.json
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = fs.readJsonSync(packageJsonPath);
      if (packageJson.name) {
        detectedName = packageJson.name;
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Could not read package.json: ${error.message}`));
    }
  }

  return {
    projectName: detectedName,
    creationDate,
    frameworkVersion
  };
}

/**
 * Main scaffold function
 * @param {string} projectRoot - Root directory where to scaffold (defaults to cwd)
 */
async function scaffold(projectRoot = process.cwd()) {
  console.log(chalk.blue.bold('\n🚀 Scaffolding ContextForge\n'));

  // Step 1: Check if agents/ directory already exists
  const agentsDir = path.join(projectRoot, 'agents');
  if (fs.existsSync(agentsDir)) {
    console.error(chalk.red('❌ Error: agents/ directory already exists!'));
    console.error(chalk.yellow('   Use the upgrade-workspace skill to migrate an existing structure.'));
    console.error(chalk.yellow('   Or remove the existing agents/ directory first.'));
    process.exit(1);
  }

  // Step 2: Detect project information
  console.log(chalk.cyan('📋 Detecting project information...'));
  const projectInfo = detectProjectInfo(projectRoot);
  console.log(chalk.green(`   Project: ${projectInfo.projectName}`));
  console.log(chalk.green(`   Date: ${projectInfo.creationDate}`));
  console.log(chalk.green(`   Framework Version: ${projectInfo.frameworkVersion}`));

  try {
    // Step 3: Create directory structure
    console.log(chalk.cyan('\n📁 Creating directory structure...'));
    await createStructure(projectRoot);
    console.log(chalk.green('   ✓ Directory structure created'));

    // Step 4: Create files from templates
    console.log(chalk.cyan('\n📄 Generating files from templates...'));
    await createFiles(projectRoot, projectInfo);
    console.log(chalk.green('   ✓ Files generated'));

    // Step 5: Create symlinks
    console.log(chalk.cyan('\n🔗 Creating symlinks for Claude Skills...'));
    await createSymlinks(projectRoot);
    console.log(chalk.green('   ✓ Symlinks created'));

    // Step 6: Success message
    console.log(chalk.green.bold('\n✅ Framework scaffolding complete!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white('  1. Review AGENTS.md - the universal agent entrypoint'));
    console.log(chalk.white('  2. Review README.md and update project-specific content'));
    console.log(chalk.white('  3. Initialize git if not already done: git init'));
    console.log(chalk.white('  4. Commit the framework: git add . && git commit -m "chore: add agent workflow framework"'));
    console.log(chalk.white('  5. (Optional) Enable Claude Skills in VS Code: chat.useClaudeSkills = true'));
    console.log(chalk.white('\n📚 Documentation:'));
    console.log(chalk.white('  - AGENTS.md: Start here'));
    console.log(chalk.white('  - agents/README.md: Directory guide'));
    console.log(chalk.white('  - agents/reference/: Deep-dive documentation'));
    console.log(chalk.white('  - .claude/skills/: Claude Skills auto-detection\n'));

  } catch (error) {
    console.error(chalk.red.bold('\n❌ Scaffolding failed!\n'));
    console.error(chalk.red(`Error: ${error.message}`));
    console.error(chalk.yellow('\nStack trace:'));
    console.error(error.stack);
    process.exit(1);
  }
}

// Run scaffold if called directly
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  scaffold(projectRoot).catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

module.exports = scaffold;

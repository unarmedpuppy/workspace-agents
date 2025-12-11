#!/usr/bin/env node

/**
 * auto-setup.js - Auto-detection script for scaffold vs upgrade
 * 
 * Detects project state and automatically routes to the appropriate skill:
 * - No agents/ directory → Run scaffold-workflow
 * - Existing agents/ directory → Run upgrade-workflow
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Check if the project needs scaffolding or upgrading
 * @param {string} projectRoot - Root directory of the project
 * @returns {string} 'scaffold' or 'upgrade'
 */
function detectAction(projectRoot) {
  const agentsDir = path.join(projectRoot, 'agents');
  
  if (fs.existsSync(agentsDir)) {
    return 'upgrade';
  } else {
    return 'scaffold';
  }
}

/**
 * Main auto-setup function
 * @param {string} projectRoot - Root directory where to setup (defaults to cwd)
 */
async function autoSetup(projectRoot = process.cwd()) {
  console.log(chalk.blue.bold('\n🔍 Auto-detecting project state...\n'));

  const action = detectAction(projectRoot);

  if (action === 'scaffold') {
    console.log(chalk.green('✓ No existing agents/ directory detected'));
    console.log(chalk.cyan('→ Running scaffold-workflow skill...\n'));
    
    try {
      const scaffold = require('./scaffold');
      await scaffold(projectRoot);
    } catch (error) {
      console.error(chalk.red('\n❌ Scaffold failed:'), error.message);
      console.error(chalk.yellow('\nYou can run scaffold manually:'));
      console.error(chalk.white('  node agents/skills/scaffold-workflow/scripts/scaffold.js'));
      process.exit(1);
    }
  } else {
    console.log(chalk.green('✓ Existing agents/ directory detected'));
    console.log(chalk.cyan('→ Running upgrade-workflow skill...\n'));
    
    // Try to require upgrade skill (may not exist yet)
    try {
      const upgradeSkillPath = path.join(
        path.dirname(__dirname),
        '..',
        'upgrade-workflow',
        'scripts',
        'upgrade.js'
      );
      
      if (fs.existsSync(upgradeSkillPath)) {
        const upgrade = require(upgradeSkillPath);
        await upgrade(projectRoot);
      } else {
        console.error(chalk.red('❌ upgrade-workflow skill not found!'));
        console.error(chalk.yellow('\nThe upgrade skill is not yet implemented.'));
        console.error(chalk.yellow('Expected location: agents/skills/upgrade-workflow/scripts/upgrade.js'));
        console.error(chalk.white('\nTo scaffold in a clean directory:'));
        console.error(chalk.white('  1. Move or backup existing agents/ directory'));
        console.error(chalk.white('  2. Run: node agents/skills/scaffold-workflow/scripts/scaffold.js'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Upgrade failed:'), error.message);
      console.error(chalk.yellow('\nYou can run upgrade manually when implemented:'));
      console.error(chalk.white('  node agents/skills/upgrade-workflow/scripts/upgrade.js'));
      process.exit(1);
    }
  }
}

// Run auto-setup if called directly
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  autoSetup(projectRoot).catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

module.exports = autoSetup;

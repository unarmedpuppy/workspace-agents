#!/usr/bin/env node

/**
 * create-symlinks.js - Creates symlinks for Claude Skills auto-detection
 * 
 * Creates symlinks from .claude/skills/ to agents/skills/ for each skill.
 * Handles both Unix (ln -s) and Windows (mklink /J) platforms.
 * 
 * Note: Symlinks are committed to git (not gitignored) for "just clone and go" UX.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Detect the current operating system
 * @returns {string} 'windows' or 'unix'
 */
function detectOS() {
  return process.platform === 'win32' ? 'windows' : 'unix';
}

/**
 * Create a symlink (cross-platform)
 * @param {string} target - Target path (what the symlink points to)
 * @param {string} linkPath - Symlink path (where to create the symlink)
 * @param {string} os - Operating system ('windows' or 'unix')
 */
async function createSymlink(target, linkPath, os) {
  // Ensure target exists
  if (!await fs.pathExists(target)) {
    console.warn(chalk.yellow(`   Warning: Target doesn't exist: ${target}`));
    return false;
  }

  // Remove existing symlink if present
  if (await fs.pathExists(linkPath)) {
    const stats = await fs.lstat(linkPath);
    if (stats.isSymbolicLink() || stats.isDirectory()) {
      await fs.remove(linkPath);
      console.log(chalk.gray(`   Removed existing: ${path.basename(linkPath)}`));
    }
  }

  try {
    if (os === 'windows') {
      // Windows: Use junction (mklink /J)
      // Note: Requires admin rights for true symlinks, junctions work without
      const targetAbs = path.resolve(target);
      const linkAbs = path.resolve(linkPath);
      execSync(`mklink /J "${linkAbs}" "${targetAbs}"`, { stdio: 'ignore' });
    } else {
      // Unix: Use symlink (ln -s)
      // Use relative path for portability
      const linkDir = path.dirname(linkPath);
      const relativePath = path.relative(linkDir, target);
      await fs.symlink(relativePath, linkPath, 'dir');
    }
    return true;
  } catch (error) {
    console.error(chalk.red(`   Error creating symlink: ${error.message}`));
    return false;
  }
}

/**
 * Get all skill directories from agents/skills/
 * @param {string} skillsDir - Path to agents/skills/ directory
 * @returns {Promise<string[]>} Array of skill names
 */
async function getSkillDirectories(skillsDir) {
  if (!await fs.pathExists(skillsDir)) {
    return [];
  }

  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name);
}

/**
 * Main function to create all symlinks
 * @param {string} projectRoot - Root directory of the project
 */
async function createSymlinks(projectRoot) {
  const os = detectOS();
  const skillsDir = path.join(projectRoot, 'agents', 'skills');
  const claudeSkillsDir = path.join(projectRoot, '.claude', 'skills');

  console.log(chalk.gray(`   Platform: ${os}`));

  // Ensure .claude/skills/ exists
  await fs.ensureDir(claudeSkillsDir);

  // Get all skills
  const skills = await getSkillDirectories(skillsDir);

  if (skills.length === 0) {
    console.log(chalk.gray('   No skills found in agents/skills/ (will create symlinks when skills are added)'));
    return;
  }

  let successCount = 0;
  let failCount = 0;

  // Create symlink for each skill
  for (const skillName of skills) {
    const targetPath = path.join(skillsDir, skillName);
    const linkPath = path.join(claudeSkillsDir, skillName);

    console.log(chalk.gray(`   Creating symlink: .claude/skills/${skillName} → agents/skills/${skillName}`));
    
    const success = await createSymlink(targetPath, linkPath, os);
    if (success) {
      successCount++;
      console.log(chalk.green(`   ✓ Linked: ${skillName}`));
    } else {
      failCount++;
    }
  }

  // Summary
  console.log(chalk.gray(`\n   Symlinks created: ${successCount}/${skills.length}`));
  
  if (failCount > 0) {
    console.log(chalk.yellow('\n   ⚠️  Some symlinks failed. Manual steps:'));
    if (os === 'windows') {
      console.log(chalk.white('   Windows users may need to:'));
      console.log(chalk.white('   1. Run as Administrator, or'));
      console.log(chalk.white('   2. Enable Developer Mode in Windows Settings, or'));
      console.log(chalk.white('   3. Configure git: git config core.symlinks true'));
      console.log(chalk.white('   4. Then manually create junctions:'));
      for (const skillName of skills) {
        const targetPath = path.join(skillsDir, skillName);
        const linkPath = path.join(claudeSkillsDir, skillName);
        console.log(chalk.gray(`      mklink /J "${linkPath}" "${targetPath}"`));
      }
    } else {
      console.log(chalk.white('   Unix/Mac: Manually create symlinks:'));
      for (const skillName of skills) {
        console.log(chalk.gray(`      ln -s ../../agents/skills/${skillName} .claude/skills/${skillName}`));
      }
    }
  }

  // Windows-specific instructions
  if (os === 'windows') {
    console.log(chalk.cyan('\n   📝 Note for Windows users:'));
    console.log(chalk.white('   To ensure symlinks work with git:'));
    console.log(chalk.white('   git config core.symlinks true'));
  }
}

// Allow direct execution for testing
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  createSymlinks(projectRoot)
    .then(() => console.log(chalk.green('\n✓ Symlinks processed')))
    .catch(error => {
      console.error(chalk.red('Error creating symlinks:'), error);
      process.exit(1);
    });
}

module.exports = createSymlinks;

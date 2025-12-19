const chalk = require('chalk');

/**
 * Format a file creation message
 * @param {string} filePath - Path to file
 * @returns {string}
 */
function formatFileCreate(filePath) {
  return `${chalk.green('CREATE')}      ${filePath}`;
}

/**
 * Format a file modification message with optional diff
 * @param {string} filePath - Path to file
 * @param {string} diff - Optional diff content
 * @returns {string}
 */
function formatFileModify(filePath, diff = null) {
  let output = `${chalk.yellow('MODIFY')}      ${filePath}`;
  if (diff) {
    const lines = diff.split('\n').map(line => {
      if (line.startsWith('-')) return chalk.red(`  ${line}`);
      if (line.startsWith('+')) return chalk.green(`  ${line}`);
      return `  ${line}`;
    });
    output += '\n' + lines.join('\n');
  }
  return output;
}

/**
 * Format a file move message
 * @param {string} from - Source path
 * @param {string} to - Destination path
 * @returns {string}
 */
function formatFileMove(from, to) {
  return `${chalk.blue('MOVE')}        ${from} ${chalk.gray('→')} ${to}`;
}

/**
 * Format a directory creation message
 * @param {string} dirPath - Directory path
 * @returns {string}
 */
function formatDirCreate(dirPath) {
  return `${chalk.green('CREATE DIR')}  ${dirPath}`;
}

/**
 * Format a symlink creation message
 * @param {string} link - Link path
 * @param {string} target - Target path
 * @returns {string}
 */
function formatSymlink(link, target) {
  return `${chalk.cyan('SYMLINK')}     ${link} ${chalk.gray('→')} ${target}`;
}

/**
 * Format a legacy file move message
 * @param {string} from - Source path
 * @param {string} to - Destination path
 * @returns {string}
 */
function formatLegacy(from, to) {
  return `${chalk.magenta('LEGACY')}      ${from} ${chalk.gray('→')} ${to}`;
}

/**
 * Format a gitignore append message
 * @param {string[]} lines - Lines being added
 * @returns {string}
 */
function formatGitignoreAppend(lines) {
  return `${chalk.gray('APPEND')}      .gitignore (${lines.join(', ')})`;
}

/**
 * Format a skill copy message
 * @param {string} skillName - Name of skill being copied
 * @returns {string}
 */
function formatSkillCopy(skillName) {
  return `${chalk.green('COPY SKILL')}  agents/skills/${skillName}`;
}

/**
 * Format a skill update message
 * @param {string} skillName - Name of skill being updated
 * @returns {string}
 */
function formatSkillUpdate(skillName) {
  return `${chalk.yellow('UPDATE SKILL')} agents/skills/${skillName}`;
}

/**
 * Format a symlink fix message
 * @param {string} link - Link path
 * @param {string} target - Target path
 * @param {string} reason - Reason for fix
 * @returns {string}
 */
function formatSymlinkFix(link, target, reason) {
  return `${chalk.yellow('FIX LINK')}    ${link} ${chalk.gray('→')} ${target} ${chalk.gray(`(${reason})`)}`;
}

/**
 * Format a skip message
 * @param {string} filePath - Path that was skipped
 * @param {string} reason - Reason for skipping
 * @returns {string}
 */
function formatSkip(filePath, reason) {
  return `${chalk.gray('SKIP')}        ${filePath} (${reason})`;
}

/**
 * Print all planned changes
 * @param {object} changes - Changes object from scaffold.plan() or upgrade.plan()
 */
function printChanges(changes) {
  const { type } = changes;

  if (type === 'scaffold') {
    console.log(chalk.bold(`\nScaffolding Workspace Agents...\n`));

    if (changes.directories?.length) {
      changes.directories.forEach(dir => console.log(formatDirCreate(dir)));
      console.log();
    }

    if (changes.files?.length) {
      changes.files.forEach(f => {
        if (f.action === 'create') {
          console.log(formatFileCreate(f.path));
        } else if (f.action === 'skip') {
          console.log(formatSkip(f.path, f.reason || 'already exists'));
        }
      });
      console.log();
    }

    if (changes.symlinks?.length) {
      changes.symlinks.forEach(s => console.log(formatSymlink(s.link, s.target)));
      console.log();
    }

    if (changes.gitignore?.length) {
      console.log(formatGitignoreAppend(changes.gitignore));
      console.log();
    }
  } else if (type === 'upgrade') {
    console.log(chalk.bold(`\nUpgrading Workspace Agents...\n`));

    if (changes.moves?.length) {
      changes.moves.forEach(m => console.log(formatFileMove(m.from, m.to)));
      console.log();
    }

    if (changes.modifications?.length) {
      changes.modifications.forEach(m => console.log(formatFileModify(m.path, m.diff)));
      console.log();
    }

    if (changes.creates?.length) {
      changes.creates.forEach(f => console.log(formatFileCreate(f.path)));
      console.log();
    }

    if (changes.skillsToCopy?.length) {
      changes.skillsToCopy.forEach(s => console.log(formatSkillCopy(s)));
      console.log();
    }

    if (changes.skillsToUpdate?.length) {
      changes.skillsToUpdate.forEach(s => console.log(formatSkillUpdate(s)));
      console.log();
    }

    if (changes.newFiles?.length) {
      changes.newFiles.forEach(f => console.log(formatFileCreate(f.path)));
      console.log();
    }

    if (changes.symlinks?.length) {
      changes.symlinks.forEach(s => console.log(formatSymlink(s.link, s.target)));
      console.log();
    }

    if (changes.symlinkFixes?.length) {
      changes.symlinkFixes.forEach(f => console.log(formatSymlinkFix(f.link, f.target, f.reason)));
      console.log();
    }

    if (changes.legacy?.length) {
      changes.legacy.forEach(l => console.log(formatLegacy(l.from, l.to)));
      console.log();
    }
  } else if (type === 'none') {
    console.log(chalk.green('\nFramework is already up to date. Nothing to do.\n'));
    return;
  }

  // Summary
  console.log(formatSummary(changes));
}

/**
 * Format summary line
 * @param {object} changes - Changes object
 * @returns {string}
 */
function formatSummary(changes) {
  const parts = [];

  if (changes.directories?.length) {
    parts.push(`${changes.directories.length} directories`);
  }
  if (changes.files?.filter(f => f.action === 'create').length) {
    parts.push(`${changes.files.filter(f => f.action === 'create').length} files`);
  }
  if (changes.moves?.length) {
    parts.push(`${changes.moves.length} moves`);
  }
  if (changes.modifications?.length) {
    parts.push(`${changes.modifications.length} modifications`);
  }
  if (changes.creates?.length) {
    parts.push(`${changes.creates.length} creates`);
  }
  if (changes.skillsToCopy?.length) {
    parts.push(`${changes.skillsToCopy.length} new skills`);
  }
  if (changes.skillsToUpdate?.length) {
    parts.push(`${changes.skillsToUpdate.length} skill updates`);
  }
  if (changes.newFiles?.length) {
    parts.push(`${changes.newFiles.length} new files`);
  }
  if (changes.symlinks?.length) {
    parts.push(`${changes.symlinks.length} symlinks`);
  }
  if (changes.symlinkFixes?.length) {
    parts.push(`${changes.symlinkFixes.length} symlink fixes`);
  }
  if (changes.legacy?.length) {
    parts.push(`${changes.legacy.length} legacy`);
  }

  if (parts.length === 0) {
    return chalk.gray('No changes to apply.');
  }

  return chalk.bold(`Summary: ${parts.join(', ')}`);
}

/**
 * Print success message after applying changes
 * @param {object} changes - Changes that were applied
 */
function printSuccess(changes) {
  if (changes.type === 'scaffold') {
    console.log(chalk.green.bold('\n✓ Workspace Agents scaffolded successfully!\n'));
    console.log(chalk.white('Next step:'));
    console.log(chalk.gray('  Open ') + chalk.cyan('agents/plans/getting-started.md') + chalk.gray(' and work through the plan.'));
    console.log(chalk.gray('  This will customize AGENTS.md and set up your workspace.\n'));
    console.log(chalk.gray('Optional: ') + chalk.gray('Run ') + chalk.cyan('npx workspace-agents') + chalk.gray(' periodically to update bundled skills.'));
  } else if (changes.type === 'upgrade') {
    console.log(chalk.green.bold('\n✓ Workspace Agents upgraded successfully!\n'));
    console.log(chalk.white('Changes applied. Review git diff for details.'));
  }
}

module.exports = {
  formatFileCreate,
  formatFileModify,
  formatFileMove,
  formatDirCreate,
  formatSymlink,
  formatSymlinkFix,
  formatSkillCopy,
  formatSkillUpdate,
  formatLegacy,
  formatGitignoreAppend,
  formatSkip,
  formatSummary,
  printChanges,
  printSuccess
};

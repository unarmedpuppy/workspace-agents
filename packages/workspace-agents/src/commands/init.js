const chalk = require('chalk');
const detector = require('../lib/project-detector');
const formatter = require('../lib/output-formatter');
const prompts = require('../lib/prompts');
const scaffold = require('../lib/scaffold');
const upgrade = require('../lib/upgrade');

/**
 * Init command - scaffolds new or upgrades existing framework
 * @param {object} options - Command options
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.yes - Skip confirmation prompts
 * @param {boolean} options.skipSymlinks - Skip symlink creation
 */
async function init(options = {}) {
  const projectRoot = process.cwd();
  const projectName = detector.detectProjectName(projectRoot);

  console.log(chalk.bold(`Project: ${projectName}`));

  // Determine action based on existing structure
  const { action, reason } = detector.determineAction(projectRoot);

  if (action === 'none') {
    console.log(chalk.green(`\n✓ ${reason}`));
    console.log(chalk.gray('Nothing to do.'));
    return;
  }

  console.log(chalk.gray(`Action: ${action} (${reason})`));

  // Compute changes (doesn't apply them yet)
  let changes;
  try {
    if (action === 'upgrade') {
      changes = await upgrade.plan(projectRoot, options);
    } else {
      changes = await scaffold.plan(projectRoot, options);
    }
  } catch (err) {
    console.error(chalk.red(`Error planning changes: ${err.message}`));
    process.exit(1);
  }

  // Show what will happen
  formatter.printChanges(changes);

  // If no changes, exit
  if (changes.type === 'none' ||
      (!changes.directories?.length &&
       !changes.files?.length &&
       !changes.symlinks?.length &&
       !changes.moves?.length &&
       !changes.modifications?.length &&
       !changes.creates?.length &&
       !changes.newFiles?.length &&
       !changes.skillsToCopy?.length &&
       !changes.skillsToUpdate?.length &&
       !changes.symlinkFixes?.length &&
       !changes.legacy?.length)) {
    console.log(chalk.green('\nNothing to do - framework is up to date.'));
    return;
  }

  // Confirm (unless -y/--yes)
  if (!options.yes) {
    console.log();
    const confirmed = await prompts.confirm('Apply these changes?');
    if (!confirmed) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
  }

  // Apply the changes
  try {
    if (action === 'upgrade') {
      await upgrade.apply(changes, projectRoot);
    } else {
      await scaffold.apply(changes, projectRoot);
    }
  } catch (err) {
    console.error(chalk.red(`Error applying changes: ${err.message}`));
    process.exit(1);
  }

  formatter.printSuccess(changes);
}

module.exports = init;

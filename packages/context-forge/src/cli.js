const { program } = require('commander');
const init = require('./commands/init');
const welcome = require('./lib/welcome-screen');
const pkg = require('../package.json');

program
  .name('workspace-agents')
  .description('Initialize AI agent workflow framework in any project')
  .version(pkg.version);

// Helper to add common options to a command
const addInitOptions = (cmd) => {
  return cmd
    .option('--force', 'Overwrite existing files')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('--skip-symlinks', 'Skip Claude Skills symlink creation')
    .action(init);
};

// Default action when no command provided - show welcome and prompt
program
  .action(async () => {
    await welcome.show();
    const prompts = require('./lib/prompts');
    const confirmed = await prompts.confirm('Continue with init in this directory?');
    if (confirmed) {
      await init({ yes: false });
    } else {
      console.log('Cancelled.');
    }
  });

// init command - scaffolds new or upgrades existing
addInitOptions(
  program
    .command('init')
    .description('Initialize framework (scaffolds new or upgrades existing)')
    .hook('preAction', async () => {
      await welcome.show();
    })
);

// update command - alias for init (semantic clarity)
addInitOptions(
  program
    .command('update')
    .description('Update existing framework to latest version')
    .hook('preAction', async () => {
      await welcome.show();
    })
);

program.parse();

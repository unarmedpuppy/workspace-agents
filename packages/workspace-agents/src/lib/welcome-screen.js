const chalk = require('chalk');
const versionChecker = require('./version-checker');

const ASCII_ART = `
  ██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗███████╗██████╗  █████╗  ██████╗███████╗
  ██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
  ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ ███████╗██████╔╝███████║██║     █████╗
  ██║███╗██║██║   ██║██╔══██╗██╔═██╗ ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝
  ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗███████║██║     ██║  ██║╚██████╗███████╗
   ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
                      █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
                     ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
                     ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
                     ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
                     ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║
                     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
`;

async function show() {
  console.log(chalk.cyan(ASCII_ART));

  // Check for updates
  const update = await versionChecker.check();
  if (update.available) {
    console.log(chalk.yellow.bold('┌───────────────────────────────────────────────────────┐'));
    console.log(chalk.yellow.bold(`│ Update available: ${update.current} → ${update.latest}`.padEnd(55) + '│'));
    console.log(chalk.yellow.bold('│ Run: npm install -g workspace-agents'.padEnd(55) + '│'));
    console.log(chalk.yellow.bold('└───────────────────────────────────────────────────────┘'));
    console.log();
  }

  // Tips section
  console.log(chalk.white('Tips for getting started:'));
  console.log(chalk.gray('1. Run ') + chalk.cyan('workspace-agents init') + chalk.gray(' to get started'));
  console.log(chalk.gray('2. Review the plan & accept/decline'));
  console.log(chalk.gray('3. ') + chalk.cyan('https://github.com/yourorg/workspace-agents') + chalk.gray(' for docs'));
  console.log();

  // Directory callout
  const cwd = process.cwd();
  const displayPath = cwd.length > 40 ? '...' + cwd.slice(-37) : cwd;
  console.log(chalk.yellow.bold('┌───────────────────────────────────────────────────────┐'));
  console.log(chalk.yellow(`│ You are in: ${displayPath}`.padEnd(55) + '│'));
  console.log(chalk.yellow.bold('└───────────────────────────────────────────────────────┘'));
  console.log();
}

module.exports = { show, ASCII_ART };

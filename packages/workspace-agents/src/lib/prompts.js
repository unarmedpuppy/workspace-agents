const readline = require('readline');

/**
 * Create readline interface
 * @returns {readline.Interface}
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Ask a yes/no confirmation question
 * @param {string} message - Question to ask
 * @param {boolean} defaultValue - Default value if user just presses enter
 * @returns {Promise<boolean>}
 */
function confirm(message, defaultValue = false) {
  return new Promise((resolve) => {
    const rl = createInterface();
    const hint = defaultValue ? '(Y/n)' : '(y/N)';

    rl.question(`${message} ${hint} `, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();

      if (normalized === '') {
        resolve(defaultValue);
      } else if (normalized === 'y' || normalized === 'yes') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Ask for text input
 * @param {string} message - Question to ask
 * @param {string} defaultValue - Default value
 * @returns {Promise<string>}
 */
function input(message, defaultValue = '') {
  return new Promise((resolve) => {
    const rl = createInterface();
    const hint = defaultValue ? ` (${defaultValue})` : '';

    rl.question(`${message}${hint}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Ask user to select from a list of options
 * @param {string} message - Question to ask
 * @param {string[]} options - List of options
 * @returns {Promise<number>} - Index of selected option
 */
function select(message, options) {
  return new Promise((resolve) => {
    const rl = createInterface();

    console.log(message);
    options.forEach((opt, i) => {
      console.log(`  ${i + 1}. ${opt}`);
    });

    rl.question('Enter number: ', (answer) => {
      rl.close();
      const num = parseInt(answer, 10);
      if (num >= 1 && num <= options.length) {
        resolve(num - 1);
      } else {
        resolve(0); // Default to first option
      }
    });
  });
}

module.exports = {
  confirm,
  input,
  select
};

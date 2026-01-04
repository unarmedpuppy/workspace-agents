const path = require('path');
const fs = require('fs-extra');

/**
 * Create directory recursively if it doesn't exist
 * @param {string} dirPath - Directory path
 * @returns {boolean} - true if created, false if already existed
 */
function ensureDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    return false;
  }
  fs.ensureDirSync(dirPath);
  return true;
}

/**
 * Write content to file, creating parent directories as needed
 * @param {string} filePath - File path
 * @param {string} content - File content
 * @param {object} options - Options
 * @param {boolean} options.skipIfExists - Don't overwrite existing files
 * @returns {boolean} - true if written, false if skipped
 */
function writeFile(filePath, content, options = {}) {
  if (options.skipIfExists && fs.existsSync(filePath)) {
    return false;
  }
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

/**
 * Check if file exists
 * @param {string} filePath - File path
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read JSON file
 * @param {string} filePath - File path
 * @returns {object|null}
 */
function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readJsonSync(filePath);
}

/**
 * Write JSON file
 * @param {string} filePath - File path
 * @param {object} data - Data to write
 */
function writeJson(filePath, data) {
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeJsonSync(filePath, data, { spaces: 2 });
}

/**
 * Read file content
 * @param {string} filePath - File path
 * @returns {string|null}
 */
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Append content to file (creates if doesn't exist)
 * @param {string} filePath - File path
 * @param {string} content - Content to append
 */
function appendFile(filePath, content) {
  fs.ensureDirSync(path.dirname(filePath));
  fs.appendFileSync(filePath, content, 'utf-8');
}

/**
 * Append lines to .gitignore if not already present
 * @param {string} root - Project root
 * @param {string[]} lines - Lines to add
 * @returns {string[]} - Lines that were added
 */
function appendGitignore(root, lines) {
  const gitignorePath = path.join(root, '.gitignore');
  let existing = '';

  if (fs.existsSync(gitignorePath)) {
    existing = fs.readFileSync(gitignorePath, 'utf-8');
  }

  const added = [];
  for (const line of lines) {
    if (!existing.includes(line)) {
      added.push(line);
    }
  }

  if (added.length > 0) {
    const toAppend = (existing.endsWith('\n') ? '' : '\n') +
      '# Workspace Agents\n' +
      added.join('\n') + '\n';
    appendFile(gitignorePath, toAppend);
  }

  return added;
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDir(src, dest) {
  fs.copySync(src, dest);
}

/**
 * Remove file or directory
 * @param {string} filePath - Path to remove
 */
function remove(filePath) {
  fs.removeSync(filePath);
}

module.exports = {
  ensureDir,
  writeFile,
  fileExists,
  readJson,
  writeJson,
  readFile,
  appendFile,
  appendGitignore,
  copyDir,
  remove
};

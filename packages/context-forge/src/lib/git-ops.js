const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Check if directory is a git repository
 * @param {string} dir - Directory path
 * @returns {boolean}
 */
function isGitRepo(dir) {
  try {
    execSync('git rev-parse --git-dir', {
      cwd: dir,
      stdio: 'pipe'
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if git working directory is clean
 * @param {string} dir - Directory path
 * @returns {boolean}
 */
function isGitClean(dir) {
  try {
    const output = execSync('git status --porcelain', {
      cwd: dir,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return output.trim() === '';
  } catch (e) {
    return true; // Not a git repo, consider "clean"
  }
}

/**
 * Move file with git history preservation
 * @param {string} from - Source path (relative to cwd)
 * @param {string} to - Destination path (relative to cwd)
 * @param {string} cwd - Working directory
 * @returns {boolean} - true if git mv succeeded, false if fell back to regular mv
 */
function gitMv(from, to, cwd) {
  // Ensure destination directory exists
  const destDir = path.dirname(path.join(cwd, to));
  fs.ensureDirSync(destDir);

  if (!isGitRepo(cwd)) {
    // Not a git repo, just move the file
    fs.moveSync(path.join(cwd, from), path.join(cwd, to));
    return false;
  }

  try {
    execSync(`git mv "${from}" "${to}"`, {
      cwd,
      stdio: 'pipe'
    });
    return true;
  } catch (e) {
    // git mv failed, try regular move (file might not be tracked)
    try {
      fs.moveSync(path.join(cwd, from), path.join(cwd, to));
      return false;
    } catch (moveError) {
      throw new Error(`Failed to move ${from} to ${to}: ${moveError.message}`);
    }
  }
}

/**
 * Get current branch name
 * @param {string} dir - Directory path
 * @returns {string|null}
 */
function getCurrentBranch(dir) {
  try {
    return execSync('git branch --show-current', {
      cwd: dir,
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
  } catch (e) {
    return null;
  }
}

/**
 * Check if file is tracked by git
 * @param {string} filePath - File path (relative to cwd)
 * @param {string} cwd - Working directory
 * @returns {boolean}
 */
function isTracked(filePath, cwd) {
  try {
    execSync(`git ls-files --error-unmatch "${filePath}"`, {
      cwd,
      stdio: 'pipe'
    });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  isGitRepo,
  isGitClean,
  gitMv,
  getCurrentBranch,
  isTracked
};

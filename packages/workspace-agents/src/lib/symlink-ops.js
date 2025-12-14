const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

/**
 * Check if symlinks are supported on this system
 * @returns {boolean}
 */
function isSymlinkSupported() {
  // On Windows, check if developer mode is enabled or running as admin
  if (process.platform === 'win32') {
    try {
      // Try to create a test symlink
      const testDir = path.join(require('os').tmpdir(), `symlink-test-${Date.now()}`);
      const testLink = path.join(testDir, 'test-link');
      const testTarget = path.join(testDir, 'test-target');

      fs.ensureDirSync(testDir);
      fs.writeFileSync(testTarget, 'test');

      try {
        fs.symlinkSync(testTarget, testLink);
        fs.removeSync(testDir);
        return true;
      } catch (e) {
        fs.removeSync(testDir);
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  // Unix-like systems always support symlinks
  return true;
}

/**
 * Check if git is configured to support symlinks
 * @param {string} dir - Directory to check
 * @returns {boolean}
 */
function isGitSymlinkEnabled(dir) {
  try {
    const output = execSync('git config --get core.symlinks', {
      cwd: dir,
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    return output !== 'false';
  } catch (e) {
    // Config not set, default depends on platform
    return process.platform !== 'win32';
  }
}

/**
 * Create a symlink (cross-platform)
 * @param {string} target - Target path (what the link points to)
 * @param {string} linkPath - Path where symlink will be created
 * @param {object} options
 * @param {boolean} options.force - Overwrite existing link
 * @returns {boolean} - true if created, false if skipped
 */
function createSymlink(target, linkPath, options = {}) {
  // Ensure parent directory exists
  fs.ensureDirSync(path.dirname(linkPath));

  // Check if link already exists
  if (fs.existsSync(linkPath)) {
    if (!options.force) {
      // Check if it's already pointing to correct target
      try {
        const existing = fs.readlinkSync(linkPath);
        if (existing === target) {
          return false; // Already correct
        }
      } catch (e) {
        // Not a symlink, might be a regular file/dir
      }
    }
    fs.removeSync(linkPath);
  }

  // Create the symlink
  // Use 'dir' type on Windows for directory symlinks
  const targetIsDir = fs.existsSync(target) && fs.statSync(target).isDirectory();
  const type = process.platform === 'win32' && targetIsDir ? 'dir' : 'file';

  try {
    fs.symlinkSync(target, linkPath, type);
    return true;
  } catch (e) {
    if (e.code === 'EPERM' && process.platform === 'win32') {
      console.warn(`Warning: Cannot create symlink ${linkPath} - requires admin or developer mode on Windows`);
      return false;
    }
    throw e;
  }
}

/**
 * Create multiple symlinks from a specification
 * @param {Array<{target: string, link: string}>} specs - Symlink specifications
 * @param {string} root - Root directory (links are relative to this)
 * @param {object} options
 * @returns {Array<{target: string, link: string, created: boolean}>}
 */
function createSymlinks(specs, root, options = {}) {
  const results = [];

  for (const spec of specs) {
    const linkPath = path.join(root, spec.link);
    const created = createSymlink(spec.target, linkPath, options);
    results.push({ ...spec, created });
  }

  return results;
}

/**
 * Validate symlinks - check for broken, stale, or incorrect links
 * @param {Array<{target: string, link: string}>} specs - Expected symlink specifications
 * @param {string} root - Root directory (links are relative to this)
 * @returns {Array<{link: string, status: 'valid'|'broken'|'missing'|'wrong_target', expected: string, actual: string|null}>}
 */
function validateSymlinks(specs, root) {
  const results = [];

  for (const spec of specs) {
    const linkPath = path.join(root, spec.link);
    const result = { link: spec.link, expected: spec.target, actual: null };

    if (!fs.existsSync(linkPath)) {
      // Check if it's a broken symlink (lstat will succeed but stat will fail)
      try {
        fs.lstatSync(linkPath);
        result.status = 'broken';
      } catch (e) {
        result.status = 'missing';
      }
    } else {
      try {
        const actualTarget = fs.readlinkSync(linkPath);
        result.actual = actualTarget;
        if (actualTarget === spec.target) {
          result.status = 'valid';
        } else {
          result.status = 'wrong_target';
        }
      } catch (e) {
        // Not a symlink - it's a regular file/directory
        result.status = 'wrong_target';
        result.actual = '(not a symlink)';
      }
    }

    results.push(result);
  }

  return results;
}

/**
 * Check if symlink target directory exists
 * @param {string} linkPath - Path where symlink is/will be
 * @param {string} target - Relative target path
 * @returns {boolean}
 */
function symlinkTargetExists(linkPath, target) {
  const resolvedTarget = path.resolve(path.dirname(linkPath), target);
  return fs.existsSync(resolvedTarget);
}

module.exports = {
  isSymlinkSupported,
  isGitSymlinkEnabled,
  createSymlink,
  createSymlinks,
  validateSymlinks,
  symlinkTargetExists
};

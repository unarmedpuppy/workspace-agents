const path = require('path');
const fs = require('fs-extra');
const templateEngine = require('./template-engine');
const fileOps = require('./file-ops');
const symlinkOps = require('./symlink-ops');
const detector = require('./project-detector');

/**
 * Plan scaffold operation - computes what changes will be made
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Options
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.skipSymlinks - Skip symlink creation
 * @returns {Promise<object>} - Changes object
 */
async function plan(projectRoot, options = {}) {
  const manifest = templateEngine.getManifest();
  const projectName = detector.detectProjectName(projectRoot);
  const variables = templateEngine.getDefaultVariables(projectName);

  const changes = {
    type: 'scaffold',
    directories: [],
    files: [],
    symlinks: [],
    gitignore: [],
    skillsToCopy: []
  };

  // Plan directories
  for (const dir of manifest.directories) {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) {
      changes.directories.push(dir);
    }
  }

  // Plan files
  for (const file of manifest.files) {
    const destPath = path.join(projectRoot, file.dest);
    const exists = fs.existsSync(destPath);

    if (exists && file.skipIfExists && !options.force) {
      changes.files.push({
        action: 'skip',
        path: file.dest,
        reason: 'already exists'
      });
    } else if (exists && !options.force) {
      changes.files.push({
        action: 'skip',
        path: file.dest,
        reason: 'already exists (use --force to overwrite)'
      });
    } else {
      changes.files.push({
        action: 'create',
        path: file.dest,
        template: file.template,
        variables
      });
    }
  }

  // Plan symlinks
  if (!options.skipSymlinks && symlinkOps.isSymlinkSupported()) {
    for (const link of manifest.symlinks) {
      const linkPath = path.join(projectRoot, link.link);
      if (!fs.existsSync(linkPath) || options.force) {
        changes.symlinks.push({
          target: link.target,
          link: link.link
        });
      }
    }
  }

  // Plan gitignore additions
  if (manifest.gitignoreAppend?.length) {
    const gitignorePath = path.join(projectRoot, '.gitignore');
    const existing = fs.existsSync(gitignorePath)
      ? fs.readFileSync(gitignorePath, 'utf-8')
      : '';

    for (const line of manifest.gitignoreAppend) {
      if (!existing.includes(line)) {
        changes.gitignore.push(line);
      }
    }
  }

  // Plan skills to copy
  if (manifest.skillsToCopy?.length) {
    changes.skillsToCopy = manifest.skillsToCopy;
  }

  return changes;
}

/**
 * Apply planned scaffold changes
 * @param {object} changes - Changes from plan()
 * @param {string} projectRoot - Project root directory
 */
async function apply(changes, projectRoot) {
  // Create directories
  for (const dir of changes.directories) {
    fileOps.ensureDir(path.join(projectRoot, dir));
  }

  // Create files
  for (const file of changes.files) {
    if (file.action === 'create') {
      const content = templateEngine.loadAndRender(file.template, file.variables);
      fileOps.writeFile(path.join(projectRoot, file.path), content);
    }
  }

  // Create symlinks
  for (const link of changes.symlinks) {
    symlinkOps.createSymlink(
      link.target,
      path.join(projectRoot, link.link),
      { force: true }
    );
  }

  // Append to gitignore
  if (changes.gitignore?.length) {
    fileOps.appendGitignore(projectRoot, changes.gitignore);
  }

  // Copy skills to project
  if (changes.skillsToCopy?.length) {
    await copySkillsToProject(changes.skillsToCopy, projectRoot);
  }
}

/**
 * Copy bundled skills to the project's agents/skills directory
 * @param {string[]} skillNames - Names of skills to copy
 * @param {string} projectRoot - Project root directory
 */
async function copySkillsToProject(skillNames, projectRoot) {
  const bundledSkillsDir = path.join(__dirname, '..', 'templates', 'skills');
  const destSkillsDir = path.join(projectRoot, 'agents', 'skills');

  // Ensure destination exists
  fileOps.ensureDir(destSkillsDir);

  for (const skillName of skillNames) {
    const srcSkill = path.join(bundledSkillsDir, skillName);
    const destSkill = path.join(destSkillsDir, skillName);

    // Only copy if source exists and destination doesn't (or is being scaffolded)
    if (fs.existsSync(srcSkill) && !fs.existsSync(destSkill)) {
      fileOps.copyDir(srcSkill, destSkill);
    }
  }
}

module.exports = { plan, apply };

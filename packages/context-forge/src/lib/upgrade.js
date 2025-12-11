const path = require('path');
const fs = require('fs-extra');
const detector = require('./project-detector');
const fileOps = require('./file-ops');
const gitOps = require('./git-ops');
const symlinkOps = require('./symlink-ops');
const templateEngine = require('./template-engine');

/**
 * Known migration mappings from old to new structure
 */
const MIGRATIONS = {
  directories: [
    { from: 'agents/tools', to: 'agents/skills' },
    { from: 'plans-local', to: 'agents/plans/local' },
    { from: 'tasks', to: 'agents/plans' }
  ],
  terminology: [
    { from: /agents\/tools/g, to: 'agents/skills' },
    { from: /`tools\/`/g, to: '`skills/`' },
    { from: /tools\//g, to: 'skills/' },
    { from: /plans-local/g, to: 'agents/plans/local' }
  ]
};

/**
 * Plan upgrade operation - computes what changes will be made
 * @param {string} projectRoot - Project root directory
 * @param {object} options - Options
 * @returns {Promise<object>} - Changes object
 */
async function plan(projectRoot, options = {}) {
  const analysis = detector.analyzeStructure(projectRoot);

  const changes = {
    type: 'upgrade',
    moves: [],
    modifications: [],
    creates: [],
    symlinks: [],
    legacy: []
  };

  // Plan directory moves
  for (const migration of MIGRATIONS.directories) {
    const fromPath = path.join(projectRoot, migration.from);
    const toPath = path.join(projectRoot, migration.to);

    if (fs.existsSync(fromPath) && !fs.existsSync(toPath)) {
      changes.moves.push({
        from: migration.from,
        to: migration.to
      });
    }
  }

  // Plan file content modifications (terminology updates)
  const filesToUpdate = ['AGENTS.md', 'agents/README.md', 'README.md'];
  for (const file of filesToUpdate) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const updates = [];

      for (const term of MIGRATIONS.terminology) {
        if (term.from.test ? term.from.test(content) : content.includes(term.from)) {
          updates.push({
            from: term.from.toString(),
            to: term.to
          });
        }
      }

      if (updates.length > 0) {
        const diff = updates.map(u => `- ${u.from}\n+ ${u.to}`).join('\n');
        changes.modifications.push({
          path: file,
          diff,
          updates
        });
      }
    }
  }

  // Plan new files that should be created
  const manifest = templateEngine.getManifest();
  const projectName = detector.detectProjectName(projectRoot);
  const variables = templateEngine.getDefaultVariables(projectName);

  // Check for missing files that should exist
  const criticalFiles = [
    '.claude/skills/README.md',
    '.cursor/rules/project.mdc',
    '.github/copilot-instructions.md'
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) {
      const manifestFile = manifest.files.find(f => f.dest === file);
      if (manifestFile) {
        changes.creates.push({
          path: file,
          template: manifestFile.template,
          variables
        });
      }
    }
  }

  // Ensure directories exist for creates
  for (const create of changes.creates) {
    const dir = path.dirname(create.path);
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) {
      // Add to moves as a create (will be handled by ensureDir)
      changes.creates.unshift({ path: dir + '/', isDir: true });
    }
  }

  // Plan symlinks
  if (!options.skipSymlinks && symlinkOps.isSymlinkSupported()) {
    for (const link of manifest.symlinks) {
      const linkPath = path.join(projectRoot, link.link);
      if (!fs.existsSync(linkPath)) {
        changes.symlinks.push({
          target: link.target,
          link: link.link
        });
      }
    }
  }

  // Plan legacy file handling - files that don't map to new structure
  const legacyPatterns = await findLegacyFiles(projectRoot, analysis);
  for (const file of legacyPatterns) {
    const destPath = `agents/legacy/${path.basename(file)}`;
    if (!fs.existsSync(path.join(projectRoot, destPath))) {
      changes.legacy.push({
        from: file,
        to: destPath
      });
    }
  }

  return changes;
}

/**
 * Find files that should be moved to legacy
 * @param {string} projectRoot - Project root
 * @param {object} analysis - Structure analysis
 * @returns {Promise<string[]>}
 */
async function findLegacyFiles(projectRoot, analysis) {
  const legacyFiles = [];

  // Look for old-style files in root that might need migration
  const oldPatterns = [
    'CONTRIBUTING.md', // If it exists and references old structure
    'DEVELOPMENT.md'   // Old development docs
  ];

  for (const pattern of oldPatterns) {
    const filePath = path.join(projectRoot, pattern);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Check if it references old structure
      if (content.includes('agents/tools') || content.includes('plans-local')) {
        legacyFiles.push(pattern);
      }
    }
  }

  return legacyFiles;
}

/**
 * Apply planned upgrade changes
 * @param {object} changes - Changes from plan()
 * @param {string} projectRoot - Project root directory
 */
async function apply(changes, projectRoot) {
  const isGit = gitOps.isGitRepo(projectRoot);

  // Execute moves (with git history preservation)
  for (const move of changes.moves) {
    const fromPath = path.join(projectRoot, move.from);
    const toPath = path.join(projectRoot, move.to);

    // Ensure destination parent exists
    fileOps.ensureDir(path.dirname(toPath));

    if (isGit) {
      gitOps.gitMv(move.from, move.to, projectRoot);
    } else {
      fs.moveSync(fromPath, toPath);
    }
  }

  // Apply file modifications
  for (const mod of changes.modifications) {
    const filePath = path.join(projectRoot, mod.path);
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const term of MIGRATIONS.terminology) {
      content = content.replace(term.from, term.to);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  // Create new files
  for (const create of changes.creates) {
    if (create.isDir) {
      fileOps.ensureDir(path.join(projectRoot, create.path.replace(/\/$/, '')));
    } else {
      const content = templateEngine.loadAndRender(create.template, create.variables);
      fileOps.writeFile(path.join(projectRoot, create.path), content);
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

  // Move legacy files
  for (const legacy of changes.legacy) {
    const fromPath = path.join(projectRoot, legacy.from);
    const toPath = path.join(projectRoot, legacy.to);

    fileOps.ensureDir(path.dirname(toPath));

    if (isGit) {
      gitOps.gitMv(legacy.from, legacy.to, projectRoot);
    } else {
      fs.moveSync(fromPath, toPath);
    }
  }
}

module.exports = { plan, apply, MIGRATIONS };

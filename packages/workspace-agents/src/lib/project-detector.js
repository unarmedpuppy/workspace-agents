const path = require('path');
const fs = require('fs-extra');
const templateEngine = require('./template-engine');
const symlinkOps = require('./symlink-ops');

/**
 * Extract project name from package.json or directory name
 * @param {string} root - Project root directory
 * @returns {string}
 */
function detectProjectName(root) {
  const pkgPath = path.join(root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath);
      if (pkg.name) return pkg.name;
    } catch (e) {
      // Fall through to directory name
    }
  }
  return path.basename(root);
}

/**
 * Check if project has existing ContextForge framework
 * @param {string} root - Project root directory
 * @returns {boolean}
 */
function detectExistingFramework(root) {
  // Check for key indicators of existing framework
  const indicators = [
    path.join(root, 'agents'),
    path.join(root, 'AGENTS.md')
  ];

  return indicators.some(p => fs.existsSync(p));
}

/**
 * Get framework version from existing installation
 * @param {string} root - Project root directory
 * @returns {string|null}
 */
function getFrameworkVersion(root) {
  // Look for version marker in AGENTS.md or agents/README.md
  const agentsMd = path.join(root, 'AGENTS.md');
  if (fs.existsSync(agentsMd)) {
    try {
      const content = fs.readFileSync(agentsMd, 'utf-8');
      // Look for version comment: <!-- ContextForge v1.0.0 -->
      const match = content.match(/<!-- ContextForge v([\d.]+) -->/);
      if (match) return match[1];
    } catch (e) {
      // Ignore read errors
    }
  }
  return null;
}

/**
 * Analyze existing framework structure for upgrade needs
 * @param {string} root - Project root directory
 * @returns {{needsUpgrade: boolean, hasOldStructure: boolean, skillsOutOfSync: boolean, brokenSymlinks: boolean, missingFiles: boolean, details: object}}
 */
function analyzeStructure(root) {
  const details = {
    hasAgents: fs.existsSync(path.join(root, 'agents')),
    hasAgentsMd: fs.existsSync(path.join(root, 'AGENTS.md')),
    hasTools: fs.existsSync(path.join(root, 'agents', 'tools')),
    hasSkills: fs.existsSync(path.join(root, 'agents', 'skills')),
    hasPlansLocal: fs.existsSync(path.join(root, 'agents', 'plans', 'local')),
    hasOldPlansLocal: fs.existsSync(path.join(root, 'plans-local')),
    hasClaudeSkills: fs.existsSync(path.join(root, '.claude', 'skills')),
    hasLegacy: fs.existsSync(path.join(root, 'agents', 'legacy')),
    missingSkills: [],
    brokenSymlinksList: [],
    missingFiles: []
  };

  // Old structure indicators
  const hasOldStructure = details.hasTools || details.hasOldPlansLocal;

  // Check for missing bundled skills
  let skillsOutOfSync = false;
  let brokenSymlinks = false;
  let missingFiles = false;

  if (details.hasAgents) {
    const manifest = templateEngine.getManifest();
    const bundledSkillsDir = path.join(__dirname, '..', 'templates', 'skills');

    // Check if any bundled skills are missing from project
    if (details.hasSkills && manifest.skillsToCopy?.length && fs.existsSync(bundledSkillsDir)) {
      for (const skillName of manifest.skillsToCopy) {
        const projectSkillPath = path.join(root, 'agents', 'skills', skillName);
        const bundledSkillPath = path.join(bundledSkillsDir, skillName);

        if (fs.existsSync(bundledSkillPath) && !fs.existsSync(projectSkillPath)) {
          details.missingSkills.push(skillName);
          skillsOutOfSync = true;
        }
      }
    }

    // Check symlink health
    if (manifest.symlinks?.length && symlinkOps.isSymlinkSupported()) {
      const symlinkResults = symlinkOps.validateSymlinks(manifest.symlinks, root);
      for (const result of symlinkResults) {
        if (result.status === 'broken' || result.status === 'missing' || result.status === 'wrong_target') {
          details.brokenSymlinksList.push(result);
          brokenSymlinks = true;
        }
      }
    }

    // Check for missing template files (personas, plans, reference docs)
    // Only check files within agents/ directory to avoid overwriting user's root files
    const filesToCheck = manifest.files.filter(f =>
      f.dest.startsWith('agents/') &&
      !f.dest.endsWith('README.md') // Don't flag README files as missing
    );

    for (const file of filesToCheck) {
      const filePath = path.join(root, file.dest);
      if (!fs.existsSync(filePath)) {
        details.missingFiles.push(file.dest);
        missingFiles = true;
      }
    }
  }

  // Needs upgrade if has old structure or missing new structure pieces or skills out of sync
  const needsUpgrade = hasOldStructure ||
    (details.hasAgents && (!details.hasSkills || !details.hasPlansLocal || !details.hasClaudeSkills)) ||
    skillsOutOfSync || brokenSymlinks || missingFiles;

  return { needsUpgrade, hasOldStructure, skillsOutOfSync, brokenSymlinks, missingFiles, details };
}

/**
 * Determine if project needs upgrade vs fresh scaffold
 * @param {string} root - Project root directory
 * @returns {{action: 'scaffold'|'upgrade'|'none', reason: string}}
 */
function determineAction(root) {
  if (!detectExistingFramework(root)) {
    return { action: 'scaffold', reason: 'No existing framework detected' };
  }

  const { needsUpgrade, hasOldStructure, skillsOutOfSync, brokenSymlinks, missingFiles, details } = analyzeStructure(root);

  if (needsUpgrade) {
    if (hasOldStructure) {
      return { action: 'upgrade', reason: 'Old framework structure detected' };
    }
    if (skillsOutOfSync) {
      const missing = details.missingSkills.join(', ');
      return { action: 'upgrade', reason: `New skills available: ${missing}` };
    }
    if (missingFiles) {
      const count = details.missingFiles.length;
      return { action: 'upgrade', reason: `${count} new template file${count > 1 ? 's' : ''} available` };
    }
    if (brokenSymlinks) {
      return { action: 'upgrade', reason: 'Broken or missing symlinks detected' };
    }
    return { action: 'upgrade', reason: 'Framework missing latest features' };
  }

  return { action: 'none', reason: 'Framework already up to date' };
}

module.exports = {
  detectProjectName,
  detectExistingFramework,
  getFrameworkVersion,
  analyzeStructure,
  determineAction
};

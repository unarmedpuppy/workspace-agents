const path = require('path');
const fs = require('fs-extra');

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
 * @returns {{needsUpgrade: boolean, hasOldStructure: boolean, details: object}}
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
    hasLegacy: fs.existsSync(path.join(root, 'agents', 'legacy'))
  };

  // Old structure indicators
  const hasOldStructure = details.hasTools || details.hasOldPlansLocal;

  // Needs upgrade if has old structure or missing new structure pieces
  const needsUpgrade = hasOldStructure ||
    (details.hasAgents && (!details.hasSkills || !details.hasPlansLocal || !details.hasClaudeSkills));

  return { needsUpgrade, hasOldStructure, details };
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

  const { needsUpgrade, hasOldStructure } = analyzeStructure(root);

  if (needsUpgrade) {
    if (hasOldStructure) {
      return { action: 'upgrade', reason: 'Old framework structure detected' };
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

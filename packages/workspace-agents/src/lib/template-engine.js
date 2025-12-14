const path = require('path');
const fs = require('fs-extra');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

/**
 * Replace template variables in content
 * @param {string} content - Template content with {{VAR}} placeholders
 * @param {object} variables - Key-value pairs for replacement
 * @returns {string}
 */
function renderTemplate(content, variables) {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, value);
  }
  return result;
}

/**
 * Load a template file from the bundled templates directory
 * @param {string} name - Template filename (e.g., 'AGENTS.md.template')
 * @returns {string}
 */
function loadTemplate(name) {
  const templatePath = path.join(TEMPLATES_DIR, name);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${name}`);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Load and render a template with variables
 * @param {string} name - Template filename
 * @param {object} variables - Variables to substitute
 * @returns {string}
 */
function loadAndRender(name, variables) {
  const content = loadTemplate(name);
  return renderTemplate(content, variables);
}

/**
 * Get the template manifest
 * @returns {object}
 */
function getManifest() {
  const manifestPath = path.join(TEMPLATES_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Template manifest not found');
  }
  return fs.readJsonSync(manifestPath);
}

/**
 * List all available templates
 * @returns {string[]}
 */
function listTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    return [];
  }
  return fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.template'));
}

/**
 * Get default template variables for a project
 * @param {string} projectName - Name of the project
 * @returns {object}
 */
function getDefaultVariables(projectName) {
  const pkg = require('../../package.json');
  return {
    PROJECT_NAME: projectName,
    CREATION_DATE: new Date().toISOString().split('T')[0],
    FRAMEWORK_VERSION: pkg.version
  };
}

module.exports = {
  renderTemplate,
  loadTemplate,
  loadAndRender,
  getManifest,
  listTemplates,
  getDefaultVariables,
  TEMPLATES_DIR
};

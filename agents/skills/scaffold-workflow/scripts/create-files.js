#!/usr/bin/env node

/**
 * create-files.js - Generates files from templates with variable substitution
 * 
 * Reads all template files, replaces variables, and writes them to the correct locations
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Template file mapping: { templateFile: targetPath }
 * Paths are relative to project root
 */
const FILE_MAPPINGS = {
  'AGENTS.md.template': 'AGENTS.md',
  'README.md.template': 'README.md',
  'CLAUDE.md.template': 'CLAUDE.md',
  'GEMINI.md.template': 'GEMINI.md',
  'project.mdc.template': '.cursor/rules/project.mdc',
  'copilot-instructions.md.template': '.github/copilot-instructions.md',
  'claude-skills-README.md.template': '.claude/skills/README.md',
  'agents-README.md.template': 'agents/README.md',
  'agent-patterns.md.template': 'agents/reference/agent-patterns.md',
  'documentation-style.md.template': 'agents/reference/documentation-style.md',
  'plan_act.md.template': 'agents/reference/plan_act.md',
  'skill-patterns.md.template': 'agents/reference/skill-patterns.md',
  'typescript.md.template': 'agents/reference/typescript.md',
  'tasks.md.template': 'agents/plans/tasks.md',
  'personas-README.md.template': 'agents/personas/README.md',
  'skills-README.md.template': 'agents/skills/README.md',
  'legacy-README.md.template': 'agents/legacy/README.md'
};

/**
 * Replace template variables in content
 * @param {string} content - Template content
 * @param {object} variables - Variable values to substitute
 * @returns {string} Content with variables replaced
 */
function replaceVariables(content, variables) {
  let result = content;
  
  // Replace all template variables
  result = result.replace(/\{\{PROJECT_NAME\}\}/g, variables.projectName);
  result = result.replace(/\{\{CREATION_DATE\}\}/g, variables.creationDate);
  result = result.replace(/\{\{FRAMEWORK_VERSION\}\}/g, variables.frameworkVersion);
  
  return result;
}

/**
 * Process a single template file
 * @param {string} templatePath - Path to template file
 * @param {string} targetPath - Path where file should be created
 * @param {object} variables - Variables for substitution
 * @param {boolean} skipExisting - Whether to skip if file already exists
 */
async function processTemplate(templatePath, targetPath, variables, skipExisting = true) {
  // Check if target already exists
  if (skipExisting && await fs.pathExists(targetPath)) {
    console.log(chalk.yellow(`   Skipped (exists): ${path.relative(process.cwd(), targetPath)}`));
    return;
  }

  // Read template
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  
  // Replace variables
  const processedContent = replaceVariables(templateContent, variables);
  
  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetPath));
  
  // Write file
  await fs.writeFile(targetPath, processedContent, 'utf-8');
  console.log(chalk.gray(`   Created: ${path.relative(process.cwd(), targetPath)}`));
}

/**
 * Main function to create all files from templates
 * @param {string} projectRoot - Root directory of the project
 * @param {object} projectInfo - Project metadata (projectName, creationDate, frameworkVersion)
 */
async function createFiles(projectRoot, projectInfo) {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  // Verify templates directory exists
  if (!await fs.pathExists(templatesDir)) {
    throw new Error(`Templates directory not found: ${templatesDir}`);
  }

  // Process each template
  for (const [templateFile, targetRelativePath] of Object.entries(FILE_MAPPINGS)) {
    const templatePath = path.join(templatesDir, templateFile);
    const targetPath = path.join(projectRoot, targetRelativePath);
    
    if (!await fs.pathExists(templatePath)) {
      console.warn(chalk.yellow(`   Warning: Template not found: ${templateFile}`));
      continue;
    }
    
    await processTemplate(templatePath, targetPath, projectInfo);
  }
}

// Allow direct execution for testing
if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  const projectInfo = {
    projectName: path.basename(projectRoot),
    creationDate: new Date().toISOString().split('T')[0],
    frameworkVersion: '2.0.0'
  };

  createFiles(projectRoot, projectInfo)
    .then(() => console.log(chalk.green('✓ Files created successfully')))
    .catch(error => {
      console.error(chalk.red('Error creating files:'), error);
      process.exit(1);
    });
}

module.exports = createFiles;

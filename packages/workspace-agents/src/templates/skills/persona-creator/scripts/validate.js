#!/usr/bin/env node

/**
 * validate.js - Validate a persona file
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');

/**
 * Extract YAML frontmatter from markdown
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Validate persona file
 */
function validatePersona(filepath) {
  const errors = [];
  const warnings = [];

  // Check file exists
  if (!fs.existsSync(filepath)) {
    errors.push(`File not found: ${filepath}`);
    return { errors, warnings };
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath);

  // Check naming convention
  if (!filename.endsWith('-agent.md')) {
    errors.push(`Filename must end with '-agent.md', got: ${filename}`);
  }

  // Check frontmatter
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    errors.push('Missing or invalid YAML frontmatter');
  } else {
    if (!frontmatter.name) {
      errors.push('Missing required field: name');
    } else if (!frontmatter.name.endsWith('-agent')) {
      errors.push(`Name must end with '-agent', got: ${frontmatter.name}`);
    }

    if (!frontmatter.description) {
      errors.push('Missing required field: description');
    }
  }

  // Check required sections
  const requiredSections = [
    { pattern: /## Key Files/i, name: 'Key Files' },
    { pattern: /## .* Requirements|### Critical Rules/i, name: 'Requirements/Critical Rules' },
    { pattern: /## When to Consult/i, name: 'When to Consult' }
  ];

  for (const section of requiredSections) {
    if (!section.pattern.test(content)) {
      warnings.push(`Missing recommended section: ${section.name}`);
    }
  }

  // Check expertise list
  if (!content.includes('Your expertise includes:')) {
    warnings.push('Missing expertise list');
  }

  // Check for placeholder text
  const placeholders = [
    '[Add relevant files]',
    '[Scenario 1]',
    '[Rule 1]',
    '[Add explanation]'
  ];

  for (const placeholder of placeholders) {
    if (content.includes(placeholder)) {
      warnings.push(`Contains placeholder text: ${placeholder}`);
    }
  }

  return { errors, warnings };
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.yellow('Usage: npm run validate <path/to/persona.md>'));
    process.exit(1);
  }

  const filepath = path.resolve(process.cwd(), args[0]);
  console.log(chalk.bold.blue(`\n🔍 Validating: ${path.basename(filepath)}\n`));

  const { errors, warnings } = validatePersona(filepath);

  if (errors.length > 0) {
    console.log(chalk.red.bold('Errors:'));
    errors.forEach(e => console.log(chalk.red(`  ✗ ${e}`)));
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold('\nWarnings:'));
    warnings.forEach(w => console.log(chalk.yellow(`  ⚠ ${w}`)));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green('✓ Persona is valid!'));
    process.exit(0);
  } else if (errors.length === 0) {
    console.log(chalk.yellow('\n⚠ Persona has warnings but is valid'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n✗ Persona validation failed'));
    process.exit(1);
  }
}

main();

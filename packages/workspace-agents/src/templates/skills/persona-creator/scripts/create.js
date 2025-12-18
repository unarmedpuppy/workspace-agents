#!/usr/bin/env node

/**
 * create.js - Create a new persona from template
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

const PERSONAS_DIR = path.resolve(process.cwd(), '../../..', 'personas');

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate persona content from answers
 */
function generatePersona(answers) {
  const { domain, description, expertise, keyFiles, rules, scenarios } = answers;

  const expertiseList = expertise
    .split(',')
    .map(e => e.trim())
    .filter(e => e)
    .map(e => `- ${e}`)
    .join('\n');

  const keyFilesList = keyFiles
    ? keyFiles
        .split(',')
        .map(f => f.trim())
        .filter(f => f)
        .map(f => `- \`${f}\``)
        .join('\n')
    : '- [Add relevant files]';

  const rulesList = rules
    ? rules
        .split(',')
        .map((r, i) => r.trim())
        .filter(r => r)
        .map((r, i) => `${i + 1}. **${r}**\n   - [Add explanation]`)
        .join('\n\n')
    : '1. **[Rule 1]**\n   - [Explanation]';

  const scenariosList = scenarios
    ? scenarios
        .split(',')
        .map(s => s.trim())
        .filter(s => s)
        .map(s => `- ${s}`)
        .join('\n')
    : '- [Scenario 1]\n- [Scenario 2]';

  const domainTitle = domain.charAt(0).toUpperCase() + domain.slice(1);

  return `---
name: ${domain}-agent
description: ${description}
---

You are the ${domainTitle} Agent. Your expertise includes:

${expertiseList}

## Key Files

${keyFilesList}

## ${domainTitle} Requirements

### Critical Rules

${rulesList}

### Common Patterns

[Add 2-3 common patterns for this domain]

### Anti-Patterns

[Add what to avoid]

## Quick Reference

\`\`\`bash
# Add common commands for this domain
\`\`\`

## When to Consult This Persona

Invoke this persona when:
${scenariosList}

## Related Resources

- [agents/reference/](../reference/) - Reference documentation

See [agents/](../) for complete documentation.
`;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.bold.blue('\n🎭 Persona Creator\n'));

  // Check if personas directory exists
  if (!fs.existsSync(PERSONAS_DIR)) {
    console.log(chalk.yellow('Creating personas directory...'));
    fs.ensureDirSync(PERSONAS_DIR);
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'domain',
      message: 'Domain name (e.g., testing, database, security):',
      validate: (input) => {
        if (!input.trim()) return 'Domain name is required';
        if (!/^[a-z][a-z0-9-]*$/.test(toKebabCase(input))) {
          return 'Domain must be kebab-case (e.g., api-design)';
        }
        return true;
      },
      filter: (input) => toKebabCase(input)
    },
    {
      type: 'input',
      name: 'description',
      message: 'Brief description (one line):',
      validate: (input) => input.trim() ? true : 'Description is required'
    },
    {
      type: 'input',
      name: 'expertise',
      message: 'Key expertise areas (comma-separated, 3-5):',
      validate: (input) => {
        const areas = input.split(',').filter(a => a.trim());
        if (areas.length < 1) return 'At least one expertise area is required';
        return true;
      }
    },
    {
      type: 'input',
      name: 'keyFiles',
      message: 'Key files this persona should know (comma-separated, optional):',
    },
    {
      type: 'input',
      name: 'rules',
      message: 'Critical rules (comma-separated, optional):',
    },
    {
      type: 'input',
      name: 'scenarios',
      message: 'When to consult scenarios (comma-separated, optional):',
    }
  ]);

  const filename = `${answers.domain}-agent.md`;
  const filepath = path.join(PERSONAS_DIR, filename);

  // Check if file already exists
  if (fs.existsSync(filepath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${filename} already exists. Overwrite?`,
        default: false
      }
    ]);
    if (!overwrite) {
      console.log(chalk.yellow('\nAborted.'));
      return;
    }
  }

  // Generate and write persona
  const content = generatePersona(answers);
  fs.writeFileSync(filepath, content, 'utf-8');

  console.log(chalk.green(`\n✓ Created: agents/personas/${filename}`));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('1. Edit the persona to add specific patterns and examples'));
  console.log(chalk.gray('2. Add links to relevant documentation'));
  console.log(chalk.gray('3. Test by asking an AI agent to use the persona'));
}

main().catch(console.error);

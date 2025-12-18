#!/usr/bin/env node

/**
 * Reference Validator - Check reference documentation completeness
 *
 * Usage: npm run validate path/to/reference.md
 *
 * Checks:
 * - Document structure follows template
 * - Headers are properly nested
 * - Code examples have language specified
 * - Length is under 500 lines
 */

const fs = require('fs');
const path = require('path');

const MAX_LINES = 500;

function validate(filePath) {
  const errors = [];
  const warnings = [];

  // Check file exists
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check line count
  if (lines.length > MAX_LINES) {
    warnings.push(`Document is ${lines.length} lines (max recommended: ${MAX_LINES}). Consider splitting.`);
  }

  // Check for H1 title
  const h1Match = content.match(/^# .+$/m);
  if (!h1Match) {
    errors.push('Missing H1 title at start of document');
  }

  // Check header hierarchy
  let lastLevel = 0;
  const headerRegex = /^(#{1,6}) .+$/gm;
  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const level = match[1].length;
    if (level > lastLevel + 1 && lastLevel !== 0) {
      warnings.push(`Header hierarchy skip: H${lastLevel} → H${level} (line ~${content.slice(0, match.index).split('\n').length})`);
    }
    lastLevel = level;
  }

  // Check code blocks have language
  const codeBlockRegex = /```(\w*)\n/g;
  let codeMatch;
  let lineNum = 1;
  while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
    lineNum = content.slice(0, codeMatch.index).split('\n').length;
    if (!codeMatch[1]) {
      warnings.push(`Code block without language specification (line ${lineNum})`);
    }
  }

  // Check for placeholder text
  const placeholderRegex = /\[.+\]/g;
  const placeholders = content.match(placeholderRegex) || [];
  const realPlaceholders = placeholders.filter(p =>
    !p.startsWith('[x]') &&
    !p.startsWith('[ ]') &&
    !p.match(/^\[.+\]\(/) // Not a markdown link
  );
  if (realPlaceholders.length > 0) {
    warnings.push(`Found ${realPlaceholders.length} placeholder(s) to fill in`);
  }

  // Check for required sections
  const requiredSections = ['## Overview', '## Best Practices'];
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      warnings.push(`Missing recommended section: ${section}`);
    }
  }

  // Check for broken relative links
  const linkRegex = /\[.+?\]\(([^)]+)\)/g;
  let linkMatch;
  const baseDir = path.dirname(filePath);
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const href = linkMatch[1];
    if (href.startsWith('..') || href.startsWith('./')) {
      const fullPath = path.resolve(baseDir, href);
      if (!fs.existsSync(fullPath)) {
        warnings.push(`Broken link: ${href}`);
      }
    }
  }

  // Output results
  console.log(`\nValidating: ${path.basename(filePath)}\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✓ Reference document is valid and complete\n');
    return 0;
  }

  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log(`  ✗ ${e}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('Warnings:');
    warnings.forEach(w => console.log(`  ⚠ ${w}`));
    console.log();
  }

  console.log(`Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`);

  return errors.length > 0 ? 1 : 2;
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: npm run validate <path/to/reference.md>');
  console.log('\nExample:');
  console.log('  npm run validate ../../reference/typescript.md');
  process.exit(1);
}

const filePath = path.resolve(args[0]);
const exitCode = validate(filePath);
process.exit(exitCode);

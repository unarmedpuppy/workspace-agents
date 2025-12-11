# Skill Development Patterns

Best practices for creating skill documentation and implementations.

## Skill Structure

### Standard Directory Layout

```
agents/skills/
└── <skill-name>/
    ├── SKILL.md         # Required: main documentation with YAML frontmatter
    ├── package.json     # Optional: dependency tracking and scripts
    ├── scripts/         # Optional: executable implementations
    │   ├── main.js      # Primary skill script
    │   ├── helper.js    # Supporting utilities
    │   └── README.md    # Optional: script documentation
    └── references/      # Optional: deep documentation (progressive disclosure)
```

### SKILL.md Format

```markdown
---
name: skill-name
description: One-line description of what the skill does and when to use it
---

# Skill Name

[Brief overview paragraph]

## Quick Reference

```bash
# Most common commands
command-1
command-2
command-3
```

## When to Use

- Scenario 1
- Scenario 2
- Scenario 3

## Installation

[How to set up the skill]

## Configuration

[How to configure the skill]

## Common Tasks

### Task 1: [Description]

```bash
# Step-by-step example
```

### Task 2: [Description]

```bash
# Step-by-step example
```

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| Error 1 | Cause | Fix |
| Error 2 | Cause | Fix |

## Advanced Usage

[Optional: complex scenarios]

## Related Skills

- [other-skill](../other-skill/) - [relationship]
```

## YAML Frontmatter

### Required Fields (Anthropic Standard)

```yaml
---
name: skill-name         # Kebab-case, matches directory name
description: Brief one-line description including when to use
---
```

### Optional Fields

```yaml
---
name: skill-name
description: Brief description including when to use
related_skills: [dependency-skill, similar-skill]
version: 1.0.0
author: @maintainer-id
updated: 2025-01-15
---
```

## Dependency Management

### package.json for Skills

Skills may include a package.json for dependencies and scripts (optional):

```json
{
  "name": "@agents/skill-name",
  "version": "1.0.0",
  "description": "Brief description for agent discovery",
  "type": "module",
  "dependencies": {
    "axios": "^1.6.0",
    "dotenv": "^16.0.0"
  },
  "scripts": {
    "execute": "node scripts/main.js",
    "test": "jest",
    "lint": "eslint scripts/"
  },
  "keywords": ["agent", "skill", "domain"]
}
```

### Installation Instructions

```markdown
## Installation

```bash
# Install skill dependencies
cd agents/skills/skill-name
npm install

# Run the skill
npm run execute
```
```

### scripts/ Directory

The `scripts/` directory contains executable implementations:

```
agents/skills/skill-name/
└── scripts/
    ├── main.js          # Primary entry point
    ├── helper.js        # Supporting utilities
    ├── config.js        # Configuration handling
    └── README.md        # Script documentation (optional)
```

**Example main.js**:

```javascript
#!/usr/bin/env node

/**
 * Main skill script
 * Description of what this script does
 * 
 * Usage: node scripts/main.js [options]
 */

const { helper } = require('./helper');

async function main() {
  // Skill implementation
  console.log('Skill executing...');
  const result = await helper();
  console.log('Result:', result);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
```

## Skill Categories

### 1. Development Skills

Skills for building and testing:

```yaml
---
name: jest-runner
description: Test execution and coverage reporting. Use when running tests, checking coverage, or debugging test failures.
related_skills: [typescript, linting]
---
```

### 2. Infrastructure Skills

Skills for deployment and operations:

```yaml
---
name: docker
description: Container builds and orchestration. Use when building images, running containers, or working with docker-compose.
related_skills: [kubernetes, ci-cd]
---
```

### 3. Integration Skills

Skills for external services:

```yaml
---
name: github-api
description: GitHub API interactions for automation. Use when creating issues, PRs, or managing repositories.
related_skills: [git, ci-cd]
---
```

### 4. Data Skills

Skills for databases and data processing:

```yaml
---
name: migrations
description: Database schema migrations. Use when creating migrations, running migrations, or performing rollbacks.
related_skills: [postgres, typeorm]
---
```

## Documentation Patterns

### Quick Reference First

Put the most common commands at the top:

```markdown
## Quick Reference

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## When to Use

Use this skill when:
- Starting local development
- Running test suite
- Creating production builds
```

### Task-Oriented Structure

Organize by what users want to accomplish:

```markdown
## Common Tasks

### Start Development Environment

1. Install dependencies: `npm install`
2. Copy environment: `cp .env.example .env`
3. Start server: `npm run dev`
4. Open browser: `http://localhost:3000`

### Deploy to Production

1. Build: `npm run build`
2. Test build: `npm run preview`
3. Deploy: `npm run deploy`
```

### Troubleshooting Table

Use tables for quick scanning:

```markdown
## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE: port 3000` | Port already in use | Kill process: `lsof -ti:3000 \| xargs kill` |
| `Module not found` | Missing dependency | Run `npm install` |
| `Permission denied` | File permissions | Run `chmod +x script.sh` |
```

## Example Implementations

### Include Runnable Scripts

```
agents/tools/api-client/
├── SKILL.md
├── package.json
└── scripts/
    ├── fetch.js         # Fetch data from API
    ├── upload.js        # Upload data to API
    └── auth.js          # Handle authentication
```

**scripts/fetch.js**:

```javascript
#!/usr/bin/env node

/**
 * Fetch data from API
 * Usage: node scripts/fetch.js <endpoint>
 */

const axios = require('axios');

async function fetchData(endpoint) {
  const response = await axios.get(`${process.env.API_URL}/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  });
  
  console.log('Data:', response.data);
  return response.data;
}

const endpoint = process.argv[2] || 'users';
fetchData(endpoint).catch(console.error);
```

## Tool Relationships

### Document Dependencies

```markdown
## Related Tools

### Dependencies (required)
- [git](../git/) - Version control operations
- [nodejs](../nodejs/) - Runtime environment

### Complementary (often used together)
- [docker](../docker/) - Containerized testing
- [ci-cd](../ci-cd/) - Automated workflows

### Alternatives
- [pnpm](../pnpm/) - Alternative package manager
```

### Cross-Reference in Tasks

```markdown
## Common Tasks

### Task: Deploy Application

1. Build the application (see [build-tools](../build-tools/SKILL.md))
2. Run tests (see [jest-runner](../jest-runner/SKILL.md))
3. Create container image (see [docker](../docker/SKILL.md))
4. Deploy to cluster (see [kubernetes](../kubernetes/SKILL.md))
```

## Configuration Schemas

### Provide Validation Schemas

**schemas/config.schema.json**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "API Client Configuration",
  "type": "object",
  "required": ["baseUrl"],
  "properties": {
    "baseUrl": {
      "type": "string",
      "format": "uri",
      "description": "Base URL for API requests"
    },
    "timeout": {
      "type": "number",
      "default": 5000,
      "description": "Request timeout in milliseconds"
    },
    "retries": {
      "type": "number",
      "default": 3,
      "description": "Number of retry attempts"
    }
  }
}
```

Reference in README:

```markdown
## Configuration

Configuration follows the JSON schema in `schemas/config.schema.json`.

**Example**:

```typescript
const config = {
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retries: 5
};
```
```

## Version Management

### Semantic Versioning

Track tool versions in frontmatter and package.json:

```yaml
---
name: api-client
version: 2.1.0
description: HTTP client for internal APIs
---
```

### Changelog Section

```markdown
## Changelog

### v2.1.0 (2025-01-15)
- Added automatic retry logic
- Improved error messages
- Updated dependencies

### v2.0.0 (2025-01-01)
- **Breaking**: Switched to async/await API
- Added TypeScript types
- Removed callback-based methods

### v1.2.0 (2024-12-15)
- Added request timeout configuration
- Fixed memory leak in connection pooling
```

## Testing Tools

### Provide Test Utilities

```
agents/tools/testing/
├── SKILL.md
├── package.json
└── scripts/
    ├── fixtures.js      # Test data generators
    ├── mocks.js         # Mock implementations
    └── assertions.js    # Custom assertions
```

**scripts/fixtures.js**:

```typescript
/**
 * Generates test user data
 * @param overrides - Partial user data to override defaults
 * @returns Complete user object for testing
 */
export const createTestUser = (overrides: Partial<User> = {}): User => {
  return {
    id: 'test-123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
};
```

## Performance Considerations

### Document Performance Characteristics

```markdown
## Performance

### Caching

This tool implements response caching with a 5-minute TTL.

```typescript
// Cache hit: ~5ms
// Cache miss: ~150ms
const data = await client.fetchData();
```

### Rate Limiting

API calls are rate-limited to 100 requests per minute.

```typescript
// Automatically handles rate limiting
for (const item of items) {
  await client.processItem(item); // Throttled internally
}
```

### Batch Operations

For bulk operations, use batch endpoints:

```typescript
// Bad: Individual requests (slow)
for (const user of users) {
  await client.updateUser(user);
}

// Good: Batch request (fast)
await client.updateUsers(users);
```
```

## Security Considerations

### Document Security Practices

```markdown
## Security

### API Keys

Store API keys in environment variables:

```bash
# .env
API_KEY=your-secret-key-here
```

**Never commit `.env` files to version control.**

### Request Signing

Requests are signed using HMAC-SHA256:

```typescript
const signature = createHmac('sha256', apiSecret)
  .update(requestBody)
  .digest('hex');
```

### TLS/SSL

All requests use HTTPS. Certificate validation is enabled by default.
```

## Tool Discovery

### Optimize for Agent Discovery

Agents should be able to:

1. **Find tools** - Via AGENTS.md or agents/README.md
2. **Understand purpose** - Via YAML frontmatter description
3. **Know when to use** - Via `when_to_use` field
4. **See quick examples** - Via Quick Reference section
5. **Deep dive** - Via full SKILL.md content

**Discovery flow**:

```
Agent needs database migrations
  → Reads AGENTS.md, sees link to agents/tools/
  → Scans YAML frontmatter of tools
  → Finds "migrations" with when_to_use: "Creating migrations, running migrations"
  → Loads full SKILL.md for migrations tool
  → Executes migration using Quick Reference examples
```

## Maintenance Checklist

When creating or updating tool documentation:

- [ ] YAML frontmatter is complete and accurate
- [ ] Quick Reference section exists with common commands
- [ ] When to Use section lists specific scenarios
- [ ] Installation instructions are clear
- [ ] Configuration options are documented
- [ ] Common tasks have step-by-step examples
- [ ] Troubleshooting table covers common errors
- [ ] Related tools are cross-referenced
- [ ] Scripts are runnable and tested
- [ ] package.json includes all dependencies
- [ ] scripts/ directory contains implementations
- [ ] Version number is current
- [ ] Security considerations are documented
- [ ] Performance characteristics are noted

## Anti-Patterns

### ❌ Tool Documentation Without Examples

```markdown
<!-- Bad -->
# Database Tool

This tool manages database operations.
```

```markdown
<!-- Good -->
# Database Tool

## Quick Reference

```bash
# Run migrations
npm run execute -- migrate

# Rollback last migration
npm run execute -- rollback
```

## Scripts

- `scripts/migrate.js` - Run pending migrations
- `scripts/rollback.js` - Rollback last migration
```
```

### ❌ Unclear When to Use

```markdown
<!-- Bad -->
when_to_use: Database stuff
```

```markdown
<!-- Good -->
when_to_use: Creating migrations, running migrations, rollback, seeding data
```

### ❌ Missing Frontmatter

```markdown
<!-- Bad -->
# My Tool

[Documentation without YAML frontmatter]
```

```markdown
<!-- Good -->
---
name: my-tool
description: Clear one-line description
when_to_use: Specific use cases
---

# My Tool
```

### ❌ Incomplete Troubleshooting

```markdown
<!-- Bad -->
## Troubleshooting

If it doesn't work, check the logs.
```

```markdown
<!-- Good -->
## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | Service not running | Start: `npm run dev` |
| `Auth failed` | Invalid API key | Check `.env` file |
```

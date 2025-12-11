const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const scaffold = require('../src/lib/scaffold');
const upgrade = require('../src/lib/upgrade');

describe('init command', () => {
  let tempDir;

  beforeEach(async () => {
    // Create a unique temp directory for each test
    tempDir = path.join(os.tmpdir(), `context-forge-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.remove(tempDir);
  });

  describe('scaffold.plan', () => {
    it('should plan scaffold for empty project', async () => {
      // Create minimal package.json
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });

      const changes = await scaffold.plan(tempDir, {});

      expect(changes.type).toBe('scaffold');
      expect(changes.directories).toContain('agents');
      expect(changes.directories).toContain('agents/skills');
      expect(changes.files.some(f => f.path === 'AGENTS.md')).toBe(true);
    });

    it('should skip existing files without --force', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });
      await fs.writeFile(path.join(tempDir, 'AGENTS.md'), '# Existing');

      const changes = await scaffold.plan(tempDir, {});

      const agentsMd = changes.files.find(f => f.path === 'AGENTS.md');
      expect(agentsMd.action).toBe('skip');
    });

    it('should include symlinks when supported', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });

      const changes = await scaffold.plan(tempDir, {});

      // Symlinks should be planned (though may not be created on all systems)
      expect(changes.symlinks.length).toBeGreaterThan(0);
    });

    it('should skip symlinks with --skip-symlinks', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });

      const changes = await scaffold.plan(tempDir, { skipSymlinks: true });

      expect(changes.symlinks.length).toBe(0);
    });
  });

  describe('scaffold.apply', () => {
    it('should create planned directories and files', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });

      const changes = await scaffold.plan(tempDir, { skipSymlinks: true });
      await scaffold.apply(changes, tempDir);

      // Check directories exist
      expect(fs.existsSync(path.join(tempDir, 'agents'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'agents/skills'))).toBe(true);

      // Check files exist
      expect(fs.existsSync(path.join(tempDir, 'AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'CLAUDE.md'))).toBe(true);
    });

    it('should render template variables', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'my-awesome-project' });

      const changes = await scaffold.plan(tempDir, { skipSymlinks: true });
      await scaffold.apply(changes, tempDir);

      const agentsMd = await fs.readFile(path.join(tempDir, 'AGENTS.md'), 'utf-8');
      expect(agentsMd).toContain('my-awesome-project');
    });
  });

  describe('upgrade.plan', () => {
    it('should plan moves for old structure', async () => {
      // Create old structure
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });
      await fs.ensureDir(path.join(tempDir, 'agents/tools'));
      await fs.writeFile(path.join(tempDir, 'agents/tools/.gitkeep'), '');
      await fs.writeFile(path.join(tempDir, 'AGENTS.md'), '# Test\n\nSee agents/tools/');

      const changes = await upgrade.plan(tempDir, {});

      expect(changes.type).toBe('upgrade');
      expect(changes.moves.some(m => m.from === 'agents/tools' && m.to === 'agents/skills')).toBe(true);
    });

    it('should plan terminology updates', async () => {
      await fs.writeJson(path.join(tempDir, 'package.json'), { name: 'test-project' });
      await fs.ensureDir(path.join(tempDir, 'agents'));
      await fs.writeFile(path.join(tempDir, 'AGENTS.md'), 'See agents/tools/ for info');

      const changes = await upgrade.plan(tempDir, {});

      expect(changes.modifications.some(m => m.path === 'AGENTS.md')).toBe(true);
    });
  });
});

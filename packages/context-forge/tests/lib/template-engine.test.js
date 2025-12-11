const templateEngine = require('../../src/lib/template-engine');

describe('template-engine', () => {
  describe('renderTemplate', () => {
    it('should replace single variable', () => {
      const result = templateEngine.renderTemplate('Hello {{NAME}}!', { NAME: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should replace multiple variables', () => {
      const result = templateEngine.renderTemplate(
        '{{PROJECT}} created on {{DATE}}',
        { PROJECT: 'Test', DATE: '2025-01-01' }
      );
      expect(result).toBe('Test created on 2025-01-01');
    });

    it('should replace repeated variables', () => {
      const result = templateEngine.renderTemplate(
        '{{A}} and {{A}} again',
        { A: 'test' }
      );
      expect(result).toBe('test and test again');
    });

    it('should leave unmatched variables', () => {
      const result = templateEngine.renderTemplate('{{KNOWN}} and {{UNKNOWN}}', { KNOWN: 'yes' });
      expect(result).toBe('yes and {{UNKNOWN}}');
    });
  });

  describe('getManifest', () => {
    it('should load manifest.json', () => {
      const manifest = templateEngine.getManifest();
      expect(manifest).toHaveProperty('directories');
      expect(manifest).toHaveProperty('files');
      expect(manifest).toHaveProperty('symlinks');
    });

    it('should have required directories', () => {
      const manifest = templateEngine.getManifest();
      expect(manifest.directories).toContain('agents');
      expect(manifest.directories).toContain('agents/skills');
      expect(manifest.directories).toContain('.claude/skills');
    });
  });

  describe('listTemplates', () => {
    it('should list available templates', () => {
      const templates = templateEngine.listTemplates();
      expect(templates).toContain('AGENTS.md.template');
      expect(templates).toContain('CLAUDE.md.template');
    });
  });

  describe('getDefaultVariables', () => {
    it('should include required variables', () => {
      const vars = templateEngine.getDefaultVariables('my-project');
      expect(vars.PROJECT_NAME).toBe('my-project');
      expect(vars.CREATION_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(vars.FRAMEWORK_VERSION).toBeDefined();
    });
  });
});

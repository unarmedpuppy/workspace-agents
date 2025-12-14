const formatter = require('../../src/lib/output-formatter');

// Mock chalk to return plain strings for testing
jest.mock('chalk', () => ({
  green: jest.fn(s => s),
  yellow: jest.fn(s => s),
  blue: jest.fn(s => s),
  cyan: jest.fn(s => s),
  magenta: jest.fn(s => s),
  gray: jest.fn(s => s),
  red: jest.fn(s => s),
  white: jest.fn(s => s),
  bold: jest.fn(s => s)
}));

describe('output-formatter', () => {
  describe('formatFileCreate', () => {
    it('should format create message', () => {
      const result = formatter.formatFileCreate('agents/README.md');
      expect(result).toContain('CREATE');
      expect(result).toContain('agents/README.md');
    });
  });

  describe('formatFileMove', () => {
    it('should format move message with arrow', () => {
      const result = formatter.formatFileMove('agents/tools', 'agents/skills');
      expect(result).toContain('MOVE');
      expect(result).toContain('agents/tools');
      expect(result).toContain('agents/skills');
    });
  });

  describe('formatDirCreate', () => {
    it('should format directory create message', () => {
      const result = formatter.formatDirCreate('agents/skills/');
      expect(result).toContain('CREATE DIR');
      expect(result).toContain('agents/skills/');
    });
  });

  describe('formatSymlink', () => {
    it('should format symlink message', () => {
      const result = formatter.formatSymlink('.claude/skills/test', '../../agents/skills/test');
      expect(result).toContain('SYMLINK');
      expect(result).toContain('.claude/skills/test');
    });
  });

  describe('formatSummary', () => {
    it('should summarize scaffold changes', () => {
      const changes = {
        type: 'scaffold',
        directories: ['a/', 'b/'],
        files: [{ action: 'create' }, { action: 'create' }],
        symlinks: [{}]
      };
      const result = formatter.formatSummary(changes);
      expect(result).toContain('2 directories');
      expect(result).toContain('2 files');
      expect(result).toContain('1 symlinks');
    });

    it('should handle empty changes', () => {
      const changes = { type: 'scaffold' };
      const result = formatter.formatSummary(changes);
      expect(result).toContain('No changes');
    });
  });
});

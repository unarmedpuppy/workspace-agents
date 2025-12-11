const path = require('path');
const detector = require('../../src/lib/project-detector');

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');

describe('project-detector', () => {
  describe('detectProjectName', () => {
    it('should detect name from package.json', () => {
      const name = detector.detectProjectName(path.join(FIXTURES_DIR, 'empty-project'));
      expect(name).toBe('test-empty-project');
    });

    it('should fall back to directory name', () => {
      const name = detector.detectProjectName(FIXTURES_DIR);
      expect(name).toBe('fixtures');
    });
  });

  describe('detectExistingFramework', () => {
    it('should detect existing framework with agents/', () => {
      const has = detector.detectExistingFramework(path.join(FIXTURES_DIR, 'old-framework'));
      expect(has).toBe(true);
    });

    it('should detect existing framework with AGENTS.md', () => {
      const has = detector.detectExistingFramework(path.join(FIXTURES_DIR, 'current-framework'));
      expect(has).toBe(true);
    });

    it('should return false for empty project', () => {
      const has = detector.detectExistingFramework(path.join(FIXTURES_DIR, 'empty-project'));
      expect(has).toBe(false);
    });
  });

  describe('analyzeStructure', () => {
    it('should detect old structure with agents/tools', () => {
      const analysis = detector.analyzeStructure(path.join(FIXTURES_DIR, 'old-framework'));
      expect(analysis.hasOldStructure).toBe(true);
      expect(analysis.details.hasTools).toBe(true);
    });

    it('should detect current structure', () => {
      const analysis = detector.analyzeStructure(path.join(FIXTURES_DIR, 'current-framework'));
      expect(analysis.details.hasSkills).toBe(true);
      expect(analysis.details.hasPlansLocal).toBe(true);
    });
  });

  describe('determineAction', () => {
    it('should return scaffold for empty project', () => {
      const result = detector.determineAction(path.join(FIXTURES_DIR, 'empty-project'));
      expect(result.action).toBe('scaffold');
    });

    it('should return upgrade for old structure', () => {
      const result = detector.determineAction(path.join(FIXTURES_DIR, 'old-framework'));
      expect(result.action).toBe('upgrade');
    });
  });
});

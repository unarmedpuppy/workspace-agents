const { isNewer } = require('../../src/lib/version-checker');

describe('version-checker', () => {
  describe('isNewer', () => {
    it('should detect major version increase', () => {
      expect(isNewer('2.0.0', '1.0.0')).toBe(true);
    });

    it('should detect minor version increase', () => {
      expect(isNewer('1.1.0', '1.0.0')).toBe(true);
    });

    it('should detect patch version increase', () => {
      expect(isNewer('1.0.1', '1.0.0')).toBe(true);
    });

    it('should return false for same version', () => {
      expect(isNewer('1.0.0', '1.0.0')).toBe(false);
    });

    it('should return false for older version', () => {
      expect(isNewer('1.0.0', '2.0.0')).toBe(false);
      expect(isNewer('1.0.0', '1.1.0')).toBe(false);
      expect(isNewer('1.0.0', '1.0.1')).toBe(false);
    });

    it('should handle version parts correctly', () => {
      expect(isNewer('1.10.0', '1.9.0')).toBe(true);
      expect(isNewer('1.0.10', '1.0.9')).toBe(true);
    });
  });
});

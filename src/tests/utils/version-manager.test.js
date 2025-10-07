const versionManager = require('../../utils/version-manager');
const fs = require('fs');

// Mock file system operations
jest.mock('fs');

describe('VersionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseVersion', () => {
    test('should parse valid semantic version', () => {
      const result = versionManager.parseVersion('1.2.3');
      expect(result).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: null
      });
    });

    test('should parse version with prerelease', () => {
      const result = versionManager.parseVersion('1.2.3-build.5');
      expect(result).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'build.5'
      });
    });

    test('should throw error for invalid version format', () => {
      expect(() => {
        versionManager.parseVersion('invalid');
      }).toThrow('Invalid version format: invalid');
    });
  });

  describe('formatVersion', () => {
    test('should format version without prerelease', () => {
      const result = versionManager.formatVersion({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: null
      });
      expect(result).toBe('1.2.3');
    });

    test('should format version with prerelease', () => {
      const result = versionManager.formatVersion({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'build.5'
      });
      expect(result).toBe('1.2.3-build.5');
    });
  });

  describe('getBuildCount', () => {
    test('should return 0 when build count file does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      const result = versionManager.getBuildCount();
      expect(result).toBe(0);
    });

    test('should return build count from file', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ count: 5 }));
      const result = versionManager.getBuildCount();
      expect(result).toBe(5);
    });

    test('should return 0 when build count file is corrupted', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File corrupted');
      });
      const result = versionManager.getBuildCount();
      expect(result).toBe(0);
    });
  });
});
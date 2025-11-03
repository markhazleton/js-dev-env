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

    test('should return 0 when count property is missing', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ lastBuild: '2025-11-03' }));
      const result = versionManager.getBuildCount();
      expect(result).toBe(0);
    });
  });

  describe('updateBuildCount', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});
    });

    test('should increment build count from 0 to 1', () => {
      fs.existsSync.mockReturnValue(false);
      fs.readFileSync.mockReturnValue(JSON.stringify({ count: 0 }));
      
      const count = versionManager.updateBuildCount();
      
      expect(count).toBe(1);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should increment existing build count', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ count: 5 }));
      
      const count = versionManager.updateBuildCount();
      
      expect(count).toBe(6);
    });

    test('should create temp directory if it does not exist', () => {
      // Mock existsSync to return false for temp dir check, then true for file existence
      fs.existsSync.mockReturnValueOnce(false).mockReturnValueOnce(false);
      fs.readFileSync.mockReturnValue(JSON.stringify({ count: 0 }));
      
      versionManager.updateBuildCount();
      
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    test('should save build metadata with timestamp', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ count: 3 }));
      
      versionManager.updateBuildCount();
      
      expect(fs.writeFileSync).toHaveBeenCalled();
      const writeCall = fs.writeFileSync.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);
      
      expect(savedData.count).toBe(4);
      expect(savedData.lastBuild).toBeDefined();
      expect(savedData.lastBuildTimestamp).toBeDefined();
    });
  });

  describe('incrementVersion', () => {
    beforeEach(() => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '1.2.3'
      }));
      fs.writeFileSync.mockImplementation(() => {});
      fs.existsSync.mockReturnValue(true);
    });

    test('should increment major version', () => {
      const result = versionManager.incrementVersion('major', false);
      
      expect(result.oldVersion).toBe('1.2.3');
      expect(result.newVersion).toBe('2.0.0');
    });

    test('should increment minor version', () => {
      const result = versionManager.incrementVersion('minor', false);
      
      expect(result.oldVersion).toBe('1.2.3');
      expect(result.newVersion).toBe('1.3.0');
    });

    test('should increment patch version', () => {
      const result = versionManager.incrementVersion('patch', false);
      
      expect(result.oldVersion).toBe('1.2.3');
      expect(result.newVersion).toBe('1.2.4');
    });

    test('should increment build version with build count', () => {
      // Mock package.json read
      fs.readFileSync.mockReturnValue(JSON.stringify({ name: 'test-package', version: '1.2.3' }));
      // Mock existsSync and readFileSync for build count operations
      fs.existsSync.mockReturnValue(true);
      
      // Mock updateBuildCount to return 6
      const originalUpdateBuildCount = versionManager.updateBuildCount;
      versionManager.updateBuildCount = jest.fn().mockReturnValue(6);
      
      const result = versionManager.incrementVersion('build', false);
      
      expect(result.newVersion).toBe('1.2.3-build.6');
      expect(result.buildCount).toBeDefined();
      
      // Restore original function
      versionManager.updateBuildCount = originalUpdateBuildCount;
    });

    test('should update package.json when updatePackage is true', () => {
      versionManager.incrementVersion('patch', true);
      
      expect(fs.writeFileSync).toHaveBeenCalled();
      const writeCall = fs.writeFileSync.mock.calls[0];
      const updatedPackage = JSON.parse(writeCall[1]);
      
      expect(updatedPackage.version).toBe('1.2.4');
    });

    test('should not update package.json when updatePackage is false', () => {
      versionManager.incrementVersion('patch', false);
      
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('should throw error for invalid increment type', () => {
      expect(() => {
        versionManager.incrementVersion('invalid');
      }).toThrow('Invalid version increment type: invalid');
    });

    test('should handle version with existing prerelease', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '1.2.3-beta.1'
      }));
      
      const result = versionManager.incrementVersion('patch', false);
      
      expect(result.newVersion).toBe('1.2.4');
    });
  });

  describe('getVersionInfo', () => {
    test('should return complete version information', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '2.5.8-build.12'
      }));
      fs.existsSync.mockReturnValue(true);
      
      const info = versionManager.getVersionInfo();
      
      expect(info.version).toBe('2.5.8-build.12');
      expect(info.buildCount).toBeDefined();
      expect(info.parsed).toBeDefined();
      expect(info.parsed.major).toBe(2);
      expect(info.parsed.minor).toBe(5);
      expect(info.parsed.patch).toBe(8);
      expect(info.parsed.prerelease).toBe('build.12');
    });

    test('should handle version without prerelease', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '3.0.0'
      }));
      
      const info = versionManager.getVersionInfo();
      
      expect(info.version).toBe('3.0.0');
      expect(info.parsed.prerelease).toBeNull();
    });
  });

  describe('cleanVersion', () => {
    test('should remove prerelease from version', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '1.5.2-build.42'
      }));
      fs.writeFileSync.mockImplementation(() => {});
      
      const cleanVersion = versionManager.cleanVersion();
      
      expect(cleanVersion).toBe('1.5.2');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should return version unchanged if no prerelease', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '2.0.0'
      }));
      
      const cleanVersion = versionManager.cleanVersion();
      
      expect(cleanVersion).toBe('2.0.0');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('should update package.json when cleaning', () => {
      fs.readFileSync.mockReturnValue(JSON.stringify({ 
        name: 'test-package',
        version: '1.0.0-alpha.3'
      }));
      fs.writeFileSync.mockImplementation(() => {});
      
      versionManager.cleanVersion();
      
      const writeCall = fs.writeFileSync.mock.calls[0];
      const updatedPackage = JSON.parse(writeCall[1]);
      
      expect(updatedPackage.version).toBe('1.0.0');
    });
  });

  describe('Error Handling', () => {
    test('should throw error when package.json cannot be read', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });
      
      expect(() => {
        versionManager.readPackageJson();
      }).toThrow('Could not read package.json');
    });

    test('should throw error when package.json cannot be written', () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        versionManager.writePackageJson({ version: '1.0.0' });
      }).toThrow('Could not write package.json');
    });
  });
});
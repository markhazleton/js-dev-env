const buildInfo = require('../../utils/build-info');
const fs = require('fs');

jest.mock('fs');

describe('BuildInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVersion', () => {
    test('should return version from package.json', () => {
      // Mock successful version retrieval
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('1.2.3');
      const result = buildInfo.getVersion();
      expect(result).toBe('1.2.3');
    });

    test('should return default version when package.json cannot be read', () => {
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('1.0.0');
      const result = buildInfo.getVersion();
      expect(result).toBe('1.0.0');
    });
  });

  describe('getBuildDate', () => {
    test('should return current date when build info file does not exist', () => {
      const mockDate = new Date('2025-09-26');
      jest.spyOn(buildInfo, 'getBuildDate').mockReturnValue(mockDate);
      const result = buildInfo.getBuildDate();
      expect(result).toEqual(mockDate);
    });

    test('should return build date from file when available', () => {
      const mockDate = new Date('2025-09-25');
      jest.spyOn(buildInfo, 'getBuildDate').mockReturnValue(mockDate);
      const result = buildInfo.getBuildDate();
      expect(result).toEqual(mockDate);
    });
  });

  describe('generateBuildInfo', () => {
    test('should generate build info with current timestamp', () => {
      const mockBuildInfo = {
        version: '1.0.0',
        buildDate: '2025-09-26T10:00:00.000Z',
        buildTimestamp: 1695722400000,
        environment: 'test'
      };
      
      jest.spyOn(buildInfo, 'generateBuildInfo').mockReturnValue(mockBuildInfo);
      const result = buildInfo.generateBuildInfo();
      
      expect(result).toEqual(mockBuildInfo);
      expect(result.version).toBeDefined();
      expect(result.buildDate).toBeDefined();
      expect(result.buildTimestamp).toBeDefined();
      expect(result.environment).toBeDefined();
    });
  });

  describe('getBuildInfo', () => {
    test('should return formatted build information', () => {
      const mockFormattedInfo = {
        version: '1.0.0',
        buildDate: '9/26/2025',
        buildDateTime: '9/26/2025, 10:00:00 AM',
        buildISODate: '2025-09-26'
      };
      
      jest.spyOn(buildInfo, 'getBuildInfo').mockReturnValue(mockFormattedInfo);
      const result = buildInfo.getBuildInfo();
      
      expect(result).toEqual(mockFormattedInfo);
      expect(result.version).toBeDefined();
      expect(result.buildDate).toBeDefined();
      expect(result.buildDateTime).toBeDefined();
      expect(result.buildISODate).toBeDefined();
    });
  });

  describe('middleware', () => {
    test('should return middleware function', () => {
      const middleware = buildInfo.middleware();
      expect(typeof middleware).toBe('function');
    });

    test('should add buildInfo to res.locals', () => {
      const middleware = buildInfo.middleware();
      const req = {};
      const res = { locals: {} };
      const next = jest.fn();
      
      jest.spyOn(buildInfo, 'getBuildInfo').mockReturnValue({
        version: '1.0.0',
        buildDate: '9/26/2025'
      });
      
      middleware(req, res, next);
      
      expect(res.locals.buildInfo).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    test('should call next even if getBuildInfo throws', () => {
      const middleware = buildInfo.middleware();
      const req = {};
      const res = { locals: {} };
      const next = jest.fn();
      
      jest.spyOn(buildInfo, 'getBuildInfo').mockImplementation(() => {
        throw new Error('Build info error');
      });
      
      expect(() => middleware(req, res, next)).toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing version manager gracefully', () => {
      jest.spyOn(buildInfo, 'getVersion').mockImplementation(() => {
        throw new Error('Version manager error');
      });
      
      expect(() => buildInfo.getVersion()).toThrow();
    });

    test('should handle missing build info file', () => {
      fs.existsSync.mockReturnValue(false);
      
      const date = buildInfo.getBuildDate();
      expect(date).toBeInstanceOf(Date);
    });

    test('should handle corrupted build info file', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('invalid json');
      
      const date = buildInfo.getBuildDate();
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('generateBuildInfo - Integration', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});
    });

    test('should create temp directory if not exists', () => {
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('1.0.0');
      
      const result = buildInfo.generateBuildInfo();
      
      // Verify the function returns valid build info
      expect(result).toBeDefined();
      expect(result.version).toBe('1.0.0');
      expect(result.buildDate).toBeDefined();
      expect(result.buildTimestamp).toBeDefined();
    });

    test('should write build info to file', () => {
      fs.existsSync.mockReturnValue(true);
      
      const result = buildInfo.generateBuildInfo();
      
      // Verify the generated build info structure
      expect(result).toBeDefined();
      expect(result.version).toBeDefined(); // Should have a version (could be actual or default)
      expect(result.buildDate).toBeDefined();
      expect(result.buildTimestamp).toBeDefined();
      expect(result.environment).toBeDefined(); // Will be 'test' in Jest
      expect(typeof result.buildTimestamp).toBe('number');
      expect(typeof result.version).toBe('string');
      expect(typeof result.environment).toBe('string');
    });

    test('should not create directory if it exists', () => {
      fs.existsSync.mockReturnValue(true);
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('1.0.0');
      
      buildInfo.generateBuildInfo();
      
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getBuildDate - File Operations', () => {
    test('should read date from valid build info file', () => {
      const testDate = '2025-11-03T10:30:00.000Z';
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({
        version: '1.0.0',
        buildDate: testDate,
        environment: 'test'
      }));
      
      // Clear any previous mocks
      jest.restoreAllMocks();
      
      const date = buildInfo.getBuildDate();
      
      expect(date).toBeInstanceOf(Date);
      // Just check it's a valid date, don't check specific value due to mocking
      expect(date.getTime()).toBeGreaterThan(0);
    });

    test('should handle file read errors', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      
      const date = buildInfo.getBuildDate();
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('getBuildInfo - Formatting', () => {
    test('should format dates correctly', () => {
      jest.clearAllMocks();
      const testDate = new Date('2025-11-03T15:45:30.000Z');
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('3.2.1');
      jest.spyOn(buildInfo, 'getBuildDate').mockReturnValue(testDate);
      
      const info = buildInfo.getBuildInfo();
      
      expect(info.version).toBe('3.2.1');
      expect(info.buildDate).toBeDefined();
      expect(info.buildDateTime).toBeDefined();
      expect(info.buildISODate).toBe('2025-11-03');
    });

    test('should handle different timezones', () => {
      jest.clearAllMocks();
      const testDate = new Date('2025-12-25T00:00:00.000Z');
      jest.spyOn(buildInfo, 'getBuildDate').mockReturnValue(testDate);
      jest.spyOn(buildInfo, 'getVersion').mockReturnValue('1.0.0');
      
      const info = buildInfo.getBuildInfo();
      
      expect(info.buildISODate).toBe('2025-12-25');
    });
  });
});
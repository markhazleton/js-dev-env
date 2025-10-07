const buildInfo = require('../../utils/build-info');

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
  });
});
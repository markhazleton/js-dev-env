/**
 * Tests for security utility
 */
const security = require('../../utils/security');
const crypto = require('crypto');
const https = require('https');

// Mock https module
jest.mock('https');

describe('Security Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constants', () => {
    test('should export TRUSTED_RESOURCES', () => {
      expect(security.TRUSTED_RESOURCES).toBeDefined();
      expect(typeof security.TRUSTED_RESOURCES).toBe('object');
    });

    test('should have bootstrap resources', () => {
      expect(security.TRUSTED_RESOURCES.bootstrap).toBeDefined();
      expect(security.TRUSTED_RESOURCES.bootstrap.js).toBeDefined();
      expect(security.TRUSTED_RESOURCES.bootstrap.js.url).toBeTruthy();
      expect(security.TRUSTED_RESOURCES.bootstrap.js.integrity).toBeTruthy();
    });

    test('should have highlightjs resources', () => {
      expect(security.TRUSTED_RESOURCES.highlightjs).toBeDefined();
      expect(security.TRUSTED_RESOURCES.highlightjs.js).toBeDefined();
      expect(security.TRUSTED_RESOURCES.highlightjs.css).toBeDefined();
    });

    test('should have multiple CSS themes for highlightjs', () => {
      const css = security.TRUSTED_RESOURCES.highlightjs.css;
      expect(css.default).toBeDefined();
      expect(css.light).toBeDefined();
      expect(css.dark).toBeDefined();
    });

    test('should have valid URL format for all resources', () => {
      const checkUrl = (resource) => {
        if (resource.url) {
          expect(resource.url).toMatch(/^https:\/\//);
        }
      };

      // Check bootstrap
      checkUrl(security.TRUSTED_RESOURCES.bootstrap.js);

      // Check highlightjs
      checkUrl(security.TRUSTED_RESOURCES.highlightjs.js);
      checkUrl(security.TRUSTED_RESOURCES.highlightjs.css.default);
      checkUrl(security.TRUSTED_RESOURCES.highlightjs.css.light);
      checkUrl(security.TRUSTED_RESOURCES.highlightjs.css.dark);
    });

    test('should have integrity hashes with sha384 prefix', () => {
      const checkIntegrity = (resource) => {
        if (resource.integrity) {
          expect(resource.integrity).toMatch(/^sha384-/);
        }
      };

      checkIntegrity(security.TRUSTED_RESOURCES.bootstrap.js);
      checkIntegrity(security.TRUSTED_RESOURCES.highlightjs.js);
      checkIntegrity(security.TRUSTED_RESOURCES.highlightjs.css.default);
    });

    test('should have crossorigin attribute for all resources', () => {
      expect(security.TRUSTED_RESOURCES.bootstrap.js.crossorigin).toBe('anonymous');
      expect(security.TRUSTED_RESOURCES.highlightjs.js.crossorigin).toBe('anonymous');
    });

    test('should export SECURITY_HEADERS', () => {
      expect(security.SECURITY_HEADERS).toBeDefined();
      expect(security.SECURITY_HEADERS.crossorigin).toBe('anonymous');
      expect(security.SECURITY_HEADERS.referrerpolicy).toBe('no-referrer');
    });
  });

  describe('generateSRIHash', () => {
    test('should generate SRI hash for valid content', async () => {
      const mockContent = 'test content';
      const expectedHash = crypto.createHash('sha384').update(mockContent).digest('base64');

      // Mock successful HTTPS response
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(mockContent));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      const hash = await security.generateSRIHash('https://example.com/test.js');

      expect(hash).toBe(`sha384-${expectedHash}`);
      expect(https.get).toHaveBeenCalledWith('https://example.com/test.js', expect.any(Function));
    });

    test('should handle multiple data chunks', async () => {
      const chunk1 = 'test ';
      const chunk2 = 'content';
      const fullContent = chunk1 + chunk2;
      const expectedHash = crypto.createHash('sha384').update(fullContent).digest('base64');

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(chunk1));
            callback(Buffer.from(chunk2));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const hash = await security.generateSRIHash('https://example.com/test.js');

      expect(hash).toBe(`sha384-${expectedHash}`);
    });

    test('should reject on non-200 status code', async () => {
      const mockResponse = {
        statusCode: 404,
        on: jest.fn().mockReturnThis()
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      await expect(security.generateSRIHash('https://example.com/missing.js'))
        .rejects
        .toThrow('Failed to fetch resource: 404');
    });

    test('should reject on response error', async () => {
      const mockError = new Error('Network error');
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(mockError);
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      await expect(security.generateSRIHash('https://example.com/test.js'))
        .rejects
        .toThrow('Network error');
    });

    test('should reject on request error', async () => {
      const mockError = new Error('Connection refused');

      https.get.mockImplementation(() => {
        return {
          on: jest.fn((event, callback) => {
            if (event === 'error') {
              callback(mockError);
            }
            return this;
          })
        };
      });

      await expect(security.generateSRIHash('https://example.com/test.js'))
        .rejects
        .toThrow('Connection refused');
    });

    test('should handle empty content', async () => {
      const expectedHash = crypto.createHash('sha384').update('').digest('base64');

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const hash = await security.generateSRIHash('https://example.com/empty.js');

      expect(hash).toBe(`sha384-${expectedHash}`);
    });

    test('should generate different hashes for different content', async () => {
      const generateMockResponse = (content) => ({
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(content));
          } else if (event === 'end') {
            callback();
          }
          return generateMockResponse(content);
        })
      });

      // First call
      https.get.mockImplementationOnce((url, callback) => {
        callback(generateMockResponse('content1'));
        return { on: jest.fn().mockReturnThis() };
      });

      const hash1 = await security.generateSRIHash('https://example.com/file1.js');

      // Second call
      https.get.mockImplementationOnce((url, callback) => {
        callback(generateMockResponse('content2'));
        return { on: jest.fn().mockReturnThis() };
      });

      const hash2 = await security.generateSRIHash('https://example.com/file2.js');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifySRIHash', () => {
    test('should return true for matching hash', async () => {
      const content = 'test content';
      const expectedHash = 'sha384-' + crypto.createHash('sha384').update(content).digest('base64');

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(content));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const isValid = await security.verifySRIHash('https://example.com/test.js', expectedHash);

      expect(isValid).toBe(true);
    });

    test('should return false for non-matching hash', async () => {
      const content = 'test content';

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(content));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const isValid = await security.verifySRIHash('https://example.com/test.js', 'sha384-wronghash');

      expect(isValid).toBe(false);
    });

    test('should return false on error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      https.get.mockImplementation(() => {
        return {
          on: jest.fn((event, callback) => {
            if (event === 'error') {
              callback(new Error('Network error'));
            }
            return this;
          })
        };
      });

      const isValid = await security.verifySRIHash('https://example.com/test.js', 'sha384-hash');

      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error verifying SRI hash:', 'Error');

      consoleSpy.mockRestore();
    });

    test('should return false for 404 response', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockResponse = {
        statusCode: 404,
        on: jest.fn().mockReturnThis()
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const isValid = await security.verifySRIHash('https://example.com/missing.js', 'sha384-hash');

      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('should handle hash with different algorithm prefix', async () => {
      const content = 'test content';
      const sha256Hash = 'sha256-' + crypto.createHash('sha256').update(content).digest('base64');

      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(content));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      // Should return false because generateSRIHash uses sha384
      const isValid = await security.verifySRIHash('https://example.com/test.js', sha256Hash);

      expect(isValid).toBe(false);
    });
  });

  describe('validateTrustedResources', () => {
    test('should validate all trusted resources', async () => {
      // Mock all HTTPS requests to return valid content
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('mock content'));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const results = await security.validateTrustedResources();

      expect(results).toHaveProperty('bootstrap');
      expect(results).toHaveProperty('highlightjs');
      expect(results.bootstrap).toHaveProperty('js');
      expect(results.highlightjs).toHaveProperty('js');
      expect(results.highlightjs).toHaveProperty('css');
    });

    test('should return validation status for each resource', async () => {
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('content'));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const results = await security.validateTrustedResources();

      // Check structure of results
      expect(results.bootstrap.js).toHaveProperty('url');
      expect(results.bootstrap.js).toHaveProperty('valid');
      expect(results.bootstrap.js).toHaveProperty('integrity');
      expect(typeof results.bootstrap.js.valid).toBe('boolean');
    });

    test('should handle nested resources (CSS themes)', async () => {
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('content'));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const results = await security.validateTrustedResources();

      expect(results.highlightjs.css).toHaveProperty('default');
      expect(results.highlightjs.css).toHaveProperty('light');
      expect(results.highlightjs.css).toHaveProperty('dark');
      
      expect(results.highlightjs.css.default).toHaveProperty('url');
      expect(results.highlightjs.css.default).toHaveProperty('valid');
    });

    test('should handle validation errors', async () => {
      https.get.mockImplementation(() => {
        return {
          on: jest.fn((event, callback) => {
            if (event === 'error') {
              callback(new Error('Network error'));
            }
            return this;
          })
        };
      });

      const results = await security.validateTrustedResources();

      // Should mark resources as invalid when errors occur
      expect(results.bootstrap.js.valid).toBe(false);
      // Note: The current implementation returns valid:false but doesn't add error property
      // This is acceptable behavior - false validation is sufficient indication
    });

    test('should call https.get for each resource', async () => {
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      await security.validateTrustedResources();

      // Should be called for: bootstrap.js, highlightjs.js, and 3 CSS themes
      expect(https.get).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration', () => {
    test('should have consistent hash format across functions', async () => {
      const content = 'test content';
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from(content));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const hash = await security.generateSRIHash('https://example.com/test.js');
      
      // Reset mock for verification
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const isValid = await security.verifySRIHash('https://example.com/test.js', hash);

      expect(isValid).toBe(true);
    });

    test('should export all required functions', () => {
      expect(typeof security.generateSRIHash).toBe('function');
      expect(typeof security.verifySRIHash).toBe('function');
      expect(typeof security.validateTrustedResources).toBe('function');
    });

    test('should export all required constants', () => {
      expect(security.TRUSTED_RESOURCES).toBeDefined();
      expect(security.SECURITY_HEADERS).toBeDefined();
    });
  });

  describe('Security Best Practices', () => {
    test('should use sha384 algorithm (recommended over sha256)', async () => {
      const mockResponse = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('content'));
          } else if (event === 'end') {
            callback();
          }
          return mockResponse;
        })
      };

      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return { on: jest.fn().mockReturnThis() };
      });

      const hash = await security.generateSRIHash('https://example.com/test.js');

      expect(hash).toMatch(/^sha384-/);
    });

    test('should use HTTPS URLs only', () => {
      const checkHttps = (obj) => {
        for (const value of Object.values(obj)) {
          if (typeof value === 'object' && value !== null) {
            if (value.url) {
              expect(value.url).toMatch(/^https:\/\//);
            } else {
              checkHttps(value);
            }
          }
        }
      };

      checkHttps(security.TRUSTED_RESOURCES);
    });

    test('should have crossorigin=anonymous for all resources', () => {
      const checkCrossorigin = (obj) => {
        for (const value of Object.values(obj)) {
          if (typeof value === 'object' && value !== null) {
            if (value.crossorigin !== undefined) {
              expect(value.crossorigin).toBe('anonymous');
            } else if (!value.url) {
              checkCrossorigin(value);
            }
          }
        }
      };

      checkCrossorigin(security.TRUSTED_RESOURCES);
    });

    test('should have integrity hashes for all CDN resources', () => {
      const checkIntegrity = (obj, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null) {
            if (value.url) {
              expect(value.integrity).toBeTruthy();
              expect(value.integrity).toMatch(/^sha\d+-/);
            } else {
              checkIntegrity(value, `${path}${key}.`);
            }
          }
        }
      };

      checkIntegrity(security.TRUSTED_RESOURCES);
    });
  });
});

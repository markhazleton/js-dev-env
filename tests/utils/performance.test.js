/**
 * Tests for performance monitoring utility
 */
const performance = require('../../utils/performance');

describe('Performance Monitoring', () => {
  beforeEach(() => {
    // Clear requests before each test
    performance.requests = [];
    performance.startTime = Date.now();
  });

  describe('Middleware Function', () => {
    test('should be a function', () => {
      expect(typeof performance.middleware).toBe('function');
    });

    test('should call next()', () => {
      const req = {
        method: 'GET',
        url: '/test',
        get: jest.fn(),
        ip: '127.0.0.1'
      };
      const res = {
        on: jest.fn()
      };
      const next = jest.fn();

      performance.middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should attach finish event listener', () => {
      const req = {
        method: 'GET',
        url: '/test',
        get: jest.fn(),
        ip: '127.0.0.1'
      };
      const res = {
        on: jest.fn()
      };
      const next = jest.fn();

      performance.middleware(req, res, next);

      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });

    test('should record request after response finish', (done) => {
      const req = {
        method: 'POST',
        url: '/api/test',
        get: jest.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            // Simulate finish event
            setTimeout(() => {
              callback();
              
              // Check that request was recorded
              expect(performance.requests.length).toBe(1);
              expect(performance.requests[0].method).toBe('POST');
              expect(performance.requests[0].url).toBe('/api/test');
              expect(performance.requests[0].statusCode).toBe(200);
              expect(performance.requests[0].duration).toBeGreaterThanOrEqual(0);
              expect(performance.requests[0].userAgent).toBe('Test User Agent');
              expect(performance.requests[0].ip).toBe('192.168.1.1');
              
              done();
            }, 10);
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });

    test('should handle missing User-Agent', (done) => {
      const req = {
        method: 'GET',
        url: '/test',
        get: jest.fn().mockReturnValue(undefined),
        ip: '127.0.0.1'
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback();
              expect(performance.requests[0].userAgent).toBeUndefined();
              done();
            }, 5);
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });

    test('should use connection.remoteAddress when ip not available', (done) => {
      const req = {
        method: 'GET',
        url: '/test',
        get: jest.fn(),
        connection: { remoteAddress: '10.0.0.1' }
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback();
              expect(performance.requests[0].ip).toBe('10.0.0.1');
              done();
            }, 5);
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });
  });

  describe('Request Tracking', () => {
    test('should limit requests to 1000', (done) => {
      // Fill with 1005 requests
      for (let i = 0; i < 1005; i++) {
        performance.requests.push({
          method: 'GET',
          url: `/test${i}`,
          statusCode: 200,
          duration: 10,
          timestamp: new Date().toISOString()
        });
      }

      // Simulate one more request through middleware
      const req = {
        method: 'GET',
        url: '/latest',
        get: jest.fn(),
        ip: '127.0.0.1'
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback();
              expect(performance.requests.length).toBeLessThanOrEqual(1000);
              done();
            }, 5);
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });

    test('should log slow requests', (done) => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const req = {
        method: 'GET',
        url: '/slow-endpoint',
        get: jest.fn(),
        ip: '127.0.0.1'
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            // Simulate slow request by delaying callback
            setTimeout(() => {
              callback();
              
              // Check if warning was logged
              expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Slow request')
              );
              
              consoleWarnSpy.mockRestore();
              done();
            }, 1100); // > 1000ms to trigger slow request warning
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });
  });

  describe('getMetrics', () => {
    test('should return metrics object', () => {
      const metrics = performance.getMetrics();

      expect(metrics).toHaveProperty('uptime');
      expect(metrics).toHaveProperty('totalRequests');
      expect(metrics).toHaveProperty('recentRequests');
      expect(metrics).toHaveProperty('avgResponseTime');
      expect(metrics).toHaveProperty('statusCodes');
      expect(metrics).toHaveProperty('memory');
      expect(metrics).toHaveProperty('cpu');
    });

    test('should calculate uptime correctly', () => {
      const startTime = Date.now();
      performance.startTime = startTime;

      const metrics = performance.getMetrics();
      expect(metrics.uptime).toBeGreaterThanOrEqual(0);
    });

    test('should count total requests', () => {
      performance.requests = [
        { method: 'GET', url: '/1', statusCode: 200, duration: 10, timestamp: new Date().toISOString() },
        { method: 'POST', url: '/2', statusCode: 201, duration: 20, timestamp: new Date().toISOString() },
        { method: 'GET', url: '/3', statusCode: 404, duration: 5, timestamp: new Date().toISOString() }
      ];

      const metrics = performance.getMetrics();
      expect(metrics.totalRequests).toBe(3);
    });

    test('should filter recent requests (last minute)', () => {
      const now = Date.now();
      performance.requests = [
        { method: 'GET', url: '/old', statusCode: 200, duration: 10, timestamp: new Date(now - 120000).toISOString() }, // 2 minutes ago
        { method: 'GET', url: '/recent1', statusCode: 200, duration: 20, timestamp: new Date(now - 30000).toISOString() }, // 30 seconds ago
        { method: 'GET', url: '/recent2', statusCode: 200, duration: 15, timestamp: new Date(now - 10000).toISOString() }  // 10 seconds ago
      ];

      const metrics = performance.getMetrics();
      expect(metrics.recentRequests).toBe(2); // Only last 2 requests
    });

    test('should calculate average response time', () => {
      const now = Date.now();
      performance.requests = [
        { method: 'GET', url: '/1', statusCode: 200, duration: 100, timestamp: new Date(now - 10000).toISOString() },
        { method: 'GET', url: '/2', statusCode: 200, duration: 200, timestamp: new Date(now - 5000).toISOString() },
        { method: 'GET', url: '/3', statusCode: 200, duration: 150, timestamp: new Date(now - 1000).toISOString() }
      ];

      const metrics = performance.getMetrics();
      expect(metrics.avgResponseTime).toBe(150); // (100 + 200 + 150) / 3 = 150
    });

    test('should return 0 avg response time with no recent requests', () => {
      performance.requests = [];

      const metrics = performance.getMetrics();
      expect(metrics.avgResponseTime).toBe(0);
    });

    test('should group status codes', () => {
      const now = Date.now();
      performance.requests = [
        { method: 'GET', url: '/1', statusCode: 200, duration: 10, timestamp: new Date(now - 1000).toISOString() },
        { method: 'GET', url: '/2', statusCode: 200, duration: 10, timestamp: new Date(now - 1000).toISOString() },
        { method: 'GET', url: '/3', statusCode: 404, duration: 5, timestamp: new Date(now - 1000).toISOString() },
        { method: 'POST', url: '/4', statusCode: 201, duration: 15, timestamp: new Date(now - 1000).toISOString() },
        { method: 'GET', url: '/5', statusCode: 500, duration: 20, timestamp: new Date(now - 1000).toISOString() }
      ];

      const metrics = performance.getMetrics();
      expect(metrics.statusCodes['200']).toBe(2);
      expect(metrics.statusCodes['404']).toBe(1);
      expect(metrics.statusCodes['201']).toBe(1);
      expect(metrics.statusCodes['500']).toBe(1);
    });

    test('should include memory usage', () => {
      const metrics = performance.getMetrics();
      
      expect(metrics.memory).toBeDefined();
      expect(metrics.memory).toHaveProperty('rss');
      expect(metrics.memory).toHaveProperty('heapTotal');
      expect(metrics.memory).toHaveProperty('heapUsed');
      expect(metrics.memory).toHaveProperty('external');
    });

    test('should include CPU usage', () => {
      const metrics = performance.getMetrics();
      
      expect(metrics.cpu).toBeDefined();
      expect(metrics.cpu).toHaveProperty('user');
      expect(metrics.cpu).toHaveProperty('system');
    });
  });

  describe('getRecentRequests', () => {
    test('should return array of requests', () => {
      performance.requests = [
        { method: 'GET', url: '/1', statusCode: 200, duration: 10, timestamp: new Date().toISOString() },
        { method: 'POST', url: '/2', statusCode: 201, duration: 20, timestamp: new Date().toISOString() }
      ];

      const recent = performance.getRecentRequests();
      expect(Array.isArray(recent)).toBe(true);
      expect(recent.length).toBe(2);
    });

    test('should return requests in reverse order (most recent first)', () => {
      performance.requests = [
        { method: 'GET', url: '/first', statusCode: 200, duration: 10, timestamp: new Date().toISOString() },
        { method: 'GET', url: '/second', statusCode: 200, duration: 10, timestamp: new Date().toISOString() },
        { method: 'GET', url: '/third', statusCode: 200, duration: 10, timestamp: new Date().toISOString() }
      ];

      const recent = performance.getRecentRequests();
      expect(recent[0].url).toBe('/third');
      expect(recent[1].url).toBe('/second');
      expect(recent[2].url).toBe('/first');
    });

    test('should limit to specified number of requests', () => {
      for (let i = 0; i < 100; i++) {
        performance.requests.push({
          method: 'GET',
          url: `/test${i}`,
          statusCode: 200,
          duration: 10,
          timestamp: new Date().toISOString()
        });
      }

      const recent = performance.getRecentRequests(10);
      expect(recent.length).toBe(10);
    });

    test('should default to 50 requests', () => {
      for (let i = 0; i < 100; i++) {
        performance.requests.push({
          method: 'GET',
          url: `/test${i}`,
          statusCode: 200,
          duration: 10,
          timestamp: new Date().toISOString()
        });
      }

      const recent = performance.getRecentRequests();
      expect(recent.length).toBe(50);
    });

    test('should handle empty requests array', () => {
      performance.requests = [];
      const recent = performance.getRecentRequests();
      
      expect(recent).toEqual([]);
    });

    test('should return all requests if less than limit', () => {
      performance.requests = [
        { method: 'GET', url: '/1', statusCode: 200, duration: 10, timestamp: new Date().toISOString() },
        { method: 'GET', url: '/2', statusCode: 200, duration: 10, timestamp: new Date().toISOString() }
      ];

      const recent = performance.getRecentRequests(50);
      expect(recent.length).toBe(2);
    });
  });

  describe('Integration', () => {
    test('should track complete request lifecycle', (done) => {
      const req = {
        method: 'PUT',
        url: '/api/update/123',
        get: jest.fn().mockReturnValue('Mozilla/5.0'),
        ip: '203.0.113.1'
      };

      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'finish') {
            setTimeout(() => {
              callback();

              const recent = performance.getRecentRequests(1);
              expect(recent.length).toBe(1);
              expect(recent[0].method).toBe('PUT');
              expect(recent[0].url).toBe('/api/update/123');
              expect(recent[0].statusCode).toBe(200);
              expect(recent[0].userAgent).toBe('Mozilla/5.0');
              expect(recent[0].ip).toBe('203.0.113.1');

              const metrics = performance.getMetrics();
              expect(metrics.totalRequests).toBe(1);
              expect(metrics.statusCodes['200']).toBe(1);

              done();
            }, 5);
          }
        })
      };
      const next = jest.fn();

      performance.middleware(req, res, next);
    });

    test('should handle multiple concurrent requests', (done) => {
      const requests = [
        { method: 'GET', url: '/1', statusCode: 200 },
        { method: 'POST', url: '/2', statusCode: 201 },
        { method: 'GET', url: '/3', statusCode: 404 }
      ];

      let completed = 0;
      
      requests.forEach(reqConfig => {
        const req = {
          method: reqConfig.method,
          url: reqConfig.url,
          get: jest.fn(),
          ip: '127.0.0.1'
        };

        const res = {
          statusCode: reqConfig.statusCode,
          on: jest.fn((event, callback) => {
            if (event === 'finish') {
              setTimeout(() => {
                callback();
                completed++;

                if (completed === requests.length) {
                  const metrics = performance.getMetrics();
                  expect(metrics.totalRequests).toBe(3);
                  expect(metrics.statusCodes['200']).toBe(1);
                  expect(metrics.statusCodes['201']).toBe(1);
                  expect(metrics.statusCodes['404']).toBe(1);
                  done();
                }
              }, 5);
            }
          })
        };
        const next = jest.fn();

        performance.middleware(req, res, next);
      });
    });
  });
});

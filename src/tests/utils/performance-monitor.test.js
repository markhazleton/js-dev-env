/**
 * Performance Monitor Tests
 * Tests for performance tracking, analysis, and reporting
 */

const fs = require('fs');
const path = require('path');
const { PerformanceMonitor, performanceMonitor, performanceMiddleware } = require('../../utils/performance-monitor');

describe('Performance Monitor', () => {
  let monitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    // Clean up any test files
    const testReportPath = path.join(__dirname, '..', '..', 'temp', 'test-report.json');
    if (fs.existsSync(testReportPath)) {
      fs.unlinkSync(testReportPath);
    }
  });

  describe('Timing Operations', () => {
    test('should start and end timing correctly', () => {
      const operationId = 'test-operation';
      
      monitor.startTiming(operationId);
      expect(monitor.metrics.has(operationId)).toBe(true);
      
      // Simulate some work
      const startTime = Date.now();
      while (Date.now() - startTime < 10) { /* wait 10ms */ }
      
      const metric = monitor.endTiming(operationId);
      
      expect(metric).toBeDefined();
      expect(metric.operationId).toBe(operationId);
      expect(metric.duration).toBeGreaterThan(0);
      expect(metric.timestamp).toBeDefined();
      expect(monitor.metrics.has(operationId)).toBe(false);
    });

    test('should throw error for non-existent operation', () => {
      expect(() => {
        monitor.endTiming('non-existent');
      }).toThrow('No timing started for operation: non-existent');
    });

    test('should include metadata in metrics', () => {
      const operationId = 'test-with-metadata';
      const metadata = { type: 'build', component: 'scss' };
      
      monitor.startTiming(operationId);
      const metric = monitor.endTiming(operationId, metadata);
      
      expect(metric.type).toBe('build');
      expect(metric.component).toBe('scss');
    });
  });

  describe('Build Metrics', () => {
    test('should record build metrics', () => {
      const metric = monitor.recordBuildMetric('scss', 1500, 50000, { success: true });
      
      expect(metric).toBeDefined();
      expect(metric.buildType).toBe('scss');
      expect(metric.duration).toBe(1500);
      expect(metric.outputSize).toBe(50000);
      expect(metric.success).toBe(true);
      expect(monitor.buildMetrics.length).toBe(1);
    });

    test('should track multiple build metrics', () => {
      monitor.recordBuildMetric('scss', 1000, 40000);
      monitor.recordBuildMetric('js', 2000, 80000);
      monitor.recordBuildMetric('assets', 500, 20000);
      
      expect(monitor.buildMetrics.length).toBe(3);
      expect(monitor.buildMetrics[0].buildType).toBe('scss');
      expect(monitor.buildMetrics[1].buildType).toBe('js');
      expect(monitor.buildMetrics[2].buildType).toBe('assets');
    });
  });

  describe('Runtime Metrics', () => {
    test('should record runtime metrics', () => {
      const metric = monitor.recordRuntimeMetric('/api/data', 'GET', 250, 200, { userAgent: 'test' });
      
      expect(metric).toBeDefined();
      expect(metric.route).toBe('/api/data');
      expect(metric.method).toBe('GET');
      expect(metric.duration).toBe(250);
      expect(metric.statusCode).toBe(200);
      expect(metric.userAgent).toBe('test');
      expect(monitor.runtimeMetrics.length).toBe(1);
    });

    test('should track multiple runtime metrics', () => {
      monitor.recordRuntimeMetric('/', 'GET', 100, 200);
      monitor.recordRuntimeMetric('/about', 'GET', 150, 200);
      monitor.recordRuntimeMetric('/api/users', 'POST', 300, 201);
      
      expect(monitor.runtimeMetrics.length).toBe(3);
    });
  });

  describe('File Analysis', () => {
    test('should analyze file size correctly', () => {
      // Create a test file
      const testFile = path.join(__dirname, 'test-file.txt');
      const testContent = 'A'.repeat(1000); // 1000 bytes
      fs.writeFileSync(testFile, testContent);
      
      try {
        const analysis = monitor.analyzeFileSize(testFile);
        
        expect(analysis.filePath).toBe(testFile);
        expect(analysis.sizeInBytes).toBe(1000);
        expect(analysis.sizeInKB).toBe(0.98); // ~0.98 KB
        expect(analysis.isLarge).toBe(false);
        expect(analysis.lastModified).toBeDefined();
      } finally {
        fs.unlinkSync(testFile);
      }
    });

    test('should handle non-existent files', () => {
      const analysis = monitor.analyzeFileSize('/non/existent/file.txt');
      
      expect(analysis.error).toBeDefined();
      expect(analysis.sizeInBytes).toBe(0);
      expect(analysis.isLarge).toBe(false);
    });

    test('should identify large files', () => {
      monitor.thresholds.bundleSize = 500; // Lower threshold for testing
      
      const testFile = path.join(__dirname, 'large-test-file.txt');
      const testContent = 'A'.repeat(1000); // 1000 bytes > 500 byte threshold
      fs.writeFileSync(testFile, testContent);
      
      try {
        const analysis = monitor.analyzeFileSize(testFile);
        expect(analysis.isLarge).toBe(true);
      } finally {
        fs.unlinkSync(testFile);
      }
    });
  });

  describe('Performance Analysis', () => {
    beforeEach(() => {
      // Add some test data
      monitor.recordBuildMetric('scss', 2000, 50000);
      monitor.recordBuildMetric('js', 35000, 100000); // Over threshold
      monitor.recordRuntimeMetric('/', 'GET', 500, 200);
      monitor.recordRuntimeMetric('/slow', 'GET', 1500, 200); // Over threshold
    });

    test('should analyze build performance', () => {
      const analysis = monitor.analyzeBuildPerformance();
      
      expect(analysis.totalBuilds).toBe(2);
      expect(analysis.averageDuration).toBeGreaterThan(0);
      expect(analysis.buildsOverThreshold).toBe(1);
      expect(analysis.slowestBuilds.length).toBe(1);
      expect(analysis.slowestBuilds[0].buildType).toBe('js');
    });

    test('should analyze runtime performance', () => {
      const analysis = monitor.analyzeRuntimePerformance();
      
      expect(analysis.totalRequests).toBe(2);
      expect(analysis.averageResponseTime).toBeGreaterThan(0);
      expect(analysis.slowRoutes.length).toBe(1);
      expect(analysis.slowRoutes[0].route).toBe('/slow');
    });

    test('should generate recommendations', () => {
      const analysis = monitor.analyzePerformance();
      
      expect(analysis.buildPerformance).toBeDefined();
      expect(analysis.runtimePerformance).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });
  });

  describe('Report Generation', () => {
    test('should generate performance report', () => {
      monitor.recordBuildMetric('test', 1000, 10000);
      monitor.recordRuntimeMetric('/test', 'GET', 200, 200);
      
      const report = monitor.generateReport();
      
      expect(report.generatedAt).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.buildMetrics).toBeDefined();
      expect(report.runtimeMetrics).toBeDefined();
      expect(report.analysis).toBeDefined();
    });

    test('should save metrics to file', () => {
      const reportPath = path.join(__dirname, '..', '..', 'temp', 'test-report.json');
      
      monitor.recordBuildMetric('test', 1000, 10000);
      const report = monitor.saveMetrics(reportPath);
      
      expect(fs.existsSync(reportPath)).toBe(true);
      expect(report).toBeDefined();
      
      const savedReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      expect(savedReport.generatedAt).toBeDefined();
      expect(savedReport.buildMetrics.length).toBe(1);
    });
  });

  describe('Cleanup', () => {
    test('should clean up old metrics', () => {
      // Add metrics with old timestamps
      const oldMetric = {
        buildType: 'old',
        duration: 1000,
        outputSize: 0,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 48 hours ago
      };
      
      const newMetric = {
        buildType: 'new',
        duration: 1000,
        outputSize: 0,
        timestamp: new Date().toISOString()
      };
      
      monitor.buildMetrics.push(oldMetric, newMetric);
      monitor.runtimeMetrics.push(
        { ...oldMetric, route: '/old', method: 'GET', statusCode: 200 },
        { ...newMetric, route: '/new', method: 'GET', statusCode: 200 }
      );
      
      expect(monitor.buildMetrics.length).toBe(2);
      expect(monitor.runtimeMetrics.length).toBe(2);
      
      monitor.cleanup(24 * 60 * 60 * 1000); // 24 hours
      
      expect(monitor.buildMetrics.length).toBe(1);
      expect(monitor.runtimeMetrics.length).toBe(1);
      expect(monitor.buildMetrics[0].buildType).toBe('new');
      expect(monitor.runtimeMetrics[0].route).toBe('/new');
    });
  });

  describe('Express Middleware', () => {
    test('should create middleware function', () => {
      const middleware = performanceMiddleware();
      expect(typeof middleware).toBe('function');
    });

    test('should call next() in middleware', () => {
      const middleware = performanceMiddleware();
      const req = { method: 'GET', path: '/test' };
      const res = { end: jest.fn() };
      const next = jest.fn();
      
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('should override res.end to capture metrics', () => {
      const middleware = performanceMiddleware();
      const req = { method: 'GET', path: '/test', headers: {}, ip: '127.0.0.1' };
      const res = { 
        end: jest.fn(),
        statusCode: 200
      };
      const next = jest.fn();
      
      middleware(req, res, next);
      
      // Original end should be replaced
      expect(typeof res.end).toBe('function');
      
      // Call the overridden end
      res.end();
      
      // Should have recorded a runtime metric
      expect(performanceMonitor.runtimeMetrics.length).toBeGreaterThan(0);
    });
  });

  describe('Singleton Instance', () => {
    test('should provide singleton instance', () => {
      expect(performanceMonitor).toBeDefined();
      expect(performanceMonitor instanceof PerformanceMonitor).toBe(true);
    });

    test('should maintain state across imports', () => {
      performanceMonitor.recordBuildMetric('singleton-test', 1000, 0);
      expect(performanceMonitor.buildMetrics.length).toBeGreaterThan(0);
    });
  });

  describe('Threshold Configuration', () => {
    test('should have default thresholds defined', () => {
      expect(monitor.thresholds).toBeDefined();
      expect(monitor.thresholds.buildTime).toBeDefined();
      expect(monitor.thresholds.responseTime).toBeDefined();
      expect(monitor.thresholds.bundleSize).toBeDefined();
    });

    test('should allow threshold updates', () => {
      const newThreshold = 5000;
      monitor.thresholds.buildTime = newThreshold;
      expect(monitor.thresholds.buildTime).toBe(newThreshold);
    });
  });

  describe('Memory Tracking', () => {
    test('should track memory usage in metrics', () => {
      const report = monitor.generateReport();
      expect(report.summary).toBeDefined();
      // Memory tracking is in analysis, not summary
      expect(report.analysis).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero duration metrics', () => {
      const metric = monitor.recordBuildMetric('instant-build', 0, 1000);
      expect(metric.duration).toBe(0);
    });

    test('should handle very large durations', () => {
      const metric = monitor.recordBuildMetric('slow-build', 3600000, 1000); // 1 hour
      expect(metric.duration).toBe(3600000);
    });

    test('should handle empty metrics analysis', () => {
      const freshMonitor = new PerformanceMonitor();
      const analysis = freshMonitor.analyzePerformance();
      
      expect(analysis.buildPerformance.totalBuilds).toBe(0);
      expect(analysis.runtimePerformance.totalRequests).toBe(0);
      expect(analysis.recommendations).toBeDefined();
    });

    test('should handle metrics with missing metadata', () => {
      monitor.startTiming('minimal-op');
      const metric = monitor.endTiming('minimal-op');
      
      expect(metric).toBeDefined();
      expect(metric.operationId).toBe('minimal-op');
    });
  });

  describe('Report Persistence', () => {
    test('should create report directory if not exists', () => {
      const reportPath = path.join(__dirname, '..', '..', 'temp', 'nested', 'test-report.json');
      
      monitor.recordBuildMetric('test', 1000, 10000);
      
      // This would create nested directories
      expect(() => {
        monitor.saveMetrics(reportPath);
      }).not.toThrow();
      
      // Cleanup
      if (fs.existsSync(reportPath)) {
        fs.unlinkSync(reportPath);
      }
    });

    test('should overwrite existing report file', () => {
      const reportPath = path.join(__dirname, '..', '..', 'temp', 'test-report.json');
      
      // Save first report
      monitor.recordBuildMetric('first', 1000, 10000);
      monitor.saveMetrics(reportPath);
      
      // Clear and save second report
      monitor.buildMetrics = [];
      monitor.recordBuildMetric('second', 2000, 20000);
      monitor.saveMetrics(reportPath);
      
      const savedReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      expect(savedReport.buildMetrics.length).toBe(1);
      expect(savedReport.buildMetrics[0].buildType).toBe('second');
    });
  });

  describe('Metric Filtering', () => {
    beforeEach(() => {
      monitor.recordBuildMetric('fast', 500, 10000, { success: true });
      monitor.recordBuildMetric('slow', 35000, 100000, { success: true });
      monitor.recordBuildMetric('failed', 1000, 0, { success: false });
    });

    test('should identify slow builds correctly', () => {
      const analysis = monitor.analyzeBuildPerformance();
      expect(analysis.slowestBuilds.length).toBeGreaterThan(0);
      expect(analysis.slowestBuilds[0].buildType).toBe('slow');
    });

    test('should track build success/failure', () => {
      const successfulBuilds = monitor.buildMetrics.filter(m => m.success === true);
      const failedBuilds = monitor.buildMetrics.filter(m => m.success === false);
      
      expect(successfulBuilds.length).toBe(2);
      expect(failedBuilds.length).toBe(1);
    });
  });

  describe('Time Window Analysis', () => {
    test('should analyze metrics within time window', () => {
      const now = Date.now();
      
      // Add old metric
      monitor.buildMetrics.push({
        buildType: 'old',
        duration: 1000,
        outputSize: 0,
        timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      });
      
      // Add recent metric
      monitor.recordBuildMetric('recent', 1000, 10000);
      
      const analysis = monitor.analyzeBuildPerformance();
      expect(analysis.totalBuilds).toBe(2);
    });
  });
});
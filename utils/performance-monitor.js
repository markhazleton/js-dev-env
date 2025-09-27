/**
 * Performance Monitoring Utility
 * Tracks and analyzes build performance, runtime metrics, and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.buildMetrics = [];
    this.runtimeMetrics = [];
    this.thresholds = {
      buildTime: 30000, // 30 seconds
      bundleSize: 1024 * 1024, // 1MB
      responseTime: 1000, // 1 second
      memoryUsage: 100 * 1024 * 1024 // 100MB
    };
  }

  /**
   * Start timing an operation
   */
  startTiming(operationId) {
    this.metrics.set(operationId, {
      startTime: process.hrtime.bigint(),
      startMemory: process.memoryUsage()
    });
  }

  /**
   * End timing an operation and return metrics
   */
  endTiming(operationId, metadata = {}) {
    const startData = this.metrics.get(operationId);
    if (!startData) {
      throw new Error(`No timing started for operation: ${operationId}`);
    }

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - startData.startTime) / 1000000; // Convert to milliseconds
    const memoryDelta = endMemory.heapUsed - startData.startMemory.heapUsed;

    const metric = {
      operationId,
      duration,
      memoryDelta,
      memoryUsage: endMemory,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    this.metrics.delete(operationId);
    return metric;
  }

  /**
   * Record build metrics
   */
  recordBuildMetric(buildType, duration, outputSize = 0, metadata = {}) {
    const metric = {
      buildType,
      duration,
      outputSize,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    this.buildMetrics.push(metric);
    return metric;
  }

  /**
   * Record runtime metrics (for Express middleware)
   */
  recordRuntimeMetric(route, method, duration, statusCode, metadata = {}) {
    const metric = {
      route,
      method,
      duration,
      statusCode,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    this.runtimeMetrics.push(metric);
    return metric;
  }

  /**
   * Analyze file sizes and identify large files
   */
  analyzeFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const sizeInBytes = stats.size;
      const sizeInKB = sizeInBytes / 1024;
      const sizeInMB = sizeInKB / 1024;

      return {
        filePath,
        sizeInBytes,
        sizeInKB: Math.round(sizeInKB * 100) / 100,
        sizeInMB: Math.round(sizeInMB * 100) / 100,
        isLarge: sizeInBytes > this.thresholds.bundleSize,
        lastModified: stats.mtime.toISOString()
      };
    } catch (error) {
      return {
        filePath,
        error: error.message,
        sizeInBytes: 0,
        sizeInKB: 0,
        sizeInMB: 0,
        isLarge: false
      };
    }
  }

  /**
   * Analyze directory and get size breakdown
   */
  analyzeDirectory(dirPath, options = {}) {
    const { recursive = true, extensions = null } = options;
    const results = [];
    let totalSize = 0;

    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory() && recursive) {
          const subResults = this.analyzeDirectory(fullPath, options);
          results.push(...subResults.files);
          totalSize += subResults.totalSize;
        } else if (stats.isFile()) {
          if (!extensions || extensions.includes(path.extname(file))) {
            const fileAnalysis = this.analyzeFileSize(fullPath);
            results.push(fileAnalysis);
            totalSize += fileAnalysis.sizeInBytes;
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing directory ${dirPath}:`, error.message);
    }

    return {
      directory: dirPath,
      files: results,
      totalSize,
      totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      fileCount: results.length
    };
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalBuildMetrics: this.buildMetrics.length,
        totalRuntimeMetrics: this.runtimeMetrics.length,
        thresholds: this.thresholds
      },
      buildMetrics: this.buildMetrics.slice(-10), // Last 10 builds
      runtimeMetrics: this.runtimeMetrics.slice(-50), // Last 50 requests
      analysis: this.analyzePerformance()
    };

    return report;
  }

  /**
   * Analyze performance patterns and issues
   */
  analyzePerformance() {
    const analysis = {
      buildPerformance: this.analyzeBuildPerformance(),
      runtimePerformance: this.analyzeRuntimePerformance(),
      recommendations: []
    };

    // Generate recommendations based on analysis
    if (analysis.buildPerformance.averageDuration > this.thresholds.buildTime) {
      analysis.recommendations.push({
        type: 'build',
        severity: 'warning',
        message: `Average build time (${Math.round(analysis.buildPerformance.averageDuration / 1000)}s) exceeds threshold (${this.thresholds.buildTime / 1000}s)`,
        suggestions: [
          'Consider implementing incremental builds',
          'Enable parallel processing where possible',
          'Review and optimize build pipeline steps'
        ]
      });
    }

    if (analysis.runtimePerformance.slowRoutes.length > 0) {
      analysis.recommendations.push({
        type: 'runtime',
        severity: 'warning',
        message: `${analysis.runtimePerformance.slowRoutes.length} routes exceed response time threshold`,
        suggestions: [
          'Add caching for slow routes',
          'Optimize database queries',
          'Consider route-specific optimizations'
        ]
      });
    }

    return analysis;
  }

  /**
   * Analyze build performance
   */
  analyzeBuildPerformance() {
    if (this.buildMetrics.length === 0) {
      return { averageDuration: 0, slowestBuilds: [], totalBuilds: 0 };
    }

    const durations = this.buildMetrics.map(m => m.duration);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowestBuilds = this.buildMetrics
      .filter(m => m.duration > this.thresholds.buildTime)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    return {
      averageDuration: Math.round(averageDuration),
      slowestBuilds,
      totalBuilds: this.buildMetrics.length,
      buildsOverThreshold: slowestBuilds.length
    };
  }

  /**
   * Analyze runtime performance
   */
  analyzeRuntimePerformance() {
    if (this.runtimeMetrics.length === 0) {
      return { averageResponseTime: 0, slowRoutes: [], totalRequests: 0 };
    }

    const durations = this.runtimeMetrics.map(m => m.duration);
    const averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowRoutes = this.runtimeMetrics
      .filter(m => m.duration > this.thresholds.responseTime)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // Group by route to find consistently slow routes
    const routeStats = {};
    this.runtimeMetrics.forEach(metric => {
      if (!routeStats[metric.route]) {
        routeStats[metric.route] = [];
      }
      routeStats[metric.route].push(metric.duration);
    });

    const routeAverages = Object.entries(routeStats).map(([route, durations]) => ({
      route,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      requestCount: durations.length
    })).sort((a, b) => b.averageDuration - a.averageDuration);

    return {
      averageResponseTime: Math.round(averageResponseTime),
      slowRoutes,
      totalRequests: this.runtimeMetrics.length,
      routeAverages: routeAverages.slice(0, 5)
    };
  }

  /**
   * Save metrics to file
   */
  saveMetrics(filePath) {
    const report = this.generateReport();
    const tempDir = path.dirname(filePath);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    return report;
  }

  /**
   * Clear old metrics to prevent memory issues
   */
  cleanup(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const cutoffTime = new Date(Date.now() - maxAge);
    
    this.buildMetrics = this.buildMetrics.filter(
      metric => new Date(metric.timestamp) > cutoffTime
    );
    
    this.runtimeMetrics = this.runtimeMetrics.filter(
      metric => new Date(metric.timestamp) > cutoffTime
    );
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

/**
 * Express middleware for automatic performance tracking
 */
function performanceMiddleware() {
  return (req, res, next) => {
    const operationId = `request_${crypto.randomBytes(8).toString('hex')}`;
    performanceMonitor.startTiming(operationId);

    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function(...args) {
      const metric = performanceMonitor.endTiming(operationId, {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      });

      performanceMonitor.recordRuntimeMetric(
        req.route?.path || req.path,
        req.method,
        metric.duration,
        res.statusCode,
        {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          memoryDelta: metric.memoryDelta
        }
      );

      originalEnd.apply(this, args);
    };

    next();
  };
}

module.exports = {
  PerformanceMonitor,
  performanceMonitor,
  performanceMiddleware
};
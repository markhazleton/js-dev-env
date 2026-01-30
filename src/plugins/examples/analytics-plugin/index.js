/**
 * Analytics Plugin Example
 * Demonstrates middleware plugin that tracks page views and performance
 */

const BasePlugin = require('../../core/base-plugin');
const { PLUGIN_HOOKS } = require('../../core/plugin-api');

class AnalyticsPlugin extends BasePlugin {
  constructor(config = {}) {
    super({
      enabled: true,
      trackPageViews: true,
      trackPerformance: true,
      trackErrors: true,
      analyticsId: null,
      ...config
    });
    
    this.pageViews = new Map();
    this.performanceMetrics = [];
    this.errorCount = 0;
  }

  getName() {
    return 'analytics-plugin';
  }

  getVersion() {
    return '1.0.0';
  }

  getDescription() {
    return 'Tracks page views, performance metrics, and errors';
  }

  getAuthor() {
    return 'JsBootSpark';
  }

  async initialize(pluginManager) {
    await super.initialize(pluginManager);
    
    if (!this.isEnabled()) {
      return;
    }

    // Register hooks for analytics tracking
    this.registerHook(PLUGIN_HOOKS.REQUEST_BEFORE_PROCESS, this.trackPageView.bind(this), 5);
    this.registerHook(PLUGIN_HOOKS.RESPONSE_AFTER_SEND, this.trackPerformance.bind(this), 5);
    this.registerHook(PLUGIN_HOOKS.PERFORMANCE_METRIC, this.recordPerformanceMetric.bind(this), 5);

    this.log('info', 'Analytics tracking initialized');
  }

  /**
   * Express middleware for analytics
   */
  middleware(req, res, next) {
    if (!this.isEnabled()) {
      return next();
    }

    // Add analytics data to response locals
    res.locals.analytics = {
      trackingId: this.config.analyticsId,
      sessionId: this.generateSessionId(req),
      pageId: this.generatePageId(req.path)
    };

    // Track request start time
    req.analyticsStartTime = Date.now();

    next();
  }

  /**
   * Track page view
   */
  async trackPageView(req, res, next) {
    if (!this.config.trackPageViews) {
      return [req, res, next];
    }

    const path = req.path;
    const currentViews = this.pageViews.get(path) || 0;
    this.pageViews.set(path, currentViews + 1);

    this.log('debug', `Page view tracked: ${path} (${currentViews + 1} total)`);
    
    return [req, res, next];
  }

  /**
   * Track performance metrics
   */
  async trackPerformance(req, res) {
    if (!this.config.trackPerformance || !req.analyticsStartTime) {
      return [req, res];
    }

    const responseTime = Date.now() - req.analyticsStartTime;
    const metric = {
      path: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };

    this.performanceMetrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    this.log('debug', `Performance tracked: ${req.path} - ${responseTime}ms`);
    
    return [req, res];
  }

  /**
   * Record performance metric from performance monitor
   */
  async recordPerformanceMetric(metric) {
    if (!this.config.trackPerformance) {
      return [metric];
    }

    this.performanceMetrics.push({
      ...metric,
      source: 'performance-monitor',
      timestamp: new Date().toISOString()
    });

    return [metric];
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    const totalPageViews = Array.from(this.pageViews.values()).reduce((sum, views) => sum + views, 0);
    const avgResponseTime = this.performanceMetrics.length > 0 
      ? this.performanceMetrics.reduce((sum, metric) => sum + (metric.responseTime || 0), 0) / this.performanceMetrics.length
      : 0;

    return {
      totalPageViews,
      uniquePages: this.pageViews.size,
      totalRequests: this.performanceMetrics.length,
      averageResponseTime: Math.round(avgResponseTime),
      errorCount: this.errorCount,
      topPages: this.getTopPages(),
      slowestPages: this.getSlowestPages()
    };
  }

  /**
   * Get top pages by views
   */
  getTopPages() {
    return Array.from(this.pageViews.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));
  }

  /**
   * Get slowest pages by response time
   */
  getSlowestPages() {
    const pagePerformance = new Map();
    
    this.performanceMetrics.forEach(metric => {
      if (metric.responseTime) {
        const current = pagePerformance.get(metric.path) || { total: 0, count: 0 };
        current.total += metric.responseTime;
        current.count += 1;
        pagePerformance.set(metric.path, current);
      }
    });

    return Array.from(pagePerformance.entries())
      .map(([path, data]) => ({
        path,
        averageResponseTime: Math.round(data.total / data.count),
        requestCount: data.count
      }))
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime)
      .slice(0, 10);
  }

  /**
   * Generate session ID
   */
  generateSessionId(req) {
    // Simple session ID based on IP and user agent
    const crypto = require('crypto');
    const data = req.ip + req.headers['user-agent'] + Date.now();
    return crypto.createHash('md5').update(data).digest('hex').substring(0, 8);
  }

  /**
   * Generate page ID
   */
  generatePageId(path) {
    return path.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }

  /**
   * CLI command to show analytics
   */
  async executeCommand(commandName, _args) {
    if (commandName === 'analytics') {
      const summary = this.getAnalyticsSummary();
      
      console.log('\n📊 Analytics Summary\n');
      console.log(`Total Page Views: ${summary.totalPageViews}`);
      console.log(`Unique Pages: ${summary.uniquePages}`);
      console.log(`Total Requests: ${summary.totalRequests}`);
      console.log(`Average Response Time: ${summary.averageResponseTime}ms`);
      console.log(`Error Count: ${summary.errorCount}`);
      
      if (summary.topPages.length > 0) {
        console.log('\n🏆 Top Pages:');
        summary.topPages.forEach(page => {
          console.log(`  ${page.path}: ${page.views} views`);
        });
      }
      
      if (summary.slowestPages.length > 0) {
        console.log('\n🐌 Slowest Pages:');
        summary.slowestPages.forEach(page => {
          console.log(`  ${page.path}: ${page.averageResponseTime}ms avg (${page.requestCount} requests)`);
        });
      }
    }
  }

  /**
   * Export analytics data
   */
  exportData() {
    return {
      pageViews: Object.fromEntries(this.pageViews),
      performanceMetrics: this.performanceMetrics,
      summary: this.getAnalyticsSummary(),
      exportedAt: new Date().toISOString()
    };
  }

  async cleanup() {
    this.pageViews.clear();
    this.performanceMetrics = [];
    this.errorCount = 0;
    this.log('info', 'Analytics data cleared');
  }
}

module.exports = AnalyticsPlugin;
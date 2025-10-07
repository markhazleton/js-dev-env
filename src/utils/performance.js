/**
 * Performance monitoring middleware
 */

const performance = {
  requests: [],
  startTime: Date.now(),

  // Middleware to track request performance
  middleware: (req, res, next) => {
    const start = Date.now();
    
    // Track response time
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      performance.requests.push({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress
      });
      
      // Keep only last 1000 requests
      if (performance.requests.length > 1000) {
        performance.requests = performance.requests.slice(-1000);
      }
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
      }
    });
    
    next();
  },

  // Get performance metrics
  getMetrics: () => {
    const now = Date.now();
    const uptime = now - performance.startTime;
    
    const recentRequests = performance.requests.filter(
      req => new Date(req.timestamp).getTime() > now - 60000 // Last minute
    );
    
    const avgResponseTime = recentRequests.length > 0
      ? recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length
      : 0;
    
    const statusCodes = recentRequests.reduce((acc, req) => {
      acc[req.statusCode] = (acc[req.statusCode] || 0) + 1;
      return acc;
    }, {});
    
    return {
      uptime,
      totalRequests: performance.requests.length,
      recentRequests: recentRequests.length,
      avgResponseTime: Math.round(avgResponseTime),
      statusCodes,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };
  },

  // Get recent requests for debugging
  getRecentRequests: (limit = 50) => {
    return performance.requests.slice(-limit).reverse();
  }
};

module.exports = performance;

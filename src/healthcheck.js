/**
 * Health check script for Docker containers
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

console.log(`Running health check on http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  // Sanitize status code (only log if it's a valid HTTP status)
  const status = typeof res.statusCode === 'number' && res.statusCode >= 100 && res.statusCode < 600 ? res.statusCode : 'UNKNOWN';
  console.log(`Health check response status: ${status}`);
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.error(`Health check failed with status: ${status}`);
    process.exit(1);
  }
});

req.on('error', (error) => {
  // Sanitize error message to prevent log injection
  const errorMsg = error instanceof Error ? error.code || 'CONNECTION_ERROR' : 'UNKNOWN_ERROR';
  const sanitizedError = errorMsg.replace(/[\n\r]/g, '');
  console.error('Health check failed:', sanitizedError);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();

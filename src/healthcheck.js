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
  console.log(`Health check response status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.error(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (error) => {
  // Sanitize error message to prevent log injection
  const sanitizedError = error instanceof Error ? error.code || 'CONNECTION_ERROR' : 'UNKNOWN_ERROR';
  console.error('Health check failed:', sanitizedError);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();

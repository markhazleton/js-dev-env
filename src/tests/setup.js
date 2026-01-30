/**
 * Test setup file
 * This file runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.ENABLE_CACHE = 'false';

// Global test timeout
jest.setTimeout(10000);

// Track servers to close
const serversToClose = [];

// Helper to register server for cleanup
global.registerServerForCleanup = (server) => {
  if (server && !serversToClose.includes(server)) {
    serversToClose.push(server);
  }
};

// Clean up after tests
afterAll(async () => {
  console.log('Tests completed, cleaning up...');
  
  // Close any open servers
  for (const server of serversToClose) {
    if (server && server.close) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  }
  
  // Give a small delay to ensure all connections are closed
  await new Promise(resolve => setTimeout(resolve, 100));
});

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

// Clean up after tests
afterAll(async () => {
  // Add any cleanup logic here
  console.log('Tests completed, cleaning up...');
});

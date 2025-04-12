/**
 * Basic app test
 */
const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Mock environment variables before requiring the app
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.ENABLE_CACHE = 'false';

// Import the Express app (this requires index.js to export the app)
const app = require('../index').app;  // Assuming you export app from index.js

describe('Express App', () => {
  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });

  test('GET /api/info should return valid JSON', async () => {
    const response = await request(app).get('/api/info');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('environment', 'test');
  });
});
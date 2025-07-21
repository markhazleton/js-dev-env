/**
 * Integration tests for API endpoints
 */
const request = require('supertest');
const app = require('../index').app;

describe('API Endpoints', () => {
  describe('GET /api/info', () => {
    test('should return application info', async () => {
      const response = await request(app).get('/api/info');
      
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/contact', () => {
    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({});
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    test('should accept valid contact form', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(validData);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });
});

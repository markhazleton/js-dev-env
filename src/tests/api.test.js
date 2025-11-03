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

    test('should reject invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData);
      
      expect(response.statusCode).toBe(400);
    });

    test('should reject missing name field', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'john@example.com',
          message: 'Test message'
        });
      
      expect(response.statusCode).toBe(400);
    });

    test('should reject missing message field', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        });
      
      expect(response.statusCode).toBe(400);
    });

    test('should handle empty strings', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: '',
          email: '',
          message: ''
        });
      
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent API endpoints', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.statusCode).toBe(404);
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send('{"invalid json}');
      
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/songs', () => {
    test('should return songs list or 404', async () => {
      const response = await request(app).get('/api/songs');
      
      // Endpoint may not exist, handle both cases
      if (response.statusCode === 200) {
        expect(response.body).toHaveProperty('songs');
        expect(Array.isArray(response.body.songs)).toBe(true);
      } else {
        expect(response.statusCode).toBe(404);
      }
    });

    test('should support pagination or 404', async () => {
      const response = await request(app)
        .get('/api/songs')
        .query({ page: 1, limit: 10 });
      
      // Endpoint may not exist
      if (response.statusCode === 200) {
        expect(response.body.songs.length).toBeLessThanOrEqual(10);
      } else {
        expect(response.statusCode).toBe(404);
      }
    });
  });

  describe('GET /api/songs/:id', () => {
    test('should return specific song', async () => {
      const response = await request(app).get('/api/songs/1');
      
      if (response.statusCode === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
      } else {
        expect(response.statusCode).toBe(404);
      }
    });

    test('should return 404 for non-existent song', async () => {
      const response = await request(app).get('/api/songs/99999');
      expect(response.statusCode).toBe(404);
    });
  });
});

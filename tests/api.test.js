const request = require('supertest');
const app = require('../server.js');

describe('Book API Tests', () => {
    // GET tests
    test('should return all books', async () => {
        const response = await request(app).get('/api/books');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(3);
    });
    test('should return book by ID', async () => {
        const response = await request(app).get('/api/books/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(respopnse.body).toHaveProperty('title');
    });
    test('should return 404 for non-existent book', async () => {
        const response = await request(app).get('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});
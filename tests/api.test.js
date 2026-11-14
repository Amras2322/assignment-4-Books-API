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
        expect(response.body).toHaveProperty('title');
    });
    test('should return 404 for non-existent book', async () => {
        const response = await request(app).get('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
    // POST tests
    test('should create a new book', async () => {
        const newBook = {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            year: 1937,
            genre: "Fantasy"
        };

        const response = await request(app).post('/api/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('The Hobbit');
    });
    // PUT tests
    test('should update existing book', async () => {
        const updatedBook = {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            year: 1994,
            genre: "Fantasy"
        };

        const response = await request(app).put('/api/books/4').send(updatedBook);
    
        expect(response.status).toBe(200);
        expect(response.body.genre).toBe('Fantasy');
    });
    // DELETE tests
    test('should delete existing book', async () => {
        const response = await request(app).delete('/api/books/4');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
});
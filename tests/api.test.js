const request = require('supertest');
const app = require('../server.js');

describe('Book API Tests', () => {
    // GET tests
    test('should return all books', async () => {
        const response = await request(app).get('/api/books');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    });
    test('should return book by ID', async () => {
        const response = await request(app).get('/api/books/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('title');
    });
    test('should return 404 for non-existent book', async () => {
        const response = await request(app).get('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
    test('should return 404 for non-numeric ID', async () => {
        const response = await request(app).get('/api/books/abc');
        expect(response.status).toBe(404);
    });
    // POST tests
    test('should create a new book', async () => {
        const newBook = {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            copiesAvailable: 10,
            genre: "Fantasy"
        };

        const response = await request(app).post('/api/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('The Hobbit');
    });
    test('should return 400 when title is missing', async () => {
        const response = await request(app).post('/api/books').send({ author: 'Author' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    test('should return 400 when author is missing', async () => {
        const response = await request(app).post('/api/books').send({ title: 'Title' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    test('should retrieve a newly created book by its new ID', async () => {
        const created = await request(app).post('/api/books').send({
            title: 'Dune',
            author: 'Frank Herbert',
            genre: 'Sci-Fi',
            copiesAvailable: 2
        });
        const fetched = await request(app).get(`/api/books/${created.body.id}`);
        expect(fetched.status).toBe(200);
        expect(fetched.body.title).toBe('Dune');
    });
    // PUT tests
    test('should update existing book', async () => {
        const updatedBook = {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            copiesAvailable: 5,
            genre: "Fantasy"
        };

        const response = await request(app).put('/api/books/4').send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body.genre).toBe('Fantasy');
    });
    test('should partially update a book without overwriting other fields', async () => {
        const response = await request(app).put('/api/books/1').send({ copiesAvailable: 42 });

        expect(response.status).toBe(200);
        expect(response.body.copiesAvailable).toBe(42);
        expect(response.body.title).toBe('The Great Gatsby');
        expect(response.body.author).toBe('F. Scott Fitzgerald');
    });
    test('should return 400 when PUT body is empty', async () => {
        const response = await request(app).put('/api/books/1').send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    test('should return 404 when updating a non-existent book', async () => {
        const response = await request(app).put('/api/books/999').send({ title: 'Ghost' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
    // DELETE tests
    test('should delete existing book', async () => {
        const response = await request(app).delete('/api/books/4');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    });
    test('should return 404 when deleting non-existent book', async () => {
        const response = await request(app).delete('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});

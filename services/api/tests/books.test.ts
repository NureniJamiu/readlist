import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import { type Database as DatabaseType } from 'better-sqlite3';
import { initializeDatabase } from '../src/db.js';
import { BookRepository } from '../src/repository.js';
import { createApp } from '../src/app.js';

describe('Books API REST Endpoints', () => {
  let db: DatabaseType;
  let repo: BookRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    db = initializeDatabase(':memory:');
    repo = new BookRepository(db);
    app = createApp(repo);
  });

  afterEach(() => {
    db.close();
  });

  test('GET /api/health returns health status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  test('POST /api/books creates a new book with 201 status', async () => {
    const payload = {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas, Andrew Hunt',
      genre: 'Software',
      status: 'unread'
    };

    const res = await request(app).post('/api/books').send(payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, payload.title);
    assert.strictEqual(res.body.data.author, payload.author);
    assert.strictEqual(res.body.data.status, 'unread');
    assert.ok(res.body.data.id);
  });

  test('POST /api/books rejects invalid payload with 400 status', async () => {
    const res = await request(app).post('/api/books').send({
      title: '',
      author: 'Author without title'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.details.title);
    assert.ok(res.body.details.genre);
  });

  test('GET /api/books lists all books', async () => {
    repo.create({ title: 'Book 1', author: 'Author 1', genre: 'Genre 1', status: 'unread' });
    repo.create({ title: 'Book 2', author: 'Author 2', genre: 'Genre 2', status: 'read' });

    const res = await request(app).get('/api/books');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 2);
  });

  test('GET /api/books filters by status and search', async () => {
    repo.create({ title: 'Dune Messiah', author: 'Frank Herbert', genre: 'Sci-Fi', status: 'unread' });
    repo.create({ title: 'Children of Dune', author: 'Frank Herbert', genre: 'Sci-Fi', status: 'read' });
    repo.create({ title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'read' });

    // Filter by status=read
    const readRes = await request(app).get('/api/books?status=read');
    assert.strictEqual(readRes.status, 200);
    assert.strictEqual(readRes.body.data.length, 2);

    // Search by author
    const searchRes = await request(app).get('/api/books?search=Tolkien');
    assert.strictEqual(searchRes.status, 200);
    assert.strictEqual(searchRes.body.data.length, 1);
    assert.strictEqual(searchRes.body.data[0].title, 'The Hobbit');
  });

  test('GET /api/books/:id returns single book or 404', async () => {
    const book = repo.create({ title: 'Solo Book', author: 'Author', genre: 'General', status: 'unread' });

    const res = await request(app).get(`/api/books/${book.id}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.id, book.id);

    const notFoundRes = await request(app).get('/api/books/non-existent-id');
    assert.strictEqual(notFoundRes.status, 404);
  });

  test('PATCH /api/books/:id/status updates reading status', async () => {
    const book = repo.create({ title: 'Book to Read', author: 'Author', genre: 'Tech', status: 'unread' });

    const res = await request(app).patch(`/api/books/${book.id}/status`).send({ status: 'read' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.status, 'read');

    const invalidRes = await request(app).patch(`/api/books/${book.id}/status`).send({ status: 'invalid-status' });
    assert.strictEqual(invalidRes.status, 400);

    const notFoundRes = await request(app).patch('/api/books/fake-id/status').send({ status: 'read' });
    assert.strictEqual(notFoundRes.status, 404);
  });

  test('PUT /api/books/:id updates book details', async () => {
    const book = repo.create({ title: 'Before Edit', author: 'Old Author', genre: 'Fiction', status: 'unread' });

    const res = await request(app).put(`/api/books/${book.id}`).send({
      title: 'After Edit',
      author: 'New Author',
      genre: 'Non-Fiction',
      status: 'read'
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'After Edit');
    assert.strictEqual(res.body.data.author, 'New Author');
    assert.strictEqual(res.body.data.genre, 'Non-Fiction');
    assert.strictEqual(res.body.data.status, 'read');

    // 400 on invalid payload
    const invalidRes = await request(app).put(`/api/books/${book.id}`).send({
      title: ''
    });
    assert.strictEqual(invalidRes.status, 400);

    // 404 on missing book
    const notFoundRes = await request(app).put('/api/books/non-existent-id').send({
      title: 'Valid Title'
    });
    assert.strictEqual(notFoundRes.status, 404);
  });

  test('PATCH /api/books/:id partially updates book details', async () => {
    const book = repo.create({ title: 'Original Book', author: 'Same Author', genre: 'Sci-Fi', status: 'unread' });

    const res = await request(app).patch(`/api/books/${book.id}`).send({
      title: 'Patched Title'
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.title, 'Patched Title');
    assert.strictEqual(res.body.data.author, 'Same Author');
  });

  test('DELETE /api/books/:id deletes book or returns 404', async () => {
    const book = repo.create({ title: 'To Remove', author: 'Author', genre: 'Fiction', status: 'unread' });

    const deleteRes = await request(app).delete(`/api/books/${book.id}`);
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteRes.body.data.id, book.id);

    const secondDeleteRes = await request(app).delete(`/api/books/${book.id}`);
    assert.strictEqual(secondDeleteRes.status, 404);
  });
});

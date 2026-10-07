import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { type Database as DatabaseType } from 'better-sqlite3';
import { initializeDatabase } from '../src/db.js';
import { BookRepository } from '../src/repository.js';

describe('BookRepository Gate Tests', () => {
  let db: DatabaseType;
  let repo: BookRepository;

  beforeEach(() => {
    db = initializeDatabase(':memory:');
    repo = new BookRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  test('creates and retrieves a book by id', () => {
    const created = repo.create({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software',
      status: 'unread'
    });

    assert.ok(created.id);
    assert.strictEqual(created.title, 'Clean Code');
    assert.strictEqual(created.author, 'Robert C. Martin');
    assert.strictEqual(created.genre, 'Software');
    assert.strictEqual(created.status, 'unread');
    assert.ok(created.createdAt);
    assert.ok(created.updatedAt);

    const found = repo.findById(created.id);
    assert.deepStrictEqual(found, created);
  });

  test('returns null when finding non-existent id', () => {
    const found = repo.findById('non-existent-id');
    assert.strictEqual(found, null);
  });

  test('lists all books ordered by created_at desc', () => {
    const b1 = repo.create({ title: 'Book 1', author: 'Author 1', genre: 'Fiction', status: 'unread' });
    const b2 = repo.create({ title: 'Book 2', author: 'Author 2', genre: 'Non-Fiction', status: 'read' });

    const all = repo.findAll();
    assert.strictEqual(all.length, 2);
    assert.strictEqual(all[0].id, b2.id); // Most recent first
    assert.strictEqual(all[1].id, b1.id);
  });

  test('filters books by reading status', () => {
    repo.create({ title: 'Book Unread', author: 'Author A', genre: 'Sci-Fi', status: 'unread' });
    repo.create({ title: 'Book Read', author: 'Author B', genre: 'Sci-Fi', status: 'read' });

    const unread = repo.findAll({ status: 'unread' });
    assert.strictEqual(unread.length, 1);
    assert.strictEqual(unread[0].title, 'Book Unread');

    const read = repo.findAll({ status: 'read' });
    assert.strictEqual(read.length, 1);
    assert.strictEqual(read[0].title, 'Book Read');
  });

  test('searches books by title or author substring', () => {
    repo.create({ title: 'Foundation', author: 'Isaac Asimov', genre: 'Sci-Fi', status: 'unread' });
    repo.create({ title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'read' });

    const titleSearch = repo.findAll({ search: 'Hobbit' });
    assert.strictEqual(titleSearch.length, 1);
    assert.strictEqual(titleSearch[0].title, 'The Hobbit');

    const authorSearch = repo.findAll({ search: 'Asimov' });
    assert.strictEqual(authorSearch.length, 1);
    assert.strictEqual(authorSearch[0].title, 'Foundation');
  });

  test('updates reading status and updatedAt timestamp', () => {
    const book = repo.create({ title: 'Test Book', author: 'Test Author', genre: 'Tech', status: 'unread' });

    const updated = repo.updateStatus(book.id, 'read');
    assert.ok(updated);
    assert.strictEqual(updated.status, 'read');
    assert.strictEqual(updated.title, 'Test Book');
  });

  test('returns null when updating status of non-existent book', () => {
    const updated = repo.updateStatus('does-not-exist', 'read');
    assert.strictEqual(updated, null);
  });

  test('updates book details and updates updatedAt timestamp', () => {
    const book = repo.create({ title: 'Original Title', author: 'Original Author', genre: 'Sci-Fi', status: 'unread' });

    const updated = repo.update(book.id, {
      title: 'Edited Title',
      author: 'Edited Author',
      genre: 'Speculative Fiction',
      status: 'read'
    });

    assert.ok(updated);
    assert.strictEqual(updated.title, 'Edited Title');
    assert.strictEqual(updated.author, 'Edited Author');
    assert.strictEqual(updated.genre, 'Speculative Fiction');
    assert.strictEqual(updated.status, 'read');
    assert.ok(updated.updatedAt);
  });

  test('updates partial book fields', () => {
    const book = repo.create({ title: 'Partially Edited', author: 'Author', genre: 'History', status: 'unread' });

    const updated = repo.update(book.id, { title: 'Updated Title Only' });
    assert.ok(updated);
    assert.strictEqual(updated.title, 'Updated Title Only');
    assert.strictEqual(updated.author, 'Author');
    assert.strictEqual(updated.genre, 'History');
    assert.strictEqual(updated.status, 'unread');
  });

  test('returns null when updating non-existent book', () => {
    const updated = repo.update('fake-id', { title: 'New' });
    assert.strictEqual(updated, null);
  });

  test('deletes a book by id and returns boolean status', () => {
    const book = repo.create({ title: 'To Delete', author: 'Author', genre: 'Mystery', status: 'unread' });

    const deleted = repo.delete(book.id);
    assert.strictEqual(deleted, true);
    assert.strictEqual(repo.findById(book.id), null);

    const deleteAgain = repo.delete(book.id);
    assert.strictEqual(deleteAgain, false);
  });
});

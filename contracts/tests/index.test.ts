import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  validateCreateBook,
  validateUpdateStatus,
  validateFilterQuery
} from '../src/index.js';

describe('Contracts — validateCreateBook', () => {
  test('validates correct input and trims whitespace', () => {
    const input = {
      title: '  The Hobbit  ',
      author: ' J.R.R. Tolkien ',
      genre: ' Fantasy ',
      status: 'unread'
    };
    const res = validateCreateBook(input);
    assert.strictEqual(res.isValid, true);
    assert.deepStrictEqual(res.value, {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      status: 'unread'
    });
  });

  test('defaults status to unread when omitted', () => {
    const input = {
      title: 'Dune',
      author: 'Frank Herbert',
      genre: 'Sci-Fi'
    };
    const res = validateCreateBook(input);
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.value?.status, 'unread');
  });

  test('rejects missing or empty title, author, genre', () => {
    const res = validateCreateBook({
      title: '   ',
      author: '',
      genre: null
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.title);
    assert.ok(res.errors.author);
    assert.ok(res.errors.genre);
  });

  test('rejects non-object inputs', () => {
    const res = validateCreateBook(null);
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors._general);
  });

  test('rejects invalid status', () => {
    const res = validateCreateBook({
      title: 'Valid Title',
      author: 'Valid Author',
      genre: 'Valid Genre',
      status: 'in-progress'
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.status);
  });

  test('enforces length constraints', () => {
    const res = validateCreateBook({
      title: 'A'.repeat(201),
      author: 'B'.repeat(151),
      genre: 'C'.repeat(101)
    });
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.title);
    assert.ok(res.errors.author);
    assert.ok(res.errors.genre);
  });
});

describe('Contracts — validateUpdateStatus', () => {
  test('accepts unread and read status', () => {
    assert.strictEqual(validateUpdateStatus({ status: 'read' }).isValid, true);
    assert.strictEqual(validateUpdateStatus({ status: 'unread' }).isValid, true);
  });

  test('rejects invalid status values', () => {
    assert.strictEqual(validateUpdateStatus({ status: 'reading' }).isValid, false);
    assert.strictEqual(validateUpdateStatus({ status: 123 }).isValid, false);
    assert.strictEqual(validateUpdateStatus(null).isValid, false);
  });
});

describe('Contracts — validateFilterQuery', () => {
  test('handles undefined or non-object query', () => {
    const res = validateFilterQuery(undefined);
    assert.deepStrictEqual(res, { status: 'all' });
  });

  test('normalizes search and valid status', () => {
    const res = validateFilterQuery({ search: '  tolkien  ', status: 'read' });
    assert.deepStrictEqual(res, { search: 'tolkien', status: 'read' });
  });

  test('defaults invalid status to all', () => {
    const res = validateFilterQuery({ search: '', status: 'unknown' });
    assert.deepStrictEqual(res, { status: 'all' });
  });
});

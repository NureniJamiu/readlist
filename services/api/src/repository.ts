import { type Database as DatabaseType } from 'better-sqlite3';
import crypto from 'node:crypto';
import {
  type Book,
  type ReadingStatus,
  type BookFilterQuery
} from '@readlist/contracts';
import { getDatabase } from './db.js';

interface BookRow {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: 'unread' | 'read';
  created_at: string;
  updated_at: string;
}

function mapRowToBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class BookRepository {
  private db: DatabaseType;

  constructor(db?: DatabaseType) {
    this.db = db || getDatabase();
  }

  findAll(filters?: BookFilterQuery): Book[] {
    let query = 'SELECT id, title, author, genre, status, created_at, updated_at FROM books WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.status && (filters.status === 'unread' || filters.status === 'read')) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim()}%`;
      query += ' AND (title LIKE ? OR author LIKE ?)';
      params.push(term, term);
    }

    query += ' ORDER BY created_at DESC, rowid DESC';

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as BookRow[];
    return rows.map(mapRowToBook);
  }

  findById(id: string): Book | null {
    const stmt = this.db.prepare(
      'SELECT id, title, author, genre, status, created_at, updated_at FROM books WHERE id = ?'
    );
    const row = stmt.get(id) as BookRow | undefined;
    return row ? mapRowToBook(row) : null;
  }

  create(data: { title: string; author: string; genre: string; status: ReadingStatus }): Book {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO books (id, title, author, genre, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.title, data.author, data.genre, data.status, now, now);

    return {
      id,
      title: data.title,
      author: data.author,
      genre: data.genre,
      status: data.status,
      createdAt: now,
      updatedAt: now
    };
  }

  updateStatus(id: string, status: ReadingStatus): Book | null {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      UPDATE books
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);

    const result = stmt.run(status, now, id);
    if (result.changes === 0) {
      return null;
    }

    return this.findById(id);
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM books WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

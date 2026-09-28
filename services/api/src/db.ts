import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

let defaultDbInstance: DatabaseType | null = null;

export function initializeDatabase(dbPath?: string): DatabaseType {
  const targetPath = dbPath || process.env.DB_PATH || path.resolve(process.cwd(), 'readlist.db');

  if (targetPath !== ':memory:') {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(targetPath);

  if (targetPath !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }

  db.pragma('foreign_keys = ON');

  // Schema creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('unread', 'read')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
    CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
  `);

  return db;
}

export function getDatabase(): DatabaseType {
  if (!defaultDbInstance) {
    defaultDbInstance = initializeDatabase();
  }
  return defaultDbInstance;
}

export function closeDatabase(): void {
  if (defaultDbInstance) {
    defaultDbInstance.close();
    defaultDbInstance = null;
  }
}

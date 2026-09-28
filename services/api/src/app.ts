import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { BookRepository } from './repository.js';
import { createBooksRouter } from './routes/books.js';

export function createApp(repo?: BookRepository): Express {
  const app = express();
  const bookRepository = repo || new BookRepository();

  app.use(cors());
  app.use(express.json());

  // Healthcheck endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Books API endpoints
  app.use('/api/books', createBooksRouter(bookRepository));

  // 404 handler for undefined routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found'
    });
  });

  // Global error handler
  app.use((err: unknown, _req: Request, res: Response) => {
    console.error('Unhandled API Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  });

  return app;
}

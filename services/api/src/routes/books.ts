import { Router, type Request, type Response } from 'express';
import {
  validateCreateBook,
  validateUpdateStatus,
  validateFilterQuery,
  type ApiResponse,
  type Book
} from '@readlist/contracts';
import { BookRepository } from '../repository.js';

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : (id as string);
}

export function createBooksRouter(repo: BookRepository): Router {
  const router = Router();

  // GET /api/books - list books with optional filtering
  router.get('/', (req: Request, res: Response<ApiResponse<Book[]>>) => {
    const filters = validateFilterQuery(req.query);
    const books = repo.findAll(filters);
    res.json({
      success: true,
      data: books
    });
  });

  // GET /api/books/:id - get single book
  router.get('/:id', (req: Request, res: Response<ApiResponse<Book>>) => {
    const id = getParamId(req);
    const book = repo.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  });

  // POST /api/books - create new book
  router.post('/', (req: Request, res: Response<ApiResponse<Book>>) => {
    const validation = validateCreateBook(req.body);
    if (!validation.isValid || !validation.value) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const created = repo.create(validation.value);
    res.status(201).json({
      success: true,
      data: created
    });
  });

  // PATCH /api/books/:id/status - update reading status
  router.patch('/:id/status', (req: Request, res: Response<ApiResponse<Book>>) => {
    const id = getParamId(req);
    const validation = validateUpdateStatus(req.body);
    if (!validation.isValid || !validation.value) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const updated = repo.updateStatus(id, validation.value.status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: updated
    });
  });

  // DELETE /api/books/:id - remove a book
  router.delete('/:id', (req: Request, res: Response<ApiResponse<{ id: string }>>) => {
    const id = getParamId(req);
    const deleted = repo.delete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: { id }
    });
  });

  return router;
}

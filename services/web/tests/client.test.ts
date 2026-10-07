import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, ApiError } from '../src/api/client';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('http://localhost:3001');
    vi.restoreAllMocks();
  });

  it('fetches books with query parameters', async () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', author: 'Author 1', genre: 'Fiction', status: 'unread', createdAt: '', updatedAt: '' }
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockBooks })
    } as Response);

    const books = await client.getBooks({ status: 'unread', search: 'Book' });
    expect(books).toEqual(mockBooks);
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/api/books?status=unread&search=Book',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('creates a new book', async () => {
    const newBook = {
      id: '2',
      title: 'New Book',
      author: 'New Author',
      genre: 'Tech',
      status: 'unread' as const,
      createdAt: '',
      updatedAt: ''
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true, data: newBook })
    } as Response);

    const result = await client.createBook({
      title: 'New Book',
      author: 'New Author',
      genre: 'Tech',
      status: 'unread'
    });

    expect(result).toEqual(newBook);
  });

  it('updates reading status', async () => {
    const updatedBook = {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      genre: 'Tech',
      status: 'read' as const,
      createdAt: '',
      updatedAt: ''
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: updatedBook })
    } as Response);

    const result = await client.updateBookStatus('1', 'read');
    expect(result.status).toBe('read');
  });

  it('updates a book with PUT request', async () => {
    const updatedBook = {
      id: '1',
      title: 'Updated Title',
      author: 'Updated Author',
      genre: 'Non-Fiction',
      status: 'read' as const,
      createdAt: '',
      updatedAt: ''
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: updatedBook })
    } as Response);

    const result = await client.updateBook('1', {
      title: 'Updated Title',
      author: 'Updated Author',
      genre: 'Non-Fiction',
      status: 'read'
    });

    expect(result).toEqual(updatedBook);
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/api/books/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Title',
          author: 'Updated Author',
          genre: 'Non-Fiction',
          status: 'read'
        })
      })
    );
  });

  it('deletes a book', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { id: '1' } })
    } as Response);

    await client.deleteBook('1');
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:3001/api/books/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('throws ApiError on failed response with validation details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: 'Validation failed',
        details: { title: ['Title is required'] }
      })
    } as Response);

    await expect(
      client.createBook({ title: '', author: '', genre: '' })
    ).rejects.toThrow(ApiError);
  });
});

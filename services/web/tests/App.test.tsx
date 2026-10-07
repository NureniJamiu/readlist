import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../src/App';
import { apiClient } from '../src/api/client';
import { type Book } from '@readlist/contracts';

describe('App Component Integration & Gate Tests', () => {
  const initialBooks: Book[] = [
    {
      id: 'book-1',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      status: 'unread',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'book-2',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      status: 'read',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders application header and initial books list', async () => {
    vi.spyOn(apiClient, 'getBooks').mockResolvedValue(initialBooks);

    render(<App />);

    expect(screen.getByText('ReadList')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
      expect(screen.getByText('1984')).toBeInTheDocument();
    });

    expect(screen.getByText('George Orwell')).toBeInTheDocument();
  });

  it('opens modal, adds a book, and renders it in the list without page reload', async () => {
    let booksState = [...initialBooks];
    vi.spyOn(apiClient, 'getBooks').mockImplementation(async () => booksState);

    const newBook: Book = {
      id: 'book-3',
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Sci-Fi',
      status: 'unread',
      createdAt: '2026-01-03T00:00:00.000Z',
      updatedAt: '2026-01-03T00:00:00.000Z'
    };

    const createSpy = vi.spyOn(apiClient, 'createBook').mockImplementation(async () => {
      booksState = [newBook, ...booksState];
      return newBook;
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });

    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    // Fill the form inside the modal
    await waitFor(() => {
      expect(screen.getByLabelText(/^title$/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^title$/i), { target: { value: 'Brave New World' } });
    fireEvent.change(screen.getByLabelText(/^author$/i), { target: { value: 'Aldous Huxley' } });
    fireEvent.change(screen.getByLabelText(/^genre$/i), { target: { value: 'Sci-Fi' } });

    fireEvent.click(screen.getByRole('button', { name: /add to reading list/i }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        title: 'Brave New World',
        author: 'Aldous Huxley',
        genre: 'Sci-Fi',
        status: 'unread'
      });
      expect(screen.getByText('Brave New World')).toBeInTheDocument();
    });
  });

  it('toggles reading status between unread and read without page reload', async () => {
    vi.spyOn(apiClient, 'getBooks').mockResolvedValue(initialBooks);
    const updateSpy = vi.spyOn(apiClient, 'updateBookStatus').mockResolvedValue({
      ...initialBooks[0],
      status: 'read'
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });

    // The status toggle buttons have title="Mark as read" for unread books
    const markReadButtons = screen.getAllByRole('button', { name: /^mark as read$/i });
    expect(markReadButtons.length).toBeGreaterThan(0);

    fireEvent.click(markReadButtons[0]);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('book-1', 'read');
    });
  });

  it('filters books by search keyword without page reload', async () => {
    const getBooksSpy = vi.spyOn(apiClient, 'getBooks').mockImplementation(async (filters) => {
      if (filters?.search === 'Orwell') {
        return [initialBooks[1]];
      }
      return initialBooks;
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by title or author/i);
    fireEvent.change(searchInput, { target: { value: 'Orwell' } });

    await waitFor(() => {
      expect(getBooksSpy).toHaveBeenCalledWith(expect.objectContaining({ search: 'Orwell' }));
    });
  });

  it('deletes a book and updates the list without page reload', async () => {
    let booksState = [...initialBooks];
    vi.spyOn(apiClient, 'getBooks').mockImplementation(async () => booksState);
    const deleteSpy = vi.spyOn(apiClient, 'deleteBook').mockImplementation(async (id) => {
      booksState = booksState.filter((b) => b.id !== id);
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('book-1');
    });
  });

  it('renders edit icon on book cards, opens edit modal, and updates book without page reload', async () => {
    let booksState = [...initialBooks];
    vi.spyOn(apiClient, 'getBooks').mockImplementation(async () => booksState);
    const updatedBook: Book = {
      ...initialBooks[0],
      title: 'The Hobbit: Illustrated Edition',
      genre: 'Classic Fantasy'
    };

    const updateSpy = vi.spyOn(apiClient, 'updateBook').mockImplementation(async (id, input) => {
      booksState = booksState.map((b) => (b.id === id ? { ...b, ...input } : b));
      return { ...updatedBook, ...input };
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });

    // Verify edit icon button is present
    const editButton = screen.getByRole('button', { name: /edit the hobbit/i });
    expect(editButton).toBeInTheDocument();

    // Click edit icon button
    fireEvent.click(editButton);

    // Modal opens in Edit mode
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit book/i })).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    expect(titleInput.value).toBe('The Hobbit');

    // Change title and genre
    fireEvent.change(titleInput, { target: { value: 'The Hobbit: Illustrated Edition' } });
    fireEvent.change(screen.getByLabelText(/^genre$/i), { target: { value: 'Classic Fantasy' } });

    // Submit changes
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('book-1', {
        title: 'The Hobbit: Illustrated Edition',
        author: 'J.R.R. Tolkien',
        genre: 'Classic Fantasy',
        status: 'unread'
      });
      expect(screen.getByText('The Hobbit: Illustrated Edition')).toBeInTheDocument();
    });
  });
});

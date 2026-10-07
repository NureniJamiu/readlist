import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { App } from '../src/App';
import { apiClient } from '../src/api/client';

describe('Web UI Quality & Design System Evaluation Suite', () => {
  it('adheres to STYLE_GUIDE design token standards', async () => {
    vi.spyOn(apiClient, 'getBooks').mockResolvedValue([]);

    const { container } = render(<App />);

    // Check 1: Wine accent border on the left edge
    const accentContainer = container.querySelector('.border-wine');
    expect(accentContainer).toBeInTheDocument();

    // Check 2: Eyebrow labels present
    const eyebrows = container.querySelectorAll('.eyebrow-label');
    expect(eyebrows.length).toBeGreaterThanOrEqual(2);

    // Check 3: Heading tags use font-heading
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('font-heading');
  });

  it('verifies accessibility landmarks, form labels, and headings hierarchy', async () => {
    vi.spyOn(apiClient, 'getBooks').mockResolvedValue([]);

    render(<App />);

    // Open modal to verify form inputs and labels
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    // Form inputs must have matching labels
    expect(screen.getByLabelText(/^title$/i)).toHaveAttribute('id', 'book-title');
    expect(screen.getByLabelText(/^author$/i)).toHaveAttribute('id', 'book-author');
    expect(screen.getByLabelText(/^genre$/i)).toHaveAttribute('id', 'book-genre');
    expect(screen.getByLabelText(/^status$/i)).toHaveAttribute('id', 'book-status');

    // Search input has accessible label
    expect(screen.getByLabelText(/^search list$/i)).toHaveAttribute('id', 'book-search');

    // Section landmark
    expect(screen.getByRole('region', { name: /your books/i })).toBeInTheDocument();
  });

  it('resiliently displays error banner when API client rejects', async () => {
    vi.spyOn(apiClient, 'getBooks').mockRejectedValue(new Error('Backend service unavailable'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Backend service unavailable/i)).toBeInTheDocument();
    });
  });

  it('evaluates book edit flow: pre-population, modal accessibility, and submission payload', async () => {
    const mockBook = {
      id: 'book-eval-1',
      title: 'Domain-Driven Design',
      author: 'Eric Evans',
      genre: 'Architecture',
      status: 'unread' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    };

    vi.spyOn(apiClient, 'getBooks').mockResolvedValue([mockBook]);
    const updateSpy = vi.spyOn(apiClient, 'updateBook').mockResolvedValue({
      ...mockBook,
      title: 'Domain-Driven Design (Reference)'
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Domain-Driven Design')).toBeInTheDocument();
    });

    // Check edit button presence and accessibility
    const editBtn = screen.getByRole('button', { name: /edit domain-driven design/i });
    expect(editBtn).toBeInTheDocument();

    // Open edit modal
    fireEvent.click(editBtn);

    // Verify dialog accessibility and pre-populated values
    const dialog = screen.getByRole('dialog', { name: /edit book/i });
    expect(dialog).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    expect(titleInput.value).toBe('Domain-Driven Design');
    const authorInput = screen.getByLabelText(/^author$/i) as HTMLInputElement;
    expect(authorInput.value).toBe('Eric Evans');
    const genreInput = screen.getByLabelText(/^genre$/i) as HTMLInputElement;
    expect(genreInput.value).toBe('Architecture');

    // Make an edit and submit
    fireEvent.change(titleInput, { target: { value: 'Domain-Driven Design (Reference)' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('book-eval-1', {
        title: 'Domain-Driven Design (Reference)',
        author: 'Eric Evans',
        genre: 'Architecture',
        status: 'unread'
      });
    });
  });
});

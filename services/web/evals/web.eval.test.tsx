import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

    // Form inputs must have matching labels
    expect(screen.getByLabelText(/^title$/i)).toHaveAttribute('id', 'book-title');
    expect(screen.getByLabelText(/^author$/i)).toHaveAttribute('id', 'book-author');
    expect(screen.getByLabelText(/^genre$/i)).toHaveAttribute('id', 'book-genre');
    expect(screen.getByLabelText(/^initial reading status$/i)).toHaveAttribute('id', 'book-status');

    // Search input has accessible label
    expect(screen.getByLabelText(/^search list$/i)).toHaveAttribute('id', 'book-search');

    // Section landmark
    expect(screen.getByRole('region', { name: /reading backlog/i })).toBeInTheDocument();
  });

  it('resiliently displays error banner when API client rejects', async () => {
    vi.spyOn(apiClient, 'getBooks').mockRejectedValue(new Error('Backend service unavailable'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Backend service unavailable/i)).toBeInTheDocument();
    });
  });
});

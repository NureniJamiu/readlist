import React from 'react';
import { type Book } from '@readlist/contracts';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: Book['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  isLoading,
  onToggleStatus,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="py-12 text-center text-plum-secondary">
        <div className="inline-block w-8 h-8 border-4 border-wine border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Loading your reading backlog...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-cream/40 border border-dashed border-wine/40 rounded-xl p-10 text-center my-6">
        <span className="eyebrow-label text-rose-accent text-xs font-bold uppercase tracking-wider block mb-2">
          Your List is Empty
        </span>
        <h3 className="font-heading text-xl font-bold text-wine mb-2">
          No books found
        </h3>
        <p className="font-body text-plum-secondary text-sm max-w-md mx-auto">
          Capture a book recommendation using the form above, or adjust your search and status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

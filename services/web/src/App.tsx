import React, { useState, useEffect, useCallback } from 'react';
import { type Book, type CreateBookInput } from '@readlist/contracts';
import { apiClient, ApiError } from './api/client';
import { Header } from './components/Header';
import { ProcessFlow } from './components/ProcessFlow';
import { ReadingStats } from './components/ReadingStats';
import { BookForm } from './components/BookForm';
import { BookFilters } from './components/BookFilters';
import { BookList } from './components/BookList';

export const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Fetch all books (for accurate counts and calculations)
  const refreshAllBooks = useCallback(async () => {
    try {
      const data = await apiClient.getBooks();
      setAllBooks(data);
    } catch (err) {
      console.error('Failed to fetch count statistics:', err);
    }
  }, []);

  // Fetch filtered list
  const fetchFilteredBooks = useCallback(async () => {
    setIsLoading(true);
    setErrorBanner(null);
    try {
      const data = await apiClient.getBooks({
        search: searchTerm,
        status: statusFilter
      });
      setBooks(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not load books';
      setErrorBanner(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Initial load
  useEffect(() => {
    refreshAllBooks();
    fetchFilteredBooks();
  }, [refreshAllBooks, fetchFilteredBooks]);

  // Add book
  const handleAddBook = async (input: CreateBookInput): Promise<boolean> => {
    setIsSubmitting(true);
    setErrorBanner(null);
    try {
      await apiClient.createBook(input);
      await refreshAllBooks();
      await fetchFilteredBooks();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add book';
      setErrorBanner(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle status between 'unread' and 'read' without page reload
  const handleToggleStatus = async (id: string, currentStatus: Book['status']) => {
    const nextStatus: Book['status'] = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      // Optimistic state update in place
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: nextStatus, updatedAt: new Date().toISOString() } : b))
      );
      setAllBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: nextStatus, updatedAt: new Date().toISOString() } : b))
      );

      await apiClient.updateBookStatus(id, nextStatus);
      await refreshAllBooks();
      await fetchFilteredBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update reading status';
      setErrorBanner(msg);
      await fetchFilteredBooks();
    }
  };

  // Delete book without page reload
  const handleDeleteBook = async (id: string) => {
    try {
      // Optimistic delete
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setAllBooks((prev) => prev.filter((b) => b.id !== id));

      await apiClient.deleteBook(id);
      await refreshAllBooks();
      await fetchFilteredBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete book';
      setErrorBanner(msg);
      await fetchFilteredBooks();
    }
  };

  const counts = {
    all: allBooks.length,
    unread: allBooks.filter((b) => b.status === 'unread').length,
    read: allBooks.filter((b) => b.status === 'read').length
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Content wrapper with wine accent bar on the left per STYLE_GUIDE */}
      <div className="border-l-4 border-wine min-h-screen">
        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {errorBanner && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-xl flex items-center justify-between text-sm">
              <span>{errorBanner}</span>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="font-bold ml-4 text-red-900"
              >
                ✕
              </button>
            </div>
          )}

          <Header />
          <ProcessFlow />
          <ReadingStats total={counts.all} unread={counts.unread} read={counts.read} />
          <BookForm onAddBook={handleAddBook} isSubmitting={isSubmitting} />

          <section aria-labelledby="reading-list-heading">
            <div className="mb-2">
              <span className="eyebrow-label text-rose-accent text-xs font-bold uppercase tracking-wider block mb-1">
                Your Collection
              </span>
              <h2 id="reading-list-heading" className="font-heading text-2xl font-bold text-wine">
                Reading Backlog
              </h2>
            </div>

            <BookFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              counts={counts}
            />

            <BookList
              books={books}
              isLoading={isLoading}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteBook}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

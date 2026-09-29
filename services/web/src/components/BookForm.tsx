import React, { useState, useEffect, useRef } from 'react';
import { type CreateBookInput, type ReadingStatus } from '@readlist/contracts';

interface BookFormProps {
  onAddBook: (book: CreateBookInput) => Promise<boolean>;
  isSubmitting: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ onAddBook, isSubmitting, isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('unread');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the DOM has rendered
      const timer = setTimeout(() => titleInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'input, select, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setStatus('unread');
    setClientErrors({});
    setIsSuccessMessageVisible(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!author.trim()) errs.author = 'Author is required';
    if (!genre.trim()) errs.genre = 'Genre is required';
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onAddBook({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      status
    });

    if (success) {
      resetForm();
      setIsSuccessMessageVisible(true);
      setTimeout(() => {
        setIsSuccessMessageVisible(false);
        handleClose();
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add a book"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-plum/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg border border-wine/10 animate-in"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-wine/10">
          <h2 className="font-heading text-xl font-bold text-wine">Add a Book</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-plum-secondary hover:text-wine transition-colors p-1 -mr-1 rounded-md"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isSuccessMessageVisible && (
            <div className="mb-4 p-3 bg-wine text-white text-sm rounded-lg flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Book added to your list!
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 mb-5">
              {/* Title */}
              <div>
                <label htmlFor="book-title" className="block text-xs font-bold text-plum-secondary uppercase tracking-wide mb-1.5">
                  Title
                </label>
                <input
                  ref={titleInputRef}
                  id="book-title"
                  type="text"
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (clientErrors.title) setClientErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-cream-light/50 border ${
                    clientErrors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/20'
                  } text-plum placeholder-plum-secondary/40 focus:outline-none focus:ring-2 focus:ring-wine/40 focus:border-wine/40 transition-colors`}
                />
                {clientErrors.title && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{clientErrors.title}</p>
                )}
              </div>

              {/* Author */}
              <div>
                <label htmlFor="book-author" className="block text-xs font-bold text-plum-secondary uppercase tracking-wide mb-1.5">
                  Author
                </label>
                <input
                  id="book-author"
                  type="text"
                  placeholder="e.g. Yuval Noah Harari"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    if (clientErrors.author) setClientErrors((prev) => ({ ...prev, author: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-cream-light/50 border ${
                    clientErrors.author ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/20'
                  } text-plum placeholder-plum-secondary/40 focus:outline-none focus:ring-2 focus:ring-wine/40 focus:border-wine/40 transition-colors`}
                />
                {clientErrors.author && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{clientErrors.author}</p>
                )}
              </div>

              {/* Genre + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="book-genre" className="block text-xs font-bold text-plum-secondary uppercase tracking-wide mb-1.5">
                    Genre
                  </label>
                  <input
                    id="book-genre"
                    type="text"
                    placeholder="e.g. Non-Fiction"
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value);
                      if (clientErrors.genre) setClientErrors((prev) => ({ ...prev, genre: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-cream-light/50 border ${
                      clientErrors.genre ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/20'
                    } text-plum placeholder-plum-secondary/40 focus:outline-none focus:ring-2 focus:ring-wine/40 focus:border-wine/40 transition-colors`}
                  />
                  {clientErrors.genre && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{clientErrors.genre}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="book-status" className="block text-xs font-bold text-plum-secondary uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    id="book-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-cream-light/50 border border-wine/20 text-plum focus:outline-none focus:ring-2 focus:ring-wine/40 focus:border-wine/40 transition-colors"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-wine/10">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-medium text-plum-secondary hover:text-plum px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-wine hover:bg-wine-dark text-white font-body font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-60 flex items-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add to Reading List'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { type CreateBookInput, type ReadingStatus } from '@readlist/contracts';

interface BookFormProps {
  onAddBook: (book: CreateBookInput) => Promise<boolean>;
  isSubmitting: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({ onAddBook, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('unread');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

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
      setTitle('');
      setAuthor('');
      setGenre('');
      setStatus('unread');
      setClientErrors({});
      setIsSuccessMessageVisible(true);
      setTimeout(() => setIsSuccessMessageVisible(false), 3000);
    }
  };

  return (
    <div className="bg-cream border border-wine rounded-xl p-6 mb-8 shadow-sm">
      <div className="mb-4">
        <span className="eyebrow-label text-rose-accent text-xs font-bold uppercase tracking-wider block mb-1">
          Capture Recommendation
        </span>
        <h2 className="font-heading text-xl font-bold text-wine">Add a Book</h2>
      </div>

      {isSuccessMessageVisible && (
        <div className="mb-4 p-3 bg-wine text-white text-sm rounded-lg flex items-center justify-between">
          <span>Book successfully added to your list!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Title input */}
          <div>
            <label htmlFor="book-title" className="block text-xs font-bold text-rose-accent uppercase mb-1">
              Title
            </label>
            <input
              id="book-title"
              type="text"
              placeholder="e.g. Sapiens: A Brief History of Humankind"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (clientErrors.title) {
                  setClientErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              className={`w-full px-3.5 py-2 rounded-lg bg-white border ${
                clientErrors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/40'
              } text-plum placeholder-plum-secondary/50 focus:outline-none focus:ring-2 focus:ring-wine`}
            />
            {clientErrors.title && (
              <p className="text-red-700 text-xs mt-1 font-medium">{clientErrors.title}</p>
            )}
          </div>

          {/* Author input */}
          <div>
            <label htmlFor="book-author" className="block text-xs font-bold text-rose-accent uppercase mb-1">
              Author
            </label>
            <input
              id="book-author"
              type="text"
              placeholder="e.g. Yuval Noah Harari"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (clientErrors.author) {
                  setClientErrors((prev) => ({ ...prev, author: '' }));
                }
              }}
              className={`w-full px-3.5 py-2 rounded-lg bg-white border ${
                clientErrors.author ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/40'
              } text-plum placeholder-plum-secondary/50 focus:outline-none focus:ring-2 focus:ring-wine`}
            />
            {clientErrors.author && (
              <p className="text-red-700 text-xs mt-1 font-medium">{clientErrors.author}</p>
            )}
          </div>

          {/* Genre input */}
          <div>
            <label htmlFor="book-genre" className="block text-xs font-bold text-rose-accent uppercase mb-1">
              Genre
            </label>
            <input
              id="book-genre"
              type="text"
              placeholder="e.g. Non-Fiction, Philosophy, Sci-Fi"
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                if (clientErrors.genre) {
                  setClientErrors((prev) => ({ ...prev, genre: '' }));
                }
              }}
              className={`w-full px-3.5 py-2 rounded-lg bg-white border ${
                clientErrors.genre ? 'border-red-500 ring-1 ring-red-500' : 'border-wine/40'
              } text-plum placeholder-plum-secondary/50 focus:outline-none focus:ring-2 focus:ring-wine`}
            />
            {clientErrors.genre && (
              <p className="text-red-700 text-xs mt-1 font-medium">{clientErrors.genre}</p>
            )}
          </div>

          {/* Status select */}
          <div>
            <label htmlFor="book-status" className="block text-xs font-bold text-rose-accent uppercase mb-1">
              Initial Reading Status
            </label>
            <select
              id="book-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReadingStatus)}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-wine/40 text-plum focus:outline-none focus:ring-2 focus:ring-wine"
            >
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-wine hover:bg-wine-dark text-white font-body font-semibold px-6 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? 'Adding...' : 'Add to Reading List'}
          </button>
        </div>
      </form>
    </div>
  );
};

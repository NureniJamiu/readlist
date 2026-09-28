import React, { useState } from 'react';
import { type Book } from '@readlist/contracts';

interface BookCardProps {
  book: Book;
  onToggleStatus: (id: string, currentStatus: Book['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onToggleStatus, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggleStatus(book.id, book.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(book.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isRead = book.status === 'read';

  return (
    <article
      data-testid={`book-card-${book.id}`}
      className="bg-cream border border-wine rounded-xl p-5 shadow-sm transition-all duration-150 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Genre badge in dusty rose */}
          <span className="bg-rose-accent text-white text-xs font-semibold px-2.5 py-0.5 rounded-pill uppercase tracking-wider">
            {book.genre}
          </span>

          {/* Reading status pill */}
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-pill ${
              isRead ? 'bg-wine text-white' : 'bg-white/80 text-plum border border-wine/30'
            }`}
          >
            {isRead ? '✓ Read' : '○ Unread'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl font-bold text-wine mb-1 leading-snug">
          {book.title}
        </h3>

        {/* Author */}
        <p className="font-body text-plum-secondary text-sm font-medium mb-3">
          by <span className="text-plum font-semibold">{book.author}</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-3 border-t border-rose-accent/20 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            isRead
              ? 'bg-white/70 hover:bg-white text-plum border border-wine/40'
              : 'bg-wine hover:bg-wine-dark text-white'
          } disabled:opacity-50`}
        >
          {isUpdating ? 'Updating...' : isRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>

        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs bg-red-700 hover:bg-red-800 text-white font-semibold px-2.5 py-1 rounded"
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs bg-white text-plum px-2 py-1 rounded border border-wine/30 hover:bg-cream"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-rose-accent hover:text-wine font-medium transition-colors px-2 py-1"
            title="Remove book"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

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
      className={`group relative rounded-xl border transition-all duration-200 flex flex-col ${
        isRead
          ? 'bg-cream/50 border-wine/15'
          : 'bg-white border-wine/25 hover:border-wine/50 hover:shadow-md'
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 rounded-t-xl ${isRead ? 'bg-wine/20' : 'bg-wine'}`}
        aria-hidden="true"
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Genre + Status row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-accent">
            {book.genre}
          </span>

          {/* Status badge (display only) */}
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isRead
                ? 'bg-wine/10 text-wine'
                : 'bg-cream text-plum-secondary'
            }`}
          >
            {isRead ? '✓ Read' : 'Unread'}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-heading text-lg font-bold leading-snug mb-1 ${
          isRead ? 'text-wine/60' : 'text-wine'
        }`}>
          {book.title}
        </h3>

        {/* Author */}
        <p className={`font-body text-sm mb-4 ${isRead ? 'text-plum-secondary/60' : 'text-plum-secondary'}`}>
          {book.author}
        </p>

        {/* Bottom actions */}
        <div className="mt-auto pt-3 border-t border-wine/10 flex items-center justify-between gap-2">
          {/* Mark as Read / Unread button */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50 ${
              isRead
                ? 'bg-white border border-wine/30 text-plum hover:bg-cream-dark'
                : 'bg-wine text-white hover:bg-wine-dark'
            }`}
          >
            {isUpdating ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : isRead ? (
              'Mark as Unread'
            ) : (
              'Mark as Read'
            )}
          </button>

          {/* Delete */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-2.5 py-1 rounded-md transition-colors"
              >
                {isDeleting ? 'Removing...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs text-plum-secondary hover:text-plum px-2 py-1 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-plum-secondary/50 hover:text-red-600 font-medium transition-colors px-1"
              title="Remove book"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};


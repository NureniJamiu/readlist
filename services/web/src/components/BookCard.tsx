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

          <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            title={isRead ? 'Mark as unread' : 'Mark as read'}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${
              isRead
                ? 'bg-wine/10 text-wine hover:bg-wine/20'
                : 'bg-cream text-plum-secondary hover:bg-wine hover:text-white'
            }`}
          >
            {isUpdating ? (
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isRead ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Read
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Unread
              </>
            )}
          </button>
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
        <div className="mt-auto pt-3 border-t border-wine/10 flex items-center justify-between">
          <time
            className="text-[11px] text-plum-secondary/50 font-body"
            dateTime={book.createdAt}
          >
            Added {new Date(book.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>

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
              className="text-xs text-plum-secondary/40 hover:text-red-600 font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 px-1"
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

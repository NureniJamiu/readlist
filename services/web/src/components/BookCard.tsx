import React, { useState } from 'react';
import { type Book } from '@readlist/contracts';

interface BookCardProps {
  book: Book;
  onToggleStatus: (id: string, currentStatus: Book['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onToggleStatus, onDelete, onEdit }) => {
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
      className={`group relative rounded-xl border transition-all duration-200 flex flex-col ${isRead
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
          <span className="text-[11px] font-bold text-rose-accent">
            {book.genre}
          </span>

          {/* Status badge (display only) */}
          <span
            className={`text-[11px] font-bold capitalize tracking-wider px-2 py-0.5 rounded-full ${isRead
              ? 'bg-wine/10 text-wine'
              : 'bg-cream text-plum-secondary'
              }`}
          >
            {isRead ? '✓ Read' : 'Unread'}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-heading text-lg font-bold leading-snug mb-1 ${isRead ? 'text-wine/60' : 'text-wine'
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
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50 ${isRead
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

          {/* Action icons: Edit and Delete */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(book)}
              className="text-wine hover:text-wine-dark transition-colors p-1 rounded-md"
              title="Edit book"
              aria-label={`Edit ${book.title}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" />
              </svg>
              <span className="sr-only">Edit</span>
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
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md"
                title="Remove book"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4M12.667 4v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
                </svg>
                <span className="sr-only">Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};


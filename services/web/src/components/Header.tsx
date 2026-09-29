import React from 'react';

interface HeaderProps {
  onAddBookClick: () => void;
  bookCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddBookClick, bookCount }) => {
  return (
    <header className="mb-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-wine">
            ReadList
          </h1>
          <p className="font-body text-plum-secondary text-sm mt-1">
            {bookCount === 0
              ? 'Your reading backlog is empty. Add your first book.'
              : `${bookCount} ${bookCount === 1 ? 'book' : 'books'} in your collection`}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddBookClick}
          className="bg-wine hover:bg-wine-dark text-white font-body font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-2 text-sm shadow-sm"
        >
          <span className="text-lg leading-none" aria-hidden="true">+</span>
          Add Book
        </button>
      </div>

      <div className="mt-4 h-px bg-wine/15" aria-hidden="true" />
    </header>
  );
};

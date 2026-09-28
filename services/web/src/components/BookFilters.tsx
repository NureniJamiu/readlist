import React from 'react';

interface BookFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedStatus: 'all' | 'unread' | 'read';
  onStatusChange: (status: 'all' | 'unread' | 'read') => void;
  counts: {
    all: number;
    unread: number;
    read: number;
  };
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  counts
}) => {
  return (
    <div className="bg-white border border-wine/30 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="flex-1 max-w-md">
          <label htmlFor="book-search" className="block text-xs font-bold text-rose-accent uppercase mb-1">
            Search List
          </label>
          <div className="relative">
            <input
              id="book-search"
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2 rounded-lg bg-cream/30 border border-wine/30 text-plum placeholder-plum-secondary/50 focus:outline-none focus:ring-2 focus:ring-wine"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-accent hover:text-wine font-bold text-xs"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status filter pills */}
        <div>
          <span className="block text-xs font-bold text-rose-accent uppercase mb-1">
            Filter Status
          </span>
          <div className="inline-flex p-1 bg-cream/40 border border-wine/20 rounded-pill gap-1">
            <button
              type="button"
              onClick={() => onStatusChange('all')}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-all duration-150 ${
                selectedStatus === 'all'
                  ? 'bg-wine text-white shadow-sm'
                  : 'text-plum hover:bg-cream/80'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('unread')}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-all duration-150 ${
                selectedStatus === 'unread'
                  ? 'bg-wine text-white shadow-sm'
                  : 'text-plum hover:bg-cream/80'
              }`}
            >
              Unread ({counts.unread})
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('read')}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold transition-all duration-150 ${
                selectedStatus === 'read'
                  ? 'bg-wine text-white shadow-sm'
                  : 'text-plum hover:bg-cream/80'
              }`}
            >
              Read ({counts.read})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

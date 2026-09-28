import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-wine text-white rounded-xl mb-8 p-8 md:p-10 shadow-sm">
      {/* Decorative soft circular elements in corner per style guide */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-rose-accent/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-12 -bottom-20 w-48 h-48 rounded-full bg-rose-accent/10"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl">
        <span className="eyebrow-label text-rose-accent tracking-widest text-xs uppercase font-bold block mb-2">
          ReadList • Personal Backlog
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Track Books You Want to Read
        </h1>
        <p className="font-body text-base md:text-lg italic text-rose-accent/90 max-w-2xl">
          A distraction-free space to capture book recommendations, organize your backlog, and celebrate reading progress.
        </p>
      </div>
    </header>
  );
};

import React from 'react';

interface ReadingStatsProps {
  total: number;
  unread: number;
  read: number;
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({ total, unread, read }) => {
  const completionRate = total > 0 ? Math.round((read / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Cream Card: Backlog / Unread */}
      <div className="bg-cream border border-wine rounded-xl p-6 text-plum flex flex-col justify-between">
        <div>
          <span className="eyebrow-label text-rose-accent text-xs font-bold uppercase tracking-wider block mb-1">
            Backlog
          </span>
          <h2 className="font-heading text-xl font-bold text-wine mb-2">
            Books to Read
          </h2>
          <p className="font-body text-plum-secondary text-sm">
            Titles waiting in your queue ready for your next reading session.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-rose-accent/30 flex items-baseline justify-between">
          <span className="text-3xl font-heading font-bold text-wine">{unread}</span>
          <span className="text-xs font-bold text-rose-accent uppercase">
            {unread === 1 ? '1 Book Waiting' : `${unread} Books Waiting`}
          </span>
        </div>
      </div>

      {/* Wine Card: Completed / Read */}
      <div className="bg-wine text-white rounded-xl p-6 flex flex-col justify-between">
        <div>
          <span className="eyebrow-label text-rose-accent text-xs font-bold uppercase tracking-wider block mb-1">
            Progress
          </span>
          <h2 className="font-heading text-xl font-bold text-white mb-2">
            Books Finished
          </h2>
          <p className="font-body text-white/80 text-sm">
            Completed books celebrating your ongoing reading momentum.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-rose-accent/30 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-white">{read}</span>
            <span className="text-xs text-white/70">/ {total} Total</span>
          </div>
          <span className="text-xs font-bold text-rose-accent uppercase">
            {completionRate}% Completed
          </span>
        </div>
      </div>
    </div>
  );
};

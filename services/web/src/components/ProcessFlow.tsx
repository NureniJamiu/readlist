import React from 'react';

const STEPS = [
  'Add Book',
  'View List',
  'Read Book',
  'Mark as Read',
  'Remove'
];

export const ProcessFlow: React.FC = () => {
  return (
    <div className="bg-wine rounded-xl p-4 md:p-5 mb-8 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[620px] gap-2 px-2">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white text-wine text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="pill-step whitespace-nowrap text-xs font-semibold bg-rose-accent text-white px-3 py-1 rounded-pill">
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <span className="text-white/70 font-bold select-none text-base" aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

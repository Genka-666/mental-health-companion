import React from 'react';

export default function ProgressDots({ total, current }) {
  return (
    <div className="progress-container" aria-label={`Step ${current + 1} of ${total}`}>
      <div className="progress-dots">
        {Array.from({ length: total }).map((_, idx) => {
          const isDone = idx < current;
          const isCurrent = idx === current;
          return (
            <span
              key={idx}
              className={`dot ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}
            />
          );
        })}
      </div>
      <span className="step-counter text-sm">
        {current + 1} of {total}
      </span>

      <style>{`
        .progress-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .progress-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background: var(--border);
          transition: all 0.2s ease;
        }
        .dot.done {
          background: var(--accent);
          opacity: 0.6;
        }
        .dot.active {
          width: 20px;
          background: var(--accent);
          opacity: 1;
        }
        .step-counter {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

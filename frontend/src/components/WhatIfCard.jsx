import React from 'react';

export default function WhatIfCard({ label, delta }) {
  const isPositive = delta > 0;
  const sign = delta > 0 ? '+' : '';

  return (
    <div className="what-if-card">
      <div className="what-if-content">
        <span className="what-if-tag">What-If Simulation</span>
        <div className="what-if-label">{label}</div>
        <p className="text-xs" style={{ color: 'var(--muted)', marginTop: '2px' }}>
          In this survey dataset, peers with this pattern averaged around this score change.
        </p>
      </div>
      <div className={`delta-badge ${isPositive ? 'positive' : 'neutral'}`}>
        {sign}{delta.toFixed(2)}
      </div>

      <style>{`
        .what-if-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }
        .what-if-content {
          flex: 1;
        }
        .what-if-tag {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--accent);
        }
        .what-if-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin-top: 2px;
        }
        .delta-badge {
          font-size: 1rem;
          font-weight: 700;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-pill);
          white-space: nowrap;
        }
        .delta-badge.positive {
          background: var(--accent-soft);
          color: var(--accent);
        }
        .delta-badge.neutral {
          background: var(--bg);
          color: var(--muted);
          border: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

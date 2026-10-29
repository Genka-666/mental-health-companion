import React from 'react';

export default function TipCard({ title, body }) {
  return (
    <div className="tip-card card">
      <div className="tip-header">
        <div className="tip-icon-dot" />
        <h3 className="tip-title">{title}</h3>
      </div>
      <p className="tip-body">{body}</p>

      <style>{`
        .tip-card {
          padding: 1.15rem 1.25rem;
          margin-bottom: 0.85rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
        }
        .tip-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.35rem;
        }
        .tip-icon-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background: var(--accent);
        }
        .tip-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
        }
        .tip-body {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

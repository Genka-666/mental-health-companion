import React from 'react';

export default function SegmentedControl({ options, value, onChange, label, name }) {
  return (
    <div className="segmented-wrapper" role="radiogroup" aria-label={label || name}>
      {options.map((opt) => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        const isSelected = value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`segmented-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onChange(optValue)}
          >
            {optLabel}
          </button>
        );
      })}

      <style>{`
        .segmented-wrapper {
          display: flex;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          padding: 4px;
          gap: 4px;
          width: 100%;
        }
        .segmented-item {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.6rem 0.75rem;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--muted);
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .segmented-item:hover {
          color: var(--text);
        }
        .segmented-item.selected {
          background: var(--surface);
          color: var(--text);
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}

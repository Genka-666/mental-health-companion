import React from 'react';

export default function TrendLine({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="trend-empty text-center text-sm">
        No check-ins yet. Take your first check-in to start tracking!
      </div>
    );
  }

  if (items.length === 1) {
    const single = items[0];
    return (
      <div className="trend-empty text-center text-sm">
        First check-in recorded: <strong>{single.score.toFixed(1)} / 10</strong> ({single.band}).
        <div style={{ marginTop: '4px', color: 'var(--muted)' }}>
          Complete another check-in in a few days to view your trend line.
        </div>
      </div>
    );
  }

  // Width & height
  const width = 480;
  const height = 160;
  const padding = 28;

  // Max score 10, Min 0
  const minScore = 0;
  const maxScore = 10;

  const points = items.map((it, idx) => {
    const x = padding + (idx / (items.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((it.score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
    return { x, y, score: it.score, band: it.band, date: it.created_at };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="trend-line-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg">
        {/* Horizontal reference lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border)" strokeDasharray="4 4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--border)" strokeDasharray="4 4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" />

        {/* Labels */}
        <text x={8} y={padding + 4} fill="var(--muted)" fontSize="10">10</text>
        <text x={12} y={height / 2 + 4} fill="var(--muted)" fontSize="10">5</text>
        <text x={12} y={height - padding + 4} fill="var(--muted)" fontSize="10">0</text>

        {/* The line */}
        <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle cx={pt.x} cy={pt.y} r="5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5" />
            <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="600">
              {pt.score.toFixed(1)}
            </text>
          </g>
        ))}
      </svg>

      <style>{`
        .trend-line-container {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1rem 0.5rem;
          margin-bottom: 1.5rem;
        }
        .trend-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .trend-empty {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.75rem 1rem;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}

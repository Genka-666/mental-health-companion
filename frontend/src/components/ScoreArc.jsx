import React from 'react';

export default function ScoreArc({ score, band }) {
  // Score is 0 - 10
  const normalized = Math.max(0, Math.min(10, score || 0));
  const percentage = normalized / 10;
  
  // Circumference for r=68 is 2 * PI * 68 = 427.25
  const radius = 68;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  // Use a 260 degree arc for calm gauge appearance
  const arcSpan = 0.72; // 72% of full circle
  const arcLength = circumference * arcSpan;
  const strokeDashoffset = arcLength * (1 - percentage);

  let bandColor = 'var(--accent)';
  let bandBg = 'var(--accent-soft)';
  if (band === 'Moderate') {
    bandColor = 'var(--warn)';
    bandBg = 'rgba(201, 131, 58, 0.12)';
  } else if (band === 'Low') {
    bandColor = 'var(--danger)';
    bandBg = 'var(--danger-soft)';
  }

  return (
    <div className="score-arc-card card text-center">
      <div className="arc-wrapper">
        <svg viewBox="0 0 170 170" className="arc-svg">
          {/* Background track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(140 85 85)"
          />
          {/* Active progress */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={bandColor}
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(140 85 85)"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>

        <div className="score-display">
          <span className="score-number">{normalized.toFixed(1)}</span>
          <span className="score-scale">/ 10</span>
        </div>
      </div>

      <div className="band-pill" style={{ backgroundColor: bandBg, color: bandColor }}>
        {band} Wellbeing Estimate
      </div>
      <p className="text-sm" style={{ marginTop: '0.65rem' }}>
        Based on correlation patterns across 5,000 student daily habits.
      </p>

      <style>{`
        .score-arc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }
        .arc-wrapper {
          position: relative;
          width: 170px;
          height: 170px;
          margin-bottom: 0.5rem;
        }
        .arc-svg {
          width: 100%;
          height: 100%;
        }
        .score-display {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 10px;
        }
        .score-number {
          font-size: 2.75rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .score-scale {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 2px;
        }
        .band-pill {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.35rem 0.95rem;
          border-radius: var(--radius-pill);
          letter-spacing: 0.01em;
        }
      `}</style>
    </div>
  );
}

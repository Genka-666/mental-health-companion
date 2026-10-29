import React from "react";
export default function ProgressDots({ total, current }) {
  return (
    <div className="progress-container">
      <span className="step-counter">A little at a time</span>
      <span className="text-xs">
        {current + 1} of {total}
      </span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Check-in progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current + 1}
      >
        <span style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}

import React from "react";
const NOTES = {
  Low: "Make a little room for rest and support. One small step is enough for today.",
  Moderate:
    "There’s room to find your rhythm. Start with one habit that feels within reach.",
  Good: "Some of your habits look supportive. Keep making space for what helps you feel well.",
};
export default function ScoreArc({ score, band }) {
  const value = Math.max(0, Math.min(10, score));
  return (
    <section
      className={`score-arc-card card ${band.toLowerCase()}`}
      aria-label={`Habit-based wellbeing estimate: ${value.toFixed(1)} out of 10, ${band}`}
    >
      <span className="eyebrow">Your habit-based wellbeing estimate</span>
      <div className="arc-wrapper" aria-hidden="true">
        <svg viewBox="0 0 200 165" className="arc-svg">
          <path
            d="M30 140a82 82 0 1 1 140 0"
            pathLength="100"
            fill="none"
            stroke="var(--border)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M30 140a82 82 0 1 1 140 0"
            pathLength="100"
            fill="none"
            stroke="var(--score-color)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(0.01, value * 10)} 100`}
          />
        </svg>
        <div className="score-display">
          <span className="score-number">{value.toFixed(1)}</span>
          <span className="score-scale">out of 10</span>
        </div>
      </div>
      <span className={`band-pill ${band.toLowerCase()}`}>{band} estimate</span>
      <p className="score-note">{NOTES[band]}</p>
      <p className="text-xs">
        Based on a survey-style dataset of 5,000 students.
        <br />A reflection of habits, not a diagnosis.
      </p>
    </section>
  );
}

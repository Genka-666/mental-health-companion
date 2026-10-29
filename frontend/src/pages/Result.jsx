import React from 'react';
import ScoreArc from '../components/ScoreArc';
import TipCard from '../components/TipCard';
import WhatIfCard from '../components/WhatIfCard';

export default function Result({ result, onTalkItThrough, onViewHistory, onRetake }) {
  if (!result) return null;

  const { score, band, tips = [], what_if = [], disclaimer } = result;

  return (
    <div className="result-page animate-fade-in">
      <ScoreArc score={score} band={band} />

      {tips.length > 0 && (
        <div className="tips-section" style={{ marginTop: '1.5rem' }}>
          <h2 className="title-sm" style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            Practical Habit Suggestions
          </h2>
          {tips.map((tip, idx) => (
            <TipCard key={tip.id || idx} title={tip.title} body={tip.body} />
          ))}
        </div>
      )}

      {what_if.length > 0 && (
        <div className="what-if-section" style={{ marginTop: '1.5rem' }}>
          <h2 className="title-sm" style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.85rem' }}>
            What-If Scenarios
          </h2>
          {what_if.map((wi, idx) => (
            <WhatIfCard key={idx} label={wi.label} delta={wi.delta} />
          ))}
        </div>
      )}

      <div className="result-actions" style={{ marginTop: '2rem' }}>
        <button
          id="talk-it-through-btn"
          className="btn btn-primary btn-full"
          style={{ fontSize: '1.05rem', padding: '0.85rem' }}
          onClick={onTalkItThrough}
        >
          Talk it through with Saathi &rarr;
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onViewHistory}>
            View History
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onRetake}>
            Retake Check-in
          </button>
        </div>
      </div>

      <div className="disclaimer-callout" style={{ marginTop: '1.75rem' }}>
        <p className="text-xs" style={{ color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
          {disclaimer || "This is a habit-based estimate, not a diagnosis. Support companion, not a therapist. Not medical advice."}
        </p>
      </div>

      <style>{`
        .result-actions {
          max-width: 440px;
          margin: 2rem auto 0 auto;
        }
      `}</style>
    </div>
  );
}

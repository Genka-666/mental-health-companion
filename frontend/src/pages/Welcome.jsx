import React from 'react';

export default function Welcome({ onStartCheckIn, onOpenChat, onOpenHistory }) {
  return (
    <div className="welcome-page animate-fade-in">
      <div className="welcome-hero text-center">
        <div className="welcome-tag">Mindful Habit Companion</div>
        <h1 className="title-xl" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
          Mansik Santulan
        </h1>
        <p className="subtitle" style={{ maxWidth: '460px', margin: '0 auto 2rem auto' }}>
          A calm, private space to reflect on your daily student habits, explore wellbeing insights, and talk through whatever is on your mind.
        </p>

        <div className="hero-cta-group">
          <button
            id="start-checkin-btn"
            className="btn btn-primary btn-full"
            style={{ fontSize: '1.05rem', padding: '0.9rem' }}
            onClick={onStartCheckIn}
          >
            Start Wellbeing Check-in &rarr;
          </button>

          <div className="quick-action-row" style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onOpenChat}>
              Talk with Saathi
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onOpenHistory}>
              Past History
            </button>
          </div>
        </div>
      </div>

      <div className="card feature-box" style={{ marginTop: '2.5rem' }}>
        <h2 className="title-sm" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          How this companion works:
        </h2>
        <ul className="feature-list text-sm">
          <li>
            <strong>1. Quick 2-Minute Check-in:</strong> Answer a few questions about your sleep, screen time, physical activity, and stress.
          </li>
          <li>
            <strong>2. Habit-Based Wellbeing Signal:</strong> Receive an estimate learned from a survey dataset of 5,000 university students.
          </li>
          <li>
            <strong>3. What-If Simulations:</strong> Explore how small changes—like +30 min of sleep—relate to positive changes.
          </li>
          <li>
            <strong>4. Supportive AI Companion:</strong> Chat with Saathi, a warm AI listener powered by Gemini, whenever you need to unpack feelings.
          </li>
        </ul>
      </div>

      <div className="privacy-notice text-center text-sm" style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>
        <strong>Private & Anonymous:</strong> No passwords, accounts, or emails required. Your entries belong to you and can be wiped anytime with "Delete my data".
      </div>

      <style>{`
        .welcome-tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent);
          background: var(--accent-soft);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-pill);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .hero-cta-group {
          max-width: 420px;
          margin: 0 auto;
        }
        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .feature-list li {
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

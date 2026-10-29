import React from 'react';

export default function HelpBanner({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="help-modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal-header">
          <div className="help-badge">Immediate Support</div>
          <button className="help-close-btn" onClick={onClose} aria-label="Close helpline details">&times;</button>
        </div>
        
        <h2 id="help-title" className="title-md" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          You deserve support right now
        </h2>
        <p className="text-sm" style={{ marginBottom: '1.25rem' }}>
          If you are in distress, feeling overwhelmed, or in danger of hurting yourself, please reach out to dedicated counselors ready to listen 24/7.
        </p>

        <div className="helpline-card">
          <div className="helpline-info">
            <strong>Tele-MANAS (India National Mental Health Helpline)</strong>
            <span className="text-sm">Free, confidential 24/7 multi-lingual support</span>
          </div>
          <a href="tel:14416" className="helpline-call-btn">
            Call 14416
          </a>
        </div>

        <div className="helpline-card" style={{ marginTop: '0.75rem' }}>
          <div className="helpline-info">
            <strong>Emergency Services</strong>
            <span className="text-sm">Police, Ambulance, and Fire support</span>
          </div>
          <a href="tel:112" className="helpline-call-btn secondary">
            Call 112
          </a>
        </div>

        <div className="helpline-card" style={{ marginTop: '0.75rem' }}>
          <div className="helpline-info">
            <strong>Tele-MANAS Toll-Free Alternate</strong>
            <span className="text-sm">Toll-free landline and mobile access</span>
          </div>
          <a href="tel:18008914416" className="helpline-call-btn secondary">
            1-800-891-4416
          </a>
        </div>

        <p className="text-xs" style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--muted)' }}>
          This companion is an automated habit tool, not a doctor or counselor.
        </p>

        <button className="btn btn-secondary btn-full" style={{ marginTop: '1rem' }} onClick={onClose}>
          Close
        </button>
      </div>

      <style>{`
        .help-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          z-index: 1000;
          animation: fadeIn 0.15s ease-out;
        }
        .help-modal-content {
          max-width: 460px;
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          margin-bottom: 0;
        }
        .help-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .help-badge {
          background: var(--danger-soft);
          color: var(--danger);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
        }
        .help-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--muted);
          line-height: 1;
        }
        .helpline-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          gap: 0.75rem;
        }
        .helpline-info {
          display: flex;
          flex-direction: column;
        }
        .helpline-info strong {
          font-size: 0.9rem;
          color: var(--text);
        }
        .helpline-call-btn {
          background: var(--danger);
          color: #FFFFFF;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-pill);
          white-space: nowrap;
          transition: transform 0.15s ease;
        }
        .helpline-call-btn.secondary {
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .helpline-call-btn:hover {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

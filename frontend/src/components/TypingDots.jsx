import React from 'react';

export default function TypingDots() {
  return (
    <div className="typing-indicator" aria-label="Saathi is typing">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />

      <style>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.65rem 0.95rem;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          margin-bottom: 0.85rem;
          width: fit-content;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--muted);
          border-radius: var(--radius-pill);
          opacity: 0.4;
          animation: pulseDot 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes pulseDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.3; }
          40% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

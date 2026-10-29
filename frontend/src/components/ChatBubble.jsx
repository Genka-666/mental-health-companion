import React from 'react';

export default function ChatBubble({ role, content, isCrisis }) {
  const isUser = role === 'user';

  return (
    <div className={`chat-bubble-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      {!isUser && (
        <div className="avatar assistant-avatar" aria-hidden="true">
          S
        </div>
      )}
      <div
        className={`chat-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'} ${isCrisis ? 'crisis-bubble' : ''}`}
        aria-live={isUser ? 'off' : 'polite'}
      >
        <div className="bubble-text">{content}</div>
      </div>

      <style>{`
        .chat-bubble-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
          animation: fadeIn 0.18s ease-out;
        }
        .user-row {
          justify-content: flex-end;
        }
        .assistant-row {
          justify-content: flex-start;
        }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .assistant-avatar {
          background: var(--accent-soft);
          color: var(--accent);
          border: 1px solid var(--accent-soft-border);
        }
        .chat-bubble {
          max-width: 82%;
          padding: 0.85rem 1.15rem;
          border-radius: 18px;
          font-size: 0.94rem;
          line-height: 1.5;
          word-break: break-word;
        }
        .user-bubble {
          background: var(--accent);
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
        }
        .assistant-bubble {
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
          box-shadow: var(--shadow-sm);
        }
        .crisis-bubble {
          border-color: var(--danger);
          background: var(--danger-soft);
          color: var(--text);
        }
      `}</style>
    </div>
  );
}

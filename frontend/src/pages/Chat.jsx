import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from '../components/ChatBubble';
import TypingDots from '../components/TypingDots';
import { api } from '../api';

const CONVERSATION_STARTERS = [
  "I'm feeling really stressed about upcoming exams.",
  "I can't seem to sleep well lately.",
  "I've been scrolling endlessly and feel drained.",
  "I feel a bit lonely and just wanted to share."
];

export default function Chat({ onOpenHelpline, initialContextMessage }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialContextMessage || "Hello, I'm Saathi. I'm here to listen without judgment. How are you feeling today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [hasCrisis, setHasCrisis] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    setErrorText(null);
    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.chat(updatedMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply, isCrisis: res.crisis }]);
      if (res.remaining_calls !== undefined) {
        setRemainingCalls(res.remaining_calls);
      }
      if (res.crisis) {
        setHasCrisis(true);
        if (onOpenHelpline) onOpenHelpline();
      }
    } catch (err) {
      setErrorText(err.message || 'Trouble connecting to Saathi. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page animate-fade-in">
      <div className="chat-header">
        <div>
          <h2 className="title-sm" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            Chat with Saathi
          </h2>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Support companion, not a therapist. Not medical advice.
          </p>
        </div>
        {remainingCalls !== null && (
          <div className="budget-tag" title="Gemini API demo call budget">
            {remainingCalls} calls left
          </div>
        )}
      </div>

      {hasCrisis && (
        <div className="crisis-alert-banner">
          <span>Immediate help is available: Call Tele-MANAS at <strong>14416</strong> or <strong>112</strong>.</span>
          <button className="banner-call-btn" onClick={onOpenHelpline}>
            View Numbers
          </button>
        </div>
      )}

      <div className="messages-container">
        {messages.map((m, idx) => (
          <ChatBubble
            key={idx}
            role={m.role}
            content={m.content}
            isCrisis={m.isCrisis}
          />
        ))}
        {isTyping && <TypingDots />}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="starters-tray">
          <span className="text-xs" style={{ color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
            Suggested prompts:
          </span>
          <div className="starters-scroll">
            {CONVERSATION_STARTERS.map((st, i) => (
              <button
                key={i}
                type="button"
                className="starter-chip"
                onClick={() => handleSendMessage(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}

      {errorText && (
        <div className="error-toast text-sm">
          {errorText}
        </div>
      )}

      <div className="chat-input-bar">
        <textarea
          id="chat-textarea"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what is on your mind... (Press Enter to send)"
          rows="1"
          maxLength={2000}
          className="chat-textarea"
        />
        <button
          id="send-chat-btn"
          className="btn btn-primary send-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isTyping}
          aria-label="Send message"
        >
          &uarr;
        </button>
      </div>

      <style>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
          min-height: 500px;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.75rem;
        }
        .budget-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
        }
        .crisis-alert-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--danger-soft);
          border: 1px solid rgba(181, 73, 63, 0.3);
          color: var(--danger);
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          margin-bottom: 0.75rem;
          gap: 0.5rem;
        }
        .banner-call-btn {
          background: var(--danger);
          color: #FFFFFF;
          border: none;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
          white-space: nowrap;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem 0.25rem;
          display: flex;
          flex-direction: column;
        }
        .starters-tray {
          margin-top: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .starters-scroll {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .starter-chip {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 0.8rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-pill);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        .starter-chip:hover {
          background: var(--accent-soft);
          border-color: var(--accent-soft-border);
        }
        .error-toast {
          background: var(--danger-soft);
          color: var(--danger);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.5rem;
        }
        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          padding: 0.35rem 0.5rem 0.35rem 1rem;
          box-shadow: var(--shadow-sm);
        }
        .chat-textarea {
          flex: 1;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.94rem;
          color: var(--text);
          resize: none;
          outline: none;
          line-height: 1.4;
          max-height: 100px;
        }
        .send-btn {
          width: 38px;
          height: 38px;
          min-height: 38px;
          padding: 0;
          border-radius: var(--radius-pill);
          font-size: 1.15rem;
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

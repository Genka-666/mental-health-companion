import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import TypingDots from "../components/TypingDots";
import Icon from "../components/Icon";
import { api } from "../api";

const STARTERS = [
  ["Exam pressure", "I'm feeling stressed about upcoming exams."],
  ["Restless nights", "I haven't been sleeping well lately."],
  ["Too much scrolling", "I've been scrolling a lot and feel drained."],
  ["Just need to talk", "I'm feeling lonely and wanted to share."],
];

export default function Chat({ onOpenHelpline, active, onBusyChange }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m Saathi. You don’t need to have it all figured out to talk here. What’s been on your mind?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [hasCrisis, setHasCrisis] = useState(false);
  const endRef = useRef(null);
  const pendingRef = useRef(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (active)
      endRef.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [messages, isTyping, active]);

  async function handleSendMessage(textToSend) {
    const text = (textToSend ?? inputValue).trim();
    if (!text || pendingRef.current) return;
    pendingRef.current = true;
    onBusyChange(true);
    setErrorText(null);
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInputValue("");
    setIsTyping(true);
    try {
      const res = await api.chat(updated);
      if (!aliveRef.current) return;
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: res.reply, isCrisis: res.crisis },
      ]);
      setRemainingCalls(res.remaining_calls);
      if (res.crisis) {
        setHasCrisis(true);
        onOpenHelpline();
      }
    } catch (err) {
      if (!aliveRef.current) return;
      // Restore the failed draft instead of leaving an unanswered turn behind.
      setMessages(updated.slice(0, -1));
      setInputValue(text);
      setErrorText(
        err.message || "We could not send that message. Please try again.",
      );
    } finally {
      pendingRef.current = false;
      onBusyChange(false);
      if (aliveRef.current) setIsTyping(false);
    }
  }

  return (
    <div className="chat-page animate-fade-in">
      <div className="page-intro">
        <span className="eyebrow">A moment to be heard</span>
        <h1 className="page-title">
          Let it out. <em>I’m listening.</em>
        </h1>
        <p>No perfect words needed. Start wherever you are.</p>
      </div>
      <section
        className="chat-panel card"
        aria-label="Conversation with Saathi"
      >
        <div className="chat-header">
          <div className="chat-identity">
            <span className="companion-avatar">
              <Icon name="leaf" size={22} />
            </span>
            <div>
              <strong>Saathi</strong>
              <span className="text-xs">Your AI wellbeing companion</span>
            </div>
          </div>
          <span className="chat-status">
            <span className="status-dot" /> Here to listen
          </span>
        </div>
        {hasCrisis && (
          <div className="notice crisis-alert-banner" role="status">
            <p>
              Real support is available. In India, call{" "}
              <a href="tel:14416">14416</a> or <a href="tel:112">112</a> in an
              emergency.
            </p>
            <button className="text-button" onClick={onOpenHelpline}>
              View support options <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
        <div
          className="messages-container"
          role="log"
          aria-label="Messages"
          aria-live="polite"
          aria-relevant="additions text"
        >
          <span className="conversation-date">A little space for you</span>
          {messages.map((message, index) => (
            <ChatBubble key={index} {...message} />
          ))}
          {isTyping && <TypingDots />}
          <div ref={endRef} />
        </div>
        {messages.length === 1 && (
          <div className="starters-tray">
            <p className="text-xs">Not sure where to start?</p>
            <div className="starters-scroll">
              {STARTERS.map(([label, text]) => (
                <button
                  className="starter-chip"
                  key={label}
                  onClick={() => handleSendMessage(text)}
                  disabled={isTyping}
                >
                  {label} <Icon name="arrow" size={14} />
                </button>
              ))}
            </div>
          </div>
        )}
        {errorText && (
          <div className="notice notice-error" role="alert">
            {errorText}
          </div>
        )}
        <form
          className="chat-input-bar"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendMessage();
          }}
        >
          <label className="sr-only" htmlFor="chat-textarea">
            Message to Saathi
          </label>
          <textarea
            id="chat-textarea"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="What’s on your mind?"
            rows={2}
            maxLength={2000}
            disabled={isTyping}
            className="chat-textarea"
            aria-describedby="chat-privacy"
          />
          <button
            id="send-chat-btn"
            type="submit"
            className="btn btn-primary send-btn"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <Icon name="send" />
          </button>
        </form>
        <div className="chat-composer-note">
          <span>Enter to send · Shift + Enter for a new line</span>
          <span>{inputValue.length}/2000</span>
        </div>
      </section>
      <p id="chat-privacy" className="chat-privacy">
        <Icon name="shield" size={15} /> Messages are processed by Google
        Gemini. Avoid identifying details. Support companion, not a therapist.
      </p>
      {remainingCalls === 0 && (
        <p className="notice" role="status">
          This demo has reached its chat limit. Your check-ins and support
          numbers are still available.
        </p>
      )}
    </div>
  );
}

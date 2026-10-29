import React from "react";
import Icon from "./Icon";
export default function ChatBubble({ role, content, isCrisis }) {
  const user = role === "user";
  return (
    <div className={`chat-bubble-row ${user ? "user-row" : "assistant-row"}`}>
      {!user && (
        <span className="assistant-avatar" aria-hidden="true">
          <Icon name="leaf" size={16} />
        </span>
      )}
      <div
        className={`chat-bubble ${user ? "user-bubble" : "assistant-bubble"} ${isCrisis ? "crisis-bubble" : ""}`}
      >
        <span className="sr-only">{user ? "You" : "Saathi"}: </span>
        <div className="bubble-text">{content}</div>
      </div>
    </div>
  );
}

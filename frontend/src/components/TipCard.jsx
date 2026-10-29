import React from "react";
export default function TipCard({ title, body, number }) {
  return (
    <article className="tip-card">
      <span className="tip-number">{String(number).padStart(2, "0")}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

import React from "react";
import Icon from "./Icon";
export default function WhatIfCard({ label, delta }) {
  return (
    <article className="what-if-card">
      <span className="what-if-icon">
        <Icon
          name={
            label.toLowerCase().includes("sleep")
              ? "moon"
              : label.toLowerCase().includes("phone")
                ? "clock"
                : "sun"
          }
        />
      </span>
      <div>
        <h3>{label}</h3>
        <p>Change in the model’s estimate</p>
      </div>
      <span className={`delta-badge ${delta > 0 ? "positive" : "neutral"}`}>
        {delta > 0 ? "+" : ""}
        {delta.toFixed(2)}
        <small>points</small>
      </span>
    </article>
  );
}

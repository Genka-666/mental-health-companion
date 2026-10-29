import React from "react";
import ScoreArc from "../components/ScoreArc";
import TipCard from "../components/TipCard";
import WhatIfCard from "../components/WhatIfCard";
import Icon from "../components/Icon";

export default function Result({
  result,
  onTalkItThrough,
  onViewHistory,
  onRetake,
}) {
  if (!result) return null;
  const { score, band, tips = [], what_if = [], disclaimer } = result;
  return (
    <div className="result-page animate-fade-in">
      <div className="page-intro text-center">
        <span className="eyebrow">
          <Icon name="check" size={14} /> A moment well spent
        </span>
        <h1 className="page-title">
          A little more <em>perspective.</em>
        </h1>
        <p>Here’s a snapshot of your habits. There’s no perfect score.</p>
      </div>
      <ScoreArc score={score} band={band} />
      <section className="result-section">
        <div className="section-heading">
          <h2>Small steps to try</h2>
          <Icon name="leaf" />
        </div>
        <p className="section-description">
          Choose one that feels manageable today.
        </p>
        {tips.length ? (
          tips.map((tip, index) => (
            <TipCard
              key={tip.id}
              title={tip.title}
              body={tip.body}
              number={index + 1}
            />
          ))
        ) : (
          <div className="card steady-note">
            <Icon name="sun" size={25} />
            <div>
              <h3>Keep making room for yourself.</h3>
              <p>
                Your current habits don’t trigger any of our suggested
                adjustments. Keep noticing what works for you.
              </p>
            </div>
          </div>
        )}
      </section>
      {what_if.length > 0 && (
        <section className="result-section">
          <div className="section-heading">
            <h2>What could a small change look like?</h2>
          </div>
          <p className="section-description">
            Explore how the model’s estimate changes with one different habit.
          </p>
          {what_if.map((item) => (
            <WhatIfCard key={item.label} {...item} />
          ))}
          <p className="text-xs">
            Model estimates show patterns, not promises. Real wellbeing is more
            complex than a number.
          </p>
        </section>
      )}
      <div className="result-actions">
        <button
          id="talk-it-through-btn"
          className="btn btn-primary btn-full"
          onClick={onTalkItThrough}
        >
          <Icon name="chat" size={19} /> Talk it through with Saathi{" "}
          <Icon name="arrow" size={18} />
        </button>
        <div className="button-pair">
          <button className="btn btn-secondary" onClick={onViewHistory}>
            View my journey
          </button>
          <button className="btn btn-secondary" onClick={onRetake}>
            Check in again
          </button>
        </div>
      </div>
      <p className="result-disclaimer">{disclaimer}</p>
    </div>
  );
}

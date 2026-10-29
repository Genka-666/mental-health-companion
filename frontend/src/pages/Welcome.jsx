import React from "react";
import Icon from "../components/Icon";

function BalanceIllustration() {
  return (
    <div className="balance-art" aria-hidden="true">
      <svg viewBox="0 0 520 240" fill="none">
        <defs>
          <linearGradient
            id="sunrise"
            x1="260"
            y1="20"
            x2="260"
            y2="200"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ead8b2" />
            <stop offset="1" stopColor="#f7eedb" />
          </linearGradient>
        </defs>
        <path
          d="M86 207a174 174 0 0 1 348 0"
          stroke="currentColor"
          strokeOpacity=".12"
        />
        <path
          d="M110 207a150 150 0 0 1 300 0"
          stroke="currentColor"
          strokeOpacity=".1"
          strokeDasharray="2 7"
        />
        <circle cx="260" cy="112" r="66" fill="url(#sunrise)" />
        <path
          d="M50 208c45-35 99-42 156-17 48 21 95 11 149-18 42-23 81-10 115 35"
          fill="#d9e2d3"
        />
        <path
          d="M43 216c69-26 125-4 187 0 77 5 112-46 201-21l47 21"
          fill="#b7cbb7"
        />
        <ellipse
          cx="261"
          cy="215"
          rx="59"
          ry="6"
          fill="#426951"
          fillOpacity=".12"
        />
        <path
          d="M217 197c0-12 18-22 43-22s44 10 44 22c0 11-87 11-87 0Z"
          fill="#577360"
        />
        <path
          d="M229 172c0-11 15-21 31-21s33 10 33 21c0 13-64 13-64 0Z"
          fill="#829882"
        />
        <path
          d="M244 146c0-10 8-18 16-18s18 8 18 18c0 10-34 10-34 0Z"
          fill="#bac9a8"
        />
        <path
          d="M152 207v-72m0 43c-23 0-33-16-30-31 20 0 30 12 30 31Zm0-16c20-2 29-17 25-31-20 3-27 14-25 31Z"
          stroke="#58785b"
          strokeWidth="2"
          fill="#91ac8b"
        />
        <path
          d="M373 208v-47m0 31c19-2 25-13 22-25-17 2-24 12-22 25Zm0-16c-17-3-22-14-17-24 14 3 20 12 17 24Z"
          stroke="#58785b"
          strokeWidth="2"
          fill="#a3b999"
        />
        <path
          d="M319 58h10m-5-5v10M195 89h8m-4-4v8"
          stroke="#9a885b"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="m229 47 7-3 7 3"
          stroke="#7e927a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="art-note">Small steps. Softer days.</span>
    </div>
  );
}

export default function Welcome({ onStartCheckIn, onOpenChat, onOpenHistory }) {
  return (
    <div className="welcome-page animate-fade-in">
      <section className="welcome-hero text-center">
        <span className="eyebrow">
          <span className="status-dot" /> A space to come back to yourself
        </span>
        <h1 className="hero-title">
          A little pause.
          <br />
          <em>A clearer mind.</em>
        </h1>
        <p className="hero-description">
          Between deadlines, screen time, and everything else,
          <br className="desktop-break" /> there’s room to check in with you.
        </p>
        <BalanceIllustration />
        <button
          id="start-checkin-btn"
          className="btn btn-primary hero-cta"
          onClick={onStartCheckIn}
        >
          Take a wellbeing check-in <Icon name="arrow" />
        </button>
        <div className="hero-meta">
          <span>
            <Icon name="clock" size={14} /> About 2 minutes
          </span>
          <span>
            <Icon name="shield" size={14} /> No account needed
          </span>
        </div>
      </section>
      <section className="companion-invite card">
        <span className="invite-icon">
          <Icon name="chat" size={25} />
        </span>
        <div>
          <span className="eyebrow">Meet your companion</span>
          <h2>Some days, talking helps.</h2>
          <p>Saathi is an AI listener for whatever’s on your mind.</p>
        </div>
        <button
          className="icon-button"
          onClick={onOpenChat}
          aria-label="Start a conversation with Saathi"
        >
          <Icon name="arrow" />
        </button>
      </section>
      <section className="how-it-works" aria-labelledby="how-title">
        <div className="section-heading">
          <h2 id="how-title">A little reflection goes a long way</h2>
          <span className="section-label">Your pace. Your space.</span>
        </div>
        <ol className="journey-list">
          <li>
            <span className="journey-number">01</span>
            <div>
              <h3>Notice your everyday</h3>
              <p>
                A few gentle questions about sleep, scrolling, movement, and
                stress.
              </p>
            </div>
            <Icon name="sun" />
          </li>
          <li>
            <span className="journey-number">02</span>
            <div>
              <h3>Find a little perspective</h3>
              <p>
                A habit-based estimate and practical ideas for your next small
                step.
              </p>
            </div>
            <Icon name="leaf" />
          </li>
          <li>
            <span className="journey-number">03</span>
            <div>
              <h3>Make room for progress</h3>
              <p>Return when you want. See how your habits shift over time.</p>
            </div>
            <Icon name="trend" />
          </li>
        </ol>
        <button className="text-button history-link" onClick={onOpenHistory}>
          Your past check-ins <Icon name="arrow" size={16} />
        </button>
      </section>
      <aside className="privacy-note">
        <Icon name="shield" size={18} />
        <p>
          No signup. You can delete your entries anytime. Chat messages are
          processed by Google Gemini, so please avoid sharing identifying or
          sensitive personal details.
        </p>
      </aside>
    </div>
  );
}

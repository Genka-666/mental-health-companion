import React, { useEffect, useRef, useState } from "react";
import ProgressDots from "../components/ProgressDots";
import SegmentedControl from "../components/SegmentedControl";
import Icon from "../components/Icon";

const INITIAL = {
  age: 21,
  academic_level: "Undergraduate",
  sleep_hours_per_night: 6.5,
  avg_daily_usage_hours: 4.5,
  daily_unlocks: 110,
  study_hours: 4,
  physical_activity_hours: 1,
  stress_level: "Medium",
  most_used_platform: "Instagram",
  purpose_of_use: "Entertainment",
  gender: "Female",
  country: "India",
};
const QUESTIONS = [
  {
    field: "age",
    title: "Let’s start with you.",
    description: "How old are you?",
    icon: "sun",
    min: 14,
    max: 60,
    step: 1,
    unit: "years",
    note: "The survey data covers ages 18–24. Estimates outside that range may be less reliable.",
  },
  {
    field: "academic_level",
    title: "What’s your chapter?",
    description: "Where are you in your studies right now?",
    icon: "leaf",
    options: ["High School", "Undergraduate", "Graduate"],
  },
  {
    field: "sleep_hours_per_night",
    title: "How are your nights?",
    description: "On average, how much sleep do you get each night?",
    icon: "moon",
    min: 3,
    max: 12,
    step: 0.5,
    unit: "hours a night",
    note: "An estimate is perfectly fine. Think about a typical night lately.",
  },
  {
    field: "avg_daily_usage_hours",
    title: "A moment on screen time.",
    description: "How long do you spend on social apps each day?",
    icon: "clock",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "hours a day",
    note: "No judgment here. This is just a chance to notice your patterns.",
  },
  {
    field: "daily_unlocks",
    title: "Those little phone checks.",
    description: "Roughly how often do you unlock your phone each day?",
    icon: "clock",
    min: 0,
    max: 300,
    step: 5,
    unit: "times a day",
    note: "Your phone’s screen time settings can help. A rough guess is okay too.",
  },
  {
    field: "study_hours",
    title: "Time for the books.",
    description: "How much of your day goes into classes or studying?",
    icon: "leaf",
    min: 0,
    max: 12,
    step: 0.5,
    unit: "hours a day",
  },
  {
    field: "physical_activity_hours",
    title: "A little room to move.",
    description: "How much time do you spend walking, playing, or exercising?",
    icon: "sun",
    min: 0,
    max: 4,
    step: 0.25,
    unit: "hours a day",
    note: "Walking to class counts. Movement doesn’t have to mean a workout.",
  },
  {
    field: "stress_level",
    title: "How heavy does it feel?",
    description: "How would you describe your stress lately?",
    icon: "heart",
    options: ["Low", "Medium", "High", "Very High"],
    note: "There’s no right answer. Choose what feels closest to your experience.",
  },
  {
    field: "most_used_platform",
    title: "Your corner of the internet.",
    description: "Which app do you use most, and what brings you there?",
    icon: "chat",
    group: "platform",
  },
  {
    field: "gender",
    title: "One last bit of context.",
    description: "These details help match the original survey categories.",
    icon: "shield",
    group: "demographics",
    note: "The original dataset offers only Female and Male. These limited categories are used for the estimate, and may not represent everyone.",
  },
];
const PLATFORMS = [
  "Instagram",
  "YouTube",
  "WhatsApp",
  "LinkedIn",
  "Snapchat",
  "Twitter",
  "TikTok",
  "Facebook",
  "WeChat",
  "LINE",
  "KakaoTalk",
  "VKontakte",
];
const COUNTRIES = [
  "India",
  "USA",
  "Canada",
  "Australia",
  "UK",
  "Germany",
  "Mexico",
  "Turkey",
  "France",
  "Other",
];

export default function CheckIn({ onSubmit, onCancel, isLoading }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const titleRef = useRef(null);
  const question = QUESTIONS[step];
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);
  const update = (field, value) =>
    setForm((previous) => ({ ...previous, [field]: value }));
  function select(field, label, options) {
    return (
      <div className="field-group">
        <label htmlFor={`select-${field}`}>{label}</label>
        <select
          id={`select-${field}`}
          value={form[field]}
          onChange={(event) => update(field, event.target.value)}
          disabled={isLoading}
        >
          {options.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="checkin-wizard animate-fade-in">
      <div className="page-intro">
        <span className="eyebrow">Your daily habits, a little clearer</span>
        <h1 className="page-title">
          A check-in <em>with yourself.</em>
        </h1>
        <p>Take your time. Honest answers are all you need.</p>
      </div>
      <ProgressDots total={QUESTIONS.length} current={step} />
      <form
        className="card wizard-card"
        onSubmit={(event) => {
          event.preventDefault();
          if (isLoading) return;
          if (step < QUESTIONS.length - 1) setStep(step + 1);
          else onSubmit(form);
        }}
      >
        <div className="wizard-step" key={step}>
          <span className="question-icon">
            <Icon name={question.icon} size={27} />
          </span>
          <span className="eyebrow question-number">
            Question {String(step + 1).padStart(2, "0")}
          </span>
          <h2 className="step-title" tabIndex={-1} ref={titleRef}>
            {question.title}
          </h2>
          <p className="step-desc">{question.description}</p>
          {question.min !== undefined && (
            <div className="slider-control">
              <output
                className="value-display"
                htmlFor={`input-${question.field}`}
                aria-live="polite"
              >
                {form[question.field]}
                <span className="unit">{question.unit}</span>
              </output>
              <input
                id={`input-${question.field}`}
                aria-label={question.description}
                type="range"
                min={question.min}
                max={question.max}
                step={question.step}
                value={form[question.field]}
                onChange={(event) =>
                  update(question.field, Number(event.target.value))
                }
                disabled={isLoading}
                className="range-input"
                style={{
                  "--range-progress": `${((form[question.field] - question.min) / (question.max - question.min)) * 100}%`,
                }}
              />
              <div className="range-bounds" aria-hidden="true">
                <span>{question.min}</span>
                <span>{question.max}</span>
              </div>
            </div>
          )}
          {question.options && (
            <div className="question-options">
              <SegmentedControl
                options={question.options}
                value={form[question.field]}
                onChange={(value) => update(question.field, value)}
                label={question.description}
                disabled={isLoading}
              />
            </div>
          )}
          {question.group === "platform" && (
            <div className="question-options">
              {select("most_used_platform", "Most-used platform", PLATFORMS)}
              <div className="field-group">
                <span className="field-label">Main reason for using it</span>
                <SegmentedControl
                  label="Main reason for using it"
                  options={["Entertainment", "Education", "Networking", "News"]}
                  value={form.purpose_of_use}
                  onChange={(value) => update("purpose_of_use", value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          {question.group === "demographics" && (
            <div className="question-options">
              <div className="field-group">
                <span className="field-label">
                  Gender category in the dataset
                </span>
                <SegmentedControl
                  label="Gender category in the dataset"
                  options={["Female", "Male"]}
                  value={form.gender}
                  onChange={(value) => update("gender", value)}
                  disabled={isLoading}
                />
              </div>
              {select("country", "Country", COUNTRIES)}
            </div>
          )}
          {question.note && <p className="question-note">{question.note}</p>}
        </div>
        <div className="wizard-nav-btns">
          <button
            type="button"
            className="text-button"
            onClick={() => (step ? setStep(step - 1) : onCancel())}
            disabled={isLoading}
          >
            <Icon name="back" size={17} />
            {step ? "Go back" : "Cancel"}
          </button>
          <button
            id="wizard-next-btn"
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Finding your estimate…"
              : step === QUESTIONS.length - 1
                ? "See my estimate"
                : "Continue"}
            {!isLoading && <Icon name="arrow" size={18} />}
          </button>
        </div>
      </form>
      <p className="checkin-reassurance">
        <Icon name="shield" size={15} /> Your answers are saved with an
        anonymous browser session. You can delete them anytime.
      </p>
    </div>
  );
}

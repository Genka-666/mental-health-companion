import React, { useState } from 'react';
import ProgressDots from '../components/ProgressDots';
import SegmentedControl from '../components/SegmentedControl';

const TOTAL_STEPS = 10;

const INITIAL_FORM = {
  age: 21,
  academic_level: 'Undergraduate',
  sleep_hours_per_night: 6.5,
  avg_daily_usage_hours: 4.5,
  daily_unlocks: 110,
  study_hours: 4.0,
  physical_activity_hours: 1.0,
  stress_level: 'Medium',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Entertainment',
  gender: 'Female',
  country: 'India',
};

const PLATFORMS = [
  'Instagram', 'YouTube', 'WhatsApp', 'LinkedIn', 'Snapchat',
  'Twitter', 'TikTok', 'Facebook', 'WeChat', 'LINE', 'KakaoTalk', 'VKontakte'
];

const COUNTRIES = [
  'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany',
  'Mexico', 'Turkey', 'France', 'Other'
];

export default function CheckIn({ onSubmit, onCancel, isLoading }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const updateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="checkin-wizard animate-fade-in">
      <ProgressDots total={TOTAL_STEPS} current={step} />

      <div className="card wizard-card">
        {step === 0 && (
          <div className="wizard-step">
            <h2 className="step-title">How old are you?</h2>
            <p className="step-desc">Enter your current age.</p>
            <div className="slider-control">
              <div className="value-display">{formData.age} <span className="unit">years</span></div>
              <input
                id="input-age"
                type="range"
                min="14"
                max="60"
                value={formData.age}
                onChange={(e) => updateField('age', parseInt(e.target.value, 10))}
                className="range-input"
              />
              <div className="range-bounds"><span>14</span><span>60</span></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="wizard-step">
            <h2 className="step-title">Academic level</h2>
            <p className="step-desc">What is your current level of education?</p>
            <div style={{ marginTop: '1.5rem' }}>
              <SegmentedControl
                label="Academic Level"
                options={['High School', 'Undergraduate', 'Graduate']}
                value={formData.academic_level}
                onChange={(v) => updateField('academic_level', v)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h2 className="step-title">Sleep per night</h2>
            <p className="step-desc">On average, how many hours of sleep do you get per night?</p>
            <div className="slider-control">
              <div className="value-display">{formData.sleep_hours_per_night} <span className="unit">hours</span></div>
              <input
                id="input-sleep"
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={formData.sleep_hours_per_night}
                onChange={(e) => updateField('sleep_hours_per_night', parseFloat(e.target.value))}
                className="range-input"
              />
              <div className="range-bounds"><span>3 hrs</span><span>12 hrs</span></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <h2 className="step-title">Daily screen / social media time</h2>
            <p className="step-desc">How many hours a day do you spend on social apps?</p>
            <div className="slider-control">
              <div className="value-display">{formData.avg_daily_usage_hours} <span className="unit">hours/day</span></div>
              <input
                id="input-usage"
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={formData.avg_daily_usage_hours}
                onChange={(e) => updateField('avg_daily_usage_hours', parseFloat(e.target.value))}
                className="range-input"
              />
              <div className="range-bounds"><span>0 hrs</span><span>12 hrs</span></div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step">
            <h2 className="step-title">Phone unlocks per day</h2>
            <p className="step-desc">Roughly how many times do you unlock or check your phone daily?</p>
            <div className="slider-control">
              <div className="value-display">{formData.daily_unlocks} <span className="unit">unlocks</span></div>
              <input
                id="input-unlocks"
                type="range"
                min="10"
                max="300"
                step="5"
                value={formData.daily_unlocks}
                onChange={(e) => updateField('daily_unlocks', parseInt(e.target.value, 10))}
                className="range-input"
              />
              <div className="range-bounds"><span>10</span><span>300+</span></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-step">
            <h2 className="step-title">Daily study & work hours</h2>
            <p className="step-desc">How many hours do you usually spend studying or on classes per day?</p>
            <div className="slider-control">
              <div className="value-display">{formData.study_hours} <span className="unit">hours</span></div>
              <input
                id="input-study"
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={formData.study_hours}
                onChange={(e) => updateField('study_hours', parseFloat(e.target.value))}
                className="range-input"
              />
              <div className="range-bounds"><span>0 hrs</span><span>12 hrs</span></div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="wizard-step">
            <h2 className="step-title">Physical activity per day</h2>
            <p className="step-desc">Time spent walking, exercising, or playing sports.</p>
            <div className="slider-control">
              <div className="value-display">{formData.physical_activity_hours} <span className="unit">hours/day</span></div>
              <input
                id="input-activity"
                type="range"
                min="0"
                max="4"
                step="0.25"
                value={formData.physical_activity_hours}
                onChange={(e) => updateField('physical_activity_hours', parseFloat(e.target.value))}
                className="range-input"
              />
              <div className="range-bounds"><span>0 hrs</span><span>4 hrs</span></div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="wizard-step">
            <h2 className="step-title">Recent stress level</h2>
            <p className="step-desc">How would you describe your general stress level lately?</p>
            <div style={{ marginTop: '1.5rem' }}>
              <SegmentedControl
                label="Stress Level"
                options={['Low', 'Medium', 'High', 'Very High']}
                value={formData.stress_level}
                onChange={(v) => updateField('stress_level', v)}
              />
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="wizard-step">
            <h2 className="step-title">Platform & primary purpose</h2>
            <p className="step-desc">Which app do you open most often, and primarily for what?</p>
            
            <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
              <label htmlFor="select-platform" className="text-sm" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                Most Used Platform
              </label>
              <select
                id="select-platform"
                value={formData.most_used_platform}
                onChange={(e) => updateField('most_used_platform', e.target.value)}
                className="custom-select"
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                Primary Purpose
              </label>
              <SegmentedControl
                label="Purpose of Use"
                options={['Entertainment', 'Education', 'Networking', 'News']}
                value={formData.purpose_of_use}
                onChange={(v) => updateField('purpose_of_use', v)}
              />
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="wizard-step">
            <h2 className="step-title">Demographic baseline</h2>
            <p className="step-desc">
              These two parameters are used solely by the machine learning pipeline to match against survey reference distributions.
            </p>

            <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
              <label className="text-sm" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                Gender (from original dataset)
              </label>
              <SegmentedControl
                label="Gender"
                options={['Female', 'Male']}
                value={formData.gender}
                onChange={(v) => updateField('gender', v)}
              />
            </div>

            <div>
              <label htmlFor="select-country" className="text-sm" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                Country
              </label>
              <select
                id="select-country"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                className="custom-select"
              >
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="wizard-nav-btns">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={isLoading}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          <button
            id="wizard-next-btn"
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLoading ? 'Estimating...' : step === TOTAL_STEPS - 1 ? 'See my estimate' : 'Next'}
          </button>
        </div>
      </div>

      <style>{`
        .wizard-card {
          padding: 2rem 1.75rem;
          min-height: 380px;
          display: flex;
          flex-direction: column;
        }
        .wizard-step {
          flex: 1;
        }
        .step-title {
          font-size: 1.35rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }
        .step-desc {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.45;
        }
        .slider-control {
          margin-top: 2rem;
          text-align: center;
        }
        .value-display {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 1.25rem;
        }
        .value-display .unit {
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--muted);
          margin-left: 4px;
        }
        .range-input {
          width: 100%;
          accent-color: var(--accent);
          height: 8px;
          border-radius: var(--radius-pill);
          cursor: pointer;
        }
        .range-bounds {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 0.5rem;
        }
        .custom-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          font-size: 0.92rem;
          outline: none;
        }
        .custom-select:focus {
          border-color: var(--accent);
        }
        .wizard-nav-btns {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
}

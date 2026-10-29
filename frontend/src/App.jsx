import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import CheckIn from './pages/CheckIn';
import Result from './pages/Result';
import Chat from './pages/Chat';
import History from './pages/History';
import HelpBanner from './components/HelpBanner';
import { api } from './api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [predictionResult, setPredictionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const handleStartCheckIn = () => {
    setGlobalError(null);
    setCurrentScreen('checkin');
  };

  const handleCheckInSubmit = async (formData) => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      const res = await api.predict(formData);
      setPredictionResult(res);
      setCurrentScreen('result');
    } catch (err) {
      setGlobalError(err.message || 'Failed to generate your wellbeing estimate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* 3D Depth Scale: Background at z = -5 */}
      <div className="depth-background" />

      {/* Interactive layer at z = 0 */}
      <div className="depth-interactive">
        <header className="app-header">
          <button
            className="brand-link"
            onClick={() => setCurrentScreen('welcome')}
            aria-label="Go to welcome screen"
          >
            <svg viewBox="0 0 24 24" className="brand-icon">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Mansik Santulan</span>
          </button>

          <div className="header-actions">
            <button
              id="header-urgent-help-btn"
              className="urgent-help-link"
              onClick={() => setIsHelpOpen(true)}
            >
              <span>Need help?</span>
            </button>

            <nav className="header-nav" aria-label="Main Navigation">
              <button
                className={`nav-btn ${currentScreen === 'chat' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('chat')}
              >
                Chat
              </button>
              <button
                className={`nav-btn ${currentScreen === 'history' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('history')}
              >
                History
              </button>
            </nav>
          </div>
        </header>

        {globalError && (
          <div className="card" style={{ background: 'var(--danger-soft)', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '1rem', marginBottom: '1.5rem' }}>
            <p className="text-sm"><strong>Notice:</strong> {globalError}</p>
          </div>
        )}

        <main id="main-content">
          {currentScreen === 'welcome' && (
            <Welcome
              onStartCheckIn={handleStartCheckIn}
              onOpenChat={() => setCurrentScreen('chat')}
              onOpenHistory={() => setCurrentScreen('history')}
            />
          )}

          {currentScreen === 'checkin' && (
            <CheckIn
              onSubmit={handleCheckInSubmit}
              onCancel={() => setCurrentScreen('welcome')}
              isLoading={isSubmitting}
            />
          )}

          {currentScreen === 'result' && (
            <Result
              result={predictionResult}
              onTalkItThrough={() => setCurrentScreen('chat')}
              onViewHistory={() => setCurrentScreen('history')}
              onRetake={handleStartCheckIn}
            />
          )}

          {currentScreen === 'chat' && (
            <Chat
              onOpenHelpline={() => setIsHelpOpen(true)}
              initialContextMessage={
                predictionResult
                  ? `Hi there! I see your latest wellbeing estimate was ${predictionResult.score.toFixed(1)}/10 (${predictionResult.band}). What would you like to unpack today?`
                  : undefined
              }
            />
          )}

          {currentScreen === 'history' && (
            <History onNewCheckIn={handleStartCheckIn} />
          )}
        </main>

        <footer className="app-footer">
          <p>
            <strong>Mansik Santulan</strong> — Support companion, not a therapist. Not medical advice.
          </p>
          <div className="footer-helplines">
            India Helpline: Tele-MANAS <strong>14416</strong> &bull; Emergency <strong>112</strong>
          </div>
        </footer>
      </div>

      <HelpBanner isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

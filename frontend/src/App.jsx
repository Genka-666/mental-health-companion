import React, { useEffect, useRef, useState } from "react";
import Welcome from "./pages/Welcome";
import CheckIn from "./pages/CheckIn";
import Result from "./pages/Result";
import Chat from "./pages/Chat";
import History from "./pages/History";
import HelpBanner from "./components/HelpBanner";
import Icon from "./components/Icon";
import { api } from "./api";

const NAV = [
  ["welcome", "Overview"],
  ["checkin", "Check-in"],
  ["chat", "Saathi"],
  ["history", "History"],
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [predictionResult, setPredictionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [chatBusy, setChatBusy] = useState(false);
  const [dataBusy, setDataBusy] = useState(false);
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentScreen]);

  function navigate(screen) {
    setGlobalError(null);
    setCurrentScreen(screen);
  }
  function handleDataDeleted() {
    setPredictionResult(null);
    setGlobalError(null);
    setSessionVersion((version) => version + 1);
  }
  async function handleCheckInSubmit(formData) {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      setPredictionResult(await api.predict(formData));
      setCurrentScreen("result");
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-wrapper">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="depth-background" aria-hidden="true" />
      <div className="depth-interactive">
        <header className="app-header">
          <button
            className="brand-link"
            onClick={() => navigate("welcome")}
            disabled={isSubmitting || dataBusy}
            aria-label="Mansik Santulan home"
          >
            <span className="brand-mark">
              <Icon name="leaf" size={23} />
            </span>
            <span className="brand-name">
              Mansik Santulan
              <span className="brand-caption">
                A little balance, every day.
              </span>
            </span>
          </button>
          <button
            id="header-urgent-help-btn"
            className="urgent-help-link"
            onClick={() => setIsHelpOpen(true)}
          >
            <Icon name="heart" size={16} /> Need urgent help?
          </button>
        </header>
        <nav className="header-nav" aria-label="Main navigation">
          {NAV.map(([screen, label]) => (
            <button
              key={screen}
              className={`nav-btn ${currentScreen === screen || (screen === "checkin" && currentScreen === "result") ? "active" : ""}`}
              aria-current={
                currentScreen === screen ||
                (screen === "checkin" && currentScreen === "result")
                  ? "page"
                  : undefined
              }
              onClick={() => navigate(screen)}
              disabled={isSubmitting || dataBusy}
            >
              {label}
            </button>
          ))}
        </nav>
        <main id="main-content" ref={mainRef} tabIndex={-1}>
          {globalError && (
            <div className="notice notice-error" role="alert">
              <strong>Let’s try that again.</strong>
              <p>{globalError}</p>
            </div>
          )}
          {currentScreen === "welcome" && (
            <Welcome
              onStartCheckIn={() => navigate("checkin")}
              onOpenChat={() => navigate("chat")}
              onOpenHistory={() => navigate("history")}
            />
          )}
          {currentScreen === "checkin" && (
            <CheckIn
              onSubmit={handleCheckInSubmit}
              onCancel={() => navigate("welcome")}
              isLoading={isSubmitting}
            />
          )}
          {currentScreen === "result" && (
            <Result
              result={predictionResult}
              onTalkItThrough={() => navigate("chat")}
              onViewHistory={() => navigate("history")}
              onRetake={() => navigate("checkin")}
            />
          )}
          <div hidden={currentScreen !== "chat"}>
            <Chat
              key={sessionVersion}
              active={currentScreen === "chat"}
              onBusyChange={setChatBusy}
              onOpenHelpline={() => setIsHelpOpen(true)}
            />
          </div>
          {currentScreen === "history" && (
            <History
              onNewCheckIn={() => navigate("checkin")}
              onDataDeleted={handleDataDeleted}
              onBusyChange={setDataBusy}
              chatBusy={chatBusy}
            />
          )}
        </main>
        <footer className="app-footer">
          <div className="footer-brand">
            <Icon name="leaf" size={17} /> Made for a little more balance.
          </div>
          <p>Support companion, not a therapist. Not medical advice.</p>
          <p className="footer-helplines">
            Urgent support in India: <a href="tel:14416">14416</a>
            <span aria-hidden="true"> · </span>Emergency:{" "}
            <a href="tel:112">112</a>
          </p>
        </footer>
      </div>
      <HelpBanner isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

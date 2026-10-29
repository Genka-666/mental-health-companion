import React, { useEffect, useState } from "react";
import TrendLine from "../components/TrendLine";
import Dialog from "../components/Dialog";
import Icon from "../components/Icon";
import { api } from "../api";
import { resetSessionId } from "../session";

export default function History({
  onNewCheckIn,
  onDataDeleted,
  onBusyChange,
  chatBusy,
}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function fetchHistory() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getHistory();
      setItems(res.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    let mounted = true;
    api
      .getHistory()
      .then((res) => {
        if (mounted) setItems(res.items || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function deleteData() {
    if (chatBusy || isLoading) return;
    setIsDeleting(true);
    setDeleteError(null);
    onBusyChange(true);
    try {
      await api.deleteMyData();
      resetSessionId();
      setItems([]);
      setError(null);
      setDeleted(true);
      setConfirmDelete(false);
      onDataDeleted?.();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
      onBusyChange(false);
    }
  }
  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
  }

  return (
    <div className="history-page animate-fade-in">
      <div className="page-intro">
        <span className="eyebrow">Every small step counts</span>
        <h1 className="page-title">
          Your journey, <em>so far.</em>
        </h1>
        <p>A little perspective on how your everyday habits change.</p>
      </div>
      {deleted && (
        <div className="notice notice-success" role="status">
          <Icon name="check" size={18} /> Your saved check-ins and messages have
          been deleted.
        </div>
      )}
      {isLoading ? (
        <div className="card loading-state" role="status">
          <span className="loading-orbit" /> Gathering your check-ins…
        </div>
      ) : error ? (
        <div className="card empty-state" role="alert">
          <Icon name="cloud" size={32} />
          <h2>We couldn’t load your journey.</h2>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchHistory}>
            Try again
          </button>
        </div>
      ) : items.length ? (
        <>
          <section className="card history-trend">
            <div className="section-heading">
              <h2>Your wellbeing estimates</h2>
              <span className="badge">
                {items.length} check-in{items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <TrendLine items={items} />
            <p className="text-xs">
              A reflection of habits, not a measure of your worth. These
              estimates are not a diagnosis.
            </p>
          </section>
          <div className="section-heading">
            <h2>Past check-ins</h2>
            <button className="text-button" onClick={onNewCheckIn}>
              Check in again <Icon name="arrow" size={16} />
            </button>
          </div>
          <ol className="history-list">
            {[...items].reverse().map((item) => (
              <li key={item.id} className="history-item-row">
                <span className="history-item-icon">
                  <Icon name="leaf" />
                </span>
                <div className="item-meta">
                  <strong>Wellbeing check-in</strong>
                  <span className="text-xs">{formatDate(item.created_at)}</span>
                </div>
                <span className={`band-pill ${item.band.toLowerCase()}`}>
                  {item.band}
                </span>
                <span className="item-score">
                  {item.score.toFixed(1)}
                  <small>/10</small>
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="card empty-state">
          <span className="empty-symbol">
            <Icon name="trend" size={34} />
          </span>
          <h2>Your story starts with a check-in.</h2>
          <p>
            You don’t need a perfect routine. Just a moment to notice how you’re
            doing.
          </p>
          <button className="btn btn-primary" onClick={onNewCheckIn}>
            Take your first check-in <Icon name="arrow" size={18} />
          </button>
        </div>
      )}
      <aside className="privacy-settings">
        <span className="privacy-settings-icon">
          <Icon name="shield" size={22} />
        </span>
        <div>
          <h2>Your space. Your choice.</h2>
          <p>
            Delete all saved check-ins and chat messages for this browser
            session, anytime.{" "}
            {chatBusy &&
              "Wait for your current chat reply to finish before deleting."}
          </p>
          <button
            id="delete-data-btn"
            className="text-button danger-text"
            disabled={chatBusy || isLoading}
            onClick={() => {
              setDeleteError(null);
              setConfirmDelete(true);
            }}
          >
            <Icon name="trash" size={15} /> Delete my data
          </button>
        </div>
      </aside>
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        titleId="delete-title"
        busy={isDeleting}
      >
        <span className="modal-symbol danger-text">
          <Icon name="trash" size={26} />
        </span>
        <h2 id="delete-title" className="page-title">
          Clear your saved data?
        </h2>
        <p className="modal-description">
          This permanently deletes your check-ins and messages from this app’s
          server. You’ll start with a fresh session. This cannot be undone.
        </p>
        <p className="text-xs">
          This does not delete any records retained by Google under its own data
          policies.
        </p>
        {deleteError && (
          <p className="notice notice-error" role="alert">
            {deleteError}
          </p>
        )}
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setConfirmDelete(false)}
            disabled={isDeleting}
          >
            Keep my data
          </button>
          <button
            id="confirm-delete-btn"
            className="btn btn-danger"
            onClick={deleteData}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete my data"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}

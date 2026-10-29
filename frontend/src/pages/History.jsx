import React, { useState, useEffect } from 'react';
import TrendLine from '../components/TrendLine';
import { api } from '../api';
import { resetSessionId } from '../session';

export default function History({ onNewCheckIn }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorText(null);
    try {
      const res = await api.getHistory();
      setHistoryItems(res.items || []);
    } catch (err) {
      setErrorText(err.message || 'Could not load your history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      await api.deleteMyData();
      resetSessionId();
      setHistoryItems([]);
      setShowConfirmDelete(false);
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="history-page animate-fade-in">
      <div className="history-header" style={{ marginBottom: '1.25rem' }}>
        <h2 className="title-sm" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Check-in History & Trend
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Track your habit-based wellbeing signals over time.
        </p>
      </div>

      {isLoading ? (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <span className="text-sm">Loading your check-ins...</span>
        </div>
      ) : errorText ? (
        <div className="card text-center" style={{ padding: '2rem' }}>
          <p className="text-sm" style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
            {errorText}
          </p>
          <button className="btn btn-secondary" onClick={fetchHistory}>Retry</button>
        </div>
      ) : (
        <>
          <TrendLine items={historyItems} />

          {historyItems.length > 0 ? (
            <div className="history-list">
              <h3 className="text-sm" style={{ fontWeight: 600, marginBottom: '0.6rem', color: 'var(--muted)' }}>
                Past Assessments
              </h3>
              {historyItems.map((item) => (
                <div key={item.id} className="history-item-row card">
                  <div className="item-meta">
                    <span className="item-date">{formatDate(item.created_at)}</span>
                    <span className={`item-band-tag ${item.band.toLowerCase()}`}>
                      {item.band}
                    </span>
                  </div>
                  <div className="item-score">
                    <strong>{item.score.toFixed(1)}</strong> <span className="unit">/ 10</span>
                  </div>
                </div>
              ))}

              <div className="danger-zone card" style={{ marginTop: '2rem', border: '1px solid rgba(181, 73, 63, 0.2)' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--danger)', fontWeight: 600 }}>
                    Privacy & Data Deletion
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--muted)', marginTop: '2px' }}>
                    Permanently wipe all your check-in scores and chat messages stored on this server.
                  </p>
                </div>
                <button
                  id="delete-data-btn"
                  className="btn btn-danger-outline"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  onClick={() => setShowConfirmDelete(true)}
                >
                  Delete my data
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-history card text-center" style={{ padding: '2.5rem 1rem' }}>
              <p className="subtitle" style={{ marginBottom: '1rem' }}>You haven't recorded any check-ins yet.</p>
              <button className="btn btn-primary" onClick={onNewCheckIn}>
                Take your first check-in
              </button>
            </div>
          )}
        </>
      )}

      {showConfirmDelete && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal-card card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.5rem' }}>
              Confirm Data Deletion
            </h3>
            <p className="text-sm" style={{ color: 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Are you sure you want to delete all your history and messages? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-btn"
                className="btn btn-danger-outline"
                style={{ background: 'var(--danger)', color: '#FFFFFF' }}
                onClick={handleDeleteData}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .history-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          margin-bottom: 0.6rem;
        }
        .item-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .item-date {
          font-size: 0.85rem;
          color: var(--muted);
        }
        .item-band-tag {
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }
        .item-band-tag.good { background: var(--accent-soft); color: var(--accent); }
        .item-band-tag.moderate { background: rgba(201, 131, 58, 0.15); color: var(--warn); }
        .item-band-tag.low { background: var(--danger-soft); color: var(--danger); }
        .item-score {
          font-size: 1.35rem;
        }
        .item-score .unit {
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: normal;
        }
        .confirm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }
        .confirm-modal-card {
          max-width: 400px;
          width: 100%;
          margin: 0;
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}

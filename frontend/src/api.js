import { getSessionId } from './session';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMsg = errorData.detail;
          } else if (errorData.detail.detail) {
            errorMsg = errorData.detail.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
          }
        }
      } catch (e) {
        // Fallback to generic status text
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to the companion server. Please make sure the backend is running at http://localhost:8000.');
    }
    throw err;
  }
}

export const api = {
  checkHealth: () => request('/health'),
  predict: (inputs) => request('/predict', { method: 'POST', body: JSON.stringify(inputs) }),
  chat: (messages) => request('/chat', { method: 'POST', body: JSON.stringify({ messages }) }),
  getHistory: () => request('/history', { method: 'GET' }),
  deleteMyData: () => request('/me', { method: 'DELETE' }),
};

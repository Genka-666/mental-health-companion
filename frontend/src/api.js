import { getSessionId } from "./session.js";

const API_BASE = (
  import.meta.env?.VITE_API_BASE || "http://localhost:8000"
).replace(/\/+$/, "");

async function request(endpoint, { timeoutMs = 30000, ...options } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "X-Session-Id": getSessionId(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          if (typeof errorData.detail === "string") {
            errorMsg = errorData.detail;
          } else if (errorData.detail.detail) {
            errorMsg = errorData.detail.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail
              .map((d) => d.msg || JSON.stringify(d))
              .join(", ");
          }
        }
      } catch (e) {
        // Fallback to generic status text
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        "The companion is taking a little longer to respond. Please try again.",
      );
    }
    if (err instanceof TypeError) {
      throw new Error(
        "We could not reach the companion right now. Check your connection and try again shortly.",
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  checkHealth: () => request("/health"),
  predict: (inputs) =>
    request("/predict", { method: "POST", body: JSON.stringify(inputs) }),
  chat: (messages) =>
    request("/chat", {
      method: "POST",
      timeoutMs: 75000,
      body: JSON.stringify({
        messages: messages
          .slice(-20)
          .map(({ role, content }) => ({ role, content })),
      }),
    }),
  getHistory: () => request("/history", { method: "GET" }),
  deleteMyData: () => request("/me", { method: "DELETE" }),
};

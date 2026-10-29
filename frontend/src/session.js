const STORAGE_KEY = "mhc_session_id";
let memorySessionId;

function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 compliant UUID generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = memorySessionId || generateUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    memorySessionId = id;
    return id;
  } catch {
    memorySessionId ||= generateUUID();
    return memorySessionId;
  }
}

export function resetSessionId() {
  memorySessionId = generateUUID();
  try {
    localStorage.setItem(STORAGE_KEY, memorySessionId);
  } catch {
    // Keep the replacement ID when storage is unavailable.
  }
  return memorySessionId;
}

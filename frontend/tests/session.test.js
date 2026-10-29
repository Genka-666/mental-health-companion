import { test } from "node:test";
import assert from "node:assert/strict";

async function freshSession(label) {
  return import(`../src/session.js?case=${label}`);
}
function storage() {
  const entries = new Map();
  return {
    getItem: (key) => entries.get(key) || null,
    setItem: (key, value) => entries.set(key, value),
  };
}

test("session is stable and resets when localStorage is unavailable", async () => {
  delete globalThis.localStorage;
  const session = await freshSession("unavailable");
  const first = session.getSessionId();
  assert.equal(session.getSessionId(), first);
  assert.match(
    first,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  const replacement = session.resetSessionId();
  assert.notEqual(replacement, first);
  assert.equal(session.getSessionId(), replacement);
});

test("session persists in available storage and rotates on deletion", async () => {
  globalThis.localStorage = storage();
  const session = await freshSession("available");
  const first = session.getSessionId();
  assert.equal(globalThis.localStorage.getItem("mhc_session_id"), first);
  assert.equal(session.getSessionId(), first);
  const replacement = session.resetSessionId();
  assert.notEqual(replacement, first);
  assert.equal(session.getSessionId(), replacement);
  assert.equal(globalThis.localStorage.getItem("mhc_session_id"), replacement);
});

test("losing storage access keeps the last known session", async () => {
  globalThis.localStorage = storage();
  const session = await freshSession("blocked");
  const first = session.getSessionId();
  globalThis.localStorage = {
    getItem() {
      throw new Error("Blocked");
    },
    setItem() {
      throw new Error("Blocked");
    },
  };
  assert.equal(session.getSessionId(), first);
  const replacement = session.resetSessionId();
  assert.equal(session.getSessionId(), replacement);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

test("long chats retain the newest turn and strip UI-only fields", async () => {
  const messages = Array.from({ length: 80 }, (_, index) => ({
    role: index % 2 ? "user" : "assistant",
    content: `Message ${index}`,
    isCrisis: false,
  }));
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return { ok: true, json: async () => ({ reply: "Hello" }) };
  };
  await api.chat(messages);
  const payload = JSON.parse(captured.options.body);
  assert.equal(payload.messages.length, 20);
  assert.deepEqual(payload.messages.at(-1), {
    role: "user",
    content: "Message 79",
  });
  assert.equal("isCrisis" in payload.messages[0], false);
  assert.ok(captured.options.headers["X-Session-Id"]);
  assert.ok(captured.options.signal instanceof AbortSignal);
});

test("server validation errors are readable", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 422,
    json: async () => ({
      detail: [{ msg: "Age is outside the allowed range" }],
    }),
  });
  await assert.rejects(api.predict({}), /Age is outside the allowed range/);
});

test("network errors do not expose development URLs", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(
    api.getHistory(),
    (error) =>
      /Check your connection/.test(error.message) &&
      !/localhost/.test(error.message),
  );
});

test("request aborts produce a retry message", async () => {
  globalThis.fetch = async () => {
    const error = new Error("Aborted");
    error.name = "AbortError";
    throw error;
  };
  await assert.rejects(api.getHistory(), /taking a little longer/);
});

test("chat waits beyond the old deadline but still has a bounded timeout", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let signal;
  globalThis.fetch = async (_url, options) => {
    signal = options.signal;
    return new Promise((_resolve, reject) => {
      signal.addEventListener(
        "abort",
        () => {
          const error = new Error("Aborted");
          error.name = "AbortError";
          reject(error);
        },
        { once: true },
      );
    });
  };
  const pending = api.chat([{ role: "user", content: "Hello" }]);
  const rejected = assert.rejects(pending, /taking a little longer/);
  t.mock.timers.tick(30001);
  assert.equal(
    signal.aborted,
    false,
    "a slower Gemini reply must survive 30 seconds",
  );
  t.mock.timers.tick(44999);
  assert.equal(
    signal.aborted,
    true,
    "the request must still stop at its final deadline",
  );
  await rejected;
});

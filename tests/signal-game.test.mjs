import assert from "node:assert/strict";
import test from "node:test";
import { createSignalGame, signalGameReducer } from "../src/lib/signal-game.ts";

test("a wrong match stays on the task and can be retried", () => {
  const initial = Object.freeze(createSignalGame());
  const wrong = signalGameReducer(initial, { type: "answer", project: "claimpilot" });
  assert.equal(wrong.roundIndex, 0);
  assert.equal(wrong.correctCount, 0);
  assert.equal(wrong.outcome, "wrong");
  assert.equal(wrong.attempts, 1);
  assert.equal(wrong.selectedProject, "claimpilot");
  assert.equal(initial.attempts, 0);

  const retried = signalGameReducer(wrong, { type: "answer", project: "prism" });
  assert.equal(retried.outcome, "correct");
  assert.equal(retried.correctCount, 1);
  assert.equal(retried.attempts, 2);
});

test("next cannot skip an unanswered or incorrectly answered task", () => {
  const initial = createSignalGame();
  assert.equal(signalGameReducer(initial, { type: "next" }), initial);
  const wrong = signalGameReducer(initial, { type: "answer", project: "jarvis" });
  assert.equal(signalGameReducer(wrong, { type: "next" }), wrong);
});

test("a correct match locks its score until the next task", () => {
  const correct = signalGameReducer(createSignalGame(), { type: "answer", project: "prism" });
  const repeated = signalGameReducer(correct, { type: "answer", project: "prism" });
  const changed = signalGameReducer(correct, { type: "answer", project: "saarthi" });
  assert.equal(correct.correctCount, 1);
  assert.equal(repeated, correct);
  assert.equal(changed, correct);

  const next = signalGameReducer(correct, { type: "next" });
  assert.equal(next.roundIndex, 1);
  assert.equal(next.outcome, "idle");
  assert.equal(next.selectedProject, null);
  assert.equal(next.correctCount, 1);
});

test("all four intended matches complete the game exactly once", () => {
  let state = createSignalGame();
  for (const project of ["prism", "claimpilot", "saarthi"]) {
    state = signalGameReducer(state, { type: "answer", project });
    assert.equal(state.status, "playing");
    state = signalGameReducer(state, { type: "next" });
  }
  state = signalGameReducer(state, { type: "answer", project: "jarvis" });
  assert.equal(state.status, "complete");
  assert.equal(state.correctCount, 4);
  assert.equal(state.roundIndex, 3);
  assert.equal(state.attempts, 4);
  assert.equal(signalGameReducer(state, { type: "answer", project: "jarvis" }), state);
  assert.equal(signalGameReducer(state, { type: "next" }), state);

  const reset = signalGameReducer(state, { type: "reset" });
  assert.deepEqual(reset, {
    roundIndex: 0,
    correctCount: 0,
    attempts: 0,
    outcome: "idle",
    selectedProject: null,
    status: "playing",
  });
});

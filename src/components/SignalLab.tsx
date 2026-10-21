"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  createSignalGame,
  signalGameReducer,
  signalProjects,
  signalTasks,
  type SignalProjectId,
} from "@/lib/signal-game";

type SignalLabProps = {
  onComplete?: () => void;
};

export default function SignalLab({ onComplete }: SignalLabProps) {
  const [state, dispatch] = useReducer(signalGameReducer, undefined, createSignalGame);
  const taskHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const completionReported = useRef(false);
  const task = signalTasks[state.roundIndex];
  const complete = state.status === "complete";
  const selected = signalProjects.find((project) => project.id === state.selectedProject);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    (complete ? resultHeading.current : taskHeading.current)?.focus();
  }, [state.roundIndex, state.attempts, complete]);

  useEffect(() => {
    if (!complete) {
      completionReported.current = false;
      return;
    }
    if (completionReported.current) return;
    completionReported.current = true;
    onComplete?.();
  }, [complete, onComplete]);

  function answer(project: SignalProjectId) {
    if (state.outcome === "correct" || complete) return;
    if (state.roundIndex === signalTasks.length - 1 && project === task.project) {
      shouldFocus.current = true;
    }
    dispatch({ type: "answer", project });
  }

  function advance() {
    shouldFocus.current = true;
    dispatch({ type: "next" });
  }

  function restart() {
    shouldFocus.current = true;
    dispatch({ type: "reset" });
  }

  const feedback = state.outcome === "correct"
    ? `Matched. ${task.explanation}`
    : state.outcome === "wrong"
      ? `${selected?.name} focuses on ${selected?.specialty.toLowerCase()}. ${task.hint} Try another project.`
      : "Choose a project below. You can retry any match.";

  return (
    <section className="signal-lab" id="lab" aria-labelledby="lab-title">
      <div className="lab-heading">
        <p>02 / PLAY WITH THE WORK</p>
        <h2 id="lab-title">Signal Lab<span aria-hidden="true">.</span></h2>
        <p>Four incoming tasks. Four AI projects. Match each task to the system built for it.</p>
        <p>Optional. No timer. Explore at your own pace.</p>
      </div>

      <div className="lab-console">
        <div className="lab-topline">
          <span>{complete ? "ALL SIGNALS CONNECTED" : "INCOMING TASK"}</span>
          <span>{state.correctCount} / {signalTasks.length} matched</span>
        </div>
        <progress className="lab-progress" value={state.correctCount} max={signalTasks.length} aria-label="Tasks matched">
          {state.correctCount} of {signalTasks.length}
        </progress>

        {complete ? (
          <div className="lab-result">
            <h3 ref={resultHeading} tabIndex={-1}>All four tasks connected.</h3>
            <p>You made {state.correctCount} matches in {state.attempts} {state.attempts === 1 ? "attempt" : "attempts"}.</p>
            <ul>
              {signalTasks.map((item) => (
                <li key={item.project}>
                  <span>{item.input}</span>
                  <strong>{signalProjects.find((project) => project.id === item.project)?.name}</strong>
                </li>
              ))}
            </ul>
            <button className="lab-next" type="button" onClick={restart}>Play again <span aria-hidden="true">↻</span></button>
          </div>
        ) : (
          <>
            <div className="lab-task">
              <p>Task {String(state.roundIndex + 1).padStart(2, "0")} / {task.input}</p>
              <h3 id="lab-task-title" ref={taskHeading} tabIndex={-1}>{task.prompt}</h3>
            </div>
            <fieldset aria-describedby="lab-task-title lab-feedback">
              <legend>Which project should handle this?</legend>
              <div className="lab-options">
                {signalProjects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    disabled={state.outcome === "correct"}
                    data-state={state.selectedProject === project.id && state.outcome !== "idle" ? state.outcome : undefined}
                    onClick={() => answer(project.id)}
                  >
                    <span aria-hidden="true">0{index + 1}</span>
                    <strong>{project.name}</strong>
                    <span>{project.specialty}</span>
                    {state.selectedProject === project.id && state.outcome !== "idle" && (
                      <span>{state.outcome === "correct" ? "Matched ✓" : "Try again"}</span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <p className="lab-feedback" id="lab-feedback" aria-live="polite" aria-atomic="true" data-state={state.outcome}>
          {feedback}
        </p>
        {!complete && state.outcome === "correct" && (
          <button className="lab-next" type="button" onClick={advance}>Next task <span aria-hidden="true">→</span></button>
        )}
      </div>
    </section>
  );
}

export type SignalProjectId = "prism" | "claimpilot" | "saarthi" | "jarvis";

export type SignalGameState = Readonly<{
  roundIndex: number;
  correctCount: number;
  attempts: number;
  outcome: "idle" | "wrong" | "correct";
  selectedProject: SignalProjectId | null;
  status: "playing" | "complete";
}>;

export type SignalGameAction =
  | { type: "answer"; project: SignalProjectId }
  | { type: "next" }
  | { type: "reset" };

export const signalProjects: ReadonlyArray<Readonly<{
  id: SignalProjectId;
  name: string;
  specialty: string;
}>> = [
  { id: "prism", name: "PRISM", specialty: "Construction intelligence" },
  { id: "claimpilot", name: "ClaimPilot", specialty: "Motor insurance claims" },
  { id: "saarthi", name: "Saarthi", specialty: "Grounded learning" },
  { id: "jarvis", name: "JARVIS", specialty: "Voice and desktop actions" },
];

export const signalTasks: ReadonlyArray<Readonly<{
  input: string;
  prompt: string;
  project: SignalProjectId;
  hint: string;
  explanation: string;
}>> = [
  {
    input: "Construction progress report",
    prompt: "Turn today's site report into progress insights and flag the risks ahead.",
    project: "prism",
    hint: "Look for the project built around construction reports and project risks.",
    explanation: "PRISM turns construction reports into progress data, forecasts, and explainable risk insights.",
  },
  {
    input: "Motor insurance evidence",
    prompt: "Review vehicle damage images and claim documents against the policy evidence.",
    project: "claimpilot",
    hint: "This task needs the project that combines claim documents, damage images, and insurance evidence.",
    explanation: "ClaimPilot reviews claim evidence and prepares settlement recommendations for human review.",
  },
  {
    input: "Course question with sources",
    prompt: "Explain a course concept using my study materials, and show where the answer comes from.",
    project: "saarthi",
    hint: "Look for the learning project that grounds its answers in course materials.",
    explanation: "Saarthi gives cited answers from course materials and guides each learner's next step.",
  },
  {
    input: "Voice command / desktop action",
    prompt: "Listen to a spoken command and carry out a useful action on the desktop.",
    project: "jarvis",
    hint: "This needs the assistant with speech, a wake word, and local desktop skills.",
    explanation: "JARVIS connects voice interaction with local desktop skills, answers, and computer vision.",
  },
];

export function createSignalGame(): SignalGameState {
  return {
    roundIndex: 0,
    correctCount: 0,
    attempts: 0,
    outcome: "idle",
    selectedProject: null,
    status: "playing",
  };
}

export function signalGameReducer(state: SignalGameState, action: SignalGameAction): SignalGameState {
  if (action.type === "reset") return createSignalGame();
  if (state.status === "complete") return state;

  if (action.type === "next") {
    if (state.outcome !== "correct" || state.roundIndex >= signalTasks.length - 1) return state;
    return {
      ...state,
      roundIndex: state.roundIndex + 1,
      outcome: "idle",
      selectedProject: null,
    };
  }

  if (state.outcome === "correct") return state;
  const isCorrect = action.project === signalTasks[state.roundIndex].project;
  return {
    ...state,
    attempts: state.attempts + 1,
    selectedProject: action.project,
    outcome: isCorrect ? "correct" : "wrong",
    correctCount: state.correctCount + (isCorrect ? 1 : 0),
    status: isCorrect && state.roundIndex === signalTasks.length - 1 ? "complete" : "playing",
  };
}

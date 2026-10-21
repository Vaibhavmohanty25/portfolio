// This is the single place to update profile links and project details.
export const profile = {
  name: "VAIBHAV MOHANTY",
  role: "AI/ML ENGINEER",
  intro: "I build AI systems that turn complex information into clear, useful decisions.",
  email: "mohanty.vaibhav2005@gmail.com",
  github: "https://github.com/Vaibhavmohanty25",
  linkedin: "",
  resume: "https://drive.google.com/drive/folders/1OqbC0rOP1YKkU9HzQeLF3ECeMdoGXbvH?usp=sharing",
};

export type Project = {
  number: string;
  name: string;
  category: string;
  summary: string;
  detail: string;
  tags: string[];
  github: string;
  live: string;
  visual: "prism" | "claim" | "saarthi" | "jarvis";
};

export const projects: Project[] = [
  {
    number: "01",
    name: "PRISM",
    category: "CONSTRUCTION / INTELLIGENCE",
    summary: "From construction reports to explainable project insights.",
    detail: "PRISM extracts progress data, tracks activity history, and surfaces evidence-backed forecasts and risks.",
    tags: ["Gemini", "FastAPI", "React"],
    github: "https://github.com/Vaibhavmohanty25/PRISM",
    live: "",
    visual: "prism",
  },
  {
    number: "02",
    name: "ClaimPilot",
    category: "INSURANCE / AGENTS",
    summary: "A clearer path through motor insurance claims.",
    detail: "ClaimPilot reviews documents and damage images, retrieves policy evidence, and prepares human-reviewed settlement recommendations.",
    tags: ["LangGraph", "RAG", "Vision"],
    github: "https://github.com/Vaibhavmohanty25/ClaimPilot",
    live: "",
    visual: "claim",
  },
  {
    number: "03",
    name: "Saarthi",
    category: "EDUCATION / AI",
    summary: "An adaptive tutor grounded in your course materials.",
    detail: "Saarthi combines cited answers, prerequisite concept graphs, and verified quizzes with Bayesian mastery tracking to guide each learner's next step.",
    tags: ["RAG", "Knowledge Graphs", "BKT"],
    github: "https://github.com/Vaibhavmohanty25/Saarthi-A-Verified-Grounded-Adaptive-Tutor",
    live: "",
    visual: "saarthi",
  },
  {
    number: "04",
    name: "JARVIS",
    category: "VOICE / ASSISTANT",
    summary: "A voice assistant that can see and act.",
    detail: "JARVIS combines wake-word interaction, speech, local desktop skills, LLM answers, and webcam object detection.",
    tags: ["Python", "Voice", "Computer Vision"],
    github: "https://github.com/Vaibhavmohanty25/JARVIS",
    live: "",
    visual: "jarvis",
  },
];

export const additionalProjects = [
  { name: "Content Intelligence Engine", category: "AI / CONTENT", github: "https://github.com/Vaibhavmohanty25/content-intelligence-engine" },
  { name: "StockSenseAI", category: "AI / FINANCE", github: "https://github.com/Vaibhavmohanty25/StockSenseAI" },
  { name: "MY_LLM", category: "LANGUAGE MODELS", github: "https://github.com/Vaibhavmohanty25/MY_LLM" },
  { name: "mini-blogger", category: "WEB APPLICATION", github: "https://github.com/Vaibhavmohanty25/mini-blogger" },
  { name: "University Management System", category: "SOFTWARE SYSTEM", github: "https://github.com/Vaibhavmohanty25/University-Management-System" },
  { name: "FaceSense", category: "COMPUTER VISION / COLLABORATION", github: "https://github.com/Vaibhavmohanty25/FaceSense" },
  { name: "CIVITAS", category: "DISASTER RESPONSE", github: "https://github.com/Vaibhavmohanty25/CIVITAS-A_disaster_management_application" },
  { name: "Deadlock Detection System", category: "SYSTEMS ENGINEERING", github: "https://github.com/Vaibhavmohanty25/Deadlock-Detection-System-" },
];

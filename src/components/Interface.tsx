"use client";
import { motion, useReducedMotion } from "motion/react";
import { createContext, useContext } from "react";

export const MotionPausedContext = createContext(false);
export function useQuietMotion() {
  const systemPreference = useReducedMotion();
  const paused = useContext(MotionPausedContext);
  return Boolean(systemPreference) || paused;
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const quiet = useQuietMotion();
  return <motion.div className={className} initial={{ y: quiet ? 0 : 20 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: quiet ? 0 : 0.65, delay: quiet ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

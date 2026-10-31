"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface WordPair {
  tailored: string;
  role: string;
}

const PAIRS: WordPair[] = [
  { tailored: "tailored", role: "roles" },
  { tailored: "calibrated", role: "interviews" },
  { tailored: "optimized", role: "offers" },
  { tailored: "engineered", role: "dream roles" },
];

export default function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentPair = PAIRS[index];

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % PAIRS.length);
  }, []);

  // Auto-advance every 3.8s unless paused by mouse hover
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const timer = setInterval(() => {
      advance();
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, advance]);

  // Easing curve from animate skill: strong ease-out (cubic-bezier(0.23, 1, 0.32, 1))
  const motionTransition = {
    duration: 0.42,
    ease: [0.23, 1, 0.32, 1] as const,
  };

  return (
    <h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto select-none cursor-pointer"
      onClick={advance}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      title="Click to cycle"
    >
      {/* Line 1: Resumes + [tailored] + for */}
      <span className="block sm:inline md:block">
        <span>Resumes </span>
        <span className="inline-block relative overflow-hidden align-top pb-1 -mb-1 text-neutral-950 dark:text-white font-semibold">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentPair.tailored}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(100%)", opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { transform: "translateY(0%)", opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(-100%)", opacity: 0 }
              }
              transition={motionTransition}
              className="inline-block"
            >
              {currentPair.tailored}
            </motion.span>
          </AnimatePresence>
        </span>
        <span> for</span>
      </span>{" "}

      {/* Line 2: the + [roles] + you want. */}
      <span className="block sm:inline md:block">
        <span>the </span>
        <span className="inline-block relative overflow-hidden align-top pb-1 -mb-1 text-neutral-950 dark:text-white font-semibold">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentPair.role}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(100%)", opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { transform: "translateY(0%)", opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(-100%)", opacity: 0 }
              }
              transition={{
                duration: motionTransition.duration,
                ease: motionTransition.ease,
                delay: shouldReduceMotion ? 0 : 0.05, // 50ms stagger
              }}
              className="inline-block"
            >
              {currentPair.role}
            </motion.span>
          </AnimatePresence>
        </span>
        <span> you want.</span>
      </span>
    </h1>
  );
}

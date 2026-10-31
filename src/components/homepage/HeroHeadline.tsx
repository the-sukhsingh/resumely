"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const TARGET_WORDS = ["roles", "teams", "offers"] as const;

export default function HeroHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTailoredHovered, setIsTailoredHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentTarget = TARGET_WORDS[wordIndex];

  const advanceWord = useCallback(() => {
    setWordIndex((prev) => (prev + 1) % TARGET_WORDS.length);
  }, []);

  // Cycle target word every 4.2 seconds unless paused by hover
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const timer = setInterval(() => {
      advanceWord();
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, advanceWord]);

  // Easing curve from animate skill: strong ease-out (cubic-bezier(0.23, 1, 0.32, 1))
  const transition = {
    duration: 0.38,
    ease: [0.23, 1, 0.32, 1] as const,
  };

  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.18] sm:leading-[1.12] max-w-4xl mx-auto select-none">
      {/* Row 1: Guaranteed 1st line, never wraps */}
      <span className="block whitespace-nowrap">
        <span>Resumes </span>

        {/* Word 1: "tailored" with precision underline & hover calibration badge */}
        <span
          className="relative inline-block text-neutral-950 dark:text-white font-semibold cursor-pointer group"
          onMouseEnter={() => setIsTailoredHovered(true)}
          onMouseLeave={() => setIsTailoredHovered(false)}
        >
          {/* Minimal Floating ATS Calibration Badge on Hover */}
          <AnimatePresence>
            {isTailoredHovered && !shouldReduceMotion && (
              <motion.span
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 3, scale: 0.95 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm pointer-events-none whitespace-nowrap tracking-normal"
              >
                ATS · 99.4% Fit
              </motion.span>
            )}
          </AnimatePresence>

          <span>tailored</span>

          {/* Minimal Precision Underline Accent */}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white origin-left pointer-events-none"
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          />
        </span>

        <span> for</span>
      </span>

      {/* Row 2: Guaranteed 2nd line, never wraps */}
      <span className="block whitespace-nowrap mt-0.5 sm:mt-1">
        <span>the </span>

        {/* Word 2: "roles" / "teams" / "offers" with smooth motion/react roll */}
        <span
          onClick={advanceWord}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative inline-block overflow-hidden align-top text-neutral-950 dark:text-white font-semibold cursor-pointer select-none px-0.5 pb-1 -mb-1"
          title="Click to switch target"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentTarget}
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
              transition={transition}
              className="inline-block"
            >
              {currentTarget}
            </motion.span>
          </AnimatePresence>

          {/* Minimal dotted baseline */}
          <span className="absolute bottom-1 left-0.5 right-0.5 h-[2px] border-b-2 border-dotted border-neutral-400/80 dark:border-neutral-500/80 pointer-events-none" />
        </span>

        <span> you want.</span>
      </span>
    </h1>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const TARGET_WORDS = ["roles", "teams", "offers"] as const;

export default function HeroHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  // Optical ease-out curve from Emil Kowalski & Apple: starts crisp, lands like silk
  const wordTransition = {
    duration: 0.48,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.18] sm:leading-[1.12] max-w-4xl mx-auto select-none">
      {/* Row 1: Guaranteed 1st line, never wraps */}
      <span className="block whitespace-nowrap">
        <span>Resumes </span>

        {/* Word 1: "tailored" with tactile spring response and precision baseline */}
        <motion.span
          className="relative inline-block font-semibold text-neutral-950 dark:text-white cursor-pointer select-none"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <span>tailored</span>

          {/* Minimal Precision Underline Accent */}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white origin-left pointer-events-none rounded-full"
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
        </motion.span>

        <span> for</span>
      </span>

      {/* Row 2: Guaranteed 2nd line, never wraps */}
      <span className="block whitespace-nowrap mt-0.5 sm:mt-1">
        <span>the </span>

        {/* Word 2: "roles" / "teams" / "offers" with fluid blur-assisted slot roll */}
        <button
          type="button"
          onClick={advanceWord}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative inline-block overflow-hidden align-top text-neutral-950 dark:text-white font-semibold cursor-pointer select-none px-0.5 pb-1 -mb-1 text-left active:scale-[0.98] transition-transform duration-150"
          title="Click to cycle target"
          aria-label={`Target: ${currentTarget}. Click to cycle.`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentTarget}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(55%)", opacity: 0, filter: "blur(5px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { transform: "translateY(0%)", opacity: 1, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { transform: "translateY(-55%)", opacity: 0, filter: "blur(5px)" }
              }
              transition={wordTransition}
              className="inline-block"
            >
              {currentTarget}
            </motion.span>
          </AnimatePresence>

          {/* Minimal dotted baseline accent */}
          <span className="absolute bottom-1 left-0.5 right-0.5 h-[2px] border-b-2 border-dotted border-neutral-400/80 dark:border-neutral-500/80 pointer-events-none" />
        </button>

        <span> you want.</span>
      </span>
    </h1>
  );
}

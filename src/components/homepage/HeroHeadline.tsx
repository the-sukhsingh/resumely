"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const TARGET_WORDS = ["roles", "teams", "offers"] as const;

// Emil Kowalski & Apple fluid ease-out curve: responsive velocity + silky deceleration
const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

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

  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[74px] tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.18] sm:leading-[1.12] max-w-4xl mx-auto select-none">
      {/* Row 1: Guaranteed 1st line, never wraps */}
      <span className="block whitespace-nowrap">
        <span>Resumes </span>

        {/* Word 1: "tailored" with clean typography & tactile spring feedback (no underline) */}
        <motion.span
          className="inline-block font-semibold text-neutral-950 dark:text-white cursor-pointer select-none"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          tailored
        </motion.span>

        <span> for</span>
      </span>

      {/* Row 2: Guaranteed 2nd line, never wraps */}
      <span className="block whitespace-nowrap mt-0.5 sm:mt-1">
        <span className="inline-block">the&nbsp;</span>

        {/* Word 2: "roles" / "teams" / "offers" with synchronous position layout */}
        <motion.button
          layout="position"
          type="button"
          onClick={advanceWord}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{
            layout: { duration: 0.45, ease: MOTION_EASE },
          }}
          className="relative inline-block align-baseline text-left font-semibold text-neutral-950 dark:text-white cursor-pointer select-none"
          title="Click to cycle target"
          aria-label={`Target: ${currentTarget}. Click to cycle.`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentTarget}
              className="inline-block whitespace-nowrap"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: "45%", opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { y: "0%", opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: "-45%", opacity: 0 }
              }
              transition={{
                duration: 0.45,
                ease: MOTION_EASE,
              }}
              style={{ willChange: "transform, opacity" }}
            >
              {currentTarget}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.span
          layout="position"
          transition={{
            layout: { duration: 0.45, ease: MOTION_EASE },
          }}
          className="inline-block"
        >
          &nbsp;you want.
        </motion.span>
      </span>
    </h1>
  );
}

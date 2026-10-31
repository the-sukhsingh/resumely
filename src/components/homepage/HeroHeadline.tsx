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
            className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white origin-left pointer-events-none rounded-full"
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: MOTION_EASE, delay: 0.15 }}
          />
        </motion.span>

        <span> for</span>
      </span>

      {/* Row 2: Guaranteed 2nd line, never wraps */}
      <span className="block whitespace-nowrap mt-0.5 sm:mt-1">
        <span>the </span>

        {/* Word 2: "roles" / "teams" / "offers" with buttery GPU slot roll */}
        <motion.button
          type="button"
          onClick={advanceWord}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative inline-grid grid-cols-1 grid-rows-1 overflow-hidden align-baseline text-left font-semibold text-neutral-950 dark:text-white cursor-pointer select-none px-0.5"
          style={{
            // Smooth vertical alpha feathering mask: letters gracefully emerge & dissolve
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
          title="Click to cycle target"
          aria-label={`Target: ${currentTarget}. Click to cycle.`}
        >
          {/* Static invisible sizer so sibling text never twitches */}
          <span
            className="col-start-1 row-start-1 invisible pointer-events-none select-none"
            aria-hidden="true"
          >
            offers
          </span>

          <AnimatePresence initial={false}>
            <motion.span
              key={currentTarget}
              className="col-start-1 row-start-1 inline-block"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: "105%", opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { y: "0%", opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: "-105%", opacity: 0 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : {
                      y: { duration: 0.52, ease: MOTION_EASE },
                      opacity: { duration: 0.32, ease: MOTION_EASE },
                    }
              }
              style={{ willChange: "transform, opacity" }}
            >
              {currentTarget}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <span> you want.</span>
      </span>
    </h1>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import GlassIcon from "./GlassIcon";
import {
  IngestIllustration,
  CalibrateIllustration,
  CompileIllustration,
} from "./WorkflowIllustrations";
import {
  FileText,
  Target,
  Download,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  step: string;
  title: string;
  tagline: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Ingest your career record",
    tagline: "Raw Ingest → Ledger",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into a verified master ledger.",
    metric: "34 metrics parsed",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    step: "02",
    title: "Calibrate to the job posting",
    tagline: "Rubric Match → Re-rank",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements to match.",
    metric: "94% semantic fit",
    icon: <Target className="w-4 h-4" />,
  },
  {
    step: "03",
    title: "Download vector PDF & track",
    tagline: "Vector PDF → Tracker",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
    metric: "100% ATS passed",
    icon: <Download className="w-4 h-4" />,
  },
];

export default function Workflow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Subtle auto-advance cycle (Emil Kowalski: automatically progresses, but pauses immediately on hover or user interaction)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, shouldReduceMotion]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPaused(true); // User made an intentional choice; prioritize user agency
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % WORKFLOW_STEPS.length;
      handleStepClick(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length;
      handleStepClick(prev);
    }
  };

  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-12 sm:py-16 md:py-20 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757] animate-pulse" />
            <span className="uppercase tracking-wider">Deterministic Pipeline Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-2xl">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* Interactive Step Rail / Controller with Glass Icons */}
        <div
          role="tablist"
          aria-label="Workflow Stages"
          className="relative grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 mb-6"
        >
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <button
                key={step.step}
                role="tab"
                id={`workflow-tab-${step.step}`}
                aria-selected={isActive}
                aria-controls={`workflow-panel-${step.step}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleStepClick(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={cn(
                  "group relative flex flex-col text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 outline-none select-none",
                  "border border-black/[0.06] dark:border-white/[0.08]",
                  "active:scale-[0.985] cursor-pointer",
                  isActive
                    ? "bg-white dark:bg-[#141413] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
                    : "bg-white/40 dark:bg-[#111110]/40 hover:bg-white/80 dark:hover:bg-[#171716]/80 text-neutral-600 dark:text-neutral-400"
                )}
              >
                {/* Active Indicator Spring Border */}
                {isActive && (
                  <motion.div
                    layoutId="active-workflow-pill"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.45, bounce: 0.12 }
                    }
                    className="absolute inset-0 rounded-2xl border-2 border-[#c15f3c] dark:border-[#D97757] pointer-events-none"
                  />
                )}

                {/* Step Top Row: Glass Icon + Step Num + Metric */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-2.5">
                    <GlassIcon
                      variant={isActive ? "coral" : "default"}
                      size="md"
                      glow={isActive}
                    >
                      {step.icon}
                    </GlassIcon>
                    <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      STEP {step.step}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "font-mono text-[10.5px] px-2 py-0.5 rounded-full transition-colors",
                      isActive
                        ? "bg-[#c15f3c]/10 dark:bg-[#D97757]/15 text-[#c15f3c] dark:text-[#D97757] font-medium"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    )}
                  >
                    {step.metric}
                  </span>
                </div>

                {/* Step Title & Description */}
                <h3
                  className={cn(
                    "text-[15px] sm:text-[16px] font-medium tracking-tight transition-colors",
                    isActive
                      ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                      : "text-neutral-800 dark:text-neutral-300"
                  )}
                >
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 font-normal">
                  {step.description}
                </p>

                {/* Active Progress Line at Bottom of Tab */}
                <div className="mt-4 pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[10.5px] font-mono">
                  <span className="text-neutral-400 dark:text-neutral-500">{step.tagline}</span>
                  <span
                    className={cn(
                      "transition-transform duration-200",
                      isActive ? "translate-x-0.5 text-[#c15f3c] dark:text-[#D97757]" : "text-neutral-400 opacity-60"
                    )}
                  >
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Editorial Illustration Canvas (§3 Framed Figure Chrome) */}
        <figure
          id={`workflow-panel-${WORKFLOW_STEPS[activeStep].step}`}
          role="tabpanel"
          aria-labelledby={`workflow-tab-${WORKFLOW_STEPS[activeStep].step}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={cn(
            "relative w-full rounded-3xl overflow-hidden select-none",
            "border border-black/[0.08] dark:border-white/[0.08]",
            "bg-gradient-to-b from-white/80 to-white/40 dark:from-[#111110]/90 dark:to-[#0c0c0b]/80",
            "backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Top Hairline Telemetry Ribbon */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                STAGE {WORKFLOW_STEPS[activeStep].step} OF 03
              </span>
              <span className="hidden sm:inline text-neutral-400">·</span>
              <span className="hidden sm:inline truncate">
                {WORKFLOW_STEPS[activeStep].tagline}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-neutral-400">
                LATENCY: 340MS · ATS PASSRATE: 100%
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                PIPELINE LIVE
              </span>
            </div>
          </div>

          {/* Dynamic Illustration Canvas with Motion Transition */}
          <div className="relative min-h-[300px] sm:min-h-[340px] flex items-center justify-center p-2 sm:p-4">
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(6px)" }
                  }
                  animate={{ opacity: 1, transform: "scale(1) translateY(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(-6px)" }
                  }
                  transition={{
                    duration: 0.22,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="w-full"
                >
                  <IngestIllustration />
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(6px)" }
                  }
                  animate={{ opacity: 1, transform: "scale(1) translateY(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(-6px)" }
                  }
                  transition={{
                    duration: 0.22,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="w-full"
                >
                  <CalibrateIllustration />
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(6px)" }
                  }
                  animate={{ opacity: 1, transform: "scale(1) translateY(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "scale(0.98) translateY(-6px)" }
                  }
                  transition={{
                    duration: 0.22,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="w-full"
                >
                  <CompileIllustration />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Figcaption: Authentic Editorial Law (§3 Framed Figure Chrome) */}
          <figcaption className="px-4 sm:px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.06] font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span>
              Figure 1.0 — Resumely deterministic career pipeline: unstructured ingest → semantic rubric calibration → ats-verified vector compilation.
            </span>
            <span className="text-neutral-400 shrink-0 font-medium">
              STATUS: CONTINUOUS
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { PipelineIllustration } from "./WorkflowIllustrations";
import { cn } from "@/lib/utils";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Ingest your career record",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into a verified master ledger.",
  },
  {
    step: "02",
    title: "Calibrate to the job posting",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements to match.",
  },
  {
    step: "03",
    title: "Download vector PDF & track",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
  },
];

export default function Workflow() {
  const [activeStep, setActiveStep] = useState<number | null>(1); // Default highlight on Step 2 (the coral focal point)

  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 md:py-24 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.05] dark:border-white/[0.06] text-[10.5px] font-mono text-neutral-600 dark:text-neutral-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
            <span className="uppercase tracking-wider">Deterministic Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-xl">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* The Cohesive Workflow Illustration Canvas (§3 Framed Figure Chrome) */}
        <figure
          className={cn(
            "relative w-full rounded-3xl overflow-hidden select-none p-4 sm:p-6 md:p-8",
            "border border-black/[0.08] dark:border-white/[0.08]",
            "bg-gradient-to-b from-white/70 via-white/40 to-white/60 dark:from-[#111110]/80 dark:via-[#0c0c0b]/70 dark:to-[#0c0c0b]/80",
            "backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
          )}
        >
          {/* Top Hairline Flow Readout */}
          <div className="pb-4 mb-4 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                AUDITABLE PIPELINE
              </span>
              <span>·</span>
              <span>01 INGEST → 02 CALIBRATE → 03 COMPILE</span>
            </div>
            <span className="text-neutral-400 font-normal hidden sm:inline">
              LATENCY &lt; 400MS
            </span>
          </div>

          {/* Connected Illustration Flow */}
          <PipelineIllustration
            activeStep={activeStep}
            onSelectStep={(idx) => setActiveStep(idx)}
          />

          {/* Editorial Figcaption */}
          <figcaption className="mt-6 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span>
              Figure 1.0 — Deterministic career pipeline: unstructured ingest → semantic rubric calibration → ats-verified vector compilation.
            </span>
            <span className="text-neutral-400 shrink-0">
              STATUS: CONTINUOUS
            </span>
          </figcaption>
        </figure>

        {/* Clean, Minimal 3-Step Narrative Columns Below Illustration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-10">
          {WORKFLOW_STEPS.map((s, idx) => {
            const isSelected = activeStep === idx;

            return (
              <div
                key={s.step}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "group relative p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "bg-black/[0.02] dark:bg-white/[0.03]"
                    : "hover:bg-black/[0.01] dark:hover:bg-white/[0.015]"
                )}
              >
                <div
                  className={cn(
                    "font-mono text-xs mb-2 transition-colors",
                    isSelected
                      ? "text-[#c15f3c] dark:text-[#D97757] font-semibold"
                      : "text-neutral-400 dark:text-neutral-500"
                  )}
                >
                  {s.step} / 03
                </div>
                <h3
                  className={cn(
                    "text-[15px] sm:text-[16px] font-medium tracking-tight mb-1.5 transition-colors",
                    isSelected
                      ? "text-neutral-900 dark:text-neutral-100 font-semibold"
                      : "text-neutral-800 dark:text-neutral-200"
                  )}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

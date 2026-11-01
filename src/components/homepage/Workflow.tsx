"use client";

import React from "react";
import { SmoothWorkflowIllustration } from "./WorkflowIllustrations";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    phase: "Ingestion",
    title: "Ingest your career record",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into an atomic, verified master ledger.",
  },
  {
    step: "02",
    phase: "Calibration",
    title: "Calibrate to the job posting",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements via the Google XYZ formula.",
  },
  {
    step: "03",
    phase: "Compilation",
    title: "Download vector PDF & track",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 md:py-24 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 text-[10.5px] font-mono text-neutral-600 dark:text-neutral-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
            <span className="uppercase tracking-wider">Deterministic Pipeline Architecture</span>
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

        {/* The Cohesive, Smooth Editorial Workflow Illustration */}
        <figure
          className={cn(
            "relative w-full rounded-[28px] overflow-hidden select-none",
            "border border-black/[0.06] dark:border-white/[0.08]",
            "bg-neutral-50/50 dark:bg-[#141413]/50 backdrop-blur-md",
            "shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          )}
        >
          {/* Main Visual: Smooth Connected Pipeline */}
          <SmoothWorkflowIllustration />

          {/* Authentic Editorial Figcaption */}
          <figcaption className="px-6 sm:px-8 py-3.5 border-t border-black/[0.05] dark:border-white/[0.06] font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span>
              Figure 1.0 — Deterministic pipeline: unstructured ingestion reconciled into atomic career ledger, calibrated against job description rubric, and compiled into ATS-verified vector artifact.
            </span>
            <span className="text-neutral-400 shrink-0 font-medium">
              STATUS: CONTINUOUS
            </span>
          </figcaption>
        </figure>

        {/* Clean, Refined 3-Step Narrative Row (Cardless, pure typographic rhythm) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 sm:pt-14">
          {STEPS.map((s) => (
            <div key={s.step} className="space-y-2">
              <div className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {s.step} / {s.phase}
              </div>
              <h3 className="text-[16px] font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

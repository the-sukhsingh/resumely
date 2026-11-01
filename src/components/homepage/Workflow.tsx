"use client";

import React, { useState } from "react";
import { WorkflowPipeline } from "./WorkflowIllustrations";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: 1,
    stepNum: "01",
    phase: "Ingestion",
    title: "Ingest your career record",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into an atomic, verified master ledger.",
  },
  {
    step: 2,
    stepNum: "02",
    phase: "Calibration",
    title: "Calibrate to the job posting",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements via the Google XYZ formula.",
    isFocal: true,
  },
  {
    step: 3,
    stepNum: "03",
    phase: "Compilation",
    title: "Download vector PDF & track",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
  },
];

export default function Workflow() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 md:py-24 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean, Unadorned Section Header (Hallmark & Monotykamary discipline) */}
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* Unified Editorial Pipeline Illustration */}
        <div className="mb-10 sm:mb-12">
          <WorkflowPipeline
            activeStage={activeStage}
            onHoverStage={setActiveStage}
          />
        </div>

        {/* 3-Step Interactive Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {STEPS.map((s) => {
            const isActive = activeStage === s.step;

            return (
              <div
                key={s.step}
                onMouseEnter={() => setActiveStage(s.step)}
                onMouseLeave={() => setActiveStage(null)}
                className={cn(
                  "flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 cursor-pointer",
                  isActive
                    ? "border-neutral-400 dark:border-neutral-600 bg-neutral-50/80 dark:bg-neutral-900/50 -translate-y-0.5"
                    : "border-neutral-200/70 dark:border-neutral-800/70 bg-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-wider",
                        s.isFocal
                          ? "text-[#c15f3c] dark:text-[#D97757] font-semibold"
                          : "text-neutral-400 dark:text-neutral-500"
                      )}
                    >
                      {s.stepNum} // {s.phase}
                    </span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
                    )}
                  </div>
                  <h3 className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

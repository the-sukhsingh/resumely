"use client";

import React from "react";
import {
  HairlineLedger,
  HairlineCalibrate,
  HairlineCompile,
} from "./WorkflowIllustrations";

const STEPS = [
  {
    step: "01",
    phase: "Ingestion",
    title: "Ingest your career record",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into an atomic, verified master ledger.",
    illustration: <HairlineLedger />,
  },
  {
    step: "02",
    phase: "Calibration",
    title: "Calibrate to the job posting",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements via the Google XYZ formula.",
    illustration: <HairlineCalibrate />,
    isFocal: true,
  },
  {
    step: "03",
    phase: "Compilation",
    title: "Download vector PDF & track",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
    illustration: <HairlineCompile />,
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 md:py-24 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean, Unadorned Section Header (No pill, no gradient) */}
        <div className="mb-12 sm:mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* 3-Step Process Grid with Hairline Isometric Figures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col justify-between group">
              {/* Hairline Isometric Figure Canvas */}
              <div className="w-full flex items-center justify-center py-2 mb-6 border-b border-neutral-100 dark:border-neutral-800/80">
                {s.illustration}
              </div>

              {/* Step Narrative */}
              <div className="space-y-2">
                <div
                  className={
                    s.isFocal
                      ? "font-mono text-[11px] text-[#c15f3c] dark:text-[#D97757] uppercase tracking-wider font-semibold"
                      : "font-mono text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider"
                  }
                >
                  {s.step} / {s.phase}
                </div>
                <h3 className="text-[17px] font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

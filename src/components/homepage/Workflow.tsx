"use client";

import React from "react";
import FeatureCard from "./FeatureCard";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      title: "Ingest your career record",
      description:
        "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into a verified master ledger.",
      artifact: (
        <div className="pt-4 border-t border-neutral-300/70 dark:border-neutral-800 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase tracking-wider text-[10px]">Source Ingest</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Extracted</span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-medium text-neutral-900 dark:text-neutral-100">
            <span className="truncate">resume-draft.pdf</span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal tabular-nums shrink-0 ml-2">PDF / LinkedIn</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-300/40 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400">
            <span>Master Ledger</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium tabular-nums">34 impact metrics parsed</span>
          </div>
        </div>
      ),
    },
    {
      step: "02",
      title: "Calibrate to the job posting",
      description:
        "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements to match.",
      artifact: (
        <div className="pt-4 border-t border-neutral-300/70 dark:border-neutral-800 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase tracking-wider text-[10px]">Rubric Match</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium tabular-nums">94% Semantic Fit</span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-medium text-neutral-900 dark:text-neutral-100">
            <span className="truncate">Target: Staff Backend</span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal shrink-0 ml-2">URL / Text</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-300/40 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400">
            <span>Re-ranked</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Distributed Raft & Latency</span>
          </div>
        </div>
      ),
    },
    {
      step: "03",
      title: "Download vector PDF & track",
      description:
        "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
      artifact: (
        <div className="pt-4 border-t border-neutral-300/70 dark:border-neutral-800 space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase tracking-wider text-[10px]">Vector Compile</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">ATS Verified · 100%</span>
          </div>
          <div className="flex items-baseline justify-between text-xs font-medium text-neutral-900 dark:text-neutral-100">
            <span className="truncate">linear-product-eng.pdf</span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal tabular-nums shrink-0 ml-2">42 KB · Vector</span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-300/40 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400">
            <span>Visual Tracker</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Linear · Stage: Applied</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-8 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className=" mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* 3-Column Equal-Width Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {steps.map((s, idx) => (
            <FeatureCard
              key={s.step}
              eyebrow={`Step ${s.step}`}
              title={s.title}
              description={s.description}
              manifest={s.artifact}
              seed={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

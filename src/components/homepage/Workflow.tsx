"use client";

import React from "react";
import {
  UploadCloud,
  Sliders,
  Send,
  Check,
  ArrowRight,
  FileText,
  Search,
} from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      title: "Ingest your career record",
      description:
        "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into a verified master ledger.",
      artifact: (
        <div className="w-full p-3 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#1c1b18] dark:text-[#edebe6]">resume-draft.pdf</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[9px]">
              Extracted
            </span>
          </div>
          <div className="text-[10px] text-[#8b897f] dark:text-[#9c9a8f] font-mono">
            34 impact metrics parsed into Master Ledger
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
        <div className="w-full p-3 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#1c1b18] dark:text-[#edebe6]">Target: Staff Backend</span>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              94% Match
            </span>
          </div>
          <div className="text-[10px] text-[#8b897f] dark:text-[#9c9a8f] font-mono">
            Re-ranked: Distributed Raft & Latency Tuning
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
        <div className="w-full p-3 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#1c1b18] dark:text-[#edebe6]">Linear · Product Eng</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[9px]">
              Applied
            </span>
          </div>
          <div className="text-[10px] text-[#8b897f] dark:text-[#9c9a8f] font-mono">
            Linked snapshot: resume-v3.2.pdf
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="workflow"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-16 sm:py-24 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[620px] mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            From career history to
            <br />
            tailored application in three steps.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed">
            No manual copy-pasting across doc versions. A linear, predictable pipeline designed for speed.
          </p>
        </div>

        {/* 3-Column Equal-Width Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-6 sm:p-7 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between h-[300px] sm:h-[320px] transition-colors duration-150"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2e0da]/60 dark:border-[#282622]">
                  <span className="font-mono text-xs font-semibold text-[#8b897f] dark:text-[#9c9a8f]">
                    STEP {s.step}
                  </span>
                  <span className="text-[11px] font-mono text-[#8b897f] dark:text-[#9c9a8f]">
                    Workflow
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-3">
                  {s.description}
                </p>
              </div>

              {/* Schematic Miniature Artifact at Bottom */}
              <div className="mt-auto pt-4">
                {s.artifact}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

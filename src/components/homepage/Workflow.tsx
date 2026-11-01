"use client";

import React from "react";
import GlassIcon from "./GlassIcon";
import { WorkflowSchematic } from "./WorkflowIllustrations";
import { FileText, Target, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    phase: "Ingestion",
    title: "Ingest your career record",
    description:
      "Import your existing resume or LinkedIn profile. Resumely extracts your roles, dates, and metrics into an atomic, verified master ledger.",
    icon: <FileText className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
    variant: "default" as const,
  },
  {
    step: "02",
    phase: "Calibration",
    title: "Calibrate to the job posting",
    description:
      "Paste the job URL or description. The semantic engine extracts core requirements and re-ranks your achievements via the Google XYZ formula.",
    icon: <Target className="w-4 h-4 text-[#c15f3c] dark:text-[#D97757]" />,
    variant: "coral" as const,
  },
  {
    step: "03",
    phase: "Compilation",
    title: "Download vector PDF & track",
    description:
      "Compile an ATS-proof vector PDF in seconds. The submission is automatically saved to your visual tracker linked to that snapshot.",
    icon: <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />,
    variant: "default" as const,
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 md:py-24 transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
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

        {/* The Editorial Illustration Figure (§3 Framed Figure Chrome) */}
        <figure
          className={cn(
            "relative w-full rounded-2xl overflow-hidden select-none p-3 sm:p-5 md:p-6",
            "border border-neutral-200 dark:border-neutral-800",
            "bg-white/80 dark:bg-[#080807]/90 backdrop-blur-md",
            "shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none"
          )}
        >
          {/* Main SVG Architecture Schematic */}
          <WorkflowSchematic />

          {/* Authentic Editorial Figcaption */}
          <figcaption className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span>
              Figure 1.0 — Deterministic pipeline: unstructured ingestion reconciled into atomic career ledger, calibrated against job description rubric, and compiled into ATS-verified vector artifact.
            </span>
            <span className="text-neutral-400 shrink-0 font-medium">
              STATUS: CONTINUOUS
            </span>
          </figcaption>
        </figure>

        {/* Clean 3-Step Narrative Strip with Glass Icons (No cards, pure typography) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 sm:pt-12">
          {STEPS.map((s) => (
            <div key={s.step} className="flex items-start gap-4 group">
              <GlassIcon variant={s.variant} size="lg" glow={s.variant === "coral"}>
                {s.icon}
              </GlassIcon>
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-wider mb-1",
                    s.variant === "coral"
                      ? "text-[#c15f3c] dark:text-[#D97757] font-semibold"
                      : "text-neutral-400 dark:text-neutral-500"
                  )}
                >
                  {s.step} / {s.phase}
                </div>
                <h3 className="text-[15px] sm:text-[16px] font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
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

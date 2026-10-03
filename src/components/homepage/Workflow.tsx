"use client";

import React, { useState } from "react";
import Heading from "./Heading";

interface WorkflowStep {
  number: string;
  tag: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: "01",
    tag: "INGESTION",
    title: "Import your master career record",
    description:
      "Upload any existing PDF, paste raw notes, or sync your LinkedIn profile. Resumely extracts dates, roles, accomplishment metrics, and technical competencies into your centralized ledger.",
    specs: [
      { label: "Sources", value: "PDF, LinkedIn, or Raw Text" },
      { label: "Extraction", value: "Roles, Metrics, Stack Tokens" },
      { label: "Ledger", value: "100% History Preserved" },
    ],
  },
  {
    number: "02",
    tag: "CALIBRATION",
    title: "Drop in the target job rubric",
    description:
      "Paste any job description. Resumely parses the recruiter's exact rubric, calculates competency weights, and surfaces matching accomplishments from your master record.",
    specs: [
      { label: "Compatibility", value: "Greenhouse, Lever, Workday" },
      { label: "Analysis", value: "Semantic Rubric Alignment" },
      { label: "Integrity", value: "Zero Fabricated Claims" },
    ],
  },
  {
    number: "03",
    tag: "EXPORT",
    title: "Inspect, refine & export ATS PDF",
    description:
      "Review your targeted resume in the live preview. Chat with the copilot to tighten verbs or re-level seniority, then download a single-column, machine-parseable PDF ready for submission.",
    specs: [
      { label: "Layout", value: "Single-Column Modern ATS" },
      { label: "Parse Rate", value: "99.4% Across All ATS" },
      { label: "Lifecycle", value: "Linked Application Tracking" },
    ],
  },
];

export default function WorkflowSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative px-6 py-24 md:py-32 z-10 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-14 md:mb-20 max-w-2xl text-left">
        <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
          HOW IT WORKS // 3-STEP PIPELINE
        </div>
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          From master history
          <br />
          <span className="text-muted-foreground font-normal">to tailored application in 90 seconds.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          No more creating twenty separate Word files on your desktop. Here is how your single master record handles every job opportunity.
        </p>
      </div>

      {/* Timeline Progression Rail (Desktop) */}
      <div className="hidden md:block mb-12">
        <svg viewBox="0 0 900 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-9 select-none">
          {/* Guide Rail */}
          <line x1="40" y1="18" x2="860" y2="18" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" />

          {/* Traveling Data Packet Across All Steps */}
          <circle r="3" className="fill-indigo-500">
            <animateMotion path="M 40 18 L 860 18" dur="4.5s" repeatCount="indefinite" />
          </circle>

          {/* Step 01 Checkpoint Node */}
          <circle cx="150" cy="18" r="8" className="fill-background stroke-indigo-500" strokeWidth="1.5" />
          <circle cx="150" cy="18" r="3" className="fill-indigo-500" />
          <line x1="140" y1="18" x2="160" y2="18" className="stroke-indigo-500/40" strokeWidth="1" />

          {/* Step 02 Checkpoint Node */}
          <circle cx="450" cy="18" r="8" className="fill-background stroke-emerald-500" strokeWidth="1.5" />
          <circle cx="450" cy="18" r="3" className="fill-emerald-500" />
          <line x1="440" y1="18" x2="460" y2="18" className="stroke-emerald-500/40" strokeWidth="1" />

          {/* Step 03 Checkpoint Node */}
          <circle cx="750" cy="18" r="8" className="fill-background stroke-amber-500" strokeWidth="1.5" />
          <circle cx="750" cy="18" r="3" className="fill-amber-500" />
          <line x1="740" y1="18" x2="760" y2="18" className="stroke-amber-500/40" strokeWidth="1" />
        </svg>
      </div>

      {/* 3-Column Open Editorial Grid (Zero Cards, Zero Borders, Clean Hairlines) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-left">
        {WORKFLOW_STEPS.map((step, idx) => {
          const accentColor =
            idx === 0
              ? "text-indigo-600 dark:text-indigo-400"
              : idx === 1
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400";

          return (
            <div
              key={step.number}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              className="group flex flex-col justify-between pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-border/40 md:pl-8 first:border-l-0 first:pl-0 transition-colors duration-200"
            >
              <div>
                {/* Step Metadata Header */}
                <div className="flex items-center justify-between font-mono text-xs mb-4">
                  <span className={`font-semibold tracking-wider uppercase transition-colors duration-200 ${accentColor}`}>
                    {step.number} / {step.tag}
                  </span>
                  <span className="text-muted-foreground/50 text-[10px]">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3 leading-snug">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Micro-Specifications (Hairline typographic items, Zero Icons) */}
              <div className="pt-4 border-t border-border/40 font-mono text-xs space-y-2.5">
                {step.specs.map((sp) => (
                  <div key={sp.label} className="flex items-center justify-between text-muted-foreground">
                    <span className="text-foreground/80 font-medium">{sp.label}</span>
                    <span className="text-[11px] text-muted-foreground/80">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="mt-16 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>ESTIMATED DURATION: 90 SECONDS</span>
        </div>
        <div className="text-muted-foreground/70">
          SINGLE-COLUMN MODERN ATS · ZERO FORMATTING DRIFT
        </div>
      </div>
    </section>
  );
}
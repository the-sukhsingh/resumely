"use client";

import React, { useState } from "react";
import { Check, Sparkles, Layers, Sliders, Target, Briefcase, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      id: "ledger",
      number: "01",
      title: "One Master Record for Your Whole Career",
      tagline: "Single Source of Truth",
      description:
        "Never duplicate or lose track of old resume variations. Resumely stores every role, metric, and technical skill in one living master ledger that dynamically powers all your tailored applications.",
      points: [
        "100% historical accuracy preserved",
        "Automatic achievement deduplication",
        "Instant branching for new applications",
      ],
      preview: (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200/70 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs font-mono">
            <span className="text-neutral-500">MASTER_LEDGER.v4</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">● 34 Bullet Metrics</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-background rounded-xl border border-border/50">
              <div className="font-semibold text-foreground">Senior Software Engineer • Stripe</div>
              <p className="text-neutral-500 text-[11px] mt-1">
                Architected distributed webhook ingestion pipeline handling 120M daily events with 99.99% uptime.
              </p>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border/50">
              <div className="font-semibold text-foreground">Full Stack Engineer • Airbnb</div>
              <p className="text-neutral-500 text-[11px] mt-1">
                Spearheaded checkout flow redesign that boosted guest conversion by 4.2% across mobile web.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ats",
      number: "02",
      title: "Direct ATS Rubric Calibration",
      tagline: "Semantic Alignment",
      description:
        "Pass automated applicant tracking systems without spamming buzzwords. Resumely analyzes the exact hiring requirements and maps your actual experiences to the job criteria.",
      points: [
        "Real-time ATS pass percentage simulator",
        "Identifies missing competencies instantly",
        "Standard single-column vector output",
      ],
      preview: (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200/70 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs font-mono">
            <span className="text-neutral-500">ATS_RUBRIC_ANALYZER</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Score: 96 / 100</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-background rounded-xl border border-border/50">
              <span className="text-neutral-700 dark:text-neutral-300">Distributed Systems</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Matched (3x)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-background rounded-xl border border-border/50">
              <span className="text-neutral-700 dark:text-neutral-300">Kubernetes & Infrastructure</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Matched (2x)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-background rounded-xl border border-border/50">
              <span className="text-neutral-700 dark:text-neutral-300">Technical Leadership</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Matched (4x)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tailor",
      number: "03",
      title: "1:1 Tailored Application Generation",
      tagline: "Targeted Precision",
      description:
        "Every job posting values different accomplishments. Generate role-specific resumes and matching cover letters in seconds while maintaining strict career truthfulness.",
      points: [
        "Dynamic bullet point re-ranking",
        "Synchronized cover letter generation",
        "Multiple export styles (LaTeX, Classic, Two-Column)",
      ],
      preview: (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200/70 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs font-mono">
            <span className="text-neutral-500">TARGET: LINEAR_STAFF_ENG</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold">Tailored Specimen</span>
          </div>
          <div className="p-4 bg-background rounded-2xl border border-border/50 space-y-2.5 text-xs">
            <div className="h-3 w-1/3 bg-neutral-300 dark:bg-neutral-700 rounded-sm" />
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
            <div className="h-2 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
            <div className="h-2 w-4/6 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
            <div className="pt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-mono text-[10px]">
                Vector PDF Compiled
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tracker",
      number: "04",
      title: "Visual Job Application Pipeline",
      tagline: "Zero Dropped Leads",
      description:
        "Stop managing job searches across messy spreadsheets. Track every application from saved to offer stage, linked directly to the exact resume version you sent.",
      points: [
        "Kanban board & interactive journey timeline",
        "Direct link to customized resume sent",
        "Interview reminders and application status",
      ],
      preview: (
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200/70 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 text-xs font-mono">
            <span className="text-neutral-500">APPLICATION_JOURNEY</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">4 In Flight</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-background rounded-xl border border-border/50">
              <div className="text-[11px] text-neutral-500 font-mono">STRIPE</div>
              <div className="font-semibold mt-1">Staff Eng</div>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 rounded-full">
                Interviewing
              </span>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border/50">
              <div className="text-[11px] text-neutral-500 font-mono">LINEAR</div>
              <div className="font-semibold mt-1">Founding Eng</div>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                Offer Received
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Platform Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-3 leading-[1.12]">
          Built for precision.
          <br />
          <span className="text-neutral-500">Designed for zero friction.</span>
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
          Every tool in Resumely exists to eliminate scattered PDF files and align your accomplishments directly to the hiring rubric.
        </p>
      </div>

      {/* Feature Grid with Hairline Dividers */}
      <div className="space-y-14">
        {features.map((feat, index) => (
          <div
            key={feat.id}
            className={cn(
              "pt-10 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
            )}
          >
            {/* Left Narrative */}
            <div className={cn("lg:col-span-6 space-y-4", index % 2 === 1 ? "lg:order-2" : "lg:order-1")}>
              <div className="font-mono text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                {feat.number} / {feat.tagline}
              </div>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
                {feat.title}
              </h3>
              <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feat.description}
              </p>
              <ul className="pt-2 space-y-2">
                {feat.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Preview */}
            <div className={cn("lg:col-span-6", index % 2 === 1 ? "lg:order-1" : "lg:order-2")}>
              {feat.preview}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


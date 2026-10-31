"use client";

import React, { useState } from "react";
import { GitBranch, Check, Copy, RotateCcw, Sliders, Lock, Sparkles, ArrowRight } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function FeatureShowcase() {
  // Interactive state for Card 1 (Career Ledger)
  const [activeBranch, setActiveBranch] = useState<"main" | "staff" | "fullstack">("main");

  // Interactive state for Card 2 (Agent Rules)
  const [strictXyz, setStrictXyz] = useState(true);

  // Interactive state for Card 4 (Copilot Diff)
  const [isEnhanced, setIsEnhanced] = useState(true);

  // Interactive state for Card 5 (LaTeX Paper Format)
  const [paperFormat, setPaperFormat] = useState<"Letter" | "A4">("Letter");

  // Interactive state for Card 7 (Job Tracker Stage)
  const [activeStage, setActiveStage] = useState(2); // 0: Saved, 1: Applied, 2: Interview, 3: Offer

  // Interactive state for Card 9 (Share Links)
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://resumely.tech/r/alex-chen");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="features"
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Two-Line Editorial Headline + Lede */}
        <div className="max-w-[620px] mb-10 sm:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block mb-3">
            Core Architecture · 01–09
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Store your verified career ledger once. Generate calibrated applications, LaTeX vector exports, and tailored cover letters in seconds.
          </p>
        </div>

        {/* 3-Column Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Master Career Ledger */}
          <FeatureCard
            id="ledger"
            eyebrow="01 · Career Ledger"
            title="Master Career Ledger"
            description="Maintain one verified record of all roles, metrics, and skills. Branch tailored versions without duplicating files."
            seed={0}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Record Tree</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Base
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100 font-medium">
                      <GitBranch className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>main</span>
                    </div>
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-300 font-medium px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                      {activeBranch === "main" ? "52 metrics" : activeBranch === "staff" ? "34 metrics" : "18 metrics"}
                    </span>
                  </div>

                  {/* Branch selector tabs */}
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveBranch("main")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        activeBranch === "main"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                          : "bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      main
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBranch("staff")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        activeBranch === "staff"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                          : "bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      staff-infra
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBranch("fullstack")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        activeBranch === "fullstack"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                          : "bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      fullstack
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 2: Custom Agent Rules */}
          <FeatureCard
            id="rules"
            eyebrow="02 · Calibration Rules"
            title="Custom Agent Rules"
            description="Enforce strict AI generation constraints: Google XYZ formula, mandatory metric density, and assertive verb choice."
            seed={1}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Google XYZ Formula</span>
                  <button
                    type="button"
                    onClick={() => setStrictXyz(!strictXyz)}
                    className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>{strictXyz ? "Strict Enforced" : "Advisory Mode"}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 text-[11px] leading-relaxed space-y-1.5 font-sans">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shrink-0">X</span>
                    <span className="text-neutral-800 dark:text-neutral-200">Accomplished real-time telemetry</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">Y</span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Slashing p99 latency by 42%</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold shrink-0">Z</span>
                    <span className="text-neutral-800 dark:text-neutral-200">By rewriting Redis stream ingest</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 3: Rubric & Skill Matcher */}
          <FeatureCard
            id="analyzer"
            eyebrow="03 · Semantic Rubric"
            title="Rubric & Skill Matcher"
            description="Extract hiring requirements and keywords from job descriptions to calculate competency coverage in real time."
            seed={2}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">ATS Coverage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">94% Calibrated</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-2.5">
                  {/* Progress Track */}
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[94%] transition-all duration-500" />
                  </div>

                  {/* Keyword Pills */}
                  <div className="flex flex-wrap gap-1 font-mono text-[9.5px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20">
                      ✓ Distributed Systems (3x)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20">
                      ✓ p99 Latency Tuning
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium border border-blue-500/20">
                      Target Keyword
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 4: Section-Focused Copilot */}
          <FeatureCard
            id="copilot"
            eyebrow="04 · Prompt Copilot"
            title="Section-Focused Copilot"
            description="Target specific sections with the AI assistant, featuring live preview diffs and complete snapshot undo history."
            seed={3}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Live Prompt Diff</span>
                  <button
                    type="button"
                    onClick={() => setIsEnhanced(!isEnhanced)}
                    className="flex items-center gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>{isEnhanced ? "Undo" : "Apply Diff"}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-1.5 font-mono text-[10.5px]">
                  {isEnhanced ? (
                    <>
                      <div className="text-rose-600 dark:text-rose-400 line-through opacity-75">
                        - Built backend microservices APIs
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                        + Scaled gRPC ingest pipeline to 120k req/s
                      </div>
                    </>
                  ) : (
                    <div className="text-neutral-700 dark:text-neutral-300">
                      Built backend microservices APIs for transaction processing
                    </div>
                  )}
                </div>
              </div>
            }
          />

          {/* Card 5: Vector PDF Engine */}
          <FeatureCard
            id="latex"
            eyebrow="05 · Typesetting"
            title="Vector PDF Engine"
            description="Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity."
            seed={4}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">LaTeX 2ε Standards</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-[10px]">0 Broken Glyphs</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div className="p-2 rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50 text-center">
                    <span className="block text-neutral-400 dark:text-neutral-500 text-[8.5px] uppercase">Purity</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">Single Column</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50 text-center">
                    <span className="block text-neutral-400 dark:text-neutral-500 text-[8.5px] uppercase">Format</span>
                    <div className="flex justify-center gap-1 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setPaperFormat("Letter")}
                        className={`px-1 rounded text-[9px] font-semibold transition-all ${
                          paperFormat === "Letter"
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        Letter
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaperFormat("A4")}
                        className={`px-1 rounded text-[9px] font-semibold transition-all ${
                          paperFormat === "A4"
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        A4
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 6: Matched Cover Letters */}
          <FeatureCard
            id="companion"
            eyebrow="06 · Companion"
            title="Matched Cover Letters"
            description="Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets."
            seed={5}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">1:1 Typographic Voice</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Synchronized</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Resume Lead</span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Staff Infrastructure</span>
                  </div>
                  <div className="pt-1 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Letter Measure</span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Matching Measure & Grid</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 7: Visual Job Tracker */}
          <FeatureCard
            id="tracker"
            eyebrow="07 · Application Pipeline"
            title="Visual Job Tracker"
            description="Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs."
            seed={6}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Pipeline Stages</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">6 Active Tracks</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-1 text-[9.5px] font-mono">
                    {["Saved", "Applied", "Interview", "Offer"].map((stage, idx) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => setActiveStage(idx)}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          activeStage === idx
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                            : "bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] font-mono flex items-center justify-between text-neutral-600 dark:text-neutral-300 pt-1 border-t border-neutral-200/50 dark:border-neutral-800/60">
                    <span>Stripe · Staff Eng</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">$240k Target</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 8: Resume Snapshot Memory */}
          <FeatureCard
            id="snapshots"
            eyebrow="08 · Snapshot Binding"
            title="Resume Snapshot Memory"
            description="Every tracked job is linked to the exact tailored resume version submitted, so you always know what the team is reading."
            seed={7}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Binding Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Version Locked
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                    <span>Submitted Artifact</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">resume-v3.2.pdf</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 text-[9px] pt-1 border-t border-neutral-200/50 dark:border-neutral-800/60">
                    <span>SHA-256 Checksum</span>
                    <span className="text-neutral-400">e82a…9f12</span>
                  </div>
                </div>
              </div>
            }
          />

          {/* Card 9: Public Share Links */}
          <FeatureCard
            id="distribution"
            eyebrow="09 · Recruiter Route"
            title="Public Share Links"
            description="Share responsive, private view-only web links directly with recruiters and hiring managers without email attachments."
            seed={8}
            preview={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px]">Live Web Route</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Responsive View</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
                  <span className="truncate text-neutral-700 dark:text-neutral-300">
                    resumely.tech/r/alex-chen
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-sans font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      copied
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 active:scale-95"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-2.5 h-2.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

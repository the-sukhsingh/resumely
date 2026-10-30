"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Download,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  FileCode,
  Layers,
  Check,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroProductPreview() {
  const [activeTab, setActiveTab] = useState<"ats" | "editor" | "latex">("ats");
  const [activeKeyword, setActiveKeyword] = useState<string>("Distributed Webhooks");

  const keywords = [
    { name: "Distributed Webhooks", score: "100% Match", bullets: 3 },
    { name: "Next.js 16 & React", score: "100% Match", bullets: 4 },
    { name: "High-Throughput Pipelining", score: "96% Match", bullets: 2 },
    { name: "PostgreSQL & Vector Indexes", score: "94% Match", bullets: 2 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      {/* Outer Glow Halo linking with prism background */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl opacity-60 dark:opacity-40 pointer-events-none" />

      {/* Main Software Window Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl shadow-2xl shadow-neutral-900/10 dark:shadow-black/50 overflow-hidden flex flex-col">
        
        {/* Window Chrome Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-neutral-200/70 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 select-none">
          {/* Traffic light dots + Window badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 ml-2 hidden sm:inline">
              resumely-engine // stripe-staff-eng.pdf
            </span>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700/50 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("ats")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer",
                activeTab === "ats"
                  ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              ATS Rubric (98%)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer",
                activeTab === "editor"
                  ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              Live Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("latex")}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer hidden sm:block",
                activeTab === "latex"
                  ? "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              LaTeX Source
            </button>
          </div>

          {/* Real-time Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Synced</span>
          </div>
        </div>

        {/* Window Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: ATS CALIBRATION RUBRIC */}
          {activeTab === "ats" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Score Metric Card */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                      Target Calibration: Stripe
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Staff Infrastructure Engineer • Tier 1 Score
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                    98 / 100
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">0 parsing flags</div>
                </div>
              </div>

              {/* Verified Keywords & Achievements breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                  Aligned Competencies ({keywords.length} verified)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keywords.map((kw) => (
                    <button
                      key={kw.name}
                      type="button"
                      onClick={() => setActiveKeyword(kw.name)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between cursor-pointer",
                        activeKeyword === kw.name
                          ? "bg-emerald-500/10 border-emerald-500/40 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300 shadow-xs"
                          : "bg-background/60 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                      )}
                    >
                      <span className="font-medium truncate mr-2">{kw.name}</span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md shrink-0">
                        {kw.score}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Tailored Bullet Preview */}
              <div className="p-3.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Bullet Point Alignment
                  </span>
                  <span>1:1 Narrative Parity</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  &ldquo;Architected distributed settlement webhooks handling 120M+ daily events, cutting lock contention by 68% and guaranteeing zero duplicate disbursements across 42 currencies.&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SPECIMEN EDITOR */}
          {activeTab === "editor" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-sans space-y-3 shadow-xs">
                <div className="border-b border-border/40 pb-2 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-sm tracking-tight">ALEXANDER REID</span>
                    <p className="text-[11px] text-neutral-500 font-mono">alex@reid.dev • San Francisco, CA</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px]">
                    Auto-Formatted ISO A4
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-neutral-900 dark:text-neutral-100">
                    <span>Staff Infrastructure Engineer — Stripe</span>
                    <span className="font-mono text-[11px] text-neutral-500">2022 — Present</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    • Deployed optimistic batch reconciliation algorithm saving \$2.4M annually in AWS compute egress.
                  </p>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    • Directed engineering team of 14 across 3 continents to achieve SOC2 Type II and FedRAMP compliance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LATEX SOURCE PREVIEW */}
          {activeTab === "latex" && (
            <div className="p-4 rounded-2xl bg-neutral-950 text-neutral-300 font-mono text-[11px] space-y-1 overflow-x-auto border border-neutral-800 animate-in fade-in duration-200">
              <div className="text-neutral-500">{"\\documentclass[11pt,a4paper]{article}"}</div>
              <div className="text-neutral-500">{"\\usepackage[empty]{fullpage}"}</div>
              <div className="text-neutral-500">{"\\usepackage{hyperref}"}</div>
              <div className="text-emerald-400">{"\\begin{document}"}</div>
              <div className="pl-4 text-sky-300">{"\\textbf{Alexander Reid} \\hfill alex@reid.dev"}</div>
              <div className="pl-4 text-amber-200">{"\\resumeSection{Experience}"}</div>
              <div className="pl-4 text-neutral-400">{"\\resumeItem{Architected distributed event engine with 99.99\\% uptime.}"}</div>
              <div className="text-emerald-400">{"\\end{document}"}</div>
            </div>
          )}

          {/* Footer Quick Action Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-[10px]">
                Workday &bull; Greenhouse &bull; Lever
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                Live Calibration Engine
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

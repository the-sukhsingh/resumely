"use client";

import React from "react";
import Heading from "./Heading";
import { ArrowUpRight, Sparkles, Check, Download, Layers, Target, Terminal, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeatureSection() {
  return (
    <section id="features" className="mx-auto px-6 py-24 md:py-32 relative z-10 max-w-6xl">
      {/* Clean section header without repetitive eyebrows */}
      <div className="mb-14 md:mb-20 max-w-2xl text-left">
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Built for relevance.
          <br />
          <span className="text-muted-foreground font-normal">Designed for zero friction.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          Every tool in Resumely exists to eliminate fragmented resume files and align your real accomplishments directly to the recruiter's hiring rubric.
        </p>
      </div>

      {/* Bento Grid: Asymmetric 4-2 / 2-4 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch">
        {/* =========================================================================
            BENTO CARD 1: Master Experience Ledger (Span 4 on LG) - Indigo Duo-Shade
           ========================================================================= */}
        <div className="lg:col-span-4 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                01 • Centralized Ledger
              </span>
              <span className="text-xs font-mono text-muted-foreground/60">
                Single Source of Truth
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              One master record for your entire career
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Never duplicate or lose track of old resume variations again. Maintain a single living record of every role, metric, and skill—automatically synchronized across every subsequent tailored application.
            </p>
          </div>

          {/* Duo-Shade Illustration: Convergence into central master ledger */}
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.07] p-5 sm:p-6 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Converging Input Nodes */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-background/80 text-[11px] font-mono text-muted-foreground shadow-xs">
                  <div className="size-1.5 rounded-full bg-indigo-500/40" />
                  <span>v1_frontend.pdf</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-background/80 text-[11px] font-mono text-muted-foreground shadow-xs">
                  <div className="size-1.5 rounded-full bg-indigo-500/40" />
                  <span>staff_eng.docx</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-background/80 text-[11px] font-mono text-muted-foreground shadow-xs">
                  <div className="size-1.5 rounded-full bg-indigo-500/40" />
                  <span>linkedin_export</span>
                </div>
              </div>

              {/* Connecting Flow Indicator */}
              <div className="hidden sm:flex flex-col items-center justify-center px-2 text-indigo-500/50">
                <svg width="40" height="36" viewBox="0 0 40 36" fill="none" className="stroke-current">
                  <path d="M2 4C18 4 22 18 38 18" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M2 32C18 32 22 18 38 18" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Central Master Hub Sheet */}
              <div className="flex-1 w-full sm:max-w-xs rounded-xl border border-indigo-500/30 bg-background/95 p-3.5 shadow-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Layers className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-foreground">Master Profile</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                    Live Sync
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-muted-foreground">
                  <div className="h-2 rounded bg-indigo-500/20 w-3/4" />
                  <div className="h-2 rounded bg-indigo-500/10 w-full" />
                  <div className="h-2 rounded bg-indigo-500/10 w-5/6" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-500/15 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                1 Master Profile → Endless Contextual Applications
              </span>
              <span className="text-[11px]">Zero Formatting Drift</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 2: Semantic Job Matcher (Span 2 on LG) - Sage/Emerald Duo-Shade
           ========================================================================= */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                02 • Keyword Scanner
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Direct ATS rubric alignment
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Extracts explicit requirements from target job posts and surfaces keyword gaps against your real experience—without artificial keyword stuffing.
            </p>
          </div>

          {/* Duo-Shade Illustration: Concentric radar scanner */}
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Concentric duo-tone radar rings */}
            <div className="relative size-32 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/30 bg-emerald-500/[0.03]" />
              <div className="absolute inset-8 rounded-full border border-emerald-500/40 bg-emerald-500/[0.06] flex items-center justify-center">
                <Target className="size-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>

              {/* Pulsing floating keyword nodes */}
              <div className="absolute top-1 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs">
                98% Fit
              </div>
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border/60 text-muted-foreground shadow-xs">
                P99 Latency
              </div>
            </div>

            <div className="mt-3 text-xs font-mono text-emerald-700 dark:text-emerald-300 font-medium">
              Greenhouse & Lever Compliant
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 3: Conversational Copilot (Span 2 on LG) - Amber Duo-Shade
           ========================================================================= */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                03 • AI Copilot
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Interactive bullet rephrasing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chat directly with your draft to quantify fuzzy impact, tighten passive verbs into active voice, or re-level bullets for leadership roles.
            </p>
          </div>

          {/* Duo-Shade Illustration: Prompt & Transformation Terminal */}
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.07] p-4 text-left font-mono">
            {/* Prompt input pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-background/90 border border-amber-500/30 text-[11px] text-foreground shadow-xs mb-3">
              <Sparkles className="size-3 text-amber-500 shrink-0" />
              <span className="truncate">&quot;Quantify P99 latency impact&quot;</span>
            </div>

            {/* Transformed output block */}
            <div className="p-2.5 rounded-lg bg-background/60 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
              <span className="text-amber-600 dark:text-amber-400 font-semibold block mb-0.5">
                Outcome:
              </span>
              <span className="text-foreground/90">
                Reduced P99 latency by 38% under 450M daily API transactions.
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 4: Synchronized Letters & PDF (Span 4 on LG) - Sky Duo-Shade
           ========================================================================= */}
        <div className="lg:col-span-4 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                04 • Unified Package
              </span>
              <span className="text-xs font-mono text-muted-foreground/60">
                Cohesive Applications
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Synchronized cover letters & instant PDF export
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Automatically generate clean cover letters that reinforce the exact accomplishments highlighted in your resume. Export to standard single-column PDF with zero formatting drift.
            </p>
          </div>

          {/* Duo-Shade Illustration: Twin Aligned Documents */}
          <div className="mt-8 rounded-2xl border border-sky-500/20 bg-sky-500/[0.04] dark:bg-sky-500/[0.07] p-5 sm:p-6 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Document 1: Resume Sheet */}
              <div className="rounded-xl border border-sky-500/30 bg-background/90 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                  <span className="text-xs font-bold text-foreground">Tailored Resume</span>
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    1-Page Verified
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px] text-muted-foreground">
                  <div className="h-2 rounded bg-sky-500/25 w-2/3" />
                  <div className="h-1.5 rounded bg-muted/60 w-full" />
                  <div className="h-1.5 rounded bg-muted/60 w-4/5" />
                  <div className="h-1.5 rounded bg-muted/60 w-5/6" />
                </div>
              </div>

              {/* Document 2: Matching Cover Letter */}
              <div className="rounded-xl border border-sky-500/30 bg-background/90 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
                  <span className="text-xs font-bold text-foreground">Matching Letter</span>
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                    Cohesive Tone
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px] text-muted-foreground">
                  <div className="h-2 rounded bg-sky-500/25 w-1/2" />
                  <div className="h-1.5 rounded bg-muted/60 w-full" />
                  <div className="h-1.5 rounded bg-muted/60 w-3/4" />
                  <div className="h-1.5 rounded bg-muted/60 w-5/6" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-500/15 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="text-sky-700 dark:text-sky-300 font-medium">
                Standard Single-Column Output • Zero Word Table Parsing Errors
              </span>
              <span className="flex items-center gap-1 text-foreground/80 font-semibold">
                <Download className="size-3" />
                Instant PDF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
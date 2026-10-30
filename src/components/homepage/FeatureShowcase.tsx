"use client";

import React from "react";
import {
  GitBranch,
  SlidersHorizontal,
  FileCheck2,
  GitCommit,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-20 sm:py-28 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header - Human, specific, non-templated */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.14]">
          Designed around how modern hiring actually works.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-2xl">
          Every tool in Resumely exists to bridge the gap between your real career achievements and what applicant tracking systems and hiring managers look for.
        </p>
      </div>

      {/* Asymmetric Bento Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Tile 1: Master Career Ledger (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-150 ease-out">
          <div>
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <GitBranch className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Master Ledger
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-4">
              A single source of truth for your whole career.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Never lose track of past accomplishments across dozens of scattered files. Store every role, verified metric, and technical skill in one living ledger that dynamically powers all your applications.
            </p>
          </div>

          {/* Ledger Specimen Artifact */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-background border border-border/60 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/40">
              <div>
                <span className="font-medium text-sm text-foreground">Stripe</span>
                <span className="text-neutral-400 mx-1.5">•</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">Senior Infrastructure Engineer</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                Branch: Staff Backend
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="text-neutral-400 mt-1 select-none">•</span>
                <span>
                  Architected distributed event ingestion pipeline processing{" "}
                  <strong className="font-semibold text-foreground">120M+ daily events</strong> with{" "}
                  <span className="underline decoration-emerald-500/50 underline-offset-2">99.99% uptime</span> across multi-region clusters.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-neutral-400 mt-1 select-none">•</span>
                <span>
                  Reduced payment processing p99 latency from{" "}
                  <strong className="font-semibold text-foreground">340ms to 110ms</strong> by introducing Redis cluster caching and async database pipelines.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-border/40">
                Distributed Systems
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-border/40">
                Go & Kafka
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-border/40">
                High Availability
              </span>
              <span className="text-[11px] font-mono text-neutral-500 ml-auto">
                34 metrics indexed
              </span>
            </div>
          </div>
        </div>

        {/* Tile 2: Semantic ATS Rubric Matcher (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-150 ease-out">
          <div>
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <FileCheck2 className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Semantic Matcher
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-4">
              Direct rubric calibration without buzzwords.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Recruiting algorithms score competencies against job requirements. Resumely analyzes the exact rubric criteria and highlights real coverage.
            </p>
          </div>

          {/* Rubric Matcher Specimen */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-background border border-border/60 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
              <div>
                <div className="text-xs font-medium text-neutral-500">Target Benchmark</div>
                <div className="text-sm font-semibold text-foreground">Staff Backend Engineer</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  94% Rubric Match
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">Distributed Consensus (Raft)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Matched (3x)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">Database Latency Optimization</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Matched (2x)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50">
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">Technical Mentorship & RFCs</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Matched (4x)</span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero keyword stuffing. 100% verified career truth.</span>
            </div>
          </div>
        </div>

        {/* Tile 3: 1:1 Tailored Application Generation (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-150 ease-out">
          <div>
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Role Calibration
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-4">
              Calibrated bullet points for every opening.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Every job values different achievements. Resumely re-ranks and sharpens your accomplishments to match the role priorities.
            </p>
          </div>

          {/* Before & After Diff Artifact */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-background border border-border/60 shadow-xs space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>BEFORE (GENERIC DRAFT)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100/50 dark:bg-neutral-800/40 text-xs text-neutral-500 line-through decoration-neutral-400">
                Worked on checkout page performance improvements and updated dependencies.
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                <span>AFTER (CALIBRATED FOR STAFF IMPACT)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300/40 dark:border-emerald-800/40 text-xs text-neutral-900 dark:text-neutral-100 leading-relaxed font-normal">
                Spearheaded checkout flow redesign that boosted conversion by <strong className="font-semibold text-emerald-700 dark:text-emerald-300">4.2%</strong> and reduced mobile p99 bundle latency by <strong className="font-semibold text-emerald-700 dark:text-emerald-300">38%</strong>.
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              Re-ranked for Staff Level Scope & Quantified Metrics
            </div>
          </div>
        </div>

        {/* Tile 4: Visual Application Pipeline & Snapshot Memory (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-150 ease-out">
          <div>
            <div className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200">
              <div className="w-8 h-8 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <GitCommit className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Snapshot Memory
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-4">
              Know exactly which resume version you sent.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
              Never walk into an interview wondering which bullet points the team is reviewing. Every application is tied directly to the exact vector PDF snapshot submitted.
            </p>
          </div>

          {/* Pipeline Specimen Rows */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-background border border-border/60 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border/40 text-xs sm:text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-foreground">Linear</span>
                  <span className="text-neutral-400 mx-1.5">•</span>
                  <span className="text-neutral-600 dark:text-neutral-300">Staff Frontend Engineer</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="hidden sm:inline font-mono text-neutral-500 text-[11px]">
                  Resume v3.2 (UI Focus)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
                  Offer Extended
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border/40 text-xs sm:text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-foreground">Stripe</span>
                  <span className="text-neutral-400 mx-1.5">•</span>
                  <span className="text-neutral-600 dark:text-neutral-300">Distributed Systems Eng</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="hidden sm:inline font-mono text-neutral-500 text-[11px]">
                  Resume v2.8 (Infra Focus)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                  Technical Round 3
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border/40 text-xs sm:text-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-foreground">Vercel</span>
                  <span className="text-neutral-400 mx-1.5">•</span>
                  <span className="text-neutral-600 dark:text-neutral-300">Next.js Framework Architect</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span className="hidden sm:inline font-mono text-neutral-500 text-[11px]">
                  Resume v4.0 (Compiler Focus)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-medium text-[11px]">
                  Applied
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

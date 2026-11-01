"use client";

import React from "react";
import { cn } from "@/lib/utils";
import GlassIcon from "./GlassIcon";
import {
  FileText,
  Target,
  Sparkles,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Kanban,
  Download,
  Layers,
  Database,
  Search,
} from "lucide-react";

/* ==========================================================================
   01 · Ingest Stage Illustration
   Unstructured career transcript → Atomic verified master ledger
   ========================================================================== */
export function IngestIllustration() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 p-4 sm:p-6 md:p-8 select-none">
      {/* Left: Raw Document Ingest Node */}
      <div className="w-full lg:w-[32%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Source Ingest
          </span>
          <span className="text-neutral-400">PDF / JSON</span>
        </div>

        {/* Glass Card: Raw File Specimen */}
        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]">
          <div className="flex items-start gap-3">
            <GlassIcon variant="default" size="md">
              <FileText className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                resume-fullstack-2026.pdf
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                48 KB · 2 pages · Unstructured
              </div>
            </div>
          </div>

          {/* Mini Raw Content Snippet */}
          <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] font-mono text-[10.5px] leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-1">
            <div className="truncate text-neutral-400 dark:text-neutral-500">
              $ raw_parser --stream --entity-extract
            </div>
            <div className="truncate text-neutral-800 dark:text-neutral-200">
              ▸ Senior Staff Engineer @ Scale
            </div>
            <div className="truncate text-neutral-500">
              ▸ Led infra team of 14; reduced p99 by 42%
            </div>
          </div>
        </div>
      </div>

      {/* Center: Deterministic Parser Nexus (SVG hairline flow) */}
      <div className="w-full lg:w-[28%] flex flex-col items-center justify-center py-2 relative">
        {/* Animated Connector Rail */}
        <div className="hidden lg:flex items-center justify-center w-full relative">
          <svg className="w-full h-12" viewBox="0 0 200 48" fill="none">
            <path
              d="M 10 24 L 190 24"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Animated traveling signal pulse */}
            <circle
              cx="100"
              cy="24"
              r="3.5"
              className="fill-[#c15f3c] dark:fill-[#D97757]"
            >
              <animate
                attributeName="cx"
                values="20;180;20"
                dur="3.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Central Extraction Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1a1a18] border border-black/[0.08] dark:border-white/[0.1] shadow-sm font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
          <Cpu className="w-3.5 h-3.5 text-[#c15f3c] dark:text-[#D97757]" />
          <span>Metric Extraction</span>
          <span className="text-[#c15f3c] dark:text-[#D97757] font-semibold tabular-nums">34 parsed</span>
        </div>

        {/* Token Chips */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            [DATES]
          </span>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            [METRICS]
          </span>
          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            [SKILLS]
          </span>
        </div>
      </div>

      {/* Right: Master Career Ledger Output */}
      <div className="w-full lg:w-[38%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#c15f3c] dark:text-[#D97757]" />
            Master Career Ledger
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified · Sync</span>
        </div>

        {/* Structured Ledger Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] space-y-2.5">
          {/* Item 1 */}
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-black/[0.04] dark:border-white/[0.04]">
            <GlassIcon variant="emerald" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                <span className="truncate">Distributed Ingest Pipeline</span>
                <span className="text-[#c15f3c] dark:text-[#D97757] font-mono text-[10px] tabular-nums">
                  -42% p99
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
                Rewrote Redis buffer layer with gRPC stream
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-black/[0.04] dark:border-white/[0.04]">
            <GlassIcon variant="default" size="sm">
              <Layers className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                <span className="truncate">Multi-Region Cloud Migration</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] tabular-nums">
                  $1.2M Saved
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
                Consolidated 18 AWS clusters to Terraform
              </div>
            </div>
          </div>

          {/* Ledger Telemetry Footer */}
          <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
            <span>HASH: 0x8F94...B12</span>
            <span>34 ATOMS STORED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   02 · Calibrate Stage Illustration
   Job description rubric → Semantic match & XYZ bullet re-ranking
   ========================================================================== */
export function CalibrateIllustration() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 p-4 sm:p-6 md:p-8 select-none">
      {/* Left: Job Description & Rubric Target */}
      <div className="w-full lg:w-[32%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-[#c15f3c] dark:text-[#D97757]" />
            Target Rubric
          </span>
          <span className="text-[#c15f3c] dark:text-[#D97757] font-semibold">Active Calibrate</span>
        </div>

        {/* Glass Card: Target Role */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-start gap-3">
            <GlassIcon variant="coral" size="md">
              <Target className="w-4 h-4 text-[#c15f3c] dark:text-[#D97757]" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                Staff Systems Engineer
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                Linear · San Francisco / Remote
              </div>
            </div>
          </div>

          {/* Quantitative Rubric Bars (5b ranked magnitudes) */}
          <div className="space-y-2 pt-1 font-mono text-[10px]">
            <div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-1">
                <span>Raft & Distributed State</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">98%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#c15f3c] dark:bg-[#D97757] rounded-full w-[98%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-1">
                <span>High-Throughput gRPC / Rust</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">94%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-700 dark:bg-neutral-300 rounded-full w-[94%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-1">
                <span>Latency Optimization (p99)</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">91%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full w-[91%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Semantic Alignment Nexus */}
      <div className="w-full lg:w-[28%] flex flex-col items-center justify-center py-2 relative">
        {/* Alignment Gauge Ring */}
        <div className="relative flex items-center justify-center w-24 h-24 my-1">
          {/* Outer hairline orbit */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              className="stroke-neutral-200 dark:stroke-neutral-800"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              className="stroke-[#c15f3c] dark:stroke-[#D97757]"
              strokeWidth="2.5"
              strokeDasharray="251.2"
              strokeDashoffset="15"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Center Glass Score Display */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums tracking-tight font-mono">
              94%
            </span>
            <span className="text-[8.5px] font-mono text-[#c15f3c] dark:text-[#D97757] uppercase tracking-wider font-semibold">
              Fit Score
            </span>
          </div>
        </div>

        {/* Vector Routing Label */}
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10.5px] font-mono text-neutral-600 dark:text-neutral-400">
          <Sparkles className="w-3 h-3 text-[#c15f3c] dark:text-[#D97757]" />
          <span>Google XYZ Re-rank</span>
        </div>
      </div>

      {/* Right: Re-ranked Bullet Output */}
      <div className="w-full lg:w-[38%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#c15f3c] dark:text-[#D97757]" />
            Calibrated Achievements
          </span>
          <span className="text-[#c15f3c] dark:text-[#D97757] font-medium">Re-ranked #1</span>
        </div>

        {/* Re-ranked Items */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] space-y-2.5">
          {/* Top Calibrated Bullet */}
          <div className="p-2.5 rounded-xl bg-[#c15f3c]/5 dark:bg-[#D97757]/10 border border-[#c15f3c]/20 dark:border-[#D97757]/25 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#c15f3c]/15 text-[#c15f3c] dark:text-[#D97757] font-semibold">
                ▲ PROMOTED TO #1
              </span>
              <span className="text-[#c15f3c] dark:text-[#D97757] font-bold tabular-nums">98% Match</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-neutral-900 dark:text-neutral-100 font-normal">
              Redesigned Raft state synchronization, cutting p99 tail latency from{" "}
              <span className="font-medium text-[#c15f3c] dark:text-[#D97757]">140ms to 18ms</span> across 12k concurrent nodes.
            </p>
          </div>

          {/* Second Calibrated Bullet */}
          <div className="p-2.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-black/[0.04] dark:border-white/[0.04] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>RANK #2 · ARCHITECTURE</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-semibold tabular-nums">92% Match</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
              Architected zero-downtime ledger migration serving 4.2M RPCs daily.
            </p>
          </div>

          <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
            <span>KEYWORD DENSITY: OPTIMIZED</span>
            <span>XYZ METRIC: QUANTIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   03 · Compile & Track Stage Illustration
   LaTeX Vector compile → ATS Verified + Live Visual Tracker
   ========================================================================== */
export function CompileIllustration() {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 p-4 sm:p-6 md:p-8 select-none">
      {/* Left: LaTeX Vector Compiler Engine */}
      <div className="w-full lg:w-[32%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Download className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Vector Engine
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">0.38s Compile</span>
        </div>

        {/* Compiler Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-start gap-3">
            <GlassIcon variant="emerald" size="md">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                linear-staff-eng.pdf
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                100% ATS Verified · Vector
              </div>
            </div>
          </div>

          {/* Compiler Specifications */}
          <div className="space-y-1.5 pt-1 font-mono text-[10.5px]">
            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04] text-neutral-600 dark:text-neutral-400">
              <span>PDF Specification</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">PDF/A-1b Archival</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04] text-neutral-600 dark:text-neutral-400">
              <span>Typeface Engine</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">Charter + Inter Vector</span>
            </div>
            <div className="flex items-center justify-between py-1 text-neutral-600 dark:text-neutral-400">
              <span>Parser OCR Errors</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0 (Zero Glyphs Dropped)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Miniature Architectural Vector Specimen */}
      <div className="w-full lg:w-[28%] flex flex-col items-center justify-center py-2 relative">
        <div className="relative w-36 h-48 rounded-xl bg-white dark:bg-[#181816] border border-black/[0.1] dark:border-white/[0.12] p-3 shadow-md flex flex-col justify-between">
          {/* Header Lines */}
          <div className="space-y-1">
            <div className="h-2 w-16 bg-neutral-800 dark:bg-neutral-200 rounded-sm" />
            <div className="h-1 w-24 bg-neutral-300 dark:bg-neutral-700 rounded-sm" />
          </div>

          {/* Section 1 */}
          <div className="space-y-1">
            <div className="h-1.5 w-12 bg-[#c15f3c] dark:bg-[#D97757] rounded-sm" />
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
              <div className="h-1 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
              <div className="h-1 w-4/6 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-1">
            <div className="h-1.5 w-14 bg-neutral-400 dark:bg-neutral-600 rounded-sm" />
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
              <div className="h-1 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
            </div>
          </div>

          {/* Bottom ATS Badge */}
          <div className="pt-1 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>ATS PASSED</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Right: Live Visual Application Tracker */}
      <div className="w-full lg:w-[38%] flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Kanban className="w-3 h-3 text-[#c15f3c] dark:text-[#D97757]" />
            Application Tracker
          </span>
          <span className="text-neutral-500">Auto-Linked</span>
        </div>

        {/* Tracker Snapshot Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-neutral-900/60 border border-black/[0.08] dark:border-white/[0.08] backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] space-y-2.5">
          {/* Active Job State */}
          <div className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-black/[0.04] dark:border-white/[0.04]">
            <GlassIcon variant="coral" size="sm">
              <Kanban className="w-3.5 h-3.5 text-[#c15f3c] dark:text-[#D97757]" />
            </GlassIcon>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                <span className="truncate">Linear · Staff Distributed</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold">
                  Stage: Applied
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
                Resume Snapshot #104 · Tailored in 18s
              </div>
            </div>
          </div>

          {/* Follow-up reminder */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 text-[10.5px] font-mono text-neutral-600 dark:text-neutral-400">
            <span>Next action: Recruiter touch</span>
            <span className="text-[#c15f3c] dark:text-[#D97757] font-semibold">In 4 days</span>
          </div>

          <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[9.5px] text-neutral-400">
            <span>PIPELINE STATUS: COMPLETE</span>
            <span>OFFER PROBABILITY: HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

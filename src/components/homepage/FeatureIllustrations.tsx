"use client";

import React from "react";
import {
  GitBranch,
  Sparkles,
  Lock,
  Search,
  Check,
} from "lucide-react";

/**
 * Resumely Smooth Editorial Illustrations:
 * - Anti-bold, refined, silky-smooth typography (font-normal to font-medium)
 * - Soft rounded white tiles and pill capsules (bg-white dark:bg-[#222220])
 * - Silky hairline borders (border-black/[0.06] dark:border-white/[0.08])
 * - Subtle ambient drop shadows (shadow-[0_1px_3px_rgba(0,0,0,0.04)])
 * - Soft Claude-coral (#D97757 / #c15f3c) and emerald accents used with quiet restraint
 */

/* ==========================================================================
   01 · Master Career Ledger
   Clean, smooth branch diagram with pill capsules and silky bezier lines
   ========================================================================== */
export function LedgerIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 select-none">
      <div className="relative w-full max-w-[270px] h-[110px] flex items-center justify-between">
        {/* Left: Root main pill */}
        <div className="z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[11.5px] font-medium text-neutral-800 dark:text-neutral-200">
          <GitBranch className="w-3.5 h-3.5 text-neutral-400" />
          <span>main</span>
        </div>

        {/* Middle: Silky SVG branch connectors */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 270 110"
          fill="none"
        >
          {/* Top curve to Staff Infra */}
          <path
            d="M 68 55 C 105 55, 115 24, 150 24"
            className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
            strokeWidth="1.25"
          />
          {/* Middle line to Founding */}
          <path
            d="M 68 55 L 150 55"
            className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
            strokeWidth="1.25"
          />
          {/* Bottom curve to Fullstack */}
          <path
            d="M 68 55 C 105 55, 115 86, 150 86"
            className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
            strokeWidth="1.25"
          />
        </svg>

        {/* Right: Destination branch pills */}
        <div className="z-10 flex flex-col gap-2">
          {/* Branch 1: Staff Infra (Active Focus with soft coral dot) */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#222220] border border-neutral-300 dark:border-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
            <span>Staff Infra</span>
            <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">34</span>
          </div>

          {/* Branch 2: Founding */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
            <span>Founding</span>
            <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">28</span>
          </div>

          {/* Branch 3: Fullstack */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
            <span>Fullstack</span>
            <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">18</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   02 · Target Roles & Spaces
   Exact pill cluster layout from user's uploaded reference (media_1793533079818_05d71f0a.png)
   ========================================================================== */
export function SpacesIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-2 select-none">
      {/* Top Row: Roles with tiny icons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[12px] font-normal text-neutral-700 dark:text-neutral-300">
          <span className="text-[12px]">📁</span>
          <span>Staff Infrastructure</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[12px] font-normal text-neutral-700 dark:text-neutral-300">
          <span className="text-[12px]">✏️</span>
          <span>Founding Engineer</span>
        </span>
      </div>

      {/* Bottom Row: Tags matching # ml, # philosophy, # ideas layout */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
          # distributed-systems
        </span>
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
          # kubernetes
        </span>
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
          # latency
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher
   Smooth floating index card snippet with quiet ATS calibrated telemetry
   ========================================================================== */
export function MatcherIllustration() {
  return (
    <div className="flex items-center justify-center w-full select-none">
      <div className="w-[220px] p-4 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2.5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#c15f3c]/10 dark:bg-[#D97757]/15 text-[#c15f3c] dark:text-[#D97757] font-medium text-[10.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
            ATS Rubric
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            94% Match
          </span>
        </div>

        {/* Target Title */}
        <div className="text-[12.5px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
          Senior Distributed Systems
        </div>

        {/* Smooth 3px hairline progress track */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full w-[94%]" />
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-neutral-400 dark:text-neutral-500">
            <span># raft-consensus</span>
            <span># grpc</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   04 · Google XYZ Calibrator
   Smooth floating constraint pills (Accomplished X, Measured Y, By doing Z)
   ========================================================================== */
export function XyzIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-2 select-none">
      {/* Row 1 */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-[11.5px] font-normal text-neutral-700 dark:text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
          <span>Accomplished telemetry</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-[11.5px] font-normal text-neutral-700 dark:text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
          <span className="font-medium text-[#c15f3c] dark:text-[#D97757]">-42% p99 latency</span>
        </span>
      </div>

      {/* Row 2 */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          <span>Rewriting Redis ingest</span>
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[10.5px] text-neutral-400 font-mono">
          # xyz
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   05 · Section-Focused Copilot
   Smooth floating AI refinement tile with subtle metric badge
   ========================================================================== */
export function CopilotIllustration() {
  return (
    <div className="flex items-center justify-center w-full select-none">
      <div className="w-[220px] p-4 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2">
        {/* Top Header */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Bullet Copilot
          </span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-mono text-[9.5px]">
            ⌘K
          </span>
        </div>

        {/* Refined sentence */}
        <p className="text-[12px] text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
          Scaled gRPC streaming to{" "}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">120k req/s</span>
        </p>

        {/* Micro-badge */}
        <div className="flex items-center gap-2 pt-0.5 text-[10.5px]">
          <span className="px-2 py-0.5 rounded-full bg-[#c15f3c]/10 dark:bg-[#D97757]/15 text-[#c15f3c] dark:text-[#D97757] font-medium text-[10px]">
            +42% throughput
          </span>
          <span className="text-neutral-400 text-[10px]">Zero fluff</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   06 · Vector PDF Engine
   Miniature architectural resume specimen sheet with clean guidelines
   ========================================================================== */
export function VectorPdfIllustration() {
  return (
    <div className="flex items-center justify-center w-full select-none">
      <div className="w-[170px] h-[130px] p-3.5 rounded-xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
        {/* Resume Header */}
        <div>
          <div className="text-[11.5px] font-medium text-neutral-900 dark:text-neutral-100">
            Alex Chen
          </div>
          <div className="text-[9px] text-neutral-400 mt-0.5">
            Staff Infrastructure Engineer
          </div>
          <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 my-2" />
        </div>

        {/* Skeletal Vector Layout Rules */}
        <div className="space-y-1.5">
          <div className="w-full h-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-full" />
          <div className="w-5/6 h-1 bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full" />
          <div className="w-2/3 h-1 bg-neutral-200/40 dark:bg-neutral-700/40 rounded-full" />
        </div>

        {/* Precision Format Tag */}
        <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-neutral-400">
          <span>Single Column</span>
          <span className="font-mono text-neutral-500">LaTeX 2ε</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   07 · Matched Cover Letters
   Two smooth overlapping paper cards with gentle tilt
   ========================================================================== */
export function CompanionIllustration() {
  return (
    <div className="flex items-center justify-center w-full relative h-[120px] select-none">
      {/* Back Paper Card */}
      <div className="absolute w-[180px] p-3 rounded-2xl bg-white/70 dark:bg-[#222220]/70 border border-black/[0.05] dark:border-white/[0.06] shadow-sm -rotate-2 -translate-y-2">
        <div className="text-[10px] text-neutral-400">
          Resume Bullets · Calibrated
        </div>
      </div>

      {/* Front Paper Card */}
      <div className="relative z-10 w-[190px] p-3.5 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-1.5 rotate-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9.5px] font-medium">
            Cover Letter
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 text-[9.5px]">
            1:1 Voice
          </span>
        </div>
        <div className="text-[11.5px] font-medium text-neutral-800 dark:text-neutral-200">
          Matching tone & cadence
        </div>
        <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
      </div>
    </div>
  );
}

/* ==========================================================================
   08 · Visual Job Application Tracker
   Three smooth rounded tiles [ Saved ] [ Applied ] [ Interview ]
   ========================================================================== */
export function TrackerIllustration() {
  return (
    <div className="flex items-center justify-center gap-2.5 w-full select-none">
      {/* Tile 1: Saved */}
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-1">
        <span className="text-[13px]">📁</span>
        <span className="text-[10px] font-normal text-neutral-700 dark:text-neutral-300">Saved</span>
      </div>

      {/* Tile 2: Applied */}
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-1">
        <span className="text-[13px]">✈️</span>
        <span className="text-[10px] font-normal text-neutral-700 dark:text-neutral-300">Applied</span>
      </div>

      {/* Tile 3: Interview (Active Target with soft coral dot) */}
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#222220] border border-neutral-300 dark:border-neutral-700 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 relative">
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c15f3c] dark:bg-[#D97757]" />
        <span className="text-[13px]">🎙️</span>
        <span className="text-[10px] font-medium text-neutral-900 dark:text-neutral-100">Interview</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   09 · Resume Snapshot Memory
   Smooth artifact tile with padlock and SHA hash
   ========================================================================== */
export function SnapshotIllustration() {
  return (
    <div className="flex items-center justify-center w-full select-none">
      <div className="w-[210px] p-4 rounded-2xl bg-white dark:bg-[#222220] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
            <Lock className="w-3 h-3 text-neutral-400" />
            Locked Version
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        <div className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
          resume-stripe-v3.2.pdf
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-neutral-400 font-mono">
          <span>SHA-256</span>
          <span className="text-neutral-600 dark:text-neutral-400">e82a…9f12</span>
        </div>
      </div>
    </div>
  );
}

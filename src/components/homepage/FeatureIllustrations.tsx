"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Check,
  Copy,
  Sparkles,
  Lock,
  Search,
  Folder,
  PenTool,
  Bookmark,
  FileText,
  Command,
} from "lucide-react";

/**
 * Resumely Schematic UI Miniatures:
 * Clean, tactile, physical tiles, pills, and keycaps matching the reference aesthetic.
 * White surfaces (#ffffff / #252523), hairline borders, soft subtle shadows,
 * with occasional tiny accent chips (orange, emerald, blue) as the only color pops.
 */

/* ==========================================================================
   01 · Master Career Ledger
   Archetype: Keycap chips [ ⌘ ] [ ⌥ ] [ L ] + branch chip
   ========================================================================== */
export function LedgerIllustration() {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleKeyClick = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1600);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full">
      {/* 3 Physical Keycap Tiles */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleKeyClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[16px] sm:text-[17px] font-semibold text-neutral-800 dark:text-neutral-100 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96] cursor-pointer select-none"
        >
          ⌘
        </button>
        <button
          type="button"
          onClick={handleKeyClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[16px] sm:text-[17px] font-semibold text-neutral-800 dark:text-neutral-100 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96] cursor-pointer select-none"
        >
          ⌥
        </button>
        <button
          type="button"
          onClick={handleKeyClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[15px] sm:text-[16px] font-semibold text-neutral-800 dark:text-neutral-100 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.96] cursor-pointer select-none"
        >
          L
        </button>
      </div>

      {/* Subtle Ledger Branch Status Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-[11px] font-medium text-neutral-800 dark:text-neutral-200 select-none">
        <GitBranch className="w-3 h-3 text-neutral-400" />
        <span>main</span>
        <span className="text-neutral-300 dark:text-neutral-600">·</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">52 verified metrics</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   02 · Target Roles & Skill Spaces
   Archetype: The EXACT pill cluster from user image (media_1793533079818_05d71f0a.png)
   ========================================================================== */
export function SpacesIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-2">
      {/* Top Row: Roles with tiny icons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11.5px] font-medium text-neutral-800 dark:text-neutral-200 select-none transition-transform duration-150 hover:-translate-y-0.5">
          <span className="text-[12px]">📁</span>
          <span>Staff Infrastructure</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11.5px] font-medium text-neutral-800 dark:text-neutral-200 select-none transition-transform duration-150 hover:-translate-y-0.5">
          <span className="text-[12px]">✏️</span>
          <span>Founding Engineer</span>
        </span>
      </div>

      {/* Bottom Row: Tags matching the # ml, # philosophy, # ideas layout */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] text-neutral-700 dark:text-neutral-300 font-mono select-none transition-transform duration-150 hover:-translate-y-0.5">
          # distributed-systems
        </span>
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] text-neutral-700 dark:text-neutral-300 font-mono select-none transition-transform duration-150 hover:-translate-y-0.5">
          # kubernetes
        </span>
        <span className="px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] text-neutral-700 dark:text-neutral-300 font-mono select-none transition-transform duration-150 hover:-translate-y-0.5">
          # latency
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher
   Archetype: Floating index card snippet with tiny orange tag pop
   ========================================================================== */
export function MatcherIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[210px] sm:w-[220px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        {/* Header row with tiny orange accent badge */}
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            ATS Rubric
          </span>
          <span className="text-neutral-400 dark:text-neutral-500 font-medium text-[10px]">
            Calibrated
          </span>
        </div>

        {/* Snippet Title */}
        <div className="text-[12px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug truncate">
          Senior Distributed Systems
        </div>

        {/* Minimal Progress Indicator & Chips */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-neutral-200 rounded-full w-[94%]" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
            <span># raft-consensus</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">94% fit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   04 · Google XYZ Calibrator
   Archetype: Floating formula tags (Accomplished X, Measured Y, By doing Z)
   ========================================================================== */
export function XyzIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-2">
      {/* Step X & Y */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11px] font-medium text-neutral-800 dark:text-neutral-200 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Accomplished telemetry</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11px] font-medium text-neutral-800 dark:text-neutral-200 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">-42% p99 latency</span>
        </span>
      </div>

      {/* Step Z & Metric Tag */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[10.5px] font-medium text-neutral-700 dark:text-neutral-300 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Rewriting Redis ingest</span>
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[10px] text-neutral-500 font-mono select-none">
          # xyz-formula
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   05 · Section-Focused Copilot
   Archetype: Prompt pill / refinement card with keyboard shortcut badge
   ========================================================================== */
export function CopilotIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[210px] sm:w-[220px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        {/* Top prompt bar with ⌘K chip */}
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1 font-medium text-neutral-800 dark:text-neutral-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Bullet Copilot
          </span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono text-[9.5px]">
            ⌘K
          </span>
        </div>

        {/* Calibrated Bullet Preview */}
        <p className="text-[11.5px] text-neutral-900 dark:text-neutral-100 font-medium leading-relaxed">
          Scaled gRPC streaming to{" "}
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">120k req/s</span>
        </p>

        {/* Tiny pill pop */}
        <div className="flex items-center gap-1.5 pt-0.5 text-[9.5px]">
          <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold">
            +42% throughput
          </span>
          <span className="text-neutral-400">Zero fluff</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   06 · Vector PDF Engine
   Archetype: Miniature white vector resume sheet with architectural rules
   ========================================================================== */
export function VectorPdfIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[170px] h-[130px] p-3 rounded-xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between select-none">
        {/* Header Micro-Specimen */}
        <div>
          <div className="text-[11px] font-serif font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Alex Chen
          </div>
          <div className="text-[8.5px] text-neutral-500 mt-0.5">
            Staff Infrastructure Engineer
          </div>
          <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700 my-1.5" />
        </div>

        {/* Skeletal Vector Layout Rules */}
        <div className="space-y-1.5">
          <div className="w-full h-1 bg-neutral-200/80 dark:bg-neutral-700/80 rounded-full" />
          <div className="w-5/6 h-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-full" />
          <div className="w-2/3 h-1 bg-neutral-200/40 dark:bg-neutral-700/40 rounded-full" />
        </div>

        {/* Precision Format Tag */}
        <div className="flex items-center justify-between text-[9px] pt-1 border-t border-neutral-100 dark:border-neutral-800 text-neutral-500 font-mono">
          <span>LaTeX 2ε</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Single Column</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   07 · Matched Cover Letters
   Archetype: Two layered / overlapping paper index tiles
   ========================================================================== */
export function CompanionIllustration() {
  return (
    <div className="flex items-center justify-center w-full relative h-[130px]">
      {/* Back Paper Tile (Tilted) */}
      <div className="absolute w-[180px] p-3 rounded-2xl bg-white/70 dark:bg-[#252523]/70 border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] -rotate-3 -translate-y-2 select-none">
        <div className="text-[9.5px] font-mono text-neutral-500">
          Resume Bullets · Synced
        </div>
      </div>

      {/* Front Paper Tile */}
      <div className="relative z-10 w-[190px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5 rotate-1 select-none">
        <div className="flex items-center justify-between text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[9.5px]">
            Cover Letter
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 text-[9.5px] font-medium">
            1:1 Voice
          </span>
        </div>
        <div className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100">
          Matching tone & measure
        </div>
        <div className="w-full h-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-full" />
      </div>
    </div>
  );
}

/* ==========================================================================
   08 · Visual Job Application Tracker
   Archetype: 3 stage icon tiles in a row [ 📁 Saved ] [ ✈️ Applied ] [ 🎙️ Interview ]
   ========================================================================== */
export function TrackerIllustration() {
  return (
    <div className="flex items-center justify-center gap-2.5 w-full">
      {/* Tile 1: Saved */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5">
        <span className="text-[14px]">📁</span>
        <span className="text-[9.5px] font-medium text-neutral-800 dark:text-neutral-200">Saved</span>
      </div>

      {/* Tile 2: Applied */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5">
        <span className="text-[14px]">✈️</span>
        <span className="text-[9.5px] font-medium text-neutral-800 dark:text-neutral-200">Applied</span>
      </div>

      {/* Tile 3: Interview (Active focus) */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-neutral-300 dark:border-neutral-600 shadow-[0_3px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5">
        <span className="text-[14px]">🎙️</span>
        <span className="text-[9.5px] font-semibold text-neutral-900 dark:text-neutral-100">Interview</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   09 · Resume Snapshot Memory
   Archetype: Clean white artifact tile with padlock and SHA hash
   ========================================================================== */
export function SnapshotIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[200px] sm:w-[210px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-black/5 dark:border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
            <Lock className="w-3 h-3 text-neutral-400" />
            Locked Version
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        <div className="text-[11.5px] font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          resume-stripe-v3.2.pdf
        </div>

        <div className="flex items-center justify-between text-[9.5px] pt-1 border-t border-neutral-100 dark:border-neutral-800 text-neutral-400 font-mono">
          <span>SHA-256</span>
          <span className="text-neutral-700 dark:text-neutral-300">e82a…9f12</span>
        </div>
      </div>
    </div>
  );
}

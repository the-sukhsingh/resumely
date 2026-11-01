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
 * Design Tokens matching the reference MyMind / Minimalist Bento aesthetic:
 * - Card surface: Warm light gray (#edebe6 / #1a1917)
 * - Tile surface: Crisp white (#ffffff / #252523)
 * - Border: Hairline neutral (#e2e0da / #33322e)
 * - Shadow: Soft, subtle physical drop shadow (no neon / heavy elevation)
 * - Typography: Near-black (#1c1b18) & Muted gray (#8b897f)
 * - Occasional tiny accent chips (orange, emerald, blue) as the only color pops
 */

/* ==========================================================================
   01 · Quick Capture & Master Career Ledger
   Archetype: Keyboard keycap chips [ ⌘ ] [ ⇧ ] [ L ] + branch tag
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
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[16px] sm:text-[17px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer select-none"
        >
          ⌘
        </button>
        <button
          type="button"
          onClick={handleKeyClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[16px] sm:text-[17px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer select-none"
        >
          ⇧
        </button>
        <button
          type="button"
          onClick={handleKeyClick}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.02)] flex items-center justify-center font-mono text-[15px] sm:text-[16px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 cursor-pointer select-none"
        >
          L
        </button>
      </div>

      {/* Subtle Ledger Branch Status Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-[11px] font-medium text-[#1c1b18] dark:text-[#f3f1ec]">
        <GitBranch className="w-3 h-3 text-[#8b897f]" />
        <span>main</span>
        <span className="text-[#8b897f] dark:text-[#9e9c93]">·</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">52 verified</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   02 · Spaces & Custom Calibration Rules (Google XYZ)
   Archetype: Floating tag-chip cluster with tiny colored dots
   ========================================================================== */
export function RulesIllustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-2">
      {/* Row 1 of Tag Chips */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11.5px] font-medium text-[#1c1b18] dark:text-[#f3f1ec] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Accomplished [X]</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-[11.5px] font-medium text-[#1c1b18] dark:text-[#f3f1ec] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Measured [Y]</span>
        </span>
      </div>

      {/* Row 2 of Tag Chips */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] font-medium text-[#1c1b18] dark:text-[#f3f1ec] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>By doing [Z]</span>
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[10.5px] text-[#8b897f] dark:text-[#9e9c93] font-mono select-none">
          # metrics
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[10.5px] text-[#8b897f] dark:text-[#9e9c93] font-mono select-none">
          # xyz
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher
   Archetype: Floating white index card snippet with tiny orange tag pop
   ========================================================================== */
export function MatcherIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[210px] sm:w-[220px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        {/* Header row with tiny orange accent badge */}
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            ATS Rubric
          </span>
          <span className="text-[#8b897f] dark:text-[#9e9c93] font-medium text-[10px]">
            Calibrated
          </span>
        </div>

        {/* Snippet Title */}
        <div className="text-[12px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec] leading-snug truncate">
          Senior Distributed Systems
        </div>

        {/* Minimal Progress Indicator & Chips */}
        <div className="space-y-1.5 pt-0.5">
          <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-neutral-200 rounded-full w-[94%]" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#8b897f] dark:text-[#9e9c93]">
            <span># raft-consensus</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">94% fit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   04 · Section-Focused Copilot
   Archetype: Search-pill / refinement card with keyboard shortcut badge
   ========================================================================== */
export function CopilotIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[210px] sm:w-[220px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        {/* Top prompt bar with ⌘K chip */}
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1 font-medium text-[#1c1b18] dark:text-[#f3f1ec]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Bullet Copilot
          </span>
          <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[#8b897f] dark:text-[#9e9c93] font-mono text-[9.5px]">
            ⌘K
          </span>
        </div>

        {/* Calibrated Bullet Preview */}
        <p className="text-[11.5px] text-[#1c1b18] dark:text-[#f3f1ec] font-medium leading-relaxed">
          Scaled gRPC streaming to{" "}
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">120k req/s</span>
        </p>

        {/* Tiny pill pop */}
        <div className="flex items-center gap-1.5 pt-0.5 text-[9.5px]">
          <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold">
            +42% latency
          </span>
          <span className="text-[#8b897f] dark:text-[#9e9c93]">Zero fluff</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   05 · Vector PDF Engine
   Archetype: Miniature white vector resume sheet with architectural rules
   ========================================================================== */
export function VectorPdfIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[170px] h-[130px] p-3 rounded-xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between select-none">
        {/* Header Micro-Specimen */}
        <div>
          <div className="text-[11px] font-serif font-bold text-[#1c1b18] dark:text-[#f3f1ec] tracking-tight">
            Alex Chen
          </div>
          <div className="text-[8.5px] text-[#8b897f] dark:text-[#9e9c93] mt-0.5">
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
        <div className="flex items-center justify-between text-[9px] pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[#8b897f] dark:text-[#9e9c93] font-mono">
          <span>LaTeX 2ε</span>
          <span className="font-semibold text-[#1c1b18] dark:text-[#f3f1ec]">Single Column</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   06 · Matched Cover Letters
   Archetype: Two layered / overlapping paper index tiles
   ========================================================================== */
export function CompanionIllustration() {
  return (
    <div className="flex items-center justify-center w-full relative h-[130px]">
      {/* Back Paper Tile (Tilted) */}
      <div className="absolute w-[180px] p-3 rounded-2xl bg-white/70 dark:bg-[#252523]/70 border border-[#e2e0da] dark:border-neutral-700/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] -rotate-3 -translate-y-2 select-none">
        <div className="text-[9.5px] font-mono text-[#8b897f] dark:text-[#9e9c93]">
          Resume Bullets · Synced
        </div>
      </div>

      {/* Front Paper Tile */}
      <div className="relative z-10 w-[190px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] space-y-1.5 rotate-1 select-none">
        <div className="flex items-center justify-between text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[9.5px]">
            Cover Letter
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 text-[9.5px] font-medium">
            1:1 Voice
          </span>
        </div>
        <div className="text-[11px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec]">
          Matching tone & measure
        </div>
        <div className="w-full h-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-full" />
      </div>
    </div>
  );
}

/* ==========================================================================
   07 · Visual Job Application Tracker
   Archetype: App-icon trio row [ 📁 Saved ] [ ✈️ Applied ] [ 🎙️ Interview ]
   ========================================================================== */
export function TrackerIllustration() {
  return (
    <div className="flex items-center justify-center gap-2.5 w-full">
      {/* Tile 1: Saved */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5">
        <span className="text-[14px]">📁</span>
        <span className="text-[9.5px] font-medium text-[#1c1b18] dark:text-[#f3f1ec]">Saved</span>
      </div>

      {/* Tile 2: Applied */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5">
        <span className="text-[14px]">✈️</span>
        <span className="text-[9.5px] font-medium text-[#1c1b18] dark:text-[#f3f1ec]">Applied</span>
      </div>

      {/* Tile 3: Interview (Active focus) */}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#252523] border border-neutral-300 dark:border-neutral-600 shadow-[0_3px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-1 select-none transition-transform duration-150 hover:-translate-y-0.5 ring-1 ring-neutral-900/5 dark:ring-white/5">
        <span className="text-[14px]">🎙️</span>
        <span className="text-[9.5px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec]">Interview</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   08 · Resume Snapshot Memory
   Archetype: Clean white artifact tile with padlock and SHA hash
   ========================================================================== */
export function SnapshotIllustration() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[200px] sm:w-[210px] p-3.5 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#1c1b18] dark:text-[#f3f1ec]">
            <Lock className="w-3 h-3 text-[#8b897f]" />
            Locked Version
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        <div className="text-[11.5px] font-semibold text-[#1c1b18] dark:text-[#f3f1ec] truncate">
          resume-stripe-v3.2.pdf
        </div>

        <div className="flex items-center justify-between text-[9.5px] pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[#8b897f] dark:text-[#9e9c93] font-mono">
          <span>SHA-256</span>
          <span className="text-[#1c1b18] dark:text-[#f3f1ec]">e82a…9f12</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   09 · Recruiter Quick Route & Share Links
   Archetype: Search pill mockup with command badge and link telemetry
   ========================================================================== */
export function ShareLinksIllustration() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://resumely.tech/r/alex-chen");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[220px] sm:w-[230px] p-3 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] space-y-2 select-none">
        {/* Search / URL Pill Input */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-[#e2e0da]/80 dark:border-neutral-700/50 text-[10.5px]">
          <div className="flex items-center gap-1.5 text-[#1c1b18] dark:text-[#f3f1ec] truncate font-mono text-[10px]">
            <Search className="w-3 h-3 text-[#8b897f] shrink-0" />
            <span className="truncate">resumely.tech/r/alex</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-1.5 py-0.5 rounded bg-white dark:bg-[#252523] text-[#1c1b18] dark:text-[#f3f1ec] font-mono text-[9px] border border-[#e2e0da] dark:border-neutral-700 shadow-sm shrink-0 hover:bg-neutral-50 active:scale-95 cursor-pointer"
          >
            {copied ? "✓ Copied" : "⌘C"}
          </button>
        </div>

        {/* Metadata subline */}
        <div className="flex items-center justify-between text-[9.5px] text-[#8b897f] dark:text-[#9e9c93] px-1">
          <span>+ 12 recruiter views</span>
          <span className="font-medium text-[#1c1b18] dark:text-[#f3f1ec]">Private link</span>
        </div>
      </div>
    </div>
  );
}

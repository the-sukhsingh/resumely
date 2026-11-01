"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Check,
  Copy,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  FileText,
  RotateCcw,
} from "lucide-react";

/**
 * Common Smooth Styling Tokens derived directly from the reference luminous button:
 * - Smooth sapphire gradient
 * - Luminous hairline cyan-blue perimeter
 * - Inset specular top highlight
 * - Soft ice-blue typography
 * - Tactile active press response
 */
export const smoothPillClasses = {
  // Primary active pill (matching the reference button)
  active:
    "relative inline-flex items-center justify-center rounded-full font-medium tracking-tight " +
    "bg-gradient-to-b from-[#19427b] via-[#123363] to-[#0a1e3d] text-[#e0edff] " +
    "dark:from-[#1b4684] dark:via-[#133464] dark:to-[#0a1d3b] dark:text-[#e0edff] " +
    "border border-sky-400/40 hover:border-sky-300/70 " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_2px_8px_rgba(14,165,233,0.25),0_0_12px_-2px_rgba(56,189,248,0.3)] " +
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
    "active:scale-[0.97] cursor-pointer select-none",

  // Inactive / secondary pill
  inactive:
    "relative inline-flex items-center justify-center rounded-full font-medium tracking-tight " +
    "bg-white/70 dark:bg-[#0c1626]/70 text-neutral-600 dark:text-neutral-400 " +
    "border border-neutral-200/80 dark:border-sky-950/70 hover:border-sky-300/60 dark:hover:border-sky-700/50 " +
    "hover:text-neutral-900 dark:hover:text-neutral-200 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none " +
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
    "active:scale-[0.97] cursor-pointer select-none",

  // Smooth substrate container for illustrations (clean, minimal, zero dark-mode AI slop)
  container:
    "p-3 sm:p-3.5 rounded-2xl " +
    "bg-gradient-to-b from-sky-50/50 via-white/80 to-slate-50/60 " +
    "dark:bg-gradient-to-b dark:from-[#0a1526]/80 dark:via-[#081120]/75 dark:to-[#050b15]/90 " +
    "border border-sky-900/10 dark:border-sky-500/20 " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_16px_-4px_rgba(14,165,233,0.06)] " +
    "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_6px_20px_-6px_rgba(2,6,23,0.6)] " +
    "backdrop-blur-sm",
};

/* ==========================================================================
   01 · Master Career Ledger Illustration
   ========================================================================== */
export function LedgerIllustration() {
  const [activeBranch, setActiveBranch] = useState<"main" | "staff" | "fullstack">("main");

  const branchMeta = {
    main: { metrics: "52 metrics", label: "Master Verified Ledger", date: "Synced today" },
    staff: { metrics: "34 metrics", label: "Staff Infrastructure Profile", date: "Calibrated" },
    fullstack: { metrics: "18 metrics", label: "Founding Engineer Profile", date: "Calibrated" },
  };

  return (
    <div className="space-y-3">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          Branch Ecosystem
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/25">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          Single Truth
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={smoothPillClasses.container}>
        {/* Branch Selector Pills */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {(["main", "staff", "fullstack"] as const).map((branch) => {
            const isActive = activeBranch === branch;
            return (
              <button
                key={branch}
                type="button"
                onClick={() => setActiveBranch(branch)}
                className={`px-3 py-1 text-[11px] ${
                  isActive ? smoothPillClasses.active : smoothPillClasses.inactive
                }`}
              >
                {branch === "main" ? "main" : branch === "staff" ? "staff-infra" : "fullstack"}
              </button>
            );
          })}
        </div>

        {/* Live Branch Info Banner */}
        <div className="mt-2.5 pt-2 border-t border-sky-900/10 dark:border-sky-500/15 flex items-center justify-between text-[11px]">
          <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">
            {branchMeta[activeBranch].label}
          </span>
          <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-sky-100/80 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-200/60 dark:border-sky-800/60">
            {branchMeta[activeBranch].metrics}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   02 · Custom Agent Rules Illustration
   ========================================================================== */
export function RulesIllustration() {
  const [strictMode, setStrictMode] = useState(true);

  return (
    <div className="space-y-3">
      {/* Header with Interactive Mode Toggle */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          XYZ Calibration Protocol
        </span>
        <button
          type="button"
          onClick={() => setStrictMode(!strictMode)}
          className={`px-2.5 py-0.5 text-[10px] ${
            strictMode ? smoothPillClasses.active : smoothPillClasses.inactive
          }`}
        >
          {strictMode ? "Strict Enforced" : "Advisory"}
        </button>
      </div>

      {/* Formula Progression Strip */}
      <div className={`${smoothPillClasses.container} space-y-2`}>
        {/* Step X */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-300 shrink-0">
            X
          </span>
          <span className="text-neutral-800 dark:text-neutral-200 truncate">
            Accomplished real-time telemetry
          </span>
        </div>

        {/* Step Y: Metric Highlight */}
        <div className="flex items-center gap-2 text-[11px] px-2 py-1 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 dark:border-sky-400/25">
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-sky-600 text-white dark:bg-sky-400 dark:text-sky-950 shrink-0">
            Y
          </span>
          <span className="text-sky-900 dark:text-sky-100 font-semibold truncate">
            Slashing p99 latency by 42%
          </span>
        </div>

        {/* Step Z */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-300 shrink-0">
            Z
          </span>
          <span className="text-neutral-600 dark:text-neutral-400 truncate">
            By rewriting Redis stream ingest
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher Illustration (Directly addressing user feedback!)
   ========================================================================== */
export function MatcherIllustration() {
  const [activeSkills, setActiveSkills] = useState({
    distributed: true,
    latency: true,
    consensus: true,
  });

  const toggleSkill = (key: keyof typeof activeSkills) => {
    setActiveSkills((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeCount = Object.values(activeSkills).filter(Boolean).length;
  const calibratedScore = 84 + activeCount * 5; // 84%, 89%, 94%, 99%

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          ATS Calibration
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-gradient-to-r from-sky-500/15 to-blue-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25 dark:border-sky-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
          {calibratedScore}% Calibrated
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={`${smoothPillClasses.container} space-y-3`}>
        {/* Sleek Luminous Calibration Track */}
        <div className="h-2 w-full bg-neutral-200/80 dark:bg-[#071324] rounded-full overflow-hidden p-0.5 border border-neutral-300/40 dark:border-sky-900/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${calibratedScore}%` }}
          />
        </div>

        {/* Tactile Keyword Pills modeled after the smooth button reference */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => toggleSkill("distributed")}
            className={`px-3 py-1 text-[11px] flex items-center gap-1.5 ${
              activeSkills.distributed ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            <span>Distributed Systems</span>
            <span className="text-[10px] opacity-75">(3x)</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSkill("latency")}
            className={`px-3 py-1 text-[11px] flex items-center gap-1.5 ${
              activeSkills.latency ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            <span>p99 Latency Tuning</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSkill("consensus")}
            className={`px-3 py-1 text-[11px] flex items-center gap-1.5 ${
              activeSkills.consensus ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            <span>Raft Consensus</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   04 · Section-Focused Copilot Illustration
   ========================================================================== */
export function CopilotIllustration() {
  const [isEnhanced, setIsEnhanced] = useState(true);

  return (
    <div className="space-y-3">
      {/* Top Header with Interactive Diff Toggle */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          Bullet Refinement
        </span>
        <button
          type="button"
          onClick={() => setIsEnhanced(!isEnhanced)}
          className={`px-2.5 py-0.5 text-[10px] ${
            isEnhanced ? smoothPillClasses.active : smoothPillClasses.inactive
          }`}
        >
          {isEnhanced ? "Enhanced Bullet" : "Original Draft"}
        </button>
      </div>

      {/* Comparison Preview Card */}
      <div className={`${smoothPillClasses.container} space-y-2`}>
        {isEnhanced ? (
          <div className="space-y-1.5">
            <p className="text-[11.5px] text-neutral-900 dark:text-[#f0f6ff] font-medium leading-relaxed">
              Scaled gRPC streaming pipeline to{" "}
              <span className="text-sky-600 dark:text-sky-300 font-semibold underline decoration-sky-400/40 underline-offset-2">
                120k req/s
              </span>{" "}
              with zero dropped frames.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] text-sky-700 dark:text-sky-300">
              <span className="px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 dark:border-sky-400/20">
                +140% Throughput
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">XYZ Validated</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Built backend microservices APIs for transaction processing.
            </p>
            <div className="pt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
              Generic wording · Lacks quantifiable metric
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   05 · Vector PDF Engine Illustration
   ========================================================================== */
export function VectorPdfIllustration() {
  const [paperFormat, setPaperFormat] = useState<"Letter" | "A4">("Letter");

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          LaTeX 2ε Pure Vector
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/20">
          0 Broken Glyphs
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={`${smoothPillClasses.container} flex items-center justify-between gap-3`}>
        {/* Architectural Specs */}
        <div className="space-y-1">
          <div className="text-[11.5px] font-semibold text-neutral-900 dark:text-neutral-100">
            Single-Column Purity
          </div>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
            Micro-typography · 100% vector scale
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaperFormat("Letter")}
            className={`px-2.5 py-1 text-[10.5px] ${
              paperFormat === "Letter" ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            Letter
          </button>
          <button
            type="button"
            onClick={() => setPaperFormat("A4")}
            className={`px-2.5 py-1 text-[10.5px] ${
              paperFormat === "A4" ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            A4
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   06 · Matched Cover Letters Illustration
   ========================================================================== */
export function CompanionIllustration() {
  const [role, setRole] = useState<"Staff Infra" | "Founding Eng">("Staff Infra");

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          1:1 Typographic Sync
        </span>
        <button
          type="button"
          onClick={() => setRole(role === "Staff Infra" ? "Founding Eng" : "Staff Infra")}
          className={`px-2 py-0.5 text-[10px] ${smoothPillClasses.active}`}
        >
          {role}
        </button>
      </div>

      {/* Dual Document Synchronized Card */}
      <div className={`${smoothPillClasses.container} space-y-2 text-[11px]`}>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">Resume Voice</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {role === "Staff Infra" ? "High-Scale Distributed Systems" : "0-to-1 Product Architect"}
          </span>
        </div>
        <div className="pt-1.5 border-t border-sky-900/10 dark:border-sky-500/15 flex items-center justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">Cover Letter</span>
          <span className="text-sky-700 dark:text-sky-300 font-medium">
            Matched cadence & measure
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   07 · Visual Job Tracker Illustration
   ========================================================================== */
export function TrackerIllustration() {
  const [activeStage, setActiveStage] = useState(2); // 0: Saved, 1: Applied, 2: Interview, 3: Offer

  const stages = ["Saved", "Applied", "Interview", "Offer"];
  const stageDetails = [
    { target: "Stripe · Staff Eng", status: "Role bookmarked · JD analyzed" },
    { target: "Stripe · Staff Eng", status: "Calibrated v3.2 PDF submitted" },
    { target: "Stripe · Staff Eng", status: "Technical round scheduled" },
    { target: "Stripe · Staff Eng", status: "Offer in review · $260k base" },
  ];

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          Application Pipeline
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/20">
          6 Active Tracks
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={`${smoothPillClasses.container} space-y-2.5`}>
        {/* Smooth Pipeline Stage Pills */}
        <div className="flex items-center justify-between gap-1 text-[10.5px]">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`px-2.5 py-1 text-[10.5px] flex-1 text-center ${
                  isActive ? smoothPillClasses.active : smoothPillClasses.inactive
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>

        {/* Active Stage Data Card */}
        <div className="pt-2 border-t border-sky-900/10 dark:border-sky-500/15 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {stageDetails[activeStage].target}
          </span>
          <span className="text-[10px] text-sky-700 dark:text-sky-300 font-medium shrink-0 ml-2">
            {stageDetails[activeStage].status}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   08 · Resume Snapshot Memory Illustration
   ========================================================================== */
export function SnapshotIllustration() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerified(true);
    setTimeout(() => setIsVerified(false), 2400);
  };

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          Snapshot Binding
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/20">
          <Lock className="w-2.5 h-2.5" />
          Version Locked
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={`${smoothPillClasses.container} space-y-2 text-[11px]`}>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 dark:text-neutral-400">Linked Submission</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            resume-stripe-v3.2.pdf
          </span>
        </div>

        <div className="pt-2 border-t border-sky-900/10 dark:border-sky-500/15 flex items-center justify-between">
          <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">
            SHA: e82a…9f12
          </span>
          <button
            type="button"
            onClick={handleVerify}
            className={`px-2.5 py-0.5 text-[10px] ${
              isVerified ? smoothPillClasses.active : smoothPillClasses.inactive
            }`}
          >
            {isVerified ? "✓ Verified Clean" : "Verify Integrity"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   09 · Public Share Links Illustration (Modeled directly after the button!)
   ========================================================================== */
export function ShareLinksIllustration() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://resumely.tech/r/alex-chen");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
          Recruiter Fast-Route
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-400/20">
          Live Web Link
        </span>
      </div>

      {/* Main Illustration Substrate */}
      <div className={`${smoothPillClasses.container} flex items-center justify-between gap-2.5`}>
        <div className="truncate text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
          resumely.tech/r/alex-chen
        </div>

        {/* Copy Button: Styled exactly as the smooth luminous reference button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`px-3.5 py-1.5 text-[11px] shrink-0 flex items-center gap-1.5 ${smoothPillClasses.active}`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-sky-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-sky-300" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


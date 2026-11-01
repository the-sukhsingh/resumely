"use client";

import React from "react";
import { cn } from "@/lib/utils";
import GlassIcon from "./GlassIcon";
import {
  FileText,
  Target,
  Download,
  CheckCircle2,
  ShieldCheck,
  Kanban,
  Sparkles,
} from "lucide-react";

interface PipelineIllustrationProps {
  activeStep?: number | null;
  onSelectStep?: (index: number) => void;
}

export function PipelineIllustration({
  activeStep = null,
  onSelectStep,
}: PipelineIllustrationProps) {
  return (
    <div className="w-full flex flex-col select-none">
      {/* 3-Stage Connected Pipeline Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_64px_1fr_64px_1fr] items-stretch gap-4 lg:gap-0 w-full py-2">
        {/* =================================================================
           STAGE 01: Ingest Record
           ================================================================= */}
        <div
          onClick={() => onSelectStep?.(0)}
          className={cn(
            "group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl transition-all duration-200 cursor-pointer",
            "border bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md",
            activeStep === 0
              ? "border-neutral-900/40 dark:border-white/40 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]"
              : "border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.15]"
          )}
        >
          {/* Header: Glass Icon + Step Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <GlassIcon
                variant={activeStep === 0 ? "coral" : "default"}
                size="md"
              >
                <FileText className="w-4 h-4" />
              </GlassIcon>
              <span className="font-mono text-[10.5px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
                01 · Ingest
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Source PDF
            </span>
          </div>

          {/* Body: Specimen & Extracted Atoms */}
          <div className="space-y-3">
            {/* Input File Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
                resume-draft.pdf
              </span>
              <span className="font-mono text-[10px] text-neutral-400 tabular-nums shrink-0 ml-2">
                48 KB
              </span>
            </div>

            {/* Structured Metric Atoms */}
            <div className="space-y-1.5 font-mono text-[10.5px]">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="truncate">▸ Staff Systems Infra</span>
                <span className="text-neutral-400 text-[9.5px]">Scale</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="truncate">▸ Rewrote Redis with gRPC</span>
                <span className="text-[#c15f3c] dark:text-[#D97757] font-semibold tabular-nums">
                  -42% p99
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="truncate">▸ Multi-region failover</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                  99.99%
                </span>
              </div>
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[10px] text-neutral-400">
            <span>MASTER LEDGER</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium tabular-nums">
              34 metrics parsed
            </span>
          </div>
        </div>

        {/* =================================================================
           CONNECTOR 01 → 02
           ================================================================= */}
        <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 px-2 relative">
          {/* Desktop Horizontal Hairline with Traveling Pulse */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full relative">
            <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Extract
            </span>
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 64 16" fill="none">
              <line
                x1="0"
                y1="8"
                x2="64"
                y2="8"
                className="stroke-neutral-300 dark:stroke-neutral-700"
                strokeWidth="1.25"
                strokeDasharray="3 3"
              />
              <circle
                cx="32"
                cy="8"
                r="3"
                className="fill-[#c15f3c] dark:fill-[#D97757]"
              >
                <animate
                  attributeName="cx"
                  values="4;60;4"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <span className="font-mono text-[10px] text-neutral-400 mt-1">→</span>
          </div>

          {/* Mobile Vertical Indicator */}
          <div className="flex lg:hidden items-center justify-center w-full py-1">
            <span className="font-mono text-[10px] text-neutral-400 flex items-center gap-1.5">
              <span>↓</span>
              <span className="uppercase text-[9px] tracking-wider">Semantic Parse</span>
            </span>
          </div>
        </div>

        {/* =================================================================
           STAGE 02: Calibrate (Claude-Coral Focal Point)
           ================================================================= */}
        <div
          onClick={() => onSelectStep?.(1)}
          className={cn(
            "group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl transition-all duration-200 cursor-pointer",
            "border backdrop-blur-md",
            "bg-white/80 dark:bg-neutral-900/60",
            activeStep === 1
              ? "border-[#c15f3c] dark:border-[#D97757] shadow-[0_4px_24px_rgba(217,119,87,0.15)]"
              : "border-[#c15f3c]/30 dark:border-[#D97757]/30 hover:border-[#c15f3c]/60 dark:hover:border-[#D97757]/60"
          )}
        >
          {/* Header: Glass Icon (Coral) + Step Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <GlassIcon variant="coral" size="md" glow>
                <Target className="w-4 h-4 text-[#c15f3c] dark:text-[#D97757]" />
              </GlassIcon>
              <span className="font-mono text-[10.5px] uppercase tracking-wider font-semibold text-[#c15f3c] dark:text-[#D97757]">
                02 · Calibrate
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#c15f3c] dark:text-[#D97757] font-semibold tabular-nums">
              94% Semantic Fit
            </span>
          </div>

          {/* Body: Target Role & Re-ranked Bullet */}
          <div className="space-y-3">
            {/* Target Role Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#c15f3c]/5 dark:bg-[#D97757]/10 border border-[#c15f3c]/20 dark:border-[#D97757]/20">
              <span className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                Target: Staff Systems @ Linear
              </span>
              <span className="font-mono text-[10px] text-[#c15f3c] dark:text-[#D97757] font-semibold shrink-0 ml-2">
                URL / Text
              </span>
            </div>

            {/* Calibrated Achievement */}
            <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-[#c15f3c] dark:text-[#D97757] font-semibold">
                  ▲ RE-RANKED #1 (XYZ FORMULA)
                </span>
                <span className="text-neutral-500 tabular-nums">98% Match</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                Redesigned Raft state replication, cutting p99 tail latency from 140ms to 18ms.
              </p>
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[10px] text-neutral-400">
            <span>RUBRIC ALIGNMENT</span>
            <span className="text-[#c15f3c] dark:text-[#D97757] font-medium">
              Raft · Latency · Rust
            </span>
          </div>
        </div>

        {/* =================================================================
           CONNECTOR 02 → 03
           ================================================================= */}
        <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 px-2 relative">
          {/* Desktop Horizontal Hairline with Traveling Pulse */}
          <div className="hidden lg:flex flex-col items-center justify-center w-full relative">
            <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
              Compile
            </span>
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 64 16" fill="none">
              <line
                x1="0"
                y1="8"
                x2="64"
                y2="8"
                className="stroke-neutral-300 dark:stroke-neutral-700"
                strokeWidth="1.25"
                strokeDasharray="3 3"
              />
              <circle
                cx="32"
                cy="8"
                r="3"
                className="fill-[#c15f3c] dark:fill-[#D97757]"
              >
                <animate
                  attributeName="cx"
                  values="4;60;4"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="2.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <span className="font-mono text-[10px] text-neutral-400 mt-1">→</span>
          </div>

          {/* Mobile Vertical Indicator */}
          <div className="flex lg:hidden items-center justify-center w-full py-1">
            <span className="font-mono text-[10px] text-neutral-400 flex items-center gap-1.5">
              <span>↓</span>
              <span className="uppercase text-[9px] tracking-wider">Vector Build</span>
            </span>
          </div>
        </div>

        {/* =================================================================
           STAGE 03: Compile & Track
           ================================================================= */}
        <div
          onClick={() => onSelectStep?.(2)}
          className={cn(
            "group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl transition-all duration-200 cursor-pointer",
            "border bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md",
            activeStep === 2
              ? "border-neutral-900/40 dark:border-white/40 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]"
              : "border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.15]"
          )}
        >
          {/* Header: Glass Icon + Step Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <GlassIcon
                variant={activeStep === 2 ? "emerald" : "default"}
                size="md"
              >
                <Download className="w-4 h-4" />
              </GlassIcon>
              <span className="font-mono text-[10.5px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
                03 · Compile & Track
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              100% Vector ATS
            </span>
          </div>

          {/* Body: Vector PDF & Application Tracker */}
          <div className="space-y-3">
            {/* Vector PDF File Chip */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
                linear-product-eng.pdf
              </span>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0 ml-2">
                0.38s · Vector
              </span>
            </div>

            {/* Application Tracker Node */}
            <div className="p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-black/[0.04] dark:border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-neutral-500">VISUAL TRACKER</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Stage: Applied
                </span>
              </div>
              <p className="text-[11.5px] text-neutral-800 dark:text-neutral-200">
                Linear · Snapshot #104 anchored with notes
              </p>
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between font-mono text-[10px] text-neutral-400">
            <span>OCR ERRORS</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              0 · 100% Parsable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

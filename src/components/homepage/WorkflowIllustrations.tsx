"use client";

import React from "react";
import { cn } from "@/lib/utils";
import GlassIcon from "./GlassIcon";
import {
  File,
  Target,
  Rocket,
  Approved,
  Certificate,
  Disk,
} from "@duo-icons/react";

/**
 * Resumely Smooth Editorial Workflow Illustration:
 * - Powered by @duo-icons/react (primary layer + 30% translucent secondary layer)
 * - Silky smooth pill cards with soft glass blur and subtle ambient shadow
 * - Connected with silky SVG hairlines (fill="none" always guaranteed)
 * - Restrained Claude-coral accent (#c15f3c / #D97757) on the Calibration node
 * - Smooth, calm, clean and breathable
 */
export function SmoothWorkflowIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full py-8 sm:py-12 px-4 sm:px-8 select-none overflow-hidden",
        className
      )}
    >
      {/* Background SVG Connectors (Desktop only: smooth horizontal bezier flow) */}
      <svg
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        viewBox="0 0 900 220"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connector 1: Stage 1 -> Stage 2 */}
        <path
          d="M 270 110 C 330 110, 340 110, 400 110"
          className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Animated Traveling Pulse 1 */}
        <circle cx="335" cy="110" r="3.5" className="fill-[#c15f3c] dark:fill-[#D97757]">
          <animate
            attributeName="cx"
            values="280;390;280"
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

        {/* Connector 2: Stage 2 -> Stage 3 */}
        <path
          d="M 570 110 C 630 110, 640 110, 700 110"
          className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Animated Traveling Pulse 2 */}
        <circle cx="635" cy="110" r="3.5" className="fill-[#c15f3c] dark:fill-[#D97757]">
          <animate
            attributeName="cx"
            values="580;690;580"
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

      {/* 3 Smooth Workflow Nodes */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 max-w-[960px] mx-auto">
        {/* =================================================================
           STAGE 01: Ingest Record
           ================================================================= */}
        <div className="w-full lg:w-[250px] p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1a18] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <GlassIcon variant="default" size="md">
              <span className="text-neutral-600 dark:text-neutral-300 shrink-0 inline-flex">
                <File size={16} />
              </span>
            </GlassIcon>
            <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">
              01 · Ingest
            </span>
          </div>

          <div>
            <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
              resume-draft.pdf
            </div>
            <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
              LinkedIn / PDF Source
            </div>
          </div>

          <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 shrink-0 inline-flex">
                <Approved size={12} />
              </span>
              <span>34 metrics parsed</span>
            </span>
          </div>
        </div>

        {/* Mobile Connector Arrow */}
        <div className="flex lg:hidden items-center justify-center text-neutral-400 dark:text-neutral-600 text-sm font-mono">
          ↓
        </div>

        {/* =================================================================
           STAGE 02: Calibrate to Job (Claude-Coral Focal Point)
           ================================================================= */}
        <div className="w-full lg:w-[250px] p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1a18] border border-[#c15f3c]/30 dark:border-[#D97757]/35 shadow-[0_4px_20px_rgba(217,119,87,0.08)] dark:shadow-[0_4px_24px_rgba(217,119,87,0.15)] space-y-3 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <GlassIcon variant="coral" size="md" glow>
              <span className="text-[#c15f3c] dark:text-[#D97757] shrink-0 inline-flex">
                <Target size={16} />
              </span>
            </GlassIcon>
            <span className="font-mono text-[10px] text-[#c15f3c] dark:text-[#D97757] uppercase tracking-wider font-semibold">
              02 · Calibrate
            </span>
          </div>

          <div>
            <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
              Staff Systems Engineer
            </div>
            <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
              Linear · Rubric Match
            </div>
          </div>

          <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c15f3c]/10 dark:bg-[#D97757]/15 text-[#c15f3c] dark:text-[#D97757] text-[11px] font-medium">
              <span className="text-[#c15f3c] dark:text-[#D97757] shrink-0 inline-flex">
                <Rocket size={12} />
              </span>
              <span>94% match · Google XYZ</span>
            </span>
          </div>
        </div>

        {/* Mobile Connector Arrow */}
        <div className="flex lg:hidden items-center justify-center text-neutral-400 dark:text-neutral-600 text-sm font-mono">
          ↓
        </div>

        {/* =================================================================
           STAGE 03: Export Vector PDF & Track
           ================================================================= */}
        <div className="w-full lg:w-[250px] p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1a18] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <GlassIcon variant="default" size="md">
              <span className="text-neutral-600 dark:text-neutral-300 shrink-0 inline-flex">
                <Certificate size={16} />
              </span>
            </GlassIcon>
            <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">
              03 · Compile &amp; Track
            </span>
          </div>

          <div>
            <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
              linear-staff-eng.pdf
            </div>
            <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
              0.38s Vector Build
            </div>
          </div>

          <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 shrink-0 inline-flex">
                <Approved size={12} />
              </span>
              <span>100% ATS · Applied</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

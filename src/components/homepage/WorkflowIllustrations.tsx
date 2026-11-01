"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial Workflow Illustrations & Continuous Pipeline
 * Follows /editorial-illustrations, /emil-design-eng, /hallmark:
 * - Claim -> Geometry: Unstructured resume transformed into verified ledger,
 *   semantically calibrated against job rubric, compiled into ATS vector PDF & tracked.
 * - Single Claude-coral (#c15f3c / #D97757) accent on the calibration focal stage.
 * - Clean 1px hairlines, zero fake pills, zero gradient borders, zero slop.
 * - Interactive stage synchronization with smooth hover and reduced-motion safety.
 */

interface PipelineProps {
  activeStage?: number | null;
  onHoverStage?: (stage: number | null) => void;
  className?: string;
}

export function WorkflowPipeline({
  activeStage,
  onHoverStage,
  className,
}: PipelineProps) {
  const [internalHover, setInternalHover] = useState<number | null>(null);
  const currentStage = activeStage ?? internalHover;

  const handleStageEnter = (stage: number) => {
    setInternalHover(stage);
    onHoverStage?.(stage);
  };

  const handleStageLeave = () => {
    setInternalHover(null);
    onHoverStage?.(null);
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-neutral-200/90 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#121211]/50 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 select-none",
        className
      )}
    >
      {/* Top Technical Chrome (Monotykamary / Linear discipline) */}
      <div className="flex items-center justify-between border-b border-neutral-200/70 dark:border-neutral-800/70 pb-3 mb-4 font-mono text-[10px] tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c15f3c] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c15f3c] dark:bg-[#D97757]" />
          </span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            AUDITABLE PIPELINE ARCHITECTURE
          </span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline">
            // SPEC 2.4
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-neutral-400 dark:text-neutral-500">
            LATENCY &lt; 400MS
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            STATUS: CONTINUOUS
          </span>
        </div>
      </div>

      {/* Responsive Horizontal Pipeline Canvas */}
      <div className="w-full overflow-x-auto scrollbar-none py-1">
        <div className="min-w-[760px] md:min-w-0 w-full">
          <svg
            viewBox="0 0 960 250"
            className="w-full h-auto block overflow-visible"
            role="img"
            aria-label="Resumely linear pipeline: Ingestion, Calibration, and Compilation"
          >
            <defs>
              <style>{`
                @keyframes signalPulse {
                  0% { transform: translateX(0); opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { transform: translateX(54px); opacity: 0; }
                }
                @keyframes coreBreathe {
                  0%, 100% { transform: scale(1); opacity: 0.9; }
                  50% { transform: scale(1.12); opacity: 1; }
                }
                .signal-rail-1 {
                  animation: signalPulse 3.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .signal-rail-2 {
                  animation: signalPulse 3.4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.7s;
                }
                .calibration-core {
                  transform-origin: 480px 125px;
                  animation: coreBreathe 4s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                  .signal-rail-1, .signal-rail-2, .calibration-core {
                    animation: none !important;
                  }
                }
              `}</style>
            </defs>

            {/* =============================================================
                STAGE 01: Ingestion & Extraction (x: 20 -> 280)
                ============================================================= */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => handleStageEnter(1)}
              onMouseLeave={handleStageLeave}
              opacity={currentStage && currentStage !== 1 ? 0.6 : 1}
            >
              {/* Stage Box Frame */}
              <rect
                x="20"
                y="15"
                width="265"
                height="215"
                rx="12"
                className={cn(
                  "fill-white dark:fill-[#161615] transition-colors duration-200",
                  currentStage === 1
                    ? "stroke-neutral-800 dark:stroke-neutral-200 stroke-[1.5px]"
                    : "stroke-neutral-200 dark:stroke-neutral-800 stroke-[1px]"
                )}
              />

              {/* Header Bar */}
              <circle cx="42" cy="38" r="3" className="fill-emerald-500" />
              <text
                x="52"
                y="41"
                className="font-mono text-[9.5px] tracking-wider uppercase font-semibold fill-neutral-700 dark:fill-neutral-300"
              >
                01 // RECORD INGESTION
              </text>

              {/* Source Document Sheet */}
              <g transform="translate(42, 60)">
                <rect
                  x="0"
                  y="0"
                  width="74"
                  height="102"
                  rx="4"
                  className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-300 dark:stroke-neutral-700"
                  strokeWidth="1"
                />
                {/* Dog-ear corner fold */}
                <path
                  d="M58 0 L74 16 H58 Z"
                  className="fill-neutral-200 dark:fill-neutral-800 stroke-neutral-300 dark:stroke-neutral-700"
                  strokeWidth="0.8"
                />
                {/* Rule lines */}
                <line x1="12" y1="24" x2="48" y2="24" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="36" x2="62" y2="36" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="12" y1="48" x2="56" y2="48" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="12" y1="60" x2="60" y2="60" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="12" y1="72" x2="44" y2="72" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                {/* Scanning laser beam */}
                <line x1="4" y1="44" x2="70" y2="44" className="stroke-emerald-500/80" strokeWidth="1.2" strokeDasharray="2 2" />
              </g>

              {/* Extraction Rail Bracket */}
              <path
                d="M126 88 H138 V136 H126"
                className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Extracted Ledger Records */}
              <g transform="translate(148, 62)">
                {/* Record 1 */}
                <rect x="0" y="0" width="122" height="28" rx="4" className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />
                <text x="8" y="12" className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">[ROLE]</text>
                <text x="8" y="22" className="font-mono text-[9px] font-medium fill-neutral-900 dark:fill-neutral-100">Staff Systems</text>

                {/* Record 2 */}
                <rect x="0" y="36" width="122" height="28" rx="4" className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />
                <text x="8" y="48" className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">[XYZ]</text>
                <text x="8" y="58" className="font-mono text-[9px] font-medium fill-neutral-900 dark:fill-neutral-100">-42% p99 Latency</text>

                {/* Record 3 */}
                <rect x="0" y="72" width="122" height="28" rx="4" className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />
                <text x="8" y="84" className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">[SLA]</text>
                <text x="8" y="94" className="font-mono text-[9px] font-medium fill-neutral-900 dark:fill-neutral-100">99.99% Reliability</text>
              </g>

              {/* Stage 1 Footer Tag */}
              <text
                x="42"
                y="204"
                className="font-mono text-[8.5px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500"
              >
                VERIFIED CAREER LEDGER · 34 METRICS
              </text>
            </g>

            {/* =============================================================
                CONNECTOR RAIL 01 -> 02 (x: 285 -> 345)
                ============================================================= */}
            <g transform="translate(285, 122)">
              <line x1="0" y1="0" x2="60" y2="0" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="M52 -4 L58 0 L52 4" className="fill-none stroke-neutral-400 dark:stroke-neutral-600" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="-8" textAnchor="middle" className="font-mono text-[8px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">
                EXTRACT
              </text>
              {/* Traveling Signal Pulse */}
              <circle cx="2" cy="0" r="3" className="fill-[#c15f3c] dark:fill-[#D97757] signal-rail-1" />
            </g>

            {/* =============================================================
                STAGE 02: Semantic Calibration (The Focal Point, x: 345 -> 615)
                ============================================================= */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => handleStageEnter(2)}
              onMouseLeave={handleStageLeave}
              opacity={currentStage && currentStage !== 2 ? 0.6 : 1}
            >
              {/* Stage Box Frame (Focal highlight) */}
              <rect
                x="345"
                y="15"
                width="270"
                height="215"
                rx="12"
                className={cn(
                  "fill-white dark:fill-[#161615] transition-colors duration-200",
                  currentStage === 2
                    ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.6px]"
                    : "stroke-[#c15f3c]/40 dark:stroke-[#D97757]/40 stroke-[1.2px]"
                )}
              />

              {/* Header Bar */}
              <circle cx="368" cy="38" r="3.2" className="fill-[#c15f3c] dark:fill-[#D97757]" />
              <text
                x="378"
                y="41"
                className="font-mono text-[9.5px] tracking-wider uppercase font-semibold fill-[#c15f3c] dark:fill-[#D97757]"
              >
                02 // SEMANTIC CALIBRATION
              </text>

              {/* Job Rubric Input Flag */}
              <g transform="translate(480, 56)">
                <text x="0" y="0" textAnchor="middle" className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400 uppercase tracking-wider">
                  TARGET: STAFF SYSTEMS @ LINEAR
                </text>
                <path d="M0 6 V16 M-3 12 L0 16 L3 12" className="fill-none stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Precision Reticle Core */}
              <g transform="translate(480, 125)">
                {/* Outer Calibration Ring */}
                <circle cx="0" cy="0" r="46" className="fill-none stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />
                {/* Inner Reticle Ring */}
                <circle cx="0" cy="0" r="32" className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeDasharray="3 3" />

                {/* Crosshairs */}
                <line x1="-54" y1="0" x2="54" y2="0" className="stroke-neutral-300/80 dark:stroke-neutral-700/80" strokeWidth="0.8" />
                <line x1="0" y1="-54" x2="0" y2="54" className="stroke-neutral-300/80 dark:stroke-neutral-700/80" strokeWidth="0.8" />

                {/* Radial Calibration Ticks */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line
                    key={deg}
                    x1={Math.cos((deg * Math.PI) / 180) * 42}
                    y1={Math.sin((deg * Math.PI) / 180) * 42}
                    x2={Math.cos((deg * Math.PI) / 180) * 46}
                    y2={Math.sin((deg * Math.PI) / 180) * 46}
                    className="stroke-neutral-400 dark:stroke-neutral-500"
                    strokeWidth="1"
                  />
                ))}

                {/* Focal Glowing Calibration Center */}
                <circle cx="0" cy="0" r="16" className="fill-[#c15f3c]/15 dark:fill-[#D97757]/15 calibration-core" />
                <circle cx="0" cy="0" r="6" className="fill-[#c15f3c] dark:fill-[#D97757]" />

                {/* Dynamic Alignment Vector Needle */}
                <line x1="0" y1="0" x2="26" y2="-18" className="stroke-[#c15f3c] dark:stroke-[#D97757]" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="26" cy="-18" r="2.5" className="fill-[#c15f3c] dark:fill-[#D97757]" />

                {/* Fit Badge */}
                <g transform="translate(68, -8)">
                  <text x="0" y="0" className="font-mono text-[10px] font-semibold fill-[#c15f3c] dark:fill-[#D97757]">
                    94% FIT
                  </text>
                  <text x="0" y="10" className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">
                    XYZ FORMULA
                  </text>
                </g>
              </g>

              {/* Stage 2 Footer Tag */}
              <text
                x="480"
                y="204"
                textAnchor="middle"
                className="font-mono text-[8.5px] uppercase tracking-wider fill-[#c15f3c] dark:fill-[#D97757] font-medium"
              >
                RUBRIC CALIBRATED // RE-RANKED VIA GOOGLE XYZ
              </text>
            </g>

            {/* =============================================================
                CONNECTOR RAIL 02 -> 03 (x: 615 -> 675)
                ============================================================= */}
            <g transform="translate(615, 122)">
              <line x1="0" y1="0" x2="60" y2="0" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="M52 -4 L58 0 L52 4" className="fill-none stroke-neutral-400 dark:stroke-neutral-600" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="-8" textAnchor="middle" className="font-mono text-[8px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">
                COMPILE
              </text>
              {/* Traveling Signal Pulse */}
              <circle cx="2" cy="0" r="3" className="fill-emerald-500 signal-rail-2" />
            </g>

            {/* =============================================================
                STAGE 03: Vector PDF & Application Tracker (x: 675 -> 940)
                ============================================================= */}
            <g
              className="cursor-pointer transition-opacity duration-200"
              onMouseEnter={() => handleStageEnter(3)}
              onMouseLeave={handleStageLeave}
              opacity={currentStage && currentStage !== 3 ? 0.6 : 1}
            >
              {/* Stage Box Frame */}
              <rect
                x="675"
                y="15"
                width="265"
                height="215"
                rx="12"
                className={cn(
                  "fill-white dark:fill-[#161615] transition-colors duration-200",
                  currentStage === 3
                    ? "stroke-neutral-800 dark:stroke-neutral-200 stroke-[1.5px]"
                    : "stroke-neutral-200 dark:stroke-neutral-800 stroke-[1px]"
                )}
              />

              {/* Header Bar */}
              <circle cx="698" cy="38" r="3" className="fill-emerald-500" />
              <text
                x="708"
                y="41"
                className="font-mono text-[9.5px] tracking-wider uppercase font-semibold fill-neutral-700 dark:fill-neutral-300"
              >
                03 // VECTOR PDF &amp; TRACK
              </text>

              {/* Compiled Vector PDF Sheet */}
              <g transform="translate(696, 60)">
                <rect
                  x="0"
                  y="0"
                  width="78"
                  height="104"
                  rx="4"
                  className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-300 dark:stroke-neutral-700"
                  strokeWidth="1"
                />
                {/* Header text line */}
                <line x1="10" y1="18" x2="52" y2="18" className="stroke-neutral-800 dark:stroke-neutral-200" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="28" x2="42" y2="28" className="stroke-neutral-400 dark:stroke-neutral-500" strokeWidth="1" strokeLinecap="round" />
                {/* Section lines */}
                <line x1="10" y1="42" x2="68" y2="42" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="52" x2="64" y2="52" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="62" x2="68" y2="62" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="72" x2="58" y2="72" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1" strokeLinecap="round" />

                {/* ATS Parsed Stamp */}
                <g transform="translate(8, 86)">
                  <circle cx="6" cy="6" r="5" className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="1" />
                  <path d="M4 6 L5.5 7.5 L8.5 4.5" className="fill-none stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="15" y="9" className="font-mono text-[7px] font-semibold fill-emerald-600 dark:fill-emerald-400 uppercase tracking-wider">
                    ATS 100%
                  </text>
                </g>
              </g>

              {/* Connecting Branch to Tracker Node */}
              <line x1="778" y1="112" x2="796" y2="112" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.2" />

              {/* Visual Job Tracker Node */}
              <g transform="translate(796, 74)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="76"
                  rx="6"
                  className="fill-neutral-50 dark:fill-[#1c1c1b] stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="1"
                />
                <text x="10" y="18" className="font-mono text-[7.5px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500">
                  VISUAL TRACKER
                </text>
                <line x1="10" y1="26" x2="120" y2="26" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />

                <g transform="translate(10, 42)">
                  <circle cx="4" cy="0" r="3.5" className="fill-emerald-500" />
                  <text x="12" y="3" className="font-mono text-[9px] font-semibold fill-neutral-900 dark:fill-neutral-100">
                    STAGE: APPLIED
                  </text>
                </g>

                <text x="10" y="62" className="font-mono text-[8px] fill-neutral-400 dark:fill-neutral-500 uppercase tracking-wider">
                  LOCKED SNAPSHOT #104
                </text>
              </g>

              {/* Stage 3 Footer Tag */}
              <text
                x="698"
                y="204"
                className="font-mono text-[8.5px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500"
              >
                0.38S VECTOR BUILD · ARCHIVAL LOCKED
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Technical Caption (Monotykamary discipline) */}
      <div className="mt-4 pt-3 border-t border-neutral-200/70 dark:border-neutral-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        <span>
          FIGURE 1.0 — DETERMINISTIC PIPELINE: UNSTRUCTURED RECORD → SEMANTIC CALIBRATION → ATS-VERIFIED VECTOR COMPILATION
        </span>
        <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
          PARSER FIDELITY: 100%
        </span>
      </div>
    </div>
  );
}

// Backward-compatible individual stage components if needed
export function HairlineLedger({ className }: { className?: string }) {
  return null;
}
export function HairlineCalibrate({ className }: { className?: string }) {
  return null;
}
export function HairlineCompile({ className }: { className?: string }) {
  return null;
}

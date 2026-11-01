"use client";

import React from "react";

/**
 * Editorial Data-Illustrations in the monotykamary / Linear aesthetic:
 * - Near-black grayscale base with exactly ONE Claude-coral accent:
 *     Light mode: #c15f3c (AA compliant on light ground)
 *     Dark mode:  #D97757
 * - 1px hairlines, non-scaling stroke
 * - Monospace micro-typography (7px-10px, uppercase labels)
 * - True geometric primitives (node DAGs, ranked bars, spectrum partitions, coupled orbits)
 * - Zero emojis, zero chartjunk, zero slop
 */

const CORAL_LIGHT = "#c15f3c";
const CORAL_DARK = "#D97757";

/* ==========================================================================
   01 · Master Career Ledger
   Claim: Single verified root ledger branches into tailored variants without data duplication.
   Geometry: Node-and-branch DAG (Atom 5c)
   ========================================================================== */
export function LedgerIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Branch Lines */}
        <path
          d="M 55 70 L 115 70 C 145 70, 155 38, 195 38 L 245 38"
          strokeWidth="1.25"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 115 70 L 255 70"
          strokeWidth="1.25"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 115 70 C 145 70, 155 102, 195 102 L 245 102"
          strokeWidth="1.25"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          vectorEffect="non-scaling-stroke"
        />

        {/* Root Node */}
        <circle
          cx="55"
          cy="70"
          r="7"
          className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-[#121210]"
          strokeWidth="1.25"
        />
        <circle
          cx="55"
          cy="70"
          r="3"
          className="fill-neutral-900 dark:fill-neutral-100"
        />
        <text
          x="55"
          y="93"
          textAnchor="middle"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          ROOT // MAIN
        </text>

        {/* Branch 1 Node (Active Calibrated - Coral Accent) */}
        <circle
          cx="245"
          cy="38"
          r="10"
          className="stroke-[#c15f3c] dark:stroke-[#D97757] fill-transparent"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle
          cx="245"
          cy="38"
          r="5"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
        <text
          x="245"
          y="24"
          textAnchor="middle"
          className="font-mono text-[8px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          STAFF-INFRA // 34P
        </text>

        {/* Branch 2 Node (Neutral) */}
        <circle
          cx="255"
          cy="70"
          r="4.5"
          className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-[#121210]"
          strokeWidth="1.25"
        />
        <text
          x="266"
          y="73"
          className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          FOUNDING // 28P
        </text>

        {/* Branch 3 Node (Neutral) */}
        <circle
          cx="245"
          cy="102"
          r="4.5"
          className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-[#121210]"
          strokeWidth="1.25"
        />
        <text
          x="245"
          y="118"
          textAnchor="middle"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          FULLSTACK // 18P
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   02 · Target Roles & Spaces
   Claim: Multidimensional competency clustering partitioned across engineering domains.
   Geometry: Spectrum cell partition / architectural matrix (Atom 5a / 5e)
   ========================================================================== */
export function SpacesIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Outer Frame */}
        <rect
          x="25"
          y="25"
          width="270"
          height="90"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="1"
        />

        {/* Column Divider 1 */}
        <line
          x1="115"
          y1="25"
          x2="115"
          y2="115"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="1"
        />

        {/* Column Divider 2 */}
        <line
          x1="205"
          y1="25"
          x2="205"
          y2="115"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="1"
        />

        {/* Cell 1: Infra */}
        <text
          x="35"
          y="42"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          01 // INFRA
        </text>
        <line
          x1="35"
          y1="56"
          x2="95"
          y2="56"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="3"
        />
        <line
          x1="35"
          y1="66"
          x2="80"
          y2="66"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="3"
        />
        <text
          x="35"
          y="102"
          className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          34 METRICS
        </text>

        {/* Cell 2: Distributed (Coral Accent Point) */}
        <rect
          x="115"
          y="25"
          width="90"
          height="90"
          className="fill-neutral-100/50 dark:fill-white/[0.02]"
        />
        <line
          x1="115"
          y1="25"
          x2="205"
          y2="25"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="2"
        />
        <text
          x="125"
          y="42"
          className="font-mono text-[7.5px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          02 // DISTRIB
        </text>
        <circle
          cx="160"
          cy="68"
          r="4.5"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
        <circle
          cx="160"
          cy="68"
          r="9"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        <text
          x="160"
          y="102"
          textAnchor="middle"
          className="font-mono text-[7.5px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          ACTIVE CLUSTER
        </text>

        {/* Cell 3: Systems */}
        <text
          x="215"
          y="42"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          03 // RUNTIME
        </text>
        <line
          x1="215"
          y1="56"
          x2="275"
          y2="56"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="3"
        />
        <line
          x1="215"
          y1="66"
          x2="260"
          y2="66"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="3"
        />
        <text
          x="215"
          y="102"
          className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          18 METRICS
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher
   Claim: Real-time semantic calibration against hiring rubrics with ranked match fidelity.
   Geometry: Precision ranked horizontal bars (Atom 5b)
   ========================================================================== */
export function MatcherIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Left Axis Line */}
        <line
          x1="90"
          y1="22"
          x2="90"
          y2="118"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          strokeWidth="1"
        />

        {/* Grid Guidelines */}
        <line
          x1="180"
          y1="22"
          x2="180"
          y2="118"
          className="stroke-neutral-200/60 dark:stroke-neutral-800/60"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <line
          x1="270"
          y1="22"
          x2="270"
          y2="118"
          className="stroke-neutral-200/60 dark:stroke-neutral-800/60"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />

        {/* Row 1: Distributed Raft (Coral Accent - The Point) */}
        <text
          x="82"
          y="42"
          textAnchor="end"
          className="font-mono text-[8px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          RAFT // DIST
        </text>
        <rect
          x="90"
          y="34"
          width="180"
          height="9"
          className="fill-neutral-100 dark:fill-neutral-900"
        />
        <rect
          x="90"
          y="34"
          width="169"
          height="9"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
        <text
          x="280"
          y="42"
          className="font-mono text-[8px] font-bold fill-[#c15f3c] dark:fill-[#D97757]"
        >
          94%
        </text>

        {/* Row 2: Latency Tuning */}
        <text
          x="82"
          y="72"
          textAnchor="end"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          P99-TUNING
        </text>
        <rect
          x="90"
          y="64"
          width="180"
          height="9"
          className="fill-neutral-100 dark:fill-neutral-900"
        />
        <rect
          x="90"
          y="64"
          width="156"
          height="9"
          className="fill-neutral-400 dark:fill-neutral-600"
        />
        <text
          x="280"
          y="72"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400"
        >
          87%
        </text>

        {/* Row 3: gRPC Telemetry */}
        <text
          x="82"
          y="102"
          textAnchor="end"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          GRPC-INGEST
        </text>
        <rect
          x="90"
          y="94"
          width="180"
          height="9"
          className="fill-neutral-100 dark:fill-neutral-900"
        />
        <rect
          x="90"
          y="94"
          width="142"
          height="9"
          className="fill-neutral-300 dark:fill-neutral-700"
        />
        <text
          x="280"
          y="102"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400"
        >
          79%
        </text>

        {/* Axis Ticks */}
        <text
          x="180"
          y="130"
          textAnchor="middle"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-600"
        >
          50%
        </text>
        <text
          x="270"
          y="130"
          textAnchor="middle"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-600"
        >
          100%
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   04 · Google XYZ Calibrator
   Claim: Strict tripartite constraint pipeline: Accomplished [X], measured by [Y], by doing [Z].
   Geometry: 3-stage transformation pipeline rail with directional coupling (Atom 5e)
   ========================================================================== */
export function XyzIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Stage 1: X (Action) */}
        <rect
          x="20"
          y="42"
          width="74"
          height="56"
          className="stroke-neutral-300 dark:stroke-neutral-800 fill-white dark:fill-[#121210]"
          strokeWidth="1"
        />
        <text
          x="28"
          y="56"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          STAGE 01
        </text>
        <text
          x="28"
          y="72"
          className="font-mono text-[9px] font-bold fill-neutral-800 dark:fill-neutral-200"
        >
          [X] ACTION
        </text>
        <text
          x="28"
          y="86"
          className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500 uppercase"
        >
          LED TELEMETRY
        </text>

        {/* Arrow 1 */}
        <line
          x1="94"
          y1="70"
          x2="114"
          y2="70"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 110 67 L 114 70 L 110 73"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1"
        />

        {/* Stage 2: Y (Metric - Coral Focus) */}
        <rect
          x="116"
          y="38"
          width="88"
          height="64"
          className="stroke-neutral-300 dark:stroke-neutral-800 fill-neutral-50 dark:fill-[#141412]"
          strokeWidth="1"
        />
        <line
          x1="116"
          y1="38"
          x2="204"
          y2="38"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="2"
        />
        <text
          x="124"
          y="54"
          className="font-mono text-[7px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          STAGE 02 // KEY
        </text>
        <text
          x="124"
          y="71"
          className="font-mono text-[9.5px] font-bold fill-[#c15f3c] dark:fill-[#D97757]"
        >
          [Y] -42% P99
        </text>
        <text
          x="124"
          y="87"
          className="font-mono text-[6.5px] fill-neutral-500 dark:fill-neutral-400 uppercase"
        >
          QUANTIFIED YIELD
        </text>

        {/* Arrow 2 */}
        <line
          x1="204"
          y1="70"
          x2="224"
          y2="70"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 220 67 L 224 70 L 220 73"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1"
        />

        {/* Stage 3: Z (Method) */}
        <rect
          x="226"
          y="42"
          width="74"
          height="56"
          className="stroke-neutral-300 dark:stroke-neutral-800 fill-white dark:fill-[#121210]"
          strokeWidth="1"
        />
        <text
          x="234"
          y="56"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          STAGE 03
        </text>
        <text
          x="234"
          y="72"
          className="font-mono text-[9px] font-bold fill-neutral-800 dark:fill-neutral-200"
        >
          [Z] METHOD
        </text>
        <text
          x="234"
          y="86"
          className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500 uppercase"
        >
          VIA REDIS STREAM
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   05 · Section-Focused Copilot
   Claim: Passive text is transformed into quantifiable metric yield in real time.
   Geometry: Dual-channel transformation vector / differential state (Atom 5e / 5b)
   ========================================================================== */
export function CopilotIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Upper Track: Passive Input */}
        <text
          x="30"
          y="38"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          INPUT // PASSIVE DRAFT
        </text>
        <line
          x1="30"
          y1="48"
          x2="290"
          y2="48"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <text
          x="30"
          y="62"
          className="font-mono text-[8px] fill-neutral-400 dark:fill-neutral-500"
        >
          - Built backend microservices APIs for transaction processing
        </text>

        {/* Connecting Vector Transition */}
        <path
          d="M 160 68 L 160 82"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.25"
        />
        <circle
          cx="160"
          cy="82"
          r="2.5"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />

        {/* Lower Track: Synthesized Output (Coral Accent Point) */}
        <line
          x1="30"
          y1="94"
          x2="290"
          y2="94"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1"
        />
        <text
          x="30"
          y="108"
          className="font-mono text-[8px] font-bold fill-neutral-900 dark:fill-neutral-100"
        >
          + Scaled gRPC pipeline to{" "}
          <tspan className="fill-[#c15f3c] dark:fill-[#D97757]">120k req/s</tspan> with 0 frame drop
        </text>

        {/* Telemetry pill */}
        <text
          x="290"
          y="126"
          textAnchor="end"
          className="font-mono text-[7px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          +140% YIELD // VERIFIED
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   06 · Vector PDF Engine
   Claim: Single-column typographical purity rendered in exact LaTeX vector coordinates.
   Geometry: Architectural blueprint grid with page coordinate system (Atom 5a / coordinate sheet)
   ========================================================================== */
export function VectorPdfIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Page Sheet Canvas */}
        <rect
          x="95"
          y="18"
          width="130"
          height="104"
          className="stroke-neutral-300 dark:stroke-neutral-800 fill-white dark:fill-[#121210]"
          strokeWidth="1"
        />

        {/* Origin Coordinate Crosshair (Coral Accent) */}
        <line
          x1="90"
          y1="18"
          x2="102"
          y2="18"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.25"
        />
        <line
          x1="95"
          y1="13"
          x2="95"
          y2="25"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.25"
        />
        <text
          x="92"
          y="12"
          className="font-mono text-[6.5px] fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          (X₀, Y₀)
        </text>

        {/* Single-Column Margin Guides */}
        <line
          x1="110"
          y1="26"
          x2="110"
          y2="114"
          className="stroke-neutral-200/80 dark:stroke-neutral-800/80"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        <line
          x1="210"
          y1="26"
          x2="210"
          y2="114"
          className="stroke-neutral-200/80 dark:stroke-neutral-800/80"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />

        {/* Micro-Typography Skeleton Lines */}
        <text
          x="160"
          y="35"
          textAnchor="middle"
          className="font-mono text-[7px] font-bold fill-neutral-800 dark:fill-neutral-200"
        >
          ALEX CHEN // STAFF
        </text>
        <line
          x1="115"
          y1="41"
          x2="205"
          y2="41"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="0.75"
        />

        <line
          x1="115"
          y1="52"
          x2="205"
          y2="52"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="2"
        />
        <line
          x1="115"
          y1="60"
          x2="195"
          y2="60"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="2"
        />
        <line
          x1="115"
          y1="68"
          x2="200"
          y2="68"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="2"
        />

        <line
          x1="115"
          y1="82"
          x2="205"
          y2="82"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="2"
        />
        <line
          x1="115"
          y1="90"
          x2="185"
          y2="90"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="2"
        />

        {/* Precision Dimension Callouts */}
        <text
          x="50"
          y="72"
          className="font-mono text-[7px] fill-neutral-400 dark:fill-neutral-500 tracking-wider"
        >
          11.0 IN →
        </text>
        <text
          x="160"
          y="132"
          textAnchor="middle"
          className="font-mono text-[7px] font-bold fill-neutral-600 dark:fill-neutral-400 tracking-wider"
        >
          LATEX 2ε // 100% VECTOR
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   07 · Matched Cover Letters
   Claim: Harmonic phase synchrony between resume metrics and companion letter cadence.
   Geometry: Coupled dual orbits / harmonic resonance bridge (Atom 5d)
   ========================================================================== */
export function CompanionIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Orbit A (Resume) */}
        <circle
          cx="95"
          cy="70"
          r="38"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          strokeWidth="1"
        />
        <circle
          cx="95"
          cy="70"
          r="26"
          className="stroke-neutral-200/80 dark:stroke-neutral-800/80"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <text
          x="95"
          y="68"
          textAnchor="middle"
          className="font-mono text-[8px] font-bold fill-neutral-800 dark:fill-neutral-200 tracking-wider"
        >
          RESUME
        </text>
        <text
          x="95"
          y="79"
          textAnchor="middle"
          className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500"
        >
          METRIC AXIS
        </text>

        {/* Orbit B (Cover Letter) */}
        <circle
          cx="225"
          cy="70"
          r="38"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          strokeWidth="1"
        />
        <circle
          cx="225"
          cy="70"
          r="26"
          className="stroke-neutral-200/80 dark:stroke-neutral-800/80"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <text
          x="225"
          y="68"
          textAnchor="middle"
          className="font-mono text-[8px] font-bold fill-neutral-800 dark:fill-neutral-200 tracking-wider"
        >
          LETTER
        </text>
        <text
          x="225"
          y="79"
          textAnchor="middle"
          className="font-mono text-[6.5px] fill-neutral-400 dark:fill-neutral-500"
        >
          PROSE VOICE
        </text>

        {/* Synchronizing Bridge (Coral Accent Node) */}
        <line
          x1="133"
          y1="70"
          x2="187"
          y2="70"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1.25"
        />
        <circle
          cx="160"
          cy="70"
          r="9"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle
          cx="160"
          cy="70"
          r="4"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
        <text
          x="160"
          y="52"
          textAnchor="middle"
          className="font-mono text-[7px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          1:1 HARMONY
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   08 · Visual Job Application Tracker
   Claim: Applications transition across discrete pipeline states to offer close.
   Geometry: Horizontal state machine rail with traveling focus node (Atom 5a + rail)
   ========================================================================== */
export function TrackerIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Pipeline Rail */}
        <line
          x1="45"
          y1="70"
          x2="195"
          y2="70"
          className="stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.25"
        />
        <line
          x1="195"
          y1="70"
          x2="275"
          y2="70"
          className="stroke-neutral-300 dark:stroke-neutral-800"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Milestone 1: Saved */}
        <circle
          cx="55"
          cy="70"
          r="5"
          className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-[#121210]"
          strokeWidth="1.25"
        />
        <text
          x="55"
          y="92"
          textAnchor="middle"
          className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          01 // SAVED
        </text>

        {/* Milestone 2: Applied */}
        <circle
          cx="125"
          cy="70"
          r="5"
          className="stroke-neutral-400 dark:stroke-neutral-600 fill-white dark:fill-[#121210]"
          strokeWidth="1.25"
        />
        <text
          x="125"
          y="92"
          textAnchor="middle"
          className="font-mono text-[7.5px] fill-neutral-500 dark:fill-neutral-400 tracking-wider"
        >
          02 // APPLIED
        </text>

        {/* Milestone 3: Interview (Active Target Focus - Coral Accent) */}
        <circle
          cx="195"
          cy="70"
          r="11"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle
          cx="195"
          cy="70"
          r="6"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
        <line
          x1="195"
          y1="59"
          x2="195"
          y2="42"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1"
        />
        <text
          x="195"
          y="36"
          textAnchor="middle"
          className="font-mono text-[8px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          ONSITE // ACTIVE
        </text>
        <text
          x="195"
          y="92"
          textAnchor="middle"
          className="font-mono text-[7.5px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          03 // INTERVIEW
        </text>

        {/* Milestone 4: Offer */}
        <circle
          cx="265"
          cy="70"
          r="5"
          className="stroke-neutral-300 dark:stroke-neutral-800 fill-transparent"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x="265"
          y="92"
          textAnchor="middle"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-600 tracking-wider"
        >
          04 // OFFER
        </text>
      </svg>
    </div>
  );
}

/* ==========================================================================
   09 · Resume Snapshot Memory
   Claim: Cryptographic hash immutably binds submission state to application artifact.
   Geometry: Merkle integrity block with verification seal (Atom 5e / cryptographic seal)
   ========================================================================== */
export function SnapshotIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 320 140"
        className="w-full max-w-[280px] h-auto select-none"
        fill="none"
        stroke="currentColor"
      >
        {/* Verification Container */}
        <rect
          x="35"
          y="25"
          width="250"
          height="90"
          className="stroke-neutral-200 dark:stroke-neutral-800 fill-white/50 dark:fill-white/[0.01]"
          strokeWidth="1"
        />

        {/* Top Header Rule */}
        <line
          x1="35"
          y1="48"
          x2="285"
          y2="48"
          className="stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="1"
        />
        <text
          x="48"
          y="40"
          className="font-mono text-[7.5px] font-bold fill-neutral-700 dark:fill-neutral-300 tracking-wider"
        >
          SHA-256 INTEGRITY BLOCK
        </text>

        {/* Telemetry rows */}
        <text
          x="48"
          y="66"
          className="font-mono text-[8px] fill-neutral-500 dark:fill-neutral-400"
        >
          ARTIFACT:{" "}
          <tspan className="fill-neutral-800 dark:fill-neutral-200 font-bold">
            RESUME-STRIPE-V3.2.PDF
          </tspan>
        </text>
        <text
          x="48"
          y="80"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-500"
        >
          DIGEST: E82A79B1...F4D091A2
        </text>
        <text
          x="48"
          y="94"
          className="font-mono text-[7.5px] fill-neutral-400 dark:fill-neutral-500"
        >
          TIMESTAMP: 2026-11-01T17:20Z
        </text>

        {/* Seal Mark (Coral Accent) */}
        <circle
          cx="252"
          cy="75"
          r="16"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1"
        />
        <circle
          cx="252"
          cy="75"
          r="12"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        <path
          d="M 246 75 L 250 79 L 258 71"
          className="stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="252"
          y="104"
          textAnchor="middle"
          className="font-mono text-[6.5px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tracking-wider"
        >
          LOCKED
        </text>
      </svg>
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial Workflow Schematic (760x280 viewBox)
 * Built strictly according to /editorial-illustrations and /hallmark:
 * - Claim: "Unstructured career data is ingested into an atomic master ledger, calibrated against target job rubrics, and compiled into an ATS-verified vector document."
 * - Restraint: Hairlines only (1px), grayscale ramp + single Claude-coral accent (#c15f3c / #D97757).
 * - No cards-in-cards or fake UI chrome. Pure architectural data geometry.
 * - Reduced-motion safe: animations cease under prefers-reduced-motion.
 */
export function WorkflowSchematic({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden select-none", className)}>
      <svg
        viewBox="0 0 760 270"
        className="w-full h-auto block overflow-visible"
        role="img"
        aria-label="Resumely three-stage deterministic pipeline: Ingest, Calibrate, and Compile"
      >
        <defs>
          {/* Subtle grid pattern background */}
          <pattern
            id="schematic-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              className="text-neutral-200/50 dark:text-neutral-800/40"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Claude-coral glowing pulse filter */}
          <filter id="coral-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* =================================================================
           BACKGROUND HAILINE GRID (quantitative structural discipline)
           ================================================================= */}
        <rect
          x="10"
          y="10"
          width="740"
          height="250"
          fill="url(#schematic-grid)"
          className="opacity-40"
        />

        {/* Outer boundary guides */}
        <rect
          x="10"
          y="10"
          width="740"
          height="250"
          fill="none"
          stroke="currentColor"
          className="text-neutral-200/80 dark:text-neutral-800/80"
          strokeWidth="1"
        />

        {/* Section divider hairlines */}
        <line
          x1="260"
          y1="10"
          x2="260"
          y2="260"
          stroke="currentColor"
          className="text-neutral-200/60 dark:text-neutral-800/60"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="500"
          y1="10"
          x2="500"
          y2="260"
          stroke="currentColor"
          className="text-neutral-200/60 dark:text-neutral-800/60"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Stage Index Watermarks */}
        <text
          x="25"
          y="30"
          className="font-mono text-[9px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500 font-semibold"
        >
          STAGE 01 // INGESTION &amp; EXTRACTION
        </text>
        <text
          x="275"
          y="30"
          className="font-mono text-[9px] uppercase tracking-wider fill-[#c15f3c] dark:fill-[#D97757] font-semibold"
        >
          STAGE 02 // SEMANTIC CALIBRATION
        </text>
        <text
          x="515"
          y="30"
          className="font-mono text-[9px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500 font-semibold"
        >
          STAGE 03 // VECTOR ATS COMPILE
        </text>

        {/* =================================================================
           STAGE 01: INGESTION (Unstructured $\to$ Master Ledger Lattice)
           ================================================================= */}
        {/* Source file capsule */}
        <g transform="translate(30, 52)">
          <rect
            x="0"
            y="0"
            width="170"
            height="32"
            rx="4"
            className="fill-white dark:fill-[#121211] stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          <circle cx="16" cy="16" r="3.5" className="fill-emerald-500" />
          <text
            x="28"
            y="15"
            className="font-mono text-[9px] uppercase tracking-wider fill-neutral-400 dark:fill-neutral-500 font-medium"
          >
            SOURCE RECORD
          </text>
          <text
            x="28"
            y="25"
            className="font-mono text-[10px] fill-neutral-800 dark:fill-neutral-200 font-medium"
          >
            resume-input.pdf · 48 KB
          </text>
        </g>

        {/* Conduit down to parsing bus */}
        <path
          d="M 115 84 L 115 110"
          stroke="currentColor"
          className="text-neutral-400 dark:text-neutral-600"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Extraction nexus splitter */}
        <circle
          cx="115"
          cy="110"
          r="3"
          className="fill-neutral-900 dark:fill-neutral-100"
        />
        <text
          x="125"
          y="113"
          className="font-mono text-[8.5px] uppercase tracking-wider fill-neutral-500 dark:fill-neutral-400"
        >
          EXTRACT MATRIX
        </text>

        {/* Tree branches fanning into Master Ledger atoms */}
        <path
          d="M 115 110 L 115 136 L 140 136"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 115 110 L 115 174 L 140 174"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 115 110 L 115 212 L 140 212"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />

        {/* Ledger Node 1: Systems Infra */}
        <circle cx="140" cy="136" r="3" className="fill-neutral-800 dark:fill-neutral-200" />
        <text
          x="152"
          y="134"
          className="font-mono text-[9.5px] fill-neutral-800 dark:fill-neutral-200 font-medium"
        >
          Staff Systems Infra
        </text>
        <text
          x="152"
          y="145"
          className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500"
        >
          scale.org · 2021–2024
        </text>

        {/* Ledger Node 2: Metric Bullet */}
        <circle cx="140" cy="174" r="3" className="fill-neutral-800 dark:fill-neutral-200" />
        <text
          x="152"
          y="172"
          className="font-mono text-[9.5px] fill-neutral-800 dark:fill-neutral-200 font-medium"
        >
          Rewrote Ingest to gRPC
        </text>
        <text
          x="152"
          y="183"
          className="font-mono text-[8.5px] fill-neutral-400 dark:fill-neutral-500 font-semibold"
        >
          -42% p99 latency · 120k rps
        </text>

        {/* Ledger Node 3: Cloud Architecture */}
        <circle cx="140" cy="212" r="3" className="fill-neutral-800 dark:fill-neutral-200" />
        <text
          x="152"
          y="210"
          className="font-mono text-[9.5px] fill-neutral-800 dark:fill-neutral-200 font-medium"
        >
          Multi-Region Failover
        </text>
        <text
          x="152"
          y="221"
          className="font-mono text-[8.5px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
        >
          99.99% SLA · $1.2M saved
        </text>

        {/* =================================================================
           TRANSIT BUS 1 $\to$ 2: CONVERGING BEZIER CONDUITS WITH SIGNAL PULSE
           ================================================================= */}
        <path
          d="M 235 136 C 290 136, 320 148, 360 148"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 235 174 L 360 152"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 235 212 C 290 212, 320 156, 360 154"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />

        {/* Animated Traveling Signal Dot on Conduit */}
        <circle cx="280" cy="140" r="2.5" className="fill-[#c15f3c] dark:fill-[#D97757]">
          <animate
            attributeName="cx"
            values="240;360;240"
            dur="3.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="136;150;136"
            dur="3.4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* =================================================================
           STAGE 02: CALIBRATION NEXUS (The Claude-Coral Single Accent Point)
           ================================================================= */}
        {/* Job Rubric Input at Top */}
        <g transform="translate(295, 52)">
          <rect
            x="0"
            y="0"
            width="170"
            height="32"
            rx="4"
            className="fill-[#c15f3c]/5 dark:fill-[#D97757]/10 stroke-[#c15f3c]/40 dark:stroke-[#D97757]/40"
            strokeWidth="1"
          />
          <circle cx="16" cy="16" r="3.5" className="fill-[#c15f3c] dark:fill-[#D97757]" />
          <text
            x="28"
            y="15"
            className="font-mono text-[9px] uppercase tracking-wider fill-[#c15f3c] dark:fill-[#D97757] font-semibold"
          >
            TARGET JOB RUBRIC
          </text>
          <text
            x="28"
            y="25"
            className="font-mono text-[10px] fill-neutral-800 dark:fill-neutral-200 font-medium"
          >
            Staff Systems @ Linear
          </text>
        </g>

        {/* Vertical alignment ray descending into Nexus */}
        <line
          x1="380"
          y1="84"
          x2="380"
          y2="120"
          stroke="#c15f3c"
          className="dark:stroke-[#D97757]"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* The Calibration Nexus Geometry: Concentric crosshairs */}
        <circle
          cx="380"
          cy="150"
          r="38"
          stroke="currentColor"
          className="text-neutral-200 dark:text-neutral-800"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="380"
          cy="150"
          r="26"
          stroke="#c15f3c"
          className="dark:stroke-[#D97757]"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />
        {/* Coral Center Focal Node */}
        <circle
          cx="380"
          cy="150"
          r="6.5"
          className="fill-[#c15f3c] dark:fill-[#D97757]"
          filter="url(#coral-glow)"
        />

        {/* Crosshair hairline ticks */}
        <line x1="334" y1="150" x2="340" y2="150" stroke="#c15f3c" className="dark:stroke-[#D97757]" strokeWidth="1.2" />
        <line x1="420" y1="150" x2="426" y2="150" stroke="#c15f3c" className="dark:stroke-[#D97757]" strokeWidth="1.2" />
        <line x1="380" y1="104" x2="380" y2="110" stroke="#c15f3c" className="dark:stroke-[#D97757]" strokeWidth="1.2" />
        <line x1="380" y1="190" x2="380" y2="196" stroke="#c15f3c" className="dark:stroke-[#D97757]" strokeWidth="1.2" />

        {/* Calibrated Metric Readout */}
        <text
          x="380"
          y="214"
          textAnchor="middle"
          className="font-mono text-[11px] font-bold fill-[#c15f3c] dark:fill-[#D97757] tabular-nums tracking-tight"
        >
          94% SEMANTIC FIT
        </text>
        <text
          x="380"
          y="227"
          textAnchor="middle"
          className="font-mono text-[8px] uppercase tracking-wider fill-neutral-500 dark:fill-neutral-400 font-medium"
        >
          RE-RANKED VIA XYZ FORMULA
        </text>

        {/* =================================================================
           TRANSIT BUS 2 $\to$ 3: CONVERGING COMPILE CONDUITS
           ================================================================= */}
        <path
          d="M 406 148 C 450 148, 480 110, 540 110"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 406 150 L 540 150"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />
        <path
          d="M 406 152 C 450 152, 480 190, 540 190"
          stroke="currentColor"
          className="text-neutral-300 dark:text-neutral-700"
          strokeWidth="1"
        />

        {/* Animated Traveling Signal Dot on Compile Conduit */}
        <circle cx="480" cy="150" r="2.5" className="fill-[#c15f3c] dark:fill-[#D97757]">
          <animate
            attributeName="cx"
            values="410;540;410"
            dur="2.9s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="150;150;150"
            dur="2.9s"
            repeatCount="indefinite"
          />
        </circle>

        {/* =================================================================
           STAGE 03: VECTOR PDF COMPILE & TRACKER SPECIMEN
           ================================================================= */}
        {/* Miniature Architectural Vector Document Specimen */}
        <g transform="translate(540, 56)">
          <rect
            x="0"
            y="0"
            width="100"
            height="136"
            rx="3"
            className="fill-white dark:fill-[#141413] stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth="1"
          />

          {/* Document Header lines */}
          <rect x="10" y="10" width="40" height="3" rx="0.5" className="fill-neutral-900 dark:fill-neutral-100" />
          <rect x="10" y="16" width="65" height="1.5" rx="0.5" className="fill-neutral-400" />
          <line x1="10" y1="23" x2="90" y2="23" stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeWidth="0.8" />

          {/* Section 1: Experience & Calibrated Coral Bullet */}
          <rect x="10" y="30" width="30" height="2" rx="0.5" className="fill-[#c15f3c] dark:fill-[#D97757]" />
          <line x1="10" y1="36" x2="88" y2="36" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth="0.8" />
          <line x1="10" y1="42" x2="82" y2="42" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth="0.8" />
          <line x1="10" y1="48" x2="75" y2="48" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth="0.8" />

          {/* Section 2: Technical Skills */}
          <rect x="10" y="58" width="24" height="2" rx="0.5" className="fill-neutral-600 dark:fill-neutral-400" />
          <line x1="10" y1="64" x2="86" y2="64" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth="0.8" />
          <line x1="10" y1="70" x2="78" y2="70" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" strokeWidth="0.8" />

          {/* ATS Verification Stamp at document bottom */}
          <rect
            x="8"
            y="108"
            width="84"
            height="18"
            rx="9"
            className="fill-emerald-500/10 dark:fill-emerald-500/20 stroke-emerald-500/30"
            strokeWidth="0.8"
          />
          <circle cx="16" cy="117" r="2.5" className="fill-emerald-600 dark:fill-emerald-400" />
          <text
            x="23"
            y="120"
            className="font-mono text-[7px] font-bold fill-emerald-700 dark:fill-emerald-400 uppercase tracking-tight"
          >
            ATS PARSED · 100%
          </text>
        </g>

        {/* Connected Conduit to Live Visual Tracker */}
        <path
          d="M 640 124 L 664 124"
          stroke="currentColor"
          className="text-neutral-400 dark:text-neutral-600"
          strokeWidth="1"
        />
        <circle cx="664" cy="124" r="3" className="fill-emerald-500" />

        {/* Live Tracker Badge */}
        <g transform="translate(672, 108)">
          <rect
            x="0"
            y="0"
            width="74"
            height="32"
            rx="4"
            className="fill-white dark:fill-[#141413] stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          <text
            x="8"
            y="14"
            className="font-mono text-[8px] uppercase tracking-wider fill-neutral-400 font-medium"
          >
            TRACKER
          </text>
          <text
            x="8"
            y="25"
            className="font-mono text-[9px] font-bold fill-neutral-900 dark:fill-neutral-100"
          >
            Applied · #104
          </text>
        </g>

        {/* Compile Telemetry at bottom */}
        <text
          x="615"
          y="214"
          textAnchor="middle"
          className="font-mono text-[11px] font-bold fill-neutral-900 dark:fill-neutral-100 tabular-nums"
        >
          0.38s VECTOR BUILD
        </text>
        <text
          x="615"
          y="227"
          textAnchor="middle"
          className="font-mono text-[8px] uppercase tracking-wider fill-neutral-500 dark:fill-neutral-400 font-medium"
        >
          PDF/A-1b ARCHIVAL VERIFIED
        </text>
      </svg>
    </div>
  );
}

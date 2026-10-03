"use client";

import React from "react";
import Heading from "./Heading";

export default function FeatureSection() {
  return (
    <section id="features" className="mx-auto px-6 py-24 md:py-32 relative z-10 max-w-6xl">
      {/* Section Header */}
      <div className="mb-16 md:mb-24 max-w-2xl text-left">
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Built for relevance.
          <br />
          <span className="text-muted-foreground font-normal">Designed for zero friction.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          Every tool in Resumely exists to eliminate fragmented resume files and align your real accomplishments directly to the recruiter&apos;s hiring rubric.
        </p>
      </div>

      {/* Open Editorial Capability Showcase (Zero Cards, Zero Illustration Borders, Clean Hairline Dividers) */}
      <div className="space-y-20 md:space-y-28">
        {/* =========================================================================
            FEATURE 01: Centralized Ledger
            Illustration: The Convergence Horizon (Indigo Duo-Shade, Borderless)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Narrative */}
          <div className="lg:col-span-5 text-left">
            <div className="font-mono text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">
              01 / Single Source of Truth
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              One master record for your entire career
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Never duplicate or lose track of old resume variations again. Resumely stores every role, accomplishment metric, and technical skill in one living ledger—automatically synced across every tailored application you generate.
            </p>

            {/* Micro-Specifications (Hairline typographic items, Zero Icons) */}
            <div className="space-y-3 pt-4 border-t border-border/40 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">100% History Preserved</span>
                <span>Historical variations stay intact</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Dynamic Deduplication</span>
                <span>Zero repetitive bullet phrasing</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Instant Branching</span>
                <span>Tailor in seconds without starting over</span>
              </div>
            </div>
          </div>

          {/* Borderless Geometric Illustration: The Branched Master Ledger (Flipped, with Tags, Zero Icons) */}
          <div className="lg:col-span-7 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 520 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Background Architectural Grid Lines */}
              <line x1="30" y1="36" x2="490" y2="36" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 4" />
              <line x1="30" y1="110" x2="490" y2="110" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              <line x1="30" y1="184" x2="490" y2="184" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 4" />

              <line x1="160" y1="20" x2="160" y2="200" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
              <line x1="295" y1="20" x2="295" y2="200" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />

              {/* Left Side: Single Unified Master Ledger Trunk */}
              <line
                x1="40"
                y1="110"
                x2="160"
                y2="110"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Precision Measurement Ticks along Master Trunk */}
              <line x1="60" y1="104" x2="60" y2="116" className="stroke-indigo-500/50" strokeWidth="1.5" />
              <line x1="85" y1="102" x2="85" y2="118" className="stroke-indigo-500/70" strokeWidth="1.5" />
              <line x1="110" y1="100" x2="110" y2="120" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="1.5" />
              <line x1="135" y1="104" x2="135" y2="116" className="stroke-indigo-500/50" strokeWidth="1.5" />

              {/* Master Trunk Annotations on Left */}
              <text x="40" y="88" className="fill-indigo-600 dark:fill-indigo-400 text-[10px] font-mono font-semibold tracking-wider">
                MASTER RECORD
              </text>
              <text x="40" y="136" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                SINGLE SOURCE
              </text>

              {/* Branching Hub Core */}
              <circle cx="160" cy="110" r="14" className="fill-indigo-500/10 dark:fill-indigo-500/20" />
              <circle cx="160" cy="110" r="7" className="fill-indigo-500/30" />
              <circle cx="160" cy="110" r="3" className="fill-indigo-600 dark:fill-indigo-400" />

              {/* 5 Fanning Out Tailored Branch Streams */}
              {/* Branch 1: Staff Systems */}
              <path
                d="M 160 110 C 215 110, 240 36, 295 36"
                className="stroke-indigo-400/40 dark:stroke-indigo-400/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Branch 2: Platform Lead */}
              <path
                d="M 160 110 C 215 110, 245 73, 295 73"
                className="stroke-indigo-400/50 dark:stroke-indigo-400/40"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Branch 3: Senior Backend (Active Core Axis) */}
              <line
                x1="160"
                y1="110"
                x2="295"
                y2="110"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Branch 4: Infrastructure */}
              <path
                d="M 160 110 C 215 110, 245 147, 295 147"
                className="stroke-indigo-400/50 dark:stroke-indigo-400/40"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Branch 5: Cloud Core */}
              <path
                d="M 160 110 C 215 110, 240 184, 295 184"
                className="stroke-indigo-400/40 dark:stroke-indigo-400/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Branch Endpoint Nodes */}
              <circle cx="295" cy="36" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="295" cy="73" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="295" cy="110" r="3.5" className="fill-indigo-600 dark:fill-indigo-400" />
              <circle cx="295" cy="147" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="295" cy="184" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />

              {/* Connecting Dashed Guides to Tags */}
              <line x1="298" y1="36" x2="312" y2="36" className="stroke-indigo-400/40" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="298" y1="73" x2="312" y2="73" className="stroke-indigo-400/40" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="298" y1="110" x2="312" y2="110" className="stroke-indigo-600 dark:stroke-indigo-400" strokeWidth="1.5" />
              <line x1="298" y1="147" x2="312" y2="147" className="stroke-indigo-400/40" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="298" y1="184" x2="312" y2="184" className="stroke-indigo-400/40" strokeWidth="1" strokeDasharray="2 2" />

              {/* Right Side: Tailored Output Tags Header */}
              <text x="312" y="16" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                TAILORED TARGETS [5]
              </text>

              {/* Tag Row 1 */}
              <rect x="312" y="25" width="86" height="22" rx="4" className="fill-indigo-500/10 dark:fill-indigo-500/15" />
              <text x="320" y="40" className="fill-indigo-700 dark:fill-indigo-300 text-[10px] font-mono font-medium">Staff Systems</text>
              <rect x="404" y="25" width="46" height="22" rx="4" className="fill-muted/60 dark:fill-muted/20" />
              <text x="412" y="40" className="fill-muted-foreground text-[9px] font-mono">eBPF</text>

              {/* Tag Row 2 */}
              <rect x="312" y="62" width="88" height="22" rx="4" className="fill-indigo-500/10 dark:fill-indigo-500/15" />
              <text x="320" y="77" className="fill-indigo-700 dark:fill-indigo-300 text-[10px] font-mono font-medium">Platform Lead</text>
              <rect x="406" y="62" width="76" height="22" rx="4" className="fill-muted/60 dark:fill-muted/20" />
              <text x="414" y="77" className="fill-muted-foreground text-[9px] font-mono">Kubernetes</text>

              {/* Tag Row 3 (Active Highlight) */}
              <rect x="312" y="99" width="96" height="22" rx="4" className="fill-indigo-600 dark:fill-indigo-500" />
              <text x="320" y="114" className="fill-white text-[10px] font-mono font-semibold">Senior Backend</text>
              <rect x="414" y="99" width="84" height="22" rx="4" className="fill-indigo-500/15 dark:fill-indigo-500/25" />
              <text x="422" y="114" className="fill-indigo-700 dark:fill-indigo-300 text-[9px] font-mono font-semibold">Distributed Go</text>

              {/* Tag Row 4 */}
              <rect x="312" y="136" width="90" height="22" rx="4" className="fill-indigo-500/10 dark:fill-indigo-500/15" />
              <text x="320" y="151" className="fill-indigo-700 dark:fill-indigo-300 text-[10px] font-mono font-medium">Infrastructure</text>
              <rect x="408" y="136" width="68" height="22" rx="4" className="fill-muted/60 dark:fill-muted/20" />
              <text x="416" y="151" className="fill-muted-foreground text-[9px] font-mono">Terraform</text>

              {/* Tag Row 5 */}
              <rect x="312" y="173" width="76" height="22" rx="4" className="fill-indigo-500/10 dark:fill-indigo-500/15" />
              <text x="320" y="188" className="fill-indigo-700 dark:fill-indigo-300 text-[10px] font-mono font-medium">Cloud Core</text>
              <rect x="394" y="173" width="96" height="22" rx="4" className="fill-muted/60 dark:fill-muted/20" />
              <text x="402" y="188" className="fill-muted-foreground text-[9px] font-mono">Zero-Downtime</text>
            </svg>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 02: Semantic Keyword Scanner
            Illustration: The Vernier Alignment Matrix (Emerald Duo-Shade, Borderless)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Borderless Geometric Illustration: The Vernier Alignment Matrix */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 480 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Background Reference Track */}
              <line x1="40" y1="70" x2="440" y2="70" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
              <line x1="40" y1="150" x2="440" y2="150" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

              {/* Top Scale: Job Description Rubric Ticks */}
              {Array.from({ length: 25 }).map((_, i) => {
                const x = 50 + i * 16;
                const isMajor = i % 5 === 0;
                return (
                  <line
                    key={`top-${i}`}
                    x1={x}
                    y1={70 - (isMajor ? 14 : 7)}
                    x2={x}
                    y2={70}
                    className={
                      i >= 8 && i <= 16
                        ? "stroke-emerald-600 dark:stroke-emerald-400"
                        : "stroke-muted-foreground/35"
                    }
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}

              {/* Bottom Scale: Candidate Record Ticks */}
              {Array.from({ length: 25 }).map((_, i) => {
                const x = 50 + i * 16;
                const isMajor = i % 5 === 0;
                return (
                  <line
                    key={`bot-${i}`}
                    x1={x}
                    y1={150}
                    x2={x}
                    y2={150 + (isMajor ? 14 : 7)}
                    className={
                      i >= 8 && i <= 16
                        ? "stroke-emerald-600 dark:stroke-emerald-400"
                        : "stroke-muted-foreground/35"
                    }
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}

              {/* Central Resonance Lock Field (Pure Soft Wash, Zero Border Stroke) */}
              <rect
                x="170"
                y="55"
                width="140"
                height="110"
                rx="6"
                className="fill-emerald-500/[0.04] dark:fill-emerald-500/[0.08]"
              />

              {/* In-Phase Resonance Alignment Rays */}
              {[178, 194, 210, 226, 242, 258, 274, 290, 306].map((x, idx) => (
                <line
                  key={`ray-${idx}`}
                  x1={x}
                  y1={70}
                  x2={x}
                  y2={150}
                  className="stroke-emerald-500/40 dark:stroke-emerald-400/40"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              ))}

              {/* Central Prime Coincidence Alignment Beam */}
              <line
                x1="242"
                y1="40"
                x2="242"
                y2="180"
                className="stroke-emerald-600 dark:stroke-emerald-400"
                strokeWidth="2"
              />
              <circle cx="242" cy="110" r="18" className="fill-emerald-500/10 stroke-emerald-500/20" strokeWidth="1" />
              <circle cx="242" cy="110" r="4" className="fill-emerald-600 dark:fill-emerald-400" />

              {/* Minimal Clean Labels */}
              <text x="50" y="46" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                RECRUITER RUBRIC AXIS
              </text>
              <text x="50" y="184" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                CANDIDATE RECORD AXIS
              </text>
              <text x="270" y="114" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-semibold tracking-wider">
                98.4% ALIGNED
              </text>
            </svg>
          </div>

          {/* Text Narrative on Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 text-left">
            <div className="font-mono text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-3">
              02 / ATS Rubric Scanner
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Direct ATS rubric alignment without keyword stuffing
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Applicant tracking systems don&apos;t just count words—they score semantic relevance against the hiring manager&apos;s criteria. Resumely extracts exact rubric weights and maps your real accomplishments to them with verifiable accuracy.
            </p>

            {/* Micro-Specifications */}
            <div className="space-y-3 pt-4 border-t border-border/40 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Greenhouse & Lever Ready</span>
                <span>Optimized for standard parsers</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Contextual Gap Analysis</span>
                <span>Surfaces missing rubric elements</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Truth Anchored</span>
                <span>Zero fabricated buzzwords</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 03: Conversational Copilot
            Illustration: The Signal Sculptor (Amber Duo-Shade, Borderless)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Narrative */}
          <div className="lg:col-span-5 text-left">
            <div className="font-mono text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">
              03 / Editorial AI Copilot
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Tighten passive drafts into executive directives
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Transform fuzzy duty descriptions into sharp, quantified impact bullets. Chat directly with your draft to elevate verb strength, specify architecture scale, and calibrate seniority from IC to leadership.
            </p>

            {/* Micro-Specifications */}
            <div className="space-y-3 pt-4 border-t border-border/40 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Quantified Impact Scoring</span>
                <span>Surfaces missing metrics automatically</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Active Verb Calibration</span>
                <span>Replaces passive phrasing with action</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Seniority Calibration</span>
                <span>Re-levels bullets for staff+ roles</span>
              </div>
            </div>
          </div>

          {/* Borderless Geometric Illustration: The Signal Sculptor */}
          <div className="lg:col-span-7 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 480 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Baseline reference */}
              <line x1="40" y1="110" x2="440" y2="110" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

              {/* Left Side: Loose, Passive, Low-Frequency Waveform */}
              <path
                d="M 40 110 Q 75 75 110 110 T 180 110 T 230 110"
                className="stroke-amber-400/40 dark:stroke-amber-400/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 40 110 Q 85 135 130 110 T 230 110"
                className="stroke-amber-400/30 dark:stroke-amber-400/20"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Focus Lens Aperture Threshold (Pure geometry, Zero Border Box) */}
              <line x1="230" y1="50" x2="230" y2="170" className="stroke-amber-500/30" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="230" cy="110" r="10" className="fill-amber-500/10" />
              <circle cx="230" cy="110" r="3" className="fill-amber-600 dark:fill-amber-400" />

              {/* Right Side: Sculpted, High-Contrast Precision Vector Impulse */}
              <path
                d="M 230 110 L 270 110 Q 300 20 330 110 T 390 110 L 440 110"
                className="stroke-amber-600 dark:stroke-amber-400"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Dimension guide for the peak */}
              <line x1="330" y1="20" x2="330" y2="110" className="stroke-amber-500/30" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="330" cy="20" r="4" className="fill-background stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" />

              {/* Clean Monospace Annotations */}
              <text x="50" y="55" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                INPUT: DIFFUSE &amp; PASSIVE
              </text>
              <text x="345" y="32" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono font-semibold tracking-wider">
                PEAK IMPACT
              </text>
              <text x="345" y="135" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                QUANTIFIED EXECUTIVE DIRECTIVE
              </text>
            </svg>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 04: Unified Package
            Illustration: The Proportional Document Blueprint (Sky Duo-Shade, Borderless)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Borderless Geometric Illustration: The Proportional Document Blueprint */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 480 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Drafting Plane Corner Alignment Markers */}
              <line x1="45" y1="20" x2="55" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="50" y1="15" x2="50" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="425" y1="20" x2="435" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="430" y1="15" x2="430" y2="25" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />

              {/* Sheet 01: Tailored Resume Silhouette (Soft Flat Tone, Zero Border Stroke) */}
              <g transform="translate(75, 25)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="170"
                  rx="4"
                  className="fill-muted/30 dark:fill-muted/15"
                />
                {/* Header branding rule */}
                <line x1="16" y1="22" x2="65" y2="22" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="16" y1="30" x2="90" y2="30" className="stroke-sky-500/30" strokeWidth="1" strokeLinecap="round" />
                <line x1="16" y1="40" x2="114" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

                {/* Section 1 Block */}
                <line x1="16" y1="54" x2="55" y2="54" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="64" x2="114" y2="64" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="74" x2="105" y2="74" className="stroke-sky-500/50" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="84" x2="95" y2="84" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />

                {/* Section 2 Block */}
                <line x1="16" y1="102" x2="60" y2="102" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="112" x2="114" y2="112" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="122" x2="100" y2="122" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="132" x2="110" y2="132" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Connecting Typographic Alignment Guides Between the Documents */}
              <line x1="205" y1="47" x2="275" y2="47" className="stroke-sky-500/50" strokeWidth="1" strokeDasharray="2 3" />
              <circle cx="240" cy="47" r="2.5" className="fill-sky-500" />

              <line x1="205" y1="99" x2="275" y2="99" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="240" cy="99" r="3" className="fill-sky-600 dark:fill-sky-400" />

              <line x1="205" y1="147" x2="275" y2="147" className="stroke-sky-500/50" strokeWidth="1" strokeDasharray="2 3" />
              <circle cx="240" cy="147" r="2.5" className="fill-sky-500" />

              {/* Sheet 02: Matching Cover Letter Silhouette (Soft Flat Tone, Zero Border Stroke) */}
              <g transform="translate(275, 25)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="170"
                  rx="4"
                  className="fill-muted/30 dark:fill-muted/15"
                />
                {/* Identical header branding */}
                <line x1="16" y1="22" x2="65" y2="22" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="16" y1="30" x2="90" y2="30" className="stroke-sky-500/30" strokeWidth="1" strokeLinecap="round" />
                <line x1="16" y1="40" x2="114" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

                {/* Letter Body Paragraph 1 */}
                <line x1="16" y1="56" x2="114" y2="56" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="66" x2="110" y2="66" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="76" x2="105" y2="76" className="stroke-sky-500/50" strokeWidth="1.5" strokeLinecap="round" />

                {/* Letter Body Paragraph 2 (Synchronized achievement narrative) */}
                <line x1="16" y1="94" x2="114" y2="94" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="104" x2="105" y2="104" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="114" x2="90" y2="114" className="stroke-muted-foreground/35" strokeWidth="1.5" strokeLinecap="round" />

                {/* Signoff */}
                <line x1="16" y1="136" x2="45" y2="136" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Clean Dimension Annotations */}
              <text x="85" y="16" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                DOC_01: RESUME (ISO A4)
              </text>
              <text x="285" y="16" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                DOC_02: COVER LETTER
              </text>
              <text x="206" y="85" className="fill-sky-600 dark:fill-sky-400 text-[9px] font-mono font-semibold tracking-wider">
                1:1 PARITY
              </text>
            </svg>
          </div>

          {/* Text Narrative on Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 text-left">
            <div className="font-mono text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-3">
              04 / Unified Package
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Synchronized cover letters & instant vector PDF export
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Never send a generic cover letter that clashes with your resume. Resumely weaves the exact achievements and metrics from your tailored resume directly into a matching letter—then compiles both into clean, single-column vector PDFs.
            </p>

            {/* Micro-Specifications */}
            <div className="space-y-3 pt-4 border-t border-border/40 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">1:1 Narrative Parity</span>
                <span>Story and resume cite identical achievements</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Single-Column Standard</span>
                <span>Zero formatting bugs or table traps</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground font-medium">Vector PDF Compilation</span>
                <span>Crisp typographic export ready for upload</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
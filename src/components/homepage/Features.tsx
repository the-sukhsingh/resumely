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

      {/* Open Editorial Capability Showcase (Zero Cards, Clean Hairline Rows) */}
      <div className="space-y-20 md:space-y-28">
        {/* =========================================================================
            FEATURE 01: Centralized Ledger
            Illustration: The Convergence Horizon (Indigo Duo-Shade)
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

          {/* Minimalist Geometric Illustration: The Convergence Horizon (Zero Icons) */}
          <div className="lg:col-span-7 rounded-2xl bg-indigo-500/[0.02] dark:bg-indigo-500/[0.04] border border-indigo-500/15 p-6 sm:p-8 flex items-center justify-center">
            <svg
              viewBox="0 0 480 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Background Architectural Grid Lines */}
              <line x1="40" y1="30" x2="440" y2="30" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="3 4" />
              <line x1="40" y1="110" x2="440" y2="110" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
              <line x1="40" y1="190" x2="440" y2="190" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="3 4" />

              <line x1="80" y1="20" x2="80" y2="200" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
              <line x1="240" y1="20" x2="240" y2="200" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
              <line x1="360" y1="20" x2="360" y2="200" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />

              {/* Stream 1: Top Branch */}
              <path
                d="M 50 40 C 150 40, 200 110, 300 110"
                className="stroke-indigo-400/40 dark:stroke-indigo-400/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Stream 2: Upper Mid */}
              <path
                d="M 50 75 C 160 75, 210 110, 300 110"
                className="stroke-indigo-400/50 dark:stroke-indigo-400/40"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Stream 3: Center Direct Axis */}
              <line
                x1="50"
                y1="110"
                x2="300"
                y2="110"
                className="stroke-indigo-500/60 dark:stroke-indigo-400/60"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Stream 4: Lower Mid */}
              <path
                d="M 50 145 C 160 145, 210 110, 300 110"
                className="stroke-indigo-400/50 dark:stroke-indigo-400/40"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Stream 5: Bottom Branch */}
              <path
                d="M 50 180 C 150 180, 200 110, 300 110"
                className="stroke-indigo-400/40 dark:stroke-indigo-400/30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Input Nodes along Left Coordinates */}
              <circle cx="50" cy="40" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="50" cy="75" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="50" cy="110" r="3.5" className="fill-background stroke-indigo-500" strokeWidth="2" />
              <circle cx="50" cy="145" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />
              <circle cx="50" cy="180" r="3" className="fill-background stroke-indigo-400" strokeWidth="1.5" />

              {/* Harmonic Convergence Core */}
              <circle cx="300" cy="110" r="14" className="fill-indigo-500/10 dark:fill-indigo-500/20" />
              <circle cx="300" cy="110" r="7" className="fill-indigo-500/30" />
              <circle cx="300" cy="110" r="3" className="fill-indigo-600 dark:fill-indigo-400" />

              {/* Unified Durable Horizon Trunk */}
              <line
                x1="300"
                y1="110"
                x2="430"
                y2="110"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Architectural Ticks on Unified Trunk */}
              <line x1="330" y1="104" x2="330" y2="116" className="stroke-indigo-500/50" strokeWidth="1.5" />
              <line x1="360" y1="102" x2="360" y2="118" className="stroke-indigo-500/70" strokeWidth="1.5" />
              <line x1="390" y1="104" x2="390" y2="116" className="stroke-indigo-500/50" strokeWidth="1.5" />
              <line x1="420" y1="106" x2="420" y2="114" className="stroke-indigo-500/40" strokeWidth="1.5" />

              {/* Clean Typography Annotations */}
              <text x="50" y="22" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                DISTRIBUTED CAREER INPUTS [5]
              </text>
              <text x="315" y="95" className="fill-indigo-600 dark:fill-indigo-400 text-[10px] font-mono font-semibold tracking-wider">
                UNIFIED BASELINE
              </text>
            </svg>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 02: Semantic Keyword Scanner
            Illustration: The Vernier Alignment Matrix (Emerald Duo-Shade)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Minimalist Geometric Illustration: The Vernier Alignment Matrix */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] border border-emerald-500/15 p-6 sm:p-8 flex items-center justify-center">
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

              {/* Central Resonance Lock Field */}
              <rect
                x="170"
                y="55"
                width="140"
                height="110"
                rx="6"
                className="fill-emerald-500/[0.04] dark:fill-emerald-500/[0.08] stroke-emerald-500/25"
                strokeWidth="1"
                strokeDasharray="4 4"
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
              <circle cx="242" cy="110" r="18" className="stroke-emerald-500/30 fill-emerald-500/10" strokeWidth="1" />
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
            Illustration: The Signal Sculptor (Amber Duo-Shade)
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

          {/* Minimalist Geometric Illustration: The Signal Sculptor */}
          <div className="lg:col-span-7 rounded-2xl bg-amber-500/[0.02] dark:bg-amber-500/[0.04] border border-amber-500/15 p-6 sm:p-8 flex items-center justify-center">
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

              {/* Focus Lens Aperture Threshold */}
              <line x1="230" y1="50" x2="230" y2="170" className="stroke-amber-500/30" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="224" y="98" width="12" height="24" rx="3" className="fill-amber-500/15 stroke-amber-500/40" strokeWidth="1" />
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
            Illustration: The Proportional Document Blueprint (Sky Duo-Shade)
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Minimalist Geometric Illustration: The Proportional Document Blueprint */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-sky-500/[0.02] dark:bg-sky-500/[0.04] border border-sky-500/15 p-6 sm:p-8 flex items-center justify-center">
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

              {/* Sheet 01: Tailored Resume Silhouette (1 : √2 Proportions) */}
              <g transform="translate(75, 25)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="170"
                  rx="4"
                  className="fill-background stroke-sky-500/35"
                  strokeWidth="1.5"
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

              {/* Sheet 02: Matching Cover Letter Silhouette */}
              <g transform="translate(275, 25)">
                <rect
                  x="0"
                  y="0"
                  width="130"
                  height="170"
                  rx="4"
                  className="fill-background stroke-sky-500/35"
                  strokeWidth="1.5"
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
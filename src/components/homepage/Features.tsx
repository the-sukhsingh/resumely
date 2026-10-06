"use client";

import React from "react";
import Heading from "./Heading";
import HairlineLedger from "./HairlineLedger";
import HairlineComparator from "./HairlineComparator";
import HairlinePipeline from "./HairlinePipeline";

export default function FeatureSection() {

  return (
    <section id="features" className="mx-auto px-6 pt-32 pb-24 relative z-10 max-w-6xl">
      {/* Section Header */}
      <div className="mt-12 mb-8 max-w-2xl text-left">
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
      <div className="space-y-6">
        {/* =========================================================================
            FEATURE 01: Centralized Ledger
            Illustration: Animated Dynamic Master Ledger & Branching Targets (Fixed Padding)
           ========================================================================= */}
        <div className="pt-12 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">100% History Preserved</span>
                <span>Historical variations stay intact</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Dynamic Deduplication</span>
                <span>Zero repetitive bullet phrasing</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Instant Branching</span>
                <span>Tailor in seconds without starting over</span>
              </div>
            </div>
          </div>

          {/* Borderless Hairline Illustration: Master Resume Powering Variants */}
          <div className="lg:col-span-7 flex items-center justify-center py-2">
            <HairlineLedger />
          </div>
        </div>

        {/* =========================================================================
            FEATURE 02: Semantic Keyword Scanner
            Illustration: Redesigned Dynamic Rubric Alignment Matrix & Sweep Scanner
           ========================================================================= */}
        <div className="pt-12 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Borderless Hairline Illustration: ATS Rubric Comparator Bench */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex items-center justify-center py-2">
            <HairlineComparator />
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Greenhouse & Lever Ready</span>
                <span>Optimized for standard parsers</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Contextual Gap Analysis</span>
                <span>Surfaces missing rubric elements</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Truth Anchored</span>
                <span>Zero fabricated buzzwords</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 03: Job Application Pipeline Tracking
            Illustration: Real-time Application State Machine & Lifecycle Telemetry
           ========================================================================= */}
        <div className="pt-12 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Narrative */}
          <div className="lg:col-span-5 text-left">
            <div className="font-mono text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3">
              03 / Application Lifecycle Tracker
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              Track every application from submission to signed offer
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Never wonder which resume variant you sent or when to follow up. Resumely tracks your entire pipeline with linked tailored versions, real-time interview stage progression, and proactive response timelines.
            </p>

            {/* Micro-Specifications */}
            <div className="space-y-3 pt-4 border-t border-border/40 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Version-Linked Records</span>
                <span>Exact tailored PDF preserved per application</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">5-Stage Pipeline Tracking</span>
                <span>Applied · Screen · Technical · Onsite · Offer</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Proactive Follow-up SLAs</span>
                <span>Automated prompts before recruiter ghosting</span>
              </div>
            </div>
          </div>

          {/* Borderless Hairline Illustration: Lifecycle Stage Machine */}
          <div className="lg:col-span-7 flex items-center justify-center py-2">
            <HairlinePipeline />
          </div>
        </div>

        {/* =========================================================================
            FEATURE 04: Unified Package
            Illustration: The Proportional Document Blueprint (Sky Duo-Shade, Borderless)
           ========================================================================= */}
        <div className="pt-12 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
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

              {/* Connecting Typographic Alignment Guides Between the Documents (Flowing Dash Marquee) */}
              <line x1="205" y1="47" x2="275" y2="47" className="stroke-sky-500/50" strokeWidth="1" strokeDasharray="3 3">
                <animate attributeName="stroke-dashoffset" values="0;-12" dur="2.4s" repeatCount="indefinite" />
              </line>
              <circle cx="240" cy="47" r="2.5" className="fill-sky-500" />

              <line x1="205" y1="99" x2="275" y2="99" className="stroke-sky-600 dark:stroke-sky-400" strokeWidth="1.5" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="2s" repeatCount="indefinite" />
              </line>
              <circle cx="240" cy="99" r="3" className="fill-sky-600 dark:fill-sky-400" />

              <line x1="205" y1="147" x2="275" y2="147" className="stroke-sky-500/50" strokeWidth="1" strokeDasharray="3 3">
                <animate attributeName="stroke-dashoffset" values="0;-12" dur="2.4s" repeatCount="indefinite" />
              </line>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">1:1 Narrative Parity</span>
                <span>Story and resume cite identical achievements</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
                <span className="text-foreground font-medium">Single-Column Standard</span>
                <span>Zero formatting bugs or table traps</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-muted-foreground">
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
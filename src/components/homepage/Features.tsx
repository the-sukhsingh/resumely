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
            Layout: Text Left (5 cols) | Visual Right (7 cols) - Indigo Duo-Shade
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

          {/* Visual Workspace (Open Duo-Shade Stage, NOT a Card) */}
          <div className="lg:col-span-7 rounded-2xl bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] border border-indigo-500/20 p-6 sm:p-8 relative overflow-hidden">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-indigo-500/15 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-indigo-500" />
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  CAREER_LEDGER_V4.2
                </span>
              </div>
              <span className="text-muted-foreground text-[11px]">
                48 Accomplishments Indexed
              </span>
            </div>

            {/* Split Visual Layout: Timeline Feed + Master Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
              {/* Left Column: Historical Experience Stream */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80 font-semibold">
                  Input Stream
                </div>

                <div className="p-3.5 rounded-xl bg-background/80 border border-indigo-500/15 shadow-xs">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-foreground">HyperScale Cloud</span>
                    <span className="font-mono text-[10px] text-muted-foreground">2021–2023</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Senior Backend Engineer
                  </div>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                      Go
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                      Kafka
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                      +14 metrics
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background border border-indigo-500/30 shadow-xs ring-1 ring-indigo-500/20">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-foreground">Vanguard Systems</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      Current
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Staff Infrastructure Architect
                  </div>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-medium">
                      Kubernetes
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-medium">
                      eBPF
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-medium">
                      Terraform
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Synchronized Master Node */}
              <div className="flex flex-col justify-between p-4 rounded-xl bg-background border border-indigo-500/25 shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/60">
                    <span className="text-[11px] font-mono font-bold text-foreground">
                      Master Sync Target
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Synced
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] border border-indigo-500/15">
                      <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                        P99 OPTIMIZATION • VERIFIED
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                        Architected multi-region mesh handling 450M queries/day with 99.99% uptime.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-background border border-border/70">
                      <div className="text-[10px] font-mono text-muted-foreground mb-1">
                        CLOUD EFFICIENCY • VERIFIED
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Automated compute topology, reducing annual cloud spend by 34% ($1.2M).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Confidence: 100%</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">Auto-Mapped</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 02: Semantic Keyword Scanner
            Layout: Visual Left (7 cols) | Text Right (5 cols) - Emerald Duo-Shade
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Workspace on Left */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] border border-emerald-500/20 p-6 sm:p-8 relative overflow-hidden">
            {/* Top Rubric Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-500/15">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                  ATS Rubric Benchmark
                </div>
                <div className="text-sm font-bold text-foreground">
                  Senior Staff Infrastructure Rubric
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                  98.4%
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  Recruiter Match Score
                </div>
              </div>
            </div>

            {/* Radar Wave Graphic (Pure SVG Geometry, Zero Icons) */}
            <div className="py-2 mb-6 flex justify-center">
              <svg viewBox="0 0 320 80" fill="none" className="w-full max-w-sm h-16">
                <ellipse cx="160" cy="40" rx="140" ry="32" className="stroke-emerald-500/15" strokeWidth="1" strokeDasharray="3 3" />
                <ellipse cx="160" cy="40" rx="95" ry="22" className="stroke-emerald-500/25" strokeWidth="1" />
                <ellipse cx="160" cy="40" rx="50" ry="12" className="stroke-emerald-500/40" strokeWidth="1.5" />
                <ellipse cx="160" cy="40" rx="14" ry="5" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />

                <line x1="20" y1="40" x2="300" y2="40" className="stroke-emerald-500/20" strokeWidth="1" />
                <line x1="160" y1="8" x2="160" y2="72" className="stroke-emerald-500/20" strokeWidth="1" />

                <circle cx="115" cy="32" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
                <circle cx="210" cy="28" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
                <circle cx="180" cy="52" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
              </svg>
            </div>

            {/* Competency Alignment Rows */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-background/90 border border-emerald-500/25 flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-foreground">
                  Distributed Systems & Data Mesh
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                  100% Match
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background/90 border border-emerald-500/25 flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-foreground">
                  Kubernetes Multi-Cluster Mesh
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                  100% Match
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background/60 border border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">
                  Terraform & Infrastructure as Code
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold shrink-0">
                  96% Match
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-mono text-emerald-700/80 dark:text-emerald-300/80">
              <span>0 Missing Core Competencies</span>
              <span>100% ATS Safe</span>
            </div>
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
            Layout: Text Left (5 cols) | Visual Right (7 cols) - Amber Duo-Shade
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

          {/* Visual Workspace on Right (Amber Duo-Shade) */}
          <div className="lg:col-span-7 rounded-2xl bg-amber-500/[0.03] dark:bg-amber-500/[0.06] border border-amber-500/20 p-6 sm:p-8 relative overflow-hidden">
            {/* Top Inspector Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/15 font-mono text-xs">
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                Impact Precision Studio
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Active Diff
              </span>
            </div>

            {/* Transformation Diff Stage */}
            <div className="space-y-3.5">
              {/* Original Draft (Passive, Unquantified) */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-1.5">
                  Original Draft
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-amber-500/15 font-mono text-xs text-muted-foreground/70 line-through decoration-amber-500/40 leading-relaxed">
                  Worked on backend APIs and helped improve database performance.
                </div>
              </div>

              {/* Transformation Conduit */}
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                <span>DIRECTIVE CALIBRATION</span>
                <span>+36 Impact Score</span>
              </div>

              {/* Refined Directive (Active Voice, Quantified) */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-1.5">
                  Refined Directive
                </div>
                <div className="p-3.5 rounded-xl bg-background border border-amber-500/35 shadow-xs font-mono text-xs text-foreground leading-relaxed">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    Engineered
                  </span>{" "}
                  distributed caching layer, reducing P99 latency by{" "}
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                    38%
                  </span>{" "}
                  under 450M daily queries.
                </div>
              </div>
            </div>

            {/* Calibration Slider Gauge */}
            <div className="mt-5 pt-3 border-t border-amber-500/15 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>PASSIVE TASK</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">EXECUTIVE DIRECTIVE</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-amber-500/15 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 04: Unified Package
            Layout: Visual Left (7 cols) | Text Right (5 cols) - Sky Duo-Shade
           ========================================================================= */}
        <div className="pt-12 md:pt-16 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Visual Workspace on Left (Sky Duo-Shade) */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-sky-500/[0.03] dark:bg-sky-500/[0.06] border border-sky-500/20 p-6 sm:p-8 relative overflow-hidden">
            {/* Top Blueprint Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-500/15 font-mono text-xs">
              <span className="text-[11px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
                Twin Document Alignment System
              </span>
              <span className="text-muted-foreground text-[11px]">
                1:1 Typographic Parity
              </span>
            </div>

            {/* Side-by-Side Document Leaves */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Document Leaf 1: Resume */}
              <div className="p-4 rounded-xl bg-background border border-sky-500/30 shadow-xs">
                <div className="pb-2 mb-3 border-b border-border/70 flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-xs text-foreground">
                      ALEX R. CHEN
                    </div>
                    <div className="text-[9px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                      STAFF INFRASTRUCTURE
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    RESUME_A4
                  </span>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="font-mono text-muted-foreground uppercase text-[9px] font-semibold">
                    Core Impact
                  </div>
                  <div className="p-2 rounded bg-sky-500/[0.05] border border-sky-500/15 text-foreground leading-relaxed">
                    Scaled global data mesh across 4 continents, sustaining{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-400 underline decoration-sky-500/40">
                      450M queries/day
                    </span>{" "}
                    at P99 &lt; 14ms.
                  </div>
                  <div className="p-2 rounded bg-background border border-border/80 text-muted-foreground leading-relaxed">
                    Directed 14-engineer team migrating 280 microservices to unified clusters.
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>ATS Margins</span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">Single Column</span>
                </div>
              </div>

              {/* Document Leaf 2: Cover Letter */}
              <div className="p-4 rounded-xl bg-background border border-sky-500/30 shadow-xs">
                <div className="pb-2 mb-3 border-b border-border/70 flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-xs text-foreground">
                      ALEX R. CHEN
                    </div>
                    <div className="text-[9px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                      COVER LETTER RE: LEAD
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    LETTER_A4
                  </span>
                </div>

                <div className="space-y-2 text-[10px] leading-relaxed">
                  <p className="text-muted-foreground text-[9px]">
                    Dear Hiring Committee,
                  </p>
                  <div className="p-2 rounded bg-sky-500/[0.05] border border-sky-500/15 text-foreground">
                    In my recent work, I focused directly on high-throughput reliability, having{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-400 underline decoration-sky-500/40">
                      scaled global data mesh across 4 continents to 450M queries/day
                    </span>
                    —the exact distributed throughput targets outlined in your role specifications.
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>Narrative Match</span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">100% Cohesion</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Rule */}
            <div className="mt-5 pt-3 border-t border-sky-500/15 flex items-center justify-between text-xs font-mono text-sky-700/80 dark:text-sky-300/80">
              <span>Standardized Vector PDF Pipeline</span>
              <span>Zero Style Drift</span>
            </div>
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
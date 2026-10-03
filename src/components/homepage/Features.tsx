"use client";

import React from "react";
import Heading from "./Heading";

export default function FeatureSection() {
  return (
    <section id="features" className="mx-auto px-6 py-24 md:py-32 relative z-10 max-w-6xl">
      {/* Header */}
      <div className="mb-14 md:mb-20 max-w-2xl text-left">
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Built for relevance.
          <br />
          <span className="text-muted-foreground font-normal">Designed for zero friction.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          Every tool in Resumely exists to eliminate fragmented resume files and align your real accomplishments directly to the recruiter&apos;s hiring rubric.
        </p>
      </div>

      {/* Bento Grid: 4-2 / 2-4 Asymmetric Rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-stretch">
        {/* =========================================================================
            BENTO CARD 1: Master Experience Ledger (Span 4) - Indigo Duo-Shade
            Illustration: Living Career Archive & Layered Version Stack
           ========================================================================= */}
        <div className="lg:col-span-4 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                01 • Centralized Ledger
              </span>
              <span className="text-xs font-mono text-muted-foreground/60">
                Single Source of Truth
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              One master record for your entire career
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Never duplicate or lose track of old resume variations again. Maintain a single living record of every role, metric, and skill—automatically synchronized across every subsequent tailored application.
            </p>
          </div>

          {/* Duo-Shade Illustration: Multi-Layered Career Stream & Active Profile Card (Zero Icons) */}
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.04] to-indigo-500/[0.01] dark:from-indigo-500/[0.08] dark:to-indigo-500/[0.02] p-5 sm:p-7 relative overflow-hidden">
            {/* Ambient Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Historical Career Branches (Staggered Stack) */}
              <div className="md:col-span-5 space-y-2.5">
                <div className="text-[11px] font-mono tracking-wider text-indigo-600/70 dark:text-indigo-400/70 uppercase font-semibold">
                  Source Milestones
                </div>

                {/* Branch Card 1 (Founding Role) */}
                <div className="p-3 rounded-xl border border-indigo-500/15 bg-background/60 backdrop-blur-xs transition-transform duration-200 hover:translate-x-1">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-foreground">HyperScale Cloud</span>
                    <span className="font-mono text-muted-foreground text-[10px]">2021 — 2023</span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    Senior Backend Engineer • Distributed Queue
                  </div>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                      Go
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                      Kafka
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                      +14 bullets
                    </span>
                  </div>
                </div>

                {/* Branch Card 2 (Core Current Role) */}
                <div className="p-3 rounded-xl border border-indigo-500/30 bg-background/90 shadow-xs relative ring-1 ring-indigo-500/20">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-foreground">Vanguard Systems</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      Current
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
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

                {/* Branch Card 3 (Advisory / Open Source) */}
                <div className="p-2.5 rounded-xl border border-indigo-500/10 bg-background/40 opacity-75">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground">Open Source Core</span>
                    <span className="font-mono text-muted-foreground text-[10px]">2019 — Present</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Maintainer • 8.4k Stars
                  </div>
                </div>
              </div>

              {/* Center Conduit: SVG Data Streams Converging into Trunk */}
              <div className="hidden md:block md:col-span-2 h-full py-4">
                <svg viewBox="0 0 80 200" fill="none" className="w-full h-full">
                  {/* Subtle stream guide paths */}
                  <path
                    d="M 5 35 C 45 35 45 100 75 100"
                    className="stroke-indigo-400/30 dark:stroke-indigo-400/20"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 5 100 L 75 100"
                    className="stroke-indigo-600 dark:stroke-indigo-400"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 5 165 C 45 165 45 100 75 100"
                    className="stroke-indigo-400/30 dark:stroke-indigo-400/20"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Convergence node */}
                  <circle cx="75" cy="100" r="5" className="fill-indigo-600 dark:fill-indigo-400" />
                  <circle cx="75" cy="100" r="10" className="stroke-indigo-500/30 fill-indigo-500/10" strokeWidth="1" />
                </svg>
              </div>

              {/* Right Column: Master Profile Synced Output Card */}
              <div className="md:col-span-5 rounded-2xl border border-indigo-500/35 bg-background p-4 sm:p-5 shadow-sm ring-1 ring-indigo-500/20">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/15">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                      Master Sync Node
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      Unified Profile Ledger
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Synced
                  </span>
                </div>

                {/* Live Accomplishment Bullets */}
                <div className="mt-3.5 space-y-2.5">
                  <div className="p-2.5 rounded-lg bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] border border-indigo-500/15">
                    <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                      <span>METRIC VERIFIED</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">100% CONFIDENCE</span>
                    </div>
                    <p className="text-xs text-foreground/90 mt-1 font-medium leading-relaxed">
                      Architected multi-region Kubernetes mesh handling 450M queries/day with 99.99% availability.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-background border border-border/80">
                    <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                      <span>FINANCIAL IMPACT</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">$1.2M SAVINGS</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Optimized compute topology, slashing cloud infrastructure costs by 34% annually.
                    </p>
                  </div>
                </div>

                {/* Synced Inventory Footer */}
                <div className="mt-3 pt-2.5 border-t border-indigo-500/15 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Inventory: 48 bullets</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">Ready to tailor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 2: Semantic Keyword Scanner (Span 2) - Sage/Emerald Duo-Shade
            Illustration: Precision Rubric Resonance Scope & Skill Spectrum
           ========================================================================= */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                02 • Keyword Scanner
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Direct ATS rubric alignment
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Extracts explicit requirements from target job posts and surfaces keyword gaps against your real experience—without artificial keyword stuffing.
            </p>
          </div>

          {/* Duo-Shade Rubric Resonance Radar & Match Chips (Zero Icons) */}
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.04] to-emerald-500/[0.01] dark:from-emerald-500/[0.08] dark:to-emerald-500/[0.02] p-5 relative overflow-hidden">
            {/* Top Radar / Alignment Metric Block */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                  ATS Rubric Scanner
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Greenhouse / Lever Model
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
                  98.4%
                </div>
                <div className="text-[10px] font-mono text-emerald-700/70 dark:text-emerald-300/70">
                  Rubric Fit
                </div>
              </div>
            </div>

            {/* Precision Resonance Visualizer: Concentric Scanner Wave */}
            <div className="my-4 py-2 relative flex items-center justify-center">
              <svg viewBox="0 0 240 70" fill="none" className="w-full h-16">
                {/* Concentric radar rings */}
                <ellipse cx="120" cy="35" rx="100" ry="28" className="stroke-emerald-500/15" strokeWidth="1" strokeDasharray="3 3" />
                <ellipse cx="120" cy="35" rx="70" ry="20" className="stroke-emerald-500/25" strokeWidth="1" />
                <ellipse cx="120" cy="35" rx="40" ry="12" className="stroke-emerald-500/40" strokeWidth="1.5" />
                <ellipse cx="120" cy="35" rx="12" ry="5" className="fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="1.5" />

                {/* Sweep axis lines */}
                <line x1="20" y1="35" x2="220" y2="35" className="stroke-emerald-500/20" strokeWidth="1" />
                <line x1="120" y1="7" x2="120" y2="63" className="stroke-emerald-500/20" strokeWidth="1" />

                {/* Target detection blips */}
                <circle cx="85" cy="27" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
                <circle cx="155" cy="24" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
                <circle cx="135" cy="46" r="3" className="fill-emerald-600 dark:fill-emerald-400" />
              </svg>
            </div>

            {/* Calibrated Rubric Slots (Zero Icons) */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-background/80 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-foreground font-medium text-[11px]">
                  Distributed Systems
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                  100% Match
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-background/80 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-foreground font-medium text-[11px]">
                  Kubernetes Clusters
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
                  100% Match
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-background/50 border border-emerald-500/15 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-muted-foreground text-[11px]">
                  Terraform & IaC
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                  96% Match
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-mono text-emerald-700/80 dark:text-emerald-300/80">
              <span>0 Gaps Identified</span>
              <span>100% Parsing Safe</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 3: Conversational Copilot (Span 2) - Amber Duo-Shade
            Illustration: Editorial Proofing Studio & Precision Verb Sculptor
           ========================================================================= */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                03 • AI Copilot
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Interactive bullet rephrasing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chat directly with your draft to quantify fuzzy impact, tighten passive verbs into active voice, or re-level bullets for leadership roles.
            </p>
          </div>

          {/* Duo-Shade Impact Studio & Precision Token Diff (Zero Icons) */}
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-amber-500/[0.01] dark:from-amber-500/[0.08] dark:to-amber-500/[0.02] p-5 relative overflow-hidden">
            {/* Studio Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold block">
                  Impact Sculptor
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Directive Optimization
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Diff Active
              </span>
            </div>

            {/* Visual Sentence Transformation Canvas */}
            <div className="my-3.5 space-y-2.5">
              {/* Draft Before (Passive / Vague) */}
              <div className="p-2.5 rounded-xl bg-background/50 border border-amber-500/15 text-xs text-muted-foreground/75 font-mono line-through decoration-amber-500/40 leading-relaxed">
                Worked on backend APIs and helped improve database performance.
              </div>

              {/* Transformation Conduit Pill */}
              <div className="flex items-center justify-between px-1 text-[10px] font-mono text-amber-600 dark:text-amber-400">
                <span className="font-semibold tracking-wider uppercase">Executive Calibration</span>
                <span>+36 Impact Pts</span>
              </div>

              {/* Transformed Directive (Active Voice / Quantified) */}
              <div className="p-3 rounded-xl bg-background border border-amber-500/35 shadow-xs text-xs font-mono text-foreground leading-relaxed">
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

            {/* Calibrated Strength Gauge */}
            <div className="pt-2 border-t border-amber-500/15 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>PASSIVE VERB</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">EXECUTIVE DIRECTIVE</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-amber-500/15 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BENTO CARD 4: Synchronized Letters & PDF (Span 4) - Sky Duo-Shade
            Illustration: Architectural Dual-Document Blueprint & 1:1 Typography Press
           ========================================================================= */}
        <div className="lg:col-span-4 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                04 • Unified Package
              </span>
              <span className="text-xs font-mono text-muted-foreground/60">
                Cohesive Applications
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3">
              Synchronized cover letters & instant PDF export
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Automatically generate clean cover letters that reinforce the exact accomplishments highlighted in your resume. Export to standard single-column PDF with zero formatting drift.
            </p>
          </div>

          {/* Duo-Shade Dual-Document Studio Canvas (Zero Icons) */}
          <div className="mt-8 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-500/[0.04] to-sky-500/[0.01] dark:from-sky-500/[0.08] dark:to-sky-500/[0.02] p-5 sm:p-7 relative overflow-hidden">
            {/* Top Coordinate Alignment Rules */}
            <div className="flex items-center justify-between pb-3 border-b border-sky-500/15 text-[11px] font-mono text-sky-700/80 dark:text-sky-300/80">
              <span className="font-semibold uppercase tracking-wider">
                Twin Document Alignment System
              </span>
              <span>1:1 Typographic Parity</span>
            </div>

            {/* Dual Document Leaf Presentation */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 relative">
              {/* Document Leaf 1: The Tailored Resume Sheet */}
              <div className="rounded-xl border border-sky-500/30 bg-background p-4 sm:p-5 shadow-xs relative">
                {/* Header Strip */}
                <div className="flex items-baseline justify-between pb-2.5 border-b border-border/70">
                  <div>
                    <div className="font-bold text-sm tracking-tight text-foreground">
                      ALEX R. CHEN
                    </div>
                    <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                      STAFF INFRASTRUCTURE ARCHITECT
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    RESUME_A4
                  </span>
                </div>

                {/* Simulated Typeset Sections */}
                <div className="mt-3 space-y-2.5">
                  <div>
                    <div className="text-[9px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      Selected Impact
                    </div>
                    <div className="mt-1 p-2 rounded bg-sky-500/[0.05] border border-sky-500/15 text-[11px] text-foreground leading-relaxed">
                      Scaled global data mesh across 4 continents, sustaining{" "}
                      <span className="font-semibold text-sky-600 dark:text-sky-400 underline decoration-sky-500/40">
                        450M queries/day
                      </span>{" "}
                      at P99 &lt; 14ms.
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                      Architecture Leadership
                    </div>
                    <div className="mt-1 p-2 rounded bg-background border border-border/80 text-[11px] text-muted-foreground leading-relaxed">
                      Directed 14-engineer team migrating 280 microservices to unified Kubernetes clusters.
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>ATS Safe Margins</span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">Single Column</span>
                </div>
              </div>

              {/* Document Leaf 2: Matching Tailored Cover Letter */}
              <div className="rounded-xl border border-sky-500/30 bg-background p-4 sm:p-5 shadow-xs relative">
                {/* Header Strip (Identical typographic branding) */}
                <div className="flex items-baseline justify-between pb-2.5 border-b border-border/70">
                  <div>
                    <div className="font-bold text-sm tracking-tight text-foreground">
                      ALEX R. CHEN
                    </div>
                    <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                      COVER LETTER RE: INFRA LEAD
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60">
                    LETTER_A4
                  </span>
                </div>

                {/* Letter Body Matching Resume Claims */}
                <div className="mt-3 space-y-2 text-[11px] leading-relaxed">
                  <p className="text-muted-foreground">
                    Dear Platform Hiring Committee,
                  </p>
                  <div className="p-2 rounded bg-sky-500/[0.05] border border-sky-500/15 text-foreground">
                    In my recent work, I focused directly on high-throughput reliability, having{" "}
                    <span className="font-semibold text-sky-600 dark:text-sky-400 underline decoration-sky-500/40">
                      scaled global data mesh across 4 continents to 450M queries/day
                    </span>
                    —the exact distributed throughput targets outlined in your role specifications.
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    I welcome the opportunity to discuss our shared engineering priorities.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Narrative Match</span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">100% Cohesion</span>
                </div>
              </div>
            </div>

            {/* Bottom Export Engine Bar */}
            <div className="mt-4 pt-3 border-t border-sky-500/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
              <span className="text-sky-700 dark:text-sky-300 font-medium">
                Standardized Vector PDF Pipeline
              </span>
              <span>Zero Style Drift Across Documents</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import React, { useState } from "react";
import Heading from "./Heading";

interface BranchData {
  id: string;
  y: number;
  curve: string;
  role: string;
  tech: string;
  roleWidth: number;
  techWidth: number;
}

const BRANCHES: BranchData[] = [
  {
    id: "staff",
    y: 36,
    curve: "M 160 110 C 215 110, 240 36, 295 36",
    role: "Staff Systems",
    tech: "eBPF",
    roleWidth: 104,
    techWidth: 50,
  },
  {
    id: "platform",
    y: 73,
    curve: "M 160 110 C 215 110, 245 73, 295 73",
    role: "Platform Lead",
    tech: "Kubernetes",
    roleWidth: 106,
    techWidth: 88,
  },
  {
    id: "backend",
    y: 110,
    curve: "M 160 110 L 295 110",
    role: "Senior Backend",
    tech: "Distributed Go",
    roleWidth: 114,
    techWidth: 112,
  },
  {
    id: "infra",
    y: 147,
    curve: "M 160 110 C 215 110, 245 147, 295 147",
    role: "Infrastructure",
    tech: "Terraform",
    roleWidth: 112,
    techWidth: 82,
  },
  {
    id: "cloud",
    y: 184,
    curve: "M 160 110 C 215 110, 240 184, 295 184",
    role: "Cloud Core",
    tech: "Zero-Downtime",
    roleWidth: 92,
    techWidth: 106,
  },
];

interface RubricCriterion {
  id: string;
  name: string;
  weight: string;
  score: string;
  percent: number;
  scoreWidth: number;
}

const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: "dist",
    name: "Distributed Caching",
    weight: "Weight: 35%",
    score: "100% Match",
    percent: 1.0,
    scoreWidth: 92,
  },
  {
    id: "k8s",
    name: "Kubernetes Mesh",
    weight: "Weight: 25%",
    score: "99% Match",
    percent: 0.99,
    scoreWidth: 86,
  },
  {
    id: "p99",
    name: "P99 SLA Optimization",
    weight: "Weight: 25%",
    score: "98% Match",
    percent: 0.98,
    scoreWidth: 86,
  },
  {
    id: "iac",
    name: "Terraform Infrastructure",
    weight: "Weight: 15%",
    score: "96% Match",
    percent: 0.96,
    scoreWidth: 86,
  },
];

interface TrackedJob {
  id: string;
  company: string;
  role: string;
  version: string;
  stageIndex: number; // 0 to 4
  stageLabel: string;
  sla: string;
  badgeWidth: number;
}

const PIPELINE_STAGES = [
  { label: "APPLIED", x: 190 },
  { label: "SCREEN", x: 242 },
  { label: "TECH", x: 295 },
  { label: "ONSITE", x: 348 },
  { label: "OFFER", x: 400 },
];

const TRACKED_JOBS: TrackedJob[] = [
  {
    id: "stripe",
    company: "STRIPE",
    role: "Staff Systems",
    version: "v4.2-tailored",
    stageIndex: 2,
    stageLabel: "03 / TECHNICAL",
    sla: "Loop in 2d",
    badgeWidth: 104,
  },
  {
    id: "linear",
    company: "LINEAR",
    role: "Platform Lead",
    version: "v2.1-tailored",
    stageIndex: 4,
    stageLabel: "05 / OFFER",
    sla: "Reviewing terms",
    badgeWidth: 98,
  },
  {
    id: "vercel",
    company: "VERCEL",
    role: "Core Infra",
    version: "v3.0-tailored",
    stageIndex: 1,
    stageLabel: "02 / SCREEN",
    sla: "Call scheduled",
    badgeWidth: 100,
  },
  {
    id: "anthropic",
    company: "ANTHROPIC",
    role: "Distributed AI",
    version: "v5.1-tailored",
    stageIndex: 3,
    stageLabel: "04 / ONSITE",
    sla: "Debrief pending",
    badgeWidth: 102,
  },
];

export default function FeatureSection() {
  const [activeBranch, setActiveBranch] = useState<number>(2);
  const [hoveredBranch, setHoveredBranch] = useState<number | null>(null);
  const selectedBranch = hoveredBranch !== null ? hoveredBranch : activeBranch;

  const [activeRubric, setActiveRubric] = useState<number>(0);
  const [hoveredRubric, setHoveredRubric] = useState<number | null>(null);
  const selectedRubric = hoveredRubric !== null ? hoveredRubric : activeRubric;

  const [activeJob, setActiveJob] = useState<number>(0);
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);
  const selectedJob = hoveredJob !== null ? hoveredJob : activeJob;

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

          {/* Borderless Geometric Illustration: The Branched Master Ledger (Flipped, with Tags, Zero Icons) */}
          <div className="lg:col-span-7 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 560 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Background Architectural Grid Lines */}
              <line x1="30" y1="36" x2="530" y2="36" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 4" />
              <line x1="30" y1="110" x2="530" y2="110" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              <line x1="30" y1="184" x2="530" y2="184" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3 4" />

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

              {/* Ambient Traveling Pulse along Master Trunk */}
              <circle r="2.5" className="fill-indigo-500/80">
                <animateMotion
                  path="M 40 110 L 160 110"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>

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

              {/* Branching Hub Core with Ambient Breathing Pulse */}
              <circle cx="160" cy="110" r="14" className="fill-indigo-500/10 dark:fill-indigo-500/20">
                <animate attributeName="r" values="12;16;12" dur="3.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="110" r="7" className="fill-indigo-500/30" />
              <circle cx="160" cy="110" r="3" className="fill-indigo-600 dark:fill-indigo-400" />

              {/* Right Side: Tailored Output Tags Header */}
              <text x="312" y="16" className="fill-muted-foreground/60 text-[9px] font-mono tracking-wider">
                TAILORED TARGETS [5]
              </text>

              {/* 5 Fanning Out Tailored Branch Streams */}
              {BRANCHES.map((b, i) => {
                const isActive = selectedBranch === i;
                const isHovered = hoveredBranch === i;
                const techX = 312 + b.roleWidth + 8;

                return (
                  <g key={b.id}>
                    {/* Branch Curve */}
                    <path
                      d={b.curve}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "stroke-indigo-600 dark:stroke-indigo-400 stroke-[2.5px] opacity-100"
                          : hoveredBranch !== null
                          ? "stroke-indigo-400/25 stroke-[1.5px] opacity-40"
                          : "stroke-indigo-400/40 dark:stroke-indigo-400/30 stroke-[1.5px] opacity-75"
                      }`}
                      strokeLinecap="round"
                    />

                    {/* Ambient Data Packet Traveling Along Branch */}
                    <circle r="2" className={`fill-indigo-400 dark:fill-indigo-300 transition-opacity duration-200 ${isActive ? "opacity-90" : "opacity-40"}`}>
                      <animateMotion
                        path={b.curve}
                        dur="2.8s"
                        repeatCount="indefinite"
                        begin={`${i * 0.45}s`}
                      />
                    </circle>

                    {/* Endpoint Node */}
                    <circle
                      cx="295"
                      cy={b.y}
                      r={isActive ? 4 : 3}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "fill-indigo-600 dark:fill-indigo-400"
                          : "fill-background stroke-indigo-400 stroke-[1.5px]"
                      }`}
                    />

                    {/* Connecting Dashed Guide to Tags */}
                    <line
                      x1="298"
                      y1={b.y}
                      x2="312"
                      y2={b.y}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "stroke-indigo-600 dark:stroke-indigo-400 stroke-[1.5px]"
                          : "stroke-indigo-400/40 stroke-[1px] [stroke-dasharray:2_2]"
                      }`}
                    />

                    {/* Interactive Clickable/Hoverable Tag Group with Comfortable Symmetrical Padding */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredBranch(i)}
                      onMouseLeave={() => setHoveredBranch(null)}
                      onClick={() => setActiveBranch(i)}
                      transform={isActive ? "translate(4, 0)" : "translate(0, 0)"}
                      style={{ transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                    >
                      {/* Transparent Hover Hit Target */}
                      <rect x="306" y={b.y - 14} width="240" height="28" fill="transparent" />

                      {/* Primary Role Tag Pill */}
                      <rect
                        x="312"
                        y={b.y - 12}
                        width={b.roleWidth}
                        height="24"
                        rx="5"
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "fill-indigo-600 dark:fill-indigo-500"
                            : isHovered
                            ? "fill-indigo-500/20 dark:fill-indigo-500/25"
                            : "fill-indigo-500/10 dark:fill-indigo-500/15"
                        }`}
                      />
                      <text
                        x={312 + b.roleWidth / 2}
                        y={b.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[10px] font-mono select-none transition-colors duration-200 ${
                          isActive
                            ? "fill-white font-semibold"
                            : "fill-indigo-700 dark:fill-indigo-300 font-medium"
                        }`}
                      >
                        {b.role}
                      </text>

                      {/* Secondary Tech Tag Pill */}
                      <rect
                        x={techX}
                        y={b.y - 12}
                        width={b.techWidth}
                        height="24"
                        rx="5"
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "fill-indigo-500/15 dark:fill-indigo-500/25"
                            : "fill-muted/60 dark:fill-muted/20"
                        }`}
                      />
                      <text
                        x={techX + b.techWidth / 2}
                        y={b.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[9px] font-mono select-none transition-colors duration-200 ${
                          isActive
                            ? "fill-indigo-700 dark:fill-indigo-300 font-semibold"
                            : "fill-muted-foreground"
                        }`}
                      >
                        {b.tech}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* =========================================================================
            FEATURE 02: Semantic Keyword Scanner
            Illustration: Redesigned Dynamic Rubric Alignment Matrix & Sweep Scanner
           ========================================================================= */}
        <div className="pt-12 border-t border-border/50 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Borderless Geometric Illustration: The Dynamic Rubric Matrix */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 550 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Header Status Row */}
              <text x="30" y="20" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-semibold tracking-wider">
                ATS RUBRIC COMPARATOR
              </text>
              <text x="180" y="20" className="fill-muted-foreground/50 text-[9px] font-mono">
                MODEL: GREENHOUSE / LEVER
              </text>

              {/* Rubric Score Beacon on Right */}
              <circle cx="452" cy="17" r="3" className="fill-emerald-500">
                <animate attributeName="r" values="2.5;4;2.5" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x="462" y="20" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold tracking-tight">
                98.4% MATCH
              </text>

              {/* Background Architectural Axis Line */}
              <line x1="30" y1="32" x2="520" y2="32" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />

              {/* 4 Competency Alignment Rows */}
              {RUBRIC_CRITERIA.map((crit, idx) => {
                const y = 58 + idx * 44;
                const isActive = selectedRubric === idx;
                const isHovered = hoveredRubric === idx;
                const railStart = 205;
                const railWidth = 200;
                const filledX = railStart + railWidth * crit.percent;
                const badgeX = 425;

                return (
                  <g
                    key={crit.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredRubric(idx)}
                    onMouseLeave={() => setHoveredRubric(null)}
                    onClick={() => setActiveRubric(idx)}
                  >
                    {/* Transparent Clickable Row Hit Target */}
                    <rect x="20" y={y - 16} width="510" height="36" fill="transparent" />

                    {/* Competency Name & Weight on Left */}
                    <text
                      x="30"
                      y={y - 2}
                      className={`text-[11px] font-mono transition-colors duration-200 ${
                        isActive
                          ? "fill-foreground font-semibold"
                          : isHovered
                          ? "fill-foreground/90 font-medium"
                          : "fill-foreground/75 font-normal"
                      }`}
                    >
                      {crit.name}
                    </text>
                    <text x="30" y={y + 12} className="text-[9px] font-mono fill-muted-foreground/60">
                      {crit.weight}
                    </text>

                    {/* Background Track Rail */}
                    <line
                      x1={railStart}
                      y1={y + 4}
                      x2={railStart + railWidth}
                      y2={y + 4}
                      stroke="currentColor"
                      strokeOpacity="0.08"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Target Recruiter Threshold Indicator (92% Benchmark) */}
                    <line
                      x1={railStart + railWidth * 0.9}
                      y1={y - 2}
                      x2={railStart + railWidth * 0.9}
                      y2={y + 10}
                      className="stroke-muted-foreground/30"
                      strokeWidth="1.5"
                    />

                    {/* Verified Candidate Alignment Bar */}
                    <line
                      x1={railStart}
                      y1={y + 4}
                      x2={filledX}
                      y2={y + 4}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "stroke-emerald-600 dark:stroke-emerald-400 stroke-[3.5px]"
                          : isHovered
                          ? "stroke-emerald-500/80 stroke-[3px]"
                          : "stroke-emerald-500/50 stroke-[2.5px]"
                      }`}
                      strokeLinecap="round"
                    />

                    {/* Terminal Match Node */}
                    <circle
                      cx={filledX}
                      cy={y + 4}
                      r={isActive ? 4 : 3}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "fill-emerald-600 dark:fill-emerald-400"
                          : "fill-emerald-500"
                      }`}
                    />

                    {/* Score Badge Pill on Right with Comfortable Symmetrical Padding */}
                    <g
                      transform={isActive ? "translate(3, 0)" : "translate(0, 0)"}
                      style={{ transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                    >
                      <rect
                        x={badgeX}
                        y={y - 8}
                        width={crit.scoreWidth}
                        height="24"
                        rx="5"
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "fill-emerald-600 dark:fill-emerald-500"
                            : isHovered
                            ? "fill-emerald-500/20 dark:fill-emerald-500/25"
                            : "fill-emerald-500/10 dark:fill-emerald-500/15"
                        }`}
                      />
                      <text
                        x={badgeX + crit.scoreWidth / 2}
                        y={y + 4}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[10px] font-mono select-none transition-colors duration-200 ${
                          isActive
                            ? "fill-white font-bold"
                            : "fill-emerald-700 dark:fill-emerald-300 font-semibold"
                        }`}
                      >
                        {crit.score}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Sweeping Optical Calibration Scanner Beam (Continuous Ambient Motion) */}
              <line
                y1="40"
                y2="204"
                className="stroke-emerald-500/40 dark:stroke-emerald-400/40"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              >
                <animate attributeName="x1" values="205;405;205" dur="4.2s" repeatCount="indefinite" />
                <animate attributeName="x2" values="205;405;205" dur="4.2s" repeatCount="indefinite" />
              </line>
              <circle r="3" className="fill-emerald-500/80">
                <animate attributeName="cx" values="205;405;205" dur="4.2s" repeatCount="indefinite" />
                <animate attributeName="cy" values="40;204;40" dur="4.2s" repeatCount="indefinite" />
              </circle>
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

          {/* Borderless Geometric Illustration: The Application Lifecycle Matrix */}
          <div className="lg:col-span-7 flex items-center justify-center py-4">
            <svg
              viewBox="0 0 560 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-lg select-none"
            >
              {/* Header Row: Title + Telemetry Beacon */}
              <text x="28" y="21" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono font-semibold tracking-wider">
                JOB PIPELINE TRACKER
              </text>
              <text x="180" y="21" className="fill-muted-foreground/50 text-[9px] font-mono">
                LIFECYCLE TELEMETRY
              </text>

              {/* Active Pipeline Status Beacon */}
              <circle cx="462" cy="18" r="3" className="fill-amber-500">
                <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="472" y="21" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono font-bold tracking-tight">
                4 ACTIVE
              </text>

              {/* Header Hairline Divider */}
              <line x1="28" y1="32" x2="532" y2="32" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />

              {/* Stage Column Guide Labels at Top */}
              {PIPELINE_STAGES.map((st) => (
                <text
                  key={st.label}
                  x={st.x}
                  y="45"
                  textAnchor="middle"
                  className="text-[8px] font-mono fill-muted-foreground/50 tracking-wider"
                >
                  {st.label}
                </text>
              ))}

              {/* Vertical Subtle Stage Grid Lines */}
              {PIPELINE_STAGES.map((st) => (
                <line
                  key={`grid-${st.label}`}
                  x1={st.x}
                  y1="50"
                  x2={st.x}
                  y2="202"
                  stroke="currentColor"
                  strokeOpacity="0.03"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              ))}

              {/* 4 Interactive Tracked Application Rows */}
              {TRACKED_JOBS.map((job, idx) => {
                const y = 68 + idx * 38;
                const isActive = selectedJob === idx;
                const isHovered = hoveredJob === idx;
                const filledX = PIPELINE_STAGES[job.stageIndex].x;
                const badgeX = 422;

                return (
                  <g
                    key={job.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredJob(idx)}
                    onMouseLeave={() => setHoveredJob(null)}
                    onClick={() => setActiveJob(idx)}
                  >
                    {/* Transparent Clickable Row Hit Target */}
                    <rect x="20" y={y - 14} width="520" height="34" fill="transparent" />

                    {/* Company & Role Column on Left */}
                    <text
                      x="28"
                      y={y - 1}
                      className={`text-[11px] font-mono transition-colors duration-200 ${
                        isActive
                          ? "fill-foreground font-bold"
                          : isHovered
                          ? "fill-foreground/90 font-medium"
                          : "fill-foreground/75 font-normal"
                      }`}
                    >
                      {job.company}
                    </text>
                    <text x="28" y={y + 13} className="text-[9px] font-mono fill-muted-foreground/60">
                      {job.role} · {job.version}
                    </text>

                    {/* Background Progress Rail */}
                    <line
                      x1="190"
                      y1={y + 4}
                      x2="400"
                      y2={y + 4}
                      stroke="currentColor"
                      strokeOpacity="0.08"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Filled Stage Progression Bar */}
                    <line
                      x1="190"
                      y1={y + 4}
                      x2={filledX}
                      y2={y + 4}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "stroke-amber-600 dark:stroke-amber-400 stroke-[3px]"
                          : isHovered
                          ? "stroke-amber-500/80 stroke-[2.5px]"
                          : "stroke-amber-500/50 stroke-[2px]"
                      }`}
                      strokeLinecap="round"
                    />

                    {/* Ambient Stage Traveling Pulse */}
                    <circle r="2" className="fill-amber-400">
                      <animateMotion
                        path={`M 190 ${y + 4} L ${filledX} ${y + 4}`}
                        dur="2.4s"
                        repeatCount="indefinite"
                        begin={`${idx * 0.4}s`}
                      />
                    </circle>

                    {/* 5 Stage Checkpoint Nodes */}
                    {PIPELINE_STAGES.map((st, sIdx) => {
                      const isCompleted = sIdx < job.stageIndex;
                      const isCurrent = sIdx === job.stageIndex;

                      if (isCurrent) {
                        return (
                          <g key={st.label}>
                            <circle cx={st.x} cy={y + 4} r="5" className="fill-amber-500/20">
                              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle
                              cx={st.x}
                              cy={y + 4}
                              r={isActive ? 3.5 : 3}
                              className="fill-amber-600 dark:fill-amber-400"
                            />
                          </g>
                        );
                      }

                      if (isCompleted) {
                        return (
                          <circle
                            key={st.label}
                            cx={st.x}
                            cy={y + 4}
                            r="2.5"
                            className="fill-amber-500/70"
                          />
                        );
                      }

                      return (
                        <circle
                          key={st.label}
                          cx={st.x}
                          cy={y + 4}
                          r="2"
                          stroke="currentColor"
                          strokeOpacity="0.2"
                          fill="none"
                        />
                      );
                    })}

                    {/* Status Badge Pill with Generous Symmetrical Padding */}
                    <g
                      transform={isActive ? "translate(3, 0)" : "translate(0, 0)"}
                      style={{ transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                    >
                      <rect
                        x={badgeX}
                        y={y - 8}
                        width={job.badgeWidth}
                        height="24"
                        rx="5"
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "fill-amber-600 dark:fill-amber-500"
                            : isHovered
                            ? "fill-amber-500/20 dark:fill-amber-500/25"
                            : "fill-amber-500/10 dark:fill-amber-500/15"
                        }`}
                      />
                      <text
                        x={badgeX + job.badgeWidth / 2}
                        y={y + 4}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[9.5px] font-mono select-none transition-colors duration-200 ${
                          isActive
                            ? "fill-white font-bold"
                            : "fill-amber-700 dark:fill-amber-300 font-semibold"
                        }`}
                      >
                        {job.stageLabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Sweeping Timeline Scanner Beam (Continuous Ambient Motion) */}
              <line
                y1="36"
                y2="202"
                className="stroke-amber-500/25 dark:stroke-amber-400/25"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              >
                <animate attributeName="x1" values="190;400;190" dur="4.6s" repeatCount="indefinite" />
                <animate attributeName="x2" values="190;400;190" dur="4.6s" repeatCount="indefinite" />
              </line>
              <circle r="3" className="fill-amber-500/80">
                <animate attributeName="cx" values="190;400;190" dur="4.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="36;202;36" dur="4.6s" repeatCount="indefinite" />
              </circle>
            </svg>
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
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  FileCheck2,
} from "lucide-react";
import JobAvatar from "@/components/tracker/JobAvatar";
import StageBadge from "@/components/tracker/StageBadge";
import ColoredButton from "@/components/custom/colored-button";
import { JobStage } from "@/components/tracker/types";

interface DemoJob {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  stage: JobStage;
  score: number;
  portal: string;
  matched: string[];
  missing: string[];
  pitch: string;
}

const DEMO_JOBS: DemoJob[] = [
  {
    id: "linear",
    company: "Linear",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA (Remote)",
    salary: "$180,000 – $220,000",
    stage: "interviewing",
    score: 98,
    portal: "Linear Careers",
    matched: ["TypeScript", "React", "Next.js", "WebSockets", "GraphQL", "Tailwind CSS"],
    missing: [],
    pitch:
      "Hi Linear Team, I have 6+ years designing high-throughput web frontends and offline-first client sync. My experience architecting real-time WebSockets directly aligns with Linear's zero-latency workflows.",
  },
  {
    id: "stripe",
    company: "Stripe",
    title: "Staff Systems Engineer",
    location: "San Francisco, CA (Hybrid)",
    salary: "$210,000 – $260,000",
    stage: "applied",
    score: 94,
    portal: "Greenhouse",
    matched: ["Distributed Systems", "TypeScript", "Node.js", "PostgreSQL", "CI/CD"],
    missing: ["Kafka"],
    pitch:
      "Hi Stripe Team, with a background leading checkout micro-frontends handling 15M+ requests with 99.99% uptime, I bring hands-on experience optimizing high-concurrency payment platforms.",
  },
  {
    id: "airbnb",
    company: "Airbnb",
    title: "Product Design Engineer",
    location: "San Francisco, CA (Remote)",
    salary: "$195,000 – $235,000",
    stage: "saved",
    score: 96,
    portal: "Lever",
    matched: ["Design Systems", "React", "Tailwind CSS", "Accessibility", "Figma"],
    missing: ["Motion"],
    pitch:
      "Hi Airbnb Team, I specialize in crafting accessible, responsive design systems that bridge visual craft and production-grade React components.",
  },
];

export default function ExtensionShowcase() {
  const [selectedJob, setSelectedJob] = useState<DemoJob>(DEMO_JOBS[0]);
  const [activeTab, setActiveTab] = useState<"matcher" | "autofill" | "pitch">("matcher");
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 relative z-10 text-left">
      {/* Eyebrow and Section Header */}
      <div className="max-w-2xl mb-10">
        <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>00 / BROWSER ASSISTANT // REAL-TIME ATS FIT &amp; AUTOFILL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
          Scan jobs anywhere.
          <br />
          <span className="text-muted-foreground font-normal">Autofill applications in 1 click.</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          The Resumely Assistant integrates directly into Chrome—analyzing job postings on LinkedIn, Indeed, Greenhouse, Lever, Ashby, and Workday, calculating real-time ATS match scores, and filling multi-page application forms without bot detection errors.
        </p>
      </div>

      {/* Main Specimen Workbench Card */}
      <div className="rounded-3xl border border-border/70 bg-card/40 dark:bg-card/20 backdrop-blur-md shadow-xs overflow-hidden">
        {/* Top Header: Portal Tabs & Active Target Switcher */}
        <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {DEMO_JOBS.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJob(job)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedJob.id === job.id
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <JobAvatar company={job.company} size={18} />
                <span>{job.company}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <StageBadge stage={selectedJob.stage} />
            <span className="text-xs font-mono text-muted-foreground font-medium hidden sm:inline">
              PORTAL: {selectedJob.portal}
            </span>
          </div>
        </div>

        {/* Workbench Body: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          {/* Left Column: Role Details & Extracted Rubric (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <JobAvatar company={selectedJob.company} size={28} />
                  <span className="font-semibold text-foreground text-sm">
                    {selectedJob.company}
                  </span>
                  <span className="text-border">/</span>
                  <span className="text-xs text-muted-foreground">{selectedJob.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-1">
                  {selectedJob.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedJob.salary}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">EXTRACTED COMPENSATION</div>
              </div>
            </div>

            {/* Sub-mode Tab Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-border/40 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab("matcher")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "matcher"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                01 / ATS Fit Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("autofill")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "autofill"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                02 / Form Autofill
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pitch")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "pitch"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                03 / Tailored Pitch
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === "matcher" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-muted/15 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">MATCHED KEYWORDS ({selectedJob.matched.length})</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">HIGH ALIGNMENT</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.matched.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300 font-mono"
                      >
                        <Check className="size-3 text-emerald-500" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedJob.missing.length > 0 ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-300">
                    <span>MISSING KEYWORD GAP:</span>
                    <span className="font-bold underline uppercase">{selectedJob.missing.join(", ")}</span>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    <span>ZERO KEYWORD GAPS DETECTED. READY TO SUBMIT.</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "autofill" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/60 bg-muted/15 p-4 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">INPUT DISPATCH ENGINE</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">14 / 14 SYNTHETIC EVENTS</span>
                  </div>
                  <div className="space-y-1.5 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Google Forms Validation:</span>
                      <span className="text-foreground font-semibold">Bypassed Required Traps ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work Authorization:</span>
                      <span className="text-foreground font-semibold">Authorized without sponsorship ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LinkedIn &amp; GitHub:</span>
                      <span className="text-foreground font-semibold">Pre-populated &amp; Dispatched ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pitch" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/60 bg-muted/15 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">TAILORED RECRUITER COVER NOTE</span>
                    <button
                      type="button"
                      onClick={() => {
                        setHasCopied(true);
                        setTimeout(() => setHasCopied(false), 2000);
                      }}
                      className="text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {hasCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{hasCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed font-mono bg-background/80 p-3 rounded-xl border border-border/40">
                    &quot;{selectedJob.pitch}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Assistant Widget & Quick Actions (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-xs">
                <span className="text-muted-foreground font-semibold">RESUMELY ASSISTANT v1.0</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
              </div>

              {/* Score Display Specimen */}
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-muted-foreground uppercase">
                    CALCULATED ATS FIT
                  </div>
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {selectedJob.score}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedJob.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground leading-normal">
                  Comparing extracted rubric tokens against your master resume achievements.
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>LinkedIn &amp; Indeed split-view supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Greenhouse, Lever &amp; Ashby forms verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                  <span>Syncs directly to your Kanban pipeline</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-border/40">
              <Link href="/tracker" className="w-full">
                <ColoredButton
                  color="neutral"
                  size="default"
                  className="w-full rounded-xl py-2.5 text-xs font-semibold shadow-xs"
                >
                  <Bookmark className="size-3.5 mr-1.5" />
                  <span>Save to Resumely Job Tracker</span>
                </ColoredButton>
              </Link>
              <Link
                href="/resume"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium py-1 transition-colors"
              >
                <span>Edit your Master Career Profile</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Tabular Strip */}
        <div className="px-6 py-3 bg-muted/20 border-t border-border/50 flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span>PLATFORMS: 50+ ATS &amp; JOB BOARDS</span>
            <span className="hidden sm:inline text-border">·</span>
            <span>SPEED: &lt; 0.4s FILL TIME</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <span>VERIFIED ZERO-VALIDATION BOT ERROR TRAPS</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Download, Copy, Sparkles, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TargetMode = "stripe" | "linear" | "master";

export default function InteractiveResumeDemo() {
  const [target, setTarget] = useState<TargetMode>("stripe");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success("Tailored ATS bullet points copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    toast.success("Downloading ATS-optimized PDF preview...");
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300">
      {/* Top Workbench Toolbar */}
      <div className="px-4 sm:px-6 py-3 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        {/* Document Status */}
        <div className="flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-foreground/80 font-medium">
            Live ATS Engine
          </span>
          <span className="text-border text-xs">/</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Single Master Source
          </span>
        </div>

        {/* Role Target Selector Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-background/80 border border-border/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTarget("master")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97]",
              target === "master"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Raw Master
          </button>
          <button
            type="button"
            onClick={() => setTarget("stripe")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] flex items-center gap-1.5",
              target === "stripe"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-3 text-emerald-400" />
            <span>Stripe (Staff Infra)</span>
          </button>
          <button
            type="button"
            onClick={() => setTarget("linear")}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-[0.97] flex items-center gap-1.5",
              target === "linear"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-3 text-emerald-400" />
            <span>Linear (Lead Frontend)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-background/50 hover:bg-muted/50 text-xs text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            <span>{copied ? "Copied" : "Copy ATS"}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-background/50 hover:bg-muted/50 text-xs text-muted-foreground hover:text-foreground transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <Download className="size-3" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Authentic Resume Document Sheet */}
      <div className="p-5 sm:p-8 bg-background/95 min-h-[380px] flex flex-col justify-between select-text">
        <div>
          {/* Resume Header: Authentic clean typography */}
          <div className="pb-4 mb-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                ALEXANDER CHEN
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">
                {target === "stripe"
                  ? "Staff Distributed Systems & Infrastructure Architect"
                  : target === "linear"
                  ? "Lead Product & High-Performance Frontend Engineer"
                  : "Senior Software Engineer (Full-Stack & Systems)"}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs font-mono text-muted-foreground/80">
                <span>San Francisco, CA</span>
                <span>•</span>
                <span>alex@chen.dev</span>
                <span>•</span>
                <span>github.com/alexchen</span>
              </div>
            </div>

            {/* ATS Score Indicator */}
            <div className="sm:text-right shrink-0">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all duration-200",
                  target === "master"
                    ? "bg-muted/60 text-muted-foreground border-border/70"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                )}
              >
                {target === "master" ? (
                  <span>Baseline: 54% Match</span>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    <span>98% ATS Alignment</span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/70 mt-1">
                {target === "master"
                  ? "Unfiltered Master Record"
                  : target === "stripe"
                  ? "Target: Stripe Staff Infra Rubric"
                  : "Target: Linear Product Engineer"}
              </p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Relevant Experience
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Single-Column Standard Layout
              </span>
            </div>

            {/* Job Title and Date Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <span className="font-bold text-sm sm:text-base text-foreground">
                  {target === "stripe"
                    ? "Staff Infrastructure Engineer"
                    : target === "linear"
                    ? "Lead Frontend Architect"
                    : "Senior Software Engineer"}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {" "}
                  • Acme Distributed Cloud Platform
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                2022 — PRESENT
              </span>
            </div>

            {/* Dynamic Bullets with Emil Kowalski blur crossfade */}
            <AnimatePresence mode="wait">
              {target === "master" && (
                <motion.div
                  key="master"
                  initial={{ opacity: 0, filter: "blur(2px)", y: 3 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(2px)", y: -3 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground text-left"
                >
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/40 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Built cloud components and backend microservices using Node.js, Go, and React.
                      Worked on database queries and helped reduce API response latency.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/40 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Managed Kubernetes cluster configurations and assisted team with on-call
                      rotations and production bug triage.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/40 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Collaborated with product managers to write technical design specifications
                      and reviewed pull requests across the engineering organization.
                    </span>
                  </p>
                </motion.div>
              )}

              {target === "stripe" && (
                <motion.div
                  key="stripe"
                  initial={{ opacity: 0, filter: "blur(2px)", y: 3 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(2px)", y: -3 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90 text-left"
                >
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Architected high-throughput distributed Kubernetes clusters across 12 AWS
                      regions, driving{" "}
                      <strong className="text-foreground font-semibold">
                        99.995% service availability
                      </strong>{" "}
                      and reducing P99 latency by{" "}
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        38%
                      </span>{" "}
                      under 450M daily API transactions.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Engineered multi-region failover automation using Go and gRPC, shrinking
                      catastrophic cluster recovery RTO from{" "}
                      <span className="line-through text-muted-foreground/60">8.5 minutes</span> to{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        12 seconds
                      </strong>
                      .
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Enforced automated SOC2 Type II and PCI-DSS compliance guardrails in CI/CD,
                      eliminating audit preparation cycles for 60+ distributed services.
                    </span>
                  </p>
                </motion.div>
              )}

              {target === "linear" && (
                <motion.div
                  key="linear"
                  initial={{ opacity: 0, filter: "blur(2px)", y: 3 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(2px)", y: -3 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90 text-left"
                >
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Engineered local-first optimistic UI synchronization engine in TypeScript and
                      React Server Components, cutting end-to-end sync latency to{" "}
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        &lt; 16ms
                      </strong>{" "}
                      across 1.4M active client sessions.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Architected custom design system token pipeline and keyboard navigation
                      primitives, achieving{" "}
                      <strong className="text-foreground font-semibold">
                        60fps silky frame-rate
                      </strong>{" "}
                      and 100% WCAG 2.1 AA keyboard parity.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-foreground/70 mt-1.5 shrink-0 text-[10px]">■</span>
                    <span>
                      Spearheaded internal RFC consensus on zero-runtime CSS abstractions, reducing
                      first-load JS bundle by{" "}
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        44%
                      </span>{" "}
                      and Core Web Vitals LCP to 0.8s.
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Meta Row on the Sheet */}
        <div className="pt-4 mt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-semibold">Keywords matched:</span>
            {target === "stripe" && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Kubernetes, Go, P99 Latency, Multi-Region, Distributed Systems, PCI-DSS
              </span>
            )}
            {target === "linear" && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                TypeScript, Optimistic UI, RSC, 60fps, Design Systems, LCP &lt; 1s
              </span>
            )}
            {target === "master" && (
              <span className="text-muted-foreground">
                Raw unfiltered experience (no job rubric applied)
              </span>
            )}
          </div>
          <span className="text-foreground/70 font-semibold">
            {target === "master" ? "14 Uncut Bullets" : "3 High-Relevance Selected"}
          </span>
        </div>
      </div>
    </div>
  );
}

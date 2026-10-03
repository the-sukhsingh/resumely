"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InteractiveResumeDemo() {
  const [activeTab, setActiveTab] = useState<"master" | "tailored">("tailored");

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-6 shadow-xl transition-all">
      {/* Top Header / Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Interactive Output Preview
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex items-center p-1 rounded-full bg-muted/60 border border-border/60 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("master")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer active:scale-[0.97]",
              activeTab === "master"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            01. Master Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tailored")}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer active:scale-[0.97] flex items-center gap-1.5",
              activeTab === "tailored"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-3" />
            <span>02. Tailored for Target Role</span>
          </button>
        </div>
      </div>

      {/* Main Preview Box */}
      <div className="relative min-h-[220px] rounded-xl border border-border/50 bg-background/80 p-5 sm:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "master" ? (
            <motion.div
              key="master"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">Source Record #01</span>
                  <h4 className="text-base font-semibold text-foreground">
                    Software Engineer — Master Experience
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-muted/70 text-muted-foreground border border-border/40">
                  <SlidersHorizontal className="size-3" />
                  <span>Unfiltered Baseline</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/20 border border-border/40 p-3.5 text-sm leading-relaxed text-muted-foreground font-mono text-xs sm:text-sm">
                <p>
                  • Built dashboard components using React and TypeScript for internal web teams.
                </p>
                <p className="mt-2">
                  • Worked with backend engineers to integrate REST APIs and updated documentation.
                </p>
                <p className="mt-2">
                  • Assisted team with bug fixes and improved site loading speed during sprint cycles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Raw Skills:</span>
                {["React", "TypeScript", "REST APIs", "Git"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-muted/50 text-muted-foreground border border-border/40"
                  >
                    {skill}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground/60 ml-auto italic">
                  Generic format · No JD targeting
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tailored"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Target Role: Senior Frontend Engineer
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    Tailored Bullet Points (ATS Aligned)
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  <ShieldCheck className="size-3.5" />
                  <span>96% ATS Keyword Match</span>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-500/5 dark:bg-emerald-500/[0.03] border border-emerald-500/20 p-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90">
                <p>
                  •{" "}
                  <strong className="font-semibold text-foreground">
                    Architected high-throughput Next.js frontend workflows
                  </strong>{" "}
                  using TypeScript and React Server Components, reducing Core Web Vitals LCP by{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    42%
                  </span>{" "}
                  across 1.2M sessions.
                </p>
                <p className="mt-2.5">
                  • Engineered type-safe real-time client state synchronization, reducing API
                  roundtrip overhead by{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    35%
                  </span>{" "}
                  and mitigating critical hydration errors.
                </p>
                <p className="mt-2.5">
                  • Led cross-functional technical RFC reviews, aligning design systems and API contracts
                  for zero-downtime deployment pipelines.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground font-medium">Matched Requirements:</span>
                {[
                  "Next.js Architecture",
                  "TypeScript",
                  "LCP Optimization",
                  "React Server Components",
                  "Cross-Functional Leadership",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-foreground/5 text-foreground border border-border/80"
                  >
                    <Check className="size-2.5 text-emerald-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Micro-footer indicator */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary" />
          Single master repository generates unlimited context-perfect resumes.
        </span>
        <span className="font-mono text-xs text-foreground/70">
          Clean PDF Export Ready • 0 Formatting Drift
        </span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InteractiveResumeDemo() {
  const [isTailored, setIsTailored] = useState(true);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md p-5 sm:p-7 shadow-xl text-left transition-all">
      {/* Top Controls: Minimal segmented toggle */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/50">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Experience Alignment
        </span>

        {/* Tactile toggle pill */}
        <div className="inline-flex items-center p-1 rounded-full bg-muted/50 border border-border/50 text-xs">
          <button
            type="button"
            onClick={() => setIsTailored(false)}
            className={cn(
              "px-3 py-1 rounded-full transition-all duration-150 cursor-pointer active:scale-[0.97]",
              !isTailored
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Master Record
          </button>
          <button
            type="button"
            onClick={() => setIsTailored(true)}
            className={cn(
              "px-3 py-1 rounded-full transition-all duration-150 cursor-pointer active:scale-[0.97] flex items-center gap-1.5",
              isTailored
                ? "bg-foreground text-background shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sparkles className="size-3 text-emerald-400" />
            <span>Target Role Aligned</span>
          </button>
        </div>
      </div>

      {/* Experience Content Block */}
      <div className="min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isTailored ? (
            <motion.div
              key="master"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Software Engineer • Full-Stack Platform
                </span>
                <span className="font-mono text-muted-foreground">Unfiltered baseline</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-muted-foreground/40 mt-1 select-none">•</span>
                  <span>
                    Built web features using React, TypeScript, and Node.js across internal team tools.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-muted-foreground/40 mt-1 select-none">•</span>
                  <span>
                    Worked on database queries and helped improve page loading performance during sprint cycles.
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tailored"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Senior Frontend Engineer • Aligned to Role Rubric
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="size-3" />
                  96% ATS Match
                </span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1 select-none">•</span>
                  <span>
                    Architected high-throughput Next.js application workflows with TypeScript, reducing Core Web Vitals LCP by <strong className="font-semibold text-foreground">42%</strong> across 1.2M sessions.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1 select-none">•</span>
                  <span>
                    Engineered type-safe client state synchronization, reducing API roundtrip overhead by <strong className="font-semibold text-foreground">35%</strong> and mitigating critical hydration errors.
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer Note */}
      <div className="pt-4 mt-5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>Single master record → unlimited tailored applications</span>
        <span className="text-foreground/70">100% ATS-friendly PDF</span>
      </div>
    </div>
  );
}

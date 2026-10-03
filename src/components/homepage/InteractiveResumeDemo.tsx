"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function InteractiveResumeDemo() {
  const [isTailored, setIsTailored] = useState(true);

  return (
    <div className="w-full max-w-2xl ml-auto pt-6 text-left">
      {/* Top Segmented Controls: Clean, borderless tactile switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
            EXPERIENCE ALIGNMENT SPECIMEN
          </span>
        </div>

        {/* Minimal Tactile Mode Pill (Zero Icons) */}
        <div className="inline-flex items-center p-1 rounded-full bg-muted/40 border border-border/40 text-xs font-mono self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsTailored(false)}
            className={cn(
              "px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.97]",
              !isTailored
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            01 / Master Record
          </button>
          <button
            type="button"
            onClick={() => setIsTailored(true)}
            className={cn(
              "px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer active:scale-[0.97] flex items-center gap-1.5",
              isTailored
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>02 / Tailored for Role</span>
          </button>
        </div>
      </div>

      {/* Role & ATS Status Header */}
      <div className="flex items-center justify-between font-mono text-xs mb-3.5 pb-2 border-b border-border/20">
        <span className="font-semibold text-foreground tracking-tight">
          ROLE: STAFF SYSTEMS &amp; BACKEND
        </span>

        {isTailored ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold tracking-tight">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            98.4% ATS MATCH
          </span>
        ) : (
          <span className="text-muted-foreground/70 font-medium">
            UNFILTERED BASELINE (52%)
          </span>
        )}
      </div>

      {/* Experience Content Specimen Block (Smooth Crossfade & Height Bridge) */}
      <div className="min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isTailored ? (
            <motion.div
              key="master"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3.5"
            >
              <div className="space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p className="flex items-start gap-2.5">
                  <span className="text-muted-foreground/40 mt-1 select-none font-mono">•</span>
                  <span>
                    Helped team maintain PostgreSQL databases, assisted with backend stability issues, and wrote API endpoints for internal tools.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="text-muted-foreground/40 mt-1 select-none font-mono">•</span>
                  <span>
                    Worked on Redis caching layer to help reduce page load times and participated in regular engineering sprint planning.
                  </span>
                </p>
              </div>

              {/* Diagnostic Monospace Readout */}
              <div className="pt-2 font-mono text-[10px] text-muted-foreground/60 tracking-wider uppercase">
                DIAGNOSIS: PASSIVE VERBS · UNQUANTIFIED SCALE · MISSING RUBRIC METRICS
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tailored"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-3.5"
            >
              <div className="space-y-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <p className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-1 select-none font-mono">•</span>
                  <span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Architected</strong> distributed Redis &amp; PostgreSQL read-replica cluster cutting P99 database latency by <strong className="font-semibold text-foreground">42%</strong> across <strong className="font-semibold text-foreground">100M+</strong> daily transactions.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-1 select-none font-mono">•</span>
                  <span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Engineered</strong> automated zero-downtime PostgreSQL shard migration tooling, eliminating <strong className="font-semibold text-foreground">14 hours</strong> of annual planned maintenance downtime.
                  </span>
                </p>
              </div>

              {/* Verified Spec Monospace Readout */}
              <div className="pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 tracking-wider uppercase font-semibold">
                VERIFIED SPEC: +42% P99 SLA · 100M+ QPS · ZERO-DOWNTIME SHARDING
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer Spec Sheet Line */}
      <div className="pt-4 mt-5 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
        <span>SINGLE MASTER RECORD → DYNAMIC RUBRIC ALIGNMENT</span>
        <span className="text-foreground/75 font-semibold">100% ATS PARSEABLE · ZERO DRIFT</span>
      </div>
    </div>
  );
}

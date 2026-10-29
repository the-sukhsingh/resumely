"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  Bookmark,
  Zap,
  Shield,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import JobAvatar from "@/components/tracker/JobAvatar";
import StageBadge from "@/components/tracker/StageBadge";

export default function BrandHero() {
  const { user } = useAuth();
  const [isTailored, setIsTailored] = useState(true);
  const [activeAssistantTab, setActiveAssistantTab] = useState<"match" | "autofill">("match");

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 sm:pt-36 md:pt-40 pb-16 sm:pb-20 flex flex-col items-start text-left relative z-10">
      {/* Brand Eyebrow Tag */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card/60 dark:bg-card/40 border border-border/80 text-xs font-mono text-muted-foreground mb-6 backdrop-blur-md shadow-2xs"
      >
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold tracking-wider uppercase text-foreground">RESUMELY V2.0</span>
        <span className="text-border">/</span>
        <span>THE INTELLIGENT CAREER COMPANION</span>
      </motion.div>

      {/* Confident Upright Roman Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08] sm:leading-[1.05] max-w-4xl text-left"
      >
        Land the role.
        <br />
        <span className="text-muted-foreground font-normal">Without the busywork.</span>
      </motion.h1>

      {/* Outcome-led Subhead */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mt-5 text-left"
      >
        Keep one master record of your career accomplishments. Resumely analyzes job descriptions across the web in real time, pinpoints missing ATS keywords, and auto-fills applications with a single click.
      </motion.p>

      {/* Primary & Secondary Action CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5 mt-8 w-full sm:w-auto"
      >
        {user ? (
          <Button
            asChild
            variant="neo"
            size="lg"
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-all duration-150"
          >
            <Link href="/resume">
              Go to Dashboard
              <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Button>
        ) : (
          <Button
            onClick={() => signIn("google")}
            variant="neo"
            size="lg"
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-all duration-150 cursor-pointer"
          >
            Start building for free
            <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-0.5">
              →
            </span>
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 px-6 rounded-full text-sm font-medium tracking-wide w-full sm:w-auto bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-all duration-150"
        >
          <a href="#features">
            Explore Features
          </a>
        </Button>
      </motion.div>

      {/* Centerpiece Showcase: Dual-Pane Product Interface */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="w-full mt-12 sm:mt-16"
      >
        <div className="rounded-3xl border border-border/70 bg-card/40 dark:bg-card/20 backdrop-blur-xl shadow-lg overflow-hidden">
          {/* Top Window Bar */}
          <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-500/80" />
              <span className="size-2.5 rounded-full bg-amber-500/80" />
              <span className="size-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground hidden sm:inline">
                resumely://workbench · live experience alignment &amp; assistant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                SYSTEM SYNCED
              </span>
            </div>
          </div>

          {/* Workbench Grid: Left = Master vs Tailored Record, Right = Assistant Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            {/* Left Pane: Experience Alignment Specimen (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                    01 / EXPERIENCE SPECIMEN
                  </span>
                  <div className="text-xs font-mono text-foreground font-semibold">
                    ROLE: STAFF FRONTEND ENGINEER
                  </div>
                </div>

                {/* Tactile Mode Pill */}
                <div className="inline-flex items-center p-1 rounded-full bg-muted/40 border border-border/40 text-xs font-mono self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsTailored(false)}
                    className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
                      !isTailored
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Master Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTailored(true)}
                    className={`px-3 py-1 rounded-full transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isTailored
                        ? "bg-foreground text-background shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>Tailored for Role</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Experience Bullets */}
              <div className="min-h-[140px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isTailored ? (
                    <motion.div
                      key="master"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <p className="flex items-start gap-2.5">
                          <span className="text-muted-foreground/40 mt-1 select-none font-mono">•</span>
                          <span>
                            Helped maintain frontend components, resolved UI bugs, and built internal team dashboards using React and TypeScript.
                          </span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-muted-foreground/40 mt-1 select-none font-mono">•</span>
                          <span>
                            Participated in daily standups and sprint planning to deliver new product features on schedule.
                          </span>
                        </p>
                      </div>
                      <div className="pt-2 font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                        DIAGNOSIS: PASSIVE VERBS · UNQUANTIFIED IMPACT · 52% BASELINE
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tailored"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3"
                    >
                      <div className="space-y-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                        <p className="flex items-start gap-2.5">
                          <span className="text-emerald-500 mt-1 select-none font-mono">•</span>
                          <span>
                            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Architected</strong> high-throughput client sync and Next.js micro-frontends serving <strong className="font-semibold text-foreground">15M+ daily requests</strong> with <strong className="font-semibold text-foreground">99.99% uptime</strong>.
                          </span>
                        </p>
                        <p className="flex items-start gap-2.5">
                          <span className="text-emerald-500 mt-1 select-none font-mono">•</span>
                          <span>
                            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Spearheaded</strong> offline-first WebSockets caching architecture, reducing First Contentful Paint by <strong className="font-semibold text-foreground">42%</strong> across global regions.
                          </span>
                        </p>
                      </div>
                      <div className="pt-2 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 tracking-wider uppercase font-semibold">
                        VERIFIED SPEC: 98.4% ATS MATCH · HIGH-IMPACT QUANTIFIABLE OUTCOMES
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Spec Sheet Strip */}
              <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
                <span>SINGLE MASTER RECORD → DYNAMIC RUBRIC ALIGNMENT</span>
                <span className="text-foreground font-semibold">100% ATS PARSEABLE</span>
              </div>
            </div>

            {/* Right Pane: Live Resumely Assistant Extension (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/5 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/40 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <JobAvatar company="Linear" size={20} />
                    <span className="font-semibold text-foreground">Linear Careers</span>
                  </div>
                  <StageBadge stage="interviewing" />
                </div>

                {/* Score Widget */}
                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Staff Frontend Engineer</h4>
                      <p className="text-[11px] text-muted-foreground font-mono">$180,000 – $220,000 · Remote</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        98%
                      </span>
                      <div className="text-[9px] font-mono text-muted-foreground">ATS FIT</div>
                    </div>
                  </div>

                  {/* Matched Skill Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {["TypeScript", "React", "Next.js", "WebSockets", "GraphQL"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Autofill Status Banner */}
                <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>1-CLICK AUTOFILL:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">14 / 14 READY</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Bypasses Google Forms &amp; Greenhouse synthetic validation traps.
                  </div>
                </div>
              </div>

              {/* Save Button Action */}
              <div className="pt-2">
                <Link
                  href="/tracker"
                  className="w-full py-2.5 px-4 rounded-xl bg-foreground text-background text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
                >
                  <Bookmark className="size-3.5" />
                  <span>Save to Resumely Job Tracker</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

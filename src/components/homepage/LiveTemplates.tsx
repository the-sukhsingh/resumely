"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sliders,
  Check,
  ChevronRight,
  Maximize2,
  Sparkles,
  Download,
  ShieldCheck,
  Layers,
  Columns,
  AlignLeft,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import ColoredButton from "@/components/custom/colored-button";

type TemplateId = "latex" | "classic" | "two-column";
type PaperSize = "letter" | "a4";

interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: string;
  badge: string;
  icon: typeof AlignLeft;
  atsScore: string;
  idealFor: string;
  summary: string;
}

const TEMPLATES: TemplateMeta[] = [
  {
    id: "latex",
    name: "Modern LaTeX",
    category: "Single Column",
    badge: "Engineering Standard",
    icon: AlignLeft,
    atsScore: "99.4%",
    idealFor: "Software, Systems, Machine Learning & Quantitative Finance",
    summary:
      "Strict single-column typographical hierarchy modeled on academic LaTeX standards. Prioritizes dense, structured technical bullet points with zero invisible parsing traps.",
  },
  {
    id: "classic",
    name: "Executive Minimalist",
    category: "Executive Serif",
    badge: "ATS Gold Standard",
    icon: Layers,
    atsScore: "98.8%",
    idealFor: "Engineering Managers, Staff/Principal Leaders & Product Directors",
    summary:
      "Refined serif headers with generous breathing room and a focused executive summary. Balances high-stakes narrative presence with guaranteed machine readability.",
  },
  {
    id: "two-column",
    name: "Structured Dual-Rail",
    category: "Two Column",
    badge: "High Density",
    icon: Columns,
    atsScore: "97.6%",
    idealFor: "Full-Stack Engineers, DevOps, Systems Architects & Polyglots",
    summary:
      "Engineered dual-rail layout featuring a dedicated competencies sidebar alongside a wide experience column, typeset to preserve linear left-to-right ATS extraction.",
  },
];

export default function LiveTemplates() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("latex");
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const shouldReduceMotion = useReducedMotion();

  const currentTemplate = TEMPLATES.find((t) => t.id === activeTemplate) ?? TEMPLATES[0];

  return (
    <section id="templates" className="py-20 sm:py-28 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Precision Typography
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50 mt-3 leading-[1.14]">
            Templates engineered to survive the filter.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed max-w-xl">
            Every template in Resumely compiles to crisp vector PDFs with zero invisible table traps, broken glyphs, or parsing artifacts.
          </p>
        </div>

        {/* Live Template Selector Pills */}
        <div className="flex flex-wrap items-center p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 self-start md:self-auto gap-1">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const isActive = activeTemplate === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTemplate(t.id)}
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-[color,transform] duration-150 ease-out cursor-pointer active:scale-[0.96]",
                  isActive
                    ? "text-neutral-950 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTemplatePill"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-xs border border-border/40"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10 shrink-0 stroke-[2]" />
                <span className="relative z-10">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Specimen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Information Column */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6 pt-2">
          <div className="space-y-5">
            
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40">
                {currentTemplate.badge}
              </span>
              <span className="text-xs font-mono text-neutral-500">
                {currentTemplate.category}
              </span>
            </div>

            {/* Template Name & Summary */}
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
              {currentTemplate.name}
            </h3>
            
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              {currentTemplate.summary}
            </p>

            {/* Metric & Target Specs */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-border/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">ATS Pass Benchmark</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {currentTemplate.atsScore} Score
                </span>
              </div>
              <div className="h-px bg-border/40" />
              <div className="space-y-1">
                <span className="text-xs text-neutral-500 block">Recommended For:</span>
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block leading-snug">
                  {currentTemplate.idealFor}
                </span>
              </div>
            </div>

            {/* Live Document Paper Size Switcher */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-neutral-500">Document Size:</span>
              <div className="flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-border/60">
                <button
                  type="button"
                  onClick={() => setPaperSize("letter")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer",
                    paperSize === "letter"
                      ? "bg-white dark:bg-neutral-800 text-foreground font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-foreground"
                  )}
                >
                  US Letter
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize("a4")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer",
                    paperSize === "a4"
                      ? "bg-white dark:bg-neutral-800 text-foreground font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-foreground"
                  )}
                >
                  ISO A4
                </button>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2">
            <ColoredButton
              asChild
              color="neutral"
              size="lg"
              className="rounded-full px-6 h-11 text-sm font-medium shadow-sm hover:shadow-md active:scale-[0.96] transition-[transform,shadow,color,background-color] duration-150 ease-out cursor-pointer inline-flex items-center gap-2"
            >
              <Link href="/resume">
                <span>Use {currentTemplate.name}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </Link>
            </ColoredButton>
          </div>
        </div>

        {/* Right Live Specimen Canvas */}
        <div className="lg:col-span-8">
          
          {/* Canvas Frame */}
          <div className="relative rounded-3xl border border-border/70 bg-neutral-100/60 dark:bg-neutral-900/30 p-4 sm:p-7 md:p-8">
            
            {/* Top Specimen Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border/50 text-xs text-neutral-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Live Vector Compilation
                </span>
                <span className="hidden sm:inline text-neutral-400">•</span>
                <span className="hidden sm:inline">Single Page Fit</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-background border border-border/60">
                  {paperSize === "letter" ? "8.5 × 11 in" : "210 × 297 mm"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40 font-semibold">
                  100% Parsed
                </span>
              </div>
            </div>

            {/* Tangible Paper Sheet Canvas */}
            <div className="relative flex justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTemplate}-${paperSize}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={cn(
                    "w-full bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-xl shadow-xl sm:shadow-2xl border border-neutral-200/90 dark:border-neutral-800/80 transition-all",
                    paperSize === "letter" ? "max-w-[620px] p-6 sm:p-8" : "max-w-[600px] p-6 sm:p-8"
                  )}
                >
                  
                  {/* Template 1: Modern LaTeX Layout */}
                  {activeTemplate === "latex" && (
                    <div className="space-y-4 font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                      
                      {/* Name & Contact Bar */}
                      <div className="text-center pb-2">
                        <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 uppercase">
                          Alexander Reid
                        </h4>
                        <div className="mt-1 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
                          <span>San Francisco, CA</span>
                          <span>|</span>
                          <span>alex@reid.dev</span>
                          <span>|</span>
                          <span>linkedin.com/in/alexreid</span>
                          <span>|</span>
                          <span>github.com/alexreid</span>
                        </div>
                      </div>

                      {/* Section: Experience */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border-b border-neutral-800 dark:border-neutral-200 pb-0.5">
                          Experience
                        </div>

                        {/* Role 1 */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline font-bold text-neutral-950 dark:text-neutral-50">
                            <span>Staff Infrastructure Engineer</span>
                            <span className="font-mono text-[11px] font-normal text-neutral-500">2022 — Present</span>
                          </div>
                          <div className="text-[11px] italic text-neutral-700 dark:text-neutral-300">
                            Stripe — Core Payments Architecture
                          </div>
                          <ul className="space-y-1 pt-0.5 text-[11px] sm:text-[11.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans list-disc list-inside">
                            <li>
                              Architected distributed transaction ingestion pipeline handling{" "}
                              <strong className="font-semibold text-neutral-950 dark:text-neutral-50">120M+ daily events</strong> with 99.999% ledger consistency.
                            </li>
                            <li>
                              Reduced database lock contention by{" "}
                              <strong className="font-semibold text-neutral-950 dark:text-neutral-50">68%</strong> by introducing optimistic batching and connection pooling.
                            </li>
                          </ul>
                        </div>

                        {/* Role 2 */}
                        <div className="space-y-1 text-xs pt-1.5">
                          <div className="flex justify-between items-baseline font-bold text-neutral-950 dark:text-neutral-50">
                            <span>Senior Software Engineer</span>
                            <span className="font-mono text-[11px] font-normal text-neutral-500">2019 — 2022</span>
                          </div>
                          <div className="text-[11px] italic text-neutral-700 dark:text-neutral-300">
                            Airbnb — Distributed Systems Group
                          </div>
                          <ul className="space-y-1 pt-0.5 text-[11px] sm:text-[11.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans list-disc list-inside">
                            <li>
                              Migrated legacy monolithic services to Kubernetes, reducing annual cloud compute spend by{" "}
                              <strong className="font-semibold text-neutral-950 dark:text-neutral-50">$1.8M</strong>.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Section: Education */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border-b border-neutral-800 dark:border-neutral-200 pb-0.5">
                          Education
                        </div>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-neutral-950 dark:text-neutral-50">University of California, Berkeley</span>
                          <span className="font-mono text-[11px] text-neutral-500">2015 — 2019</span>
                        </div>
                        <div className="text-[11px] italic text-neutral-700 dark:text-neutral-300">
                          B.S. in Electrical Engineering & Computer Science (EECS)
                        </div>
                      </div>

                      {/* Section: Skills */}
                      <div className="space-y-1 pt-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 border-b border-neutral-800 dark:border-neutral-200 pb-0.5">
                          Technical Skills
                        </div>
                        <div className="text-[11px] text-neutral-800 dark:text-neutral-200 font-sans space-y-0.5 pt-0.5">
                          <div>
                            <strong className="font-semibold text-neutral-950 dark:text-neutral-50">Languages:</strong> Go, Rust, TypeScript, Python, C++, SQL
                          </div>
                          <div>
                            <strong className="font-semibold text-neutral-950 dark:text-neutral-50">Infrastructure:</strong> Distributed Consensus (Raft), Kafka, Kubernetes, Redis, AWS
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Template 2: Executive Minimalist Layout */}
                  {activeTemplate === "classic" && (
                    <div className="space-y-4 font-sans">
                      
                      {/* Executive Header */}
                      <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h4 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                            Alexander Reid
                          </h4>
                          <div className="text-xs text-neutral-500 font-medium mt-0.5">
                            Staff Systems Architect & Engineering Leader
                          </div>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono text-left sm:text-right">
                          San Francisco, CA • alex@reid.dev
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-[11.5px] text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                        Systems architect with 8+ years designing high-throughput transaction pipelines, distributed databases, and fault-tolerant infrastructure at global scale.
                      </div>

                      {/* Experience */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                          Selected Leadership & Experience
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                              Stripe — Staff Infrastructure Engineer
                            </span>
                            <span className="font-mono text-[11px] text-neutral-500">2022 — Present</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Spearheaded core multi-currency settlement modernization. Authored the technical RFC and led 6 senior engineers to migrate critical payment pathways without customer downtime.
                          </p>
                        </div>

                        <div className="space-y-1 text-xs pt-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                              Airbnb — Senior Systems Engineer
                            </span>
                            <span className="font-mono text-[11px] text-neutral-500">2019 — 2022</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Drove company-wide Kubernetes adoption across 40+ engineering squads, improving deployment frequency by 4x and cutting hardware overhead by $1.8M.
                          </p>
                        </div>
                      </div>

                      {/* Core Domains */}
                      <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                            Distributed Systems
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                            Technical Strategy & RFCs
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                            Cloud Economics
                          </span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Template 3: Structured Dual-Rail Layout */}
                  {activeTemplate === "two-column" && (
                    <div className="space-y-3 font-sans">
                      
                      {/* Header */}
                      <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline">
                        <div>
                          <h4 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
                            ALEXANDER REID
                          </h4>
                          <div className="text-xs text-neutral-500 font-mono">
                            Senior Staff Infrastructure Engineer
                          </div>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          alex@reid.dev
                        </div>
                      </div>

                      {/* Dual-Rail Grid */}
                      <div className="grid grid-cols-12 gap-5 pt-1">
                        
                        {/* Left Column (4 cols) */}
                        <div className="col-span-4 space-y-3 border-r border-neutral-200/80 dark:border-neutral-800/80 pr-3">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                              Core Skills
                            </div>
                            <div className="text-[11px] text-neutral-700 dark:text-neutral-300 space-y-1">
                              <div>• Go & Rust</div>
                              <div>• Distributed Raft</div>
                              <div>• Kafka & Spark</div>
                              <div>• Kubernetes</div>
                              <div>• Postgres Scaling</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                              Education
                            </div>
                            <div className="text-[11px]">
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100">UC Berkeley</div>
                              <div className="text-[10px] text-neutral-500">B.S. EECS '19</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                              Credentials
                            </div>
                            <div className="text-[10px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                              <div>AWS Solutions Pro</div>
                              <div>CKA Administrator</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column (8 cols) */}
                        <div className="col-span-8 space-y-3">
                          <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                            Experience & System Impact
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-neutral-950 dark:text-neutral-50">
                              <span>Staff Engineer • Stripe</span>
                              <span className="font-mono text-[10px] text-neutral-500 font-normal">2022 — Present</span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                              Architected distributed payment ingestion pipeline processing 120M+ daily events with 99.999% ledger consistency.
                            </p>
                          </div>

                          <div className="space-y-1 text-xs pt-1.5 border-t border-neutral-200/40 dark:border-neutral-800/40">
                            <div className="flex justify-between font-semibold text-neutral-950 dark:text-neutral-50">
                              <span>Senior Engineer • Airbnb</span>
                              <span className="font-mono text-[10px] text-neutral-500 font-normal">2019 — 2022</span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                              Led multi-cluster Kubernetes migration, cutting p99 service mesh latency by 45% and annual compute cost by $1.8M.
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

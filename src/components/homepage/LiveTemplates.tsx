"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TemplateId = "latex" | "classic" | "two-column";
type PaperSize = "letter" | "a4";

interface Template {
  id: TemplateId;
  label: string;
  subtitle: string;
  format: string;
}

const TEMPLATES: Template[] = [
  {
    id: "latex",
    label: "LaTeX Standard",
    subtitle: "Single-column academic hierarchy with dense technical impact.",
    format: "Single Column · Serif",
  },
  {
    id: "classic",
    label: "Executive Minimal",
    subtitle: "Refined narrative summary with generous typographic breathing room.",
    format: "Editorial · Leadership",
  },
  {
    id: "two-column",
    label: "Structured Dual-Rail",
    subtitle: "Compact competencies rail alongside a wide experience track.",
    format: "Two Column · Technical",
  },
];

export default function LiveTemplates() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("latex");
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const shouldReduceMotion = useReducedMotion();

  const current = TEMPLATES.find((t) => t.id === activeTemplate) ?? TEMPLATES[0];

  return (
    <section
      id="templates"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-16 sm:py-24 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[620px] mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Precision typesetting,
            <br />
            calibrated for every reader.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed">
            Every template compiles to crisp vector PDFs with zero invisible table traps or broken glyphs.
          </p>

          {/* Minimal Centered Switcher Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Template Selector Pills */}
            <div className="inline-flex p-1 rounded-full bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622]">
              {TEMPLATES.map((t) => {
                const isActive = activeTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTemplate(t.id)}
                    className={cn(
                      "relative px-4 py-1.5 rounded-full text-xs font-medium transition-[color,transform] duration-150 ease-out cursor-pointer active:scale-[0.96]",
                      isActive
                        ? "text-[#1c1b18] dark:text-[#f3f2ee]"
                        : "text-[#8b897f] dark:text-[#9c9a8f] hover:text-[#1c1b18] dark:hover:text-[#edebe6]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTemplateIndicator"
                        className="absolute inset-0 bg-[#ffffff] dark:bg-[#252420] rounded-full shadow-xs border border-[#e2e0da] dark:border-[#2d2b26]"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Paper Size Mini Toggle */}
            <div className="inline-flex p-1 rounded-full bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setPaperSize("letter")}
                className={cn(
                  "px-3 py-1 rounded-full transition-colors cursor-pointer",
                  paperSize === "letter"
                    ? "bg-[#ffffff] dark:bg-[#252420] text-[#1c1b18] dark:text-[#edebe6] font-semibold shadow-2xs border border-[#e2e0da] dark:border-[#2d2b26]"
                    : "text-[#8b897f] hover:text-[#1c1b18] dark:hover:text-[#edebe6]"
                )}
              >
                Letter
              </button>
              <button
                type="button"
                onClick={() => setPaperSize("a4")}
                className={cn(
                  "px-3 py-1 rounded-full transition-colors cursor-pointer",
                  paperSize === "a4"
                    ? "bg-[#ffffff] dark:bg-[#252420] text-[#1c1b18] dark:text-[#edebe6] font-semibold shadow-2xs border border-[#e2e0da] dark:border-[#2d2b26]"
                    : "text-[#8b897f] hover:text-[#1c1b18] dark:hover:text-[#edebe6]"
                )}
              >
                A4
              </button>
            </div>
          </div>
        </div>

        {/* Live Specimen Drafting Sheet */}
        <div className="max-w-[760px] mx-auto">
          {/* Subtle Outer Drafting Mat */}
          <div className="rounded-3xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] p-4 sm:p-7 shadow-xs">
            
            {/* Minimal Specimen Header Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#e2e0da] dark:border-[#282622] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] text-[#8b897f] dark:text-[#9c9a8f]">
                  {current.format}
                </span>
                <span className="text-[#8b897f] hidden sm:inline">•</span>
                <span className="font-mono text-[11px] text-[#8b897f] dark:text-[#9c9a8f] hidden sm:inline">
                  {paperSize === "letter" ? "8.5 × 11 in" : "210 × 297 mm"}
                </span>
              </div>

              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1c1b18] dark:text-[#edebe6] hover:opacity-80 transition-opacity"
              >
                <span>Use this layout</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>

            {/* Tangible Paper Sheet */}
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTemplate}-${paperSize}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className={cn(
                    "w-full bg-[#ffffff] dark:bg-[#1e1d1a] text-[#1c1b18] dark:text-[#edebe6] rounded-xl shadow-lg border border-[#e2e0da] dark:border-[#282622] transition-all",
                    paperSize === "letter" ? "p-6 sm:p-8" : "p-6 sm:p-8"
                  )}
                >
                  
                  {/* Template 1: LaTeX Standard (Single Column Serif) */}
                  {activeTemplate === "latex" && (
                    <div className="space-y-4 font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                      {/* Name & Contact Bar */}
                      <div className="text-center pb-2">
                        <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1b18] dark:text-[#f3f2ee] uppercase">
                          Alexander Reid
                        </h4>
                        <div className="mt-1 text-[11px] text-[#8b897f] dark:text-[#9c9a8f] font-mono flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
                          <span>San Francisco, CA</span>
                          <span>|</span>
                          <span>alex@reid.dev</span>
                          <span>|</span>
                          <span>linkedin.com/in/alexreid</span>
                          <span>|</span>
                          <span>github.com/alexreid</span>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#1c1b18] dark:text-[#f3f2ee] border-b border-[#1c1b18] dark:border-[#f3f2ee] pb-0.5">
                          Experience
                        </div>

                        {/* Role 1 */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline font-bold text-[#1c1b18] dark:text-[#f3f2ee]">
                            <span>Staff Infrastructure Engineer</span>
                            <span className="font-mono text-[11px] font-normal text-[#8b897f]">2022 — Present</span>
                          </div>
                          <div className="text-[11px] italic text-[#8b897f]">
                            Stripe — Core Payments Architecture
                          </div>
                          <ul className="space-y-1 pt-0.5 text-[11px] sm:text-[11.5px] leading-relaxed font-sans list-disc list-inside text-[#1c1b18] dark:text-[#edebe6]">
                            <li>
                              Architected distributed transaction ingestion pipeline handling{" "}
                              <strong className="font-semibold">120M+ daily events</strong> with 99.999% ledger consistency.
                            </li>
                            <li>
                              Reduced database lock contention by{" "}
                              <strong className="font-semibold">68%</strong> by introducing optimistic batching and connection pooling.
                            </li>
                          </ul>
                        </div>

                        {/* Role 2 */}
                        <div className="space-y-1 text-xs pt-1">
                          <div className="flex justify-between items-baseline font-bold text-[#1c1b18] dark:text-[#f3f2ee]">
                            <span>Senior Software Engineer</span>
                            <span className="font-mono text-[11px] font-normal text-[#8b897f]">2019 — 2022</span>
                          </div>
                          <div className="text-[11px] italic text-[#8b897f]">
                            Airbnb — Distributed Systems Group
                          </div>
                          <ul className="space-y-1 pt-0.5 text-[11px] sm:text-[11.5px] leading-relaxed font-sans list-disc list-inside text-[#1c1b18] dark:text-[#edebe6]">
                            <li>
                              Migrated legacy monolithic services to Kubernetes, reducing annual cloud compute spend by{" "}
                              <strong className="font-semibold">$1.8M</strong>.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#1c1b18] dark:text-[#f3f2ee] border-b border-[#1c1b18] dark:border-[#f3f2ee] pb-0.5">
                          Education
                        </div>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-[#1c1b18] dark:text-[#f3f2ee]">University of California, Berkeley</span>
                          <span className="font-mono text-[11px] text-[#8b897f]">2015 — 2019</span>
                        </div>
                        <div className="text-[11px] italic text-[#8b897f]">
                          B.S. in Electrical Engineering & Computer Science (EECS)
                        </div>
                      </div>

                      {/* Technical Skills */}
                      <div className="space-y-1 pt-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#1c1b18] dark:text-[#f3f2ee] border-b border-[#1c1b18] dark:border-[#f3f2ee] pb-0.5">
                          Technical Skills
                        </div>
                        <div className="text-[11px] font-sans space-y-0.5 pt-0.5 text-[#1c1b18] dark:text-[#edebe6]">
                          <div>
                            <strong className="font-semibold">Languages:</strong> Go, Rust, TypeScript, Python, C++, SQL
                          </div>
                          <div>
                            <strong className="font-semibold">Infrastructure:</strong> Distributed Systems (Raft), Kafka, Kubernetes, Redis, AWS
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template 2: Executive Minimal (Editorial Serif & Narrative) */}
                  {activeTemplate === "classic" && (
                    <div className="space-y-4 font-sans">
                      {/* Executive Header */}
                      <div className="pb-3 border-b border-[#e2e0da] dark:border-[#282622] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h4 className="text-2xl font-semibold tracking-tight text-[#1c1b18] dark:text-[#f3f2ee] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                            Alexander Reid
                          </h4>
                          <div className="text-xs text-[#8b897f] font-medium mt-0.5">
                            Staff Systems Architect & Engineering Leader
                          </div>
                        </div>
                        <div className="text-[11px] text-[#8b897f] font-mono text-left sm:text-right">
                          San Francisco, CA • alex@reid.dev
                        </div>
                      </div>

                      {/* Executive Narrative Summary */}
                      <div className="p-3 rounded-lg bg-[#f5f3ef] dark:bg-[#252420] border border-[#e2e0da] dark:border-[#282622] text-[11.5px] text-[#1c1b18] dark:text-[#edebe6] leading-relaxed italic">
                        Systems architect with 8+ years designing high-throughput transaction pipelines, distributed databases, and fault-tolerant infrastructure at global scale.
                      </div>

                      {/* Selected Experience */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b897f] font-semibold">
                          Selected Leadership & Experience
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                              Stripe — Staff Infrastructure Engineer
                            </span>
                            <span className="font-mono text-[11px] text-[#8b897f]">2022 — Present</span>
                          </div>
                          <p className="text-[11px] text-[#8b897f] leading-relaxed">
                            Spearheaded core multi-currency settlement modernization. Authored the technical RFC and led 6 senior engineers to migrate critical payment pathways without customer downtime.
                          </p>
                        </div>

                        <div className="space-y-1 text-xs pt-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                              Airbnb — Senior Systems Engineer
                            </span>
                            <span className="font-mono text-[11px] text-[#8b897f]">2019 — 2022</span>
                          </div>
                          <p className="text-[11px] text-[#8b897f] leading-relaxed">
                            Drove company-wide Kubernetes adoption across 40+ engineering squads, improving deployment frequency by 4x and cutting hardware overhead by $1.8M.
                          </p>
                        </div>
                      </div>

                      {/* Core Domains */}
                      <div className="pt-2 border-t border-[#e2e0da] dark:border-[#282622]">
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3ef] dark:bg-[#252420] text-[#1c1b18] dark:text-[#edebe6] border border-[#e2e0da] dark:border-[#282622] font-medium">
                            Distributed Systems
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3ef] dark:bg-[#252420] text-[#1c1b18] dark:text-[#edebe6] border border-[#e2e0da] dark:border-[#282622] font-medium">
                            Technical Strategy & RFCs
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3ef] dark:bg-[#252420] text-[#1c1b18] dark:text-[#edebe6] border border-[#e2e0da] dark:border-[#282622] font-medium">
                            Cloud Economics
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template 3: Structured Dual-Rail (Two Column Technical) */}
                  {activeTemplate === "two-column" && (
                    <div className="space-y-3 font-sans">
                      {/* Compact Header */}
                      <div className="pb-3 border-b border-[#e2e0da] dark:border-[#282622] flex justify-between items-baseline">
                        <div>
                          <h4 className="text-xl font-bold tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]">
                            ALEXANDER REID
                          </h4>
                          <div className="text-xs text-[#8b897f] font-mono">
                            Senior Staff Infrastructure Engineer
                          </div>
                        </div>
                        <div className="text-[11px] text-[#8b897f] font-mono">
                          alex@reid.dev
                        </div>
                      </div>

                      {/* Dual-Rail Grid */}
                      <div className="grid grid-cols-12 gap-5 pt-1">
                        {/* Left Rail (4 cols) */}
                        <div className="col-span-4 space-y-3 border-r border-[#e2e0da] dark:border-[#282622] pr-3">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8b897f]">
                              Core Skills
                            </div>
                            <div className="text-[11px] text-[#1c1b18] dark:text-[#edebe6] space-y-1">
                              <div>• Go & Rust</div>
                              <div>• Distributed Raft</div>
                              <div>• Kafka & Spark</div>
                              <div>• Kubernetes</div>
                              <div>• Postgres Scaling</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-[#e2e0da] dark:border-[#282622]">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8b897f]">
                              Education
                            </div>
                            <div className="text-[11px]">
                              <div className="font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">UC Berkeley</div>
                              <div className="text-[10px] text-[#8b897f]">B.S. EECS '19</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1 border-t border-[#e2e0da] dark:border-[#282622]">
                            <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8b897f]">
                              Credentials
                            </div>
                            <div className="text-[10px] text-[#8b897f] space-y-0.5">
                              <div>AWS Solutions Pro</div>
                              <div>CKA Administrator</div>
                            </div>
                          </div>
                        </div>

                        {/* Right Rail (8 cols) */}
                        <div className="col-span-8 space-y-3">
                          <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8b897f]">
                            Experience & System Impact
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                              <span>Staff Engineer • Stripe</span>
                              <span className="font-mono text-[10px] text-[#8b897f] font-normal">2022 — Present</span>
                            </div>
                            <p className="text-[11px] text-[#8b897f] leading-relaxed">
                              Architected distributed payment ingestion pipeline processing 120M+ daily events with 99.999% ledger consistency.
                            </p>
                          </div>

                          <div className="space-y-1 text-xs pt-1.5 border-t border-[#e2e0da] dark:border-[#282622]">
                            <div className="flex justify-between font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                              <span>Senior Engineer • Airbnb</span>
                              <span className="font-mono text-[10px] text-[#8b897f] font-normal">2019 — 2022</span>
                            </div>
                            <p className="text-[11px] text-[#8b897f] leading-relaxed">
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

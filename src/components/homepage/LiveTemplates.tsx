"use client";

import React, { useState } from "react";
import { Check, Sparkles, Download, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LiveTemplates() {
  const [activeTemplate, setActiveTemplate] = useState<"latex" | "classic" | "two-column">("latex");

  const templates = [
    {
      id: "latex" as const,
      name: "Modern LaTeX Engineering",
      badge: "Industry Favorite",
      desc: "Single-column typographical standard optimized for maximum ATS parsing rate and engineering leadership roles.",
    },
    {
      id: "classic" as const,
      name: "Executive Minimalist",
      badge: "ATS Gold Standard",
      desc: "Clean serif headers with refined metrics layout, trusted for executive, management, and high-stakes positions.",
    },
    {
      id: "two-column" as const,
      name: "Structured Technical",
      badge: "High Density",
      desc: "Dual-rail layout highlighting skills, patents, and projects without sacrificing linear machine-readability.",
    },
  ];

  return (
    <section id="templates" className="py-20 sm:py-28 border-t border-border/50 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Precision Typography
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-3 leading-[1.12]">
            Templates engineered to survive the filter.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
            Every template in Resumely compiles to crisp vector PDFs with zero invisible table traps or broken glyphs.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex p-1 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 self-start md:self-auto">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer",
                activeTemplate === t.id
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {t.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Template Specimen Display Card */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Specimen Info */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {templates.find((t) => t.id === activeTemplate)?.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-neutral-100">
              {templates.find((t) => t.id === activeTemplate)?.name}
            </h3>
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {templates.find((t) => t.id === activeTemplate)?.desc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-[#1b2820] hover:bg-[#25382d] text-white dark:bg-white dark:text-neutral-950 text-xs font-medium transition-all shadow-xs"
              >
                <span>Use This Template</span>
              </Link>
            </div>
          </div>

          {/* Right Live Specimen Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 font-sans text-neutral-900 dark:text-neutral-100 space-y-4">
              
              {/* Header */}
              <div className="text-center pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="text-lg font-bold tracking-tight">ALEXANDER REID</div>
                <div className="text-xs text-neutral-500 font-mono">
                  San Francisco, CA • alex@reid.dev • linkedin.com/in/alexreid
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono tracking-wider uppercase text-neutral-400 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-1">
                  EXPERIENCE
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline font-semibold">
                    <span>Staff Infrastructure Engineer</span>
                    <span className="font-mono text-neutral-500 text-[11px]">2022 — Present</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400 text-[11px]">Stripe • Global Core Payments</div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    • Designed distributed settlement engine processing \$40B+ annual volume across 42 currencies with 99.999% ledger consistency.
                  </p>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    • Reduced p99 database lock contention by 68% through optimistic batch pipelining.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs pt-2">
                  <div className="flex justify-between items-baseline font-semibold">
                    <span>Senior Software Engineer</span>
                    <span className="font-mono text-neutral-500 text-[11px]">2019 — 2022</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400 text-[11px]">Airbnb • Core Infrastructure</div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    • Migrated legacy service mesh to Kubernetes, shaving \$1.8M in annual compute costs.
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                <div className="text-[11px] font-mono text-neutral-500">
                  <strong className="text-neutral-800 dark:text-neutral-200">Technologies:</strong> Go, Rust, TypeScript, Distributed Systems, Kafka, PostgreSQL, Docker, AWS
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


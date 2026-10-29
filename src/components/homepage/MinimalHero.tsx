"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  Bookmark,
  Zap,
  ShieldCheck,
  ChevronRight,
  Send,
  Eye,
  Check,
} from "lucide-react";

export default function MinimalHero() {
  const [activeTab, setActiveTab] = useState<"match" | "autofill" | "pitch">("match");
  const [hasCopiedPitch, setHasCopiedPitch] = useState(false);

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Outer Floating Panel Container */}
      <div className="relative rounded-3xl sm:rounded-4xl bg-[#faf9f7] dark:bg-[#151518]/90 border border-[#e8e6e3] dark:border-zinc-800/80 p-6 sm:p-12 md:p-16 shadow-xs overflow-hidden transition-all">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial from-orange-500/5 dark:from-orange-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Hero Header Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#dad8d4] dark:border-zinc-800 text-[11px] font-medium tracking-widest uppercase text-[#6e6c68] dark:text-zinc-400 mb-6 shadow-2xs">
            <span className="size-1.5 rounded-full bg-[#e8531f] animate-pulse" />
            <span>The Intelligent Career Companion · v2.0</span>
          </div>

          {/* High-Contrast Editorial Serif Display Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1e1d1b] dark:text-zinc-50 leading-[1.08] text-balance">
            Land the role, <span className="italic font-light">without the busywork.</span>
          </h1>

          {/* Centered Lede Paragraph */}
          <p className="mt-6 text-base sm:text-lg text-[#6e6c68] dark:text-zinc-400 leading-relaxed max-w-2xl text-balance">
            Resumely matches your master resume to live job postings in real time, flags missing keywords before ATS filters reject you, and auto-fills applications with zero friction.
          </p>

          {/* 3 Gray Pill Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f3f1] dark:bg-zinc-900/80 border border-[#dad8d4]/70 dark:border-zinc-800 text-xs font-medium text-[#1e1d1b] dark:text-zinc-300">
              <span className="text-[#e8531f] text-sm leading-none">✦</span> Real-Time ATS Fit Gauge
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f3f1] dark:bg-zinc-900/80 border border-[#dad8d4]/70 dark:border-zinc-800 text-xs font-medium text-[#1e1d1b] dark:text-zinc-300">
              <Zap className="size-3.5 text-[#e8531f]" /> 1-Click Application Autofill
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f3f1] dark:bg-zinc-900/80 border border-[#dad8d4]/70 dark:border-zinc-800 text-xs font-medium text-[#1e1d1b] dark:text-zinc-300">
              <Sparkles className="size-3.5 text-[#e8531f]" /> Tailored Elevator Pitch
            </span>
          </div>

          {/* CTA Pill Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/resume"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 active:scale-98 transition-all shadow-sm"
            >
              <span>Build Master Resume</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-[#dad8d4] dark:border-zinc-800 text-[#1e1d1b] dark:text-zinc-200 text-sm font-medium hover:bg-[#f4f3f1] dark:hover:bg-zinc-800 active:scale-98 transition-all"
            >
              <Eye className="size-4 text-[#6e6c68] dark:text-zinc-400" />
              <span>Explore Live Preview</span>
            </a>
          </div>

          <p className="mt-4 text-xs text-[#6e6c68] dark:text-zinc-500">
            Free plan available · No credit card required · Privacy-first storage
          </p>
        </div>

        {/* Hero Interactive Collage / Product Mockup */}
        <div id="interactive-demo" className="mt-14 pt-2 relative">
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-[#dad8d4] dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            {/* macOS Window Chrome Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dad8d4]/80 dark:border-zinc-800 bg-[#f4f3f1]/70 dark:bg-zinc-900/60 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-[#6e6c68] dark:text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                  resumely-assistant://active-tab · Linear Careers
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  Extension Live
                </span>
              </div>
            </div>

            {/* Split Screen Application Assistant Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#dad8d4]/80 dark:divide-zinc-800">
              {/* Left Column: Job Description & Extracted Specs (7 cols) */}
              <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-5 bg-white dark:bg-zinc-950">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      Linear · San Francisco, CA (Remote)
                    </span>
                    <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      $180k – $220k
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-[#1e1d1b] dark:text-zinc-100">
                    Staff Frontend Engineer (Core Product)
                  </h3>
                  <p className="mt-2 text-xs text-[#6e6c68] dark:text-zinc-400 leading-relaxed">
                    We are looking for an exceptional engineer to lead frontend architecture across our web and desktop applications. You will craft high-performance client sync, offline-first interactions, and maintain zero-latency keyboard-driven workflows.
                  </p>
                </div>

                {/* Live Extraction Details */}
                <div className="rounded-xl border border-[#dad8d4]/80 dark:border-zinc-800/80 bg-[#faf9f7] dark:bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#1e1d1b] dark:text-zinc-200">
                      Extracted Requirements & Skills
                    </span>
                    <span className="text-[10px] font-mono text-[#e8531f] font-semibold">
                      6 Matched · 0 Missing
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["TypeScript", "React", "Next.js", "WebSockets", "GraphQL", "Tailwind CSS"].map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                      >
                        <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Mode Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f4f3f1] dark:bg-zinc-900 border border-[#dad8d4]/70 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTab("match")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "match"
                        ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-2xs"
                        : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    ATS Match Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab("autofill")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "autofill"
                        ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-2xs"
                        : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    1-Click Autofill
                  </button>
                  <button
                    onClick={() => setActiveTab("pitch")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "pitch"
                        ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-2xs"
                        : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    Elevator Pitch
                  </button>
                </div>
              </div>

              {/* Right Column: Resumely Extension Panel & Active Mode View (5 cols) */}
              <div className="md:col-span-5 p-5 sm:p-6 bg-[#faf9f7]/50 dark:bg-zinc-900/20 flex flex-col justify-between space-y-4">
                {activeTab === "match" && (
                  <div className="space-y-4">
                    {/* ATS Gauge Card */}
                    <div className="rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xs">
                      <div className="flex items-center gap-4">
                        {/* Circular Score Ring */}
                        <div className="relative size-18 flex items-center justify-center shrink-0">
                          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-zinc-100 dark:text-zinc-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-emerald-500"
                              strokeDasharray="98, 100"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
                              98<span className="text-xs font-normal">%</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-500" /> Strong ATS Alignment
                          </div>
                          <h4 className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            Master Resume v2.4
                          </h4>
                          <p className="text-[11px] text-[#6e6c68] dark:text-zinc-400 leading-tight">
                            Keyword density exceeds top candidate threshold.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#dad8d4]/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 space-y-2">
                      <div className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-200">
                        Top Resume Bullets Tailored
                      </div>
                      <div className="text-[11px] text-[#6e6c68] dark:text-zinc-400 space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Architected Next.js micro-frontends handling 15M+ daily requests.</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Reduced client latency by 42% via WebSockets & optimistic mutation.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "autofill" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          Autofill Status
                        </span>
                        <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          14 / 14 Fields Ready
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-[#6e6c68] dark:text-zinc-400">
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                          <span>Full Name</span>
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">Alex Morgan</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                          <span>Work Authorization</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">US Citizen (No Sponsor)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                          <span>GitHub & LinkedIn</span>
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">Synced ✓</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Custom Question AI</span>
                          <span className="font-mono text-purple-600 dark:text-purple-400">Auto-Generated ✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-3 text-center">
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        Supports Greenhouse, Lever, Ashby, Workday & Google Forms
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "pitch" && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          Generated Cover Pitch
                        </span>
                        <button
                          onClick={() => {
                            setHasCopiedPitch(true);
                            setTimeout(() => setHasCopiedPitch(false), 2000);
                          }}
                          className="text-[10px] font-semibold text-[#e8531f] hover:underline cursor-pointer"
                        >
                          {hasCopiedPitch ? "Copied!" : "Copy Pitch"}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6e6c68] dark:text-zinc-400 leading-relaxed font-mono bg-[#faf9f7] dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        &quot;Hi Linear Team, as a Staff Frontend Engineer specializing in Next.js and high-frequency WebSockets, I have led zero-latency client architectures serving 15M+ daily requests. I would love to bring this velocity to Linear&apos;s sync engine.&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6e6c68] dark:text-zinc-400 px-1">
                      <span>Tailored for Linear</span>
                      <span>Target: Staff Level</span>
                    </div>
                  </div>
                )}

                {/* Action button inside mockup */}
                <Link
                  href="/resume"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-zinc-200 active:scale-98 transition-all"
                >
                  <Bookmark className="size-3.5" />
                  <span>Save to Resumely Job Tracker</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

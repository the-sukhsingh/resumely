"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  Zap,
  FileText,
  Kanban,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react";

type FeatureTab = "ats" | "autofill" | "studio" | "tracker";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("ats");

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Centered Serif Section Headline with Muted Subline */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1e1d1b] dark:text-zinc-50 leading-[1.12]">
          Built for every stage of your career journey.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#6e6c68] dark:text-zinc-400">
          From drafting your master achievements to tracking offers across companies, Resumely brings cohesion to your entire job search.
        </p>
      </div>

      {/* Segmented Pill Track as in DESIGN.md */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-[#eceae7] dark:bg-zinc-900 border border-[#dad8d4] dark:border-zinc-800 shadow-2xs overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveTab("ats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "ats"
                ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-xs"
                : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Target className="size-3.5 text-[#e8531f]" />
            <span>ATS Match Engine</span>
          </button>
          <button
            onClick={() => setActiveTab("autofill")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "autofill"
                ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-xs"
                : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Zap className="size-3.5 text-[#e8531f]" />
            <span>Smart Autofill</span>
          </button>
          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "studio"
                ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-xs"
                : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <FileText className="size-3.5 text-[#e8531f]" />
            <span>Master Resume Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "tracker"
                ? "bg-white dark:bg-zinc-800 text-[#1e1d1b] dark:text-white shadow-xs"
                : "text-[#6e6c68] dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Kanban className="size-3.5 text-[#e8531f]" />
            <span>Application Kanban</span>
          </button>
        </div>
      </div>

      {/* Feature Window Container */}
      <div className="rounded-3xl border border-[#dad8d4] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-lg min-h-[440px] flex flex-col justify-between">
        {/* Tab 1: ATS Match Engine */}
        {activeTab === "ats" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#e8531f] uppercase tracking-wider">
                01 · Precision Keyword Matching
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1d1b] dark:text-zinc-100">
                Never get filtered out by algorithmic gatekeepers.
              </h3>
              <p className="text-sm text-[#6e6c68] dark:text-zinc-400 leading-relaxed">
                Applicant tracking systems discard up to 75% of qualified resumes before human eyes see them. Resumely analyzes the exact taxonomy of the job posting and scores your resume in real time.
              </p>
              <ul className="space-y-2 text-xs text-[#1e1d1b] dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Real-time keyword density comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Missing technical skill detection & suggestions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Instant tailored elevator pitch for hiring managers</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e1d1b] dark:text-white hover:underline"
                >
                  <span>Test with your resume</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Interactive Visual Right */}
            <div className="lg:col-span-7 rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#dad8d4]/70 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    St
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Stripe · Senior Full Stack
                    </div>
                    <div className="text-[10px] text-zinc-500">Extracted from stripe.com/jobs</div>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  94% Match Fit
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                  Identified Core Competencies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Next.js App Router",
                    "TypeScript 5",
                    "PostgreSQL",
                    "REST Architecture",
                    "Microservices",
                    "Distributed Systems",
                    "CI/CD Pipeline",
                  ].map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 text-[11px] text-amber-800 dark:text-amber-300">
                <span className="font-bold">Missing Keyword Alert:</span> Job emphasizes &quot;Kafka&quot; or &quot;Event-Driven&quot; architecture. Add your event-streaming accomplishments to reach 99%.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Smart Autofill */}
        {activeTab === "autofill" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#e8531f] uppercase tracking-wider">
                02 · Autonomous Form Fill
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1d1b] dark:text-zinc-100">
                Fill multi-page job portals with one click.
              </h3>
              <p className="text-sm text-[#6e6c68] dark:text-zinc-400 leading-relaxed">
                Tired of re-typing your work history, education, LinkedIn, and personal details into every portal? Resumely parses complex forms and triggers native input events so validation errors never block you.
              </p>
              <ul className="space-y-2 text-xs text-[#1e1d1b] dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Works seamlessly on Google Forms, Greenhouse, Lever & Ashby</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Bypasses &quot;This is a required question&quot; synthetic event traps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Auto-detects multi-step page wizard changes</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-900/40 p-6 space-y-3">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Google Form / Greenhouse Application Simulator
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-400">First & Last Name *</div>
                  <div className="text-zinc-900 dark:text-zinc-100 font-medium">Alex Morgan</div>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-400">LinkedIn Profile URL *</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">https://linkedin.com/in/alexmorgan-dev</div>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] text-zinc-400">GitHub Profile URL *</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">https://github.com/alexmorgan</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                <span>All 12 required fields filled successfully</span>
                <span>Zero Validation Warnings ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Master Resume Studio */}
        {activeTab === "studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#e8531f] uppercase tracking-wider">
                03 · Modular Resume Studio
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1d1b] dark:text-zinc-100">
                A single source of truth for your entire career.
              </h3>
              <p className="text-sm text-[#6e6c68] dark:text-zinc-400 leading-relaxed">
                Maintain a master inventory of all your projects, roles, certifications, and achievements. Fork targeted versions for specific roles with one click and export pixel-perfect PDFs.
              </p>
              <ul className="space-y-2 text-xs text-[#1e1d1b] dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Real-time live PDF preview engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Customizable layout, margins, and typography tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Instant version branching (Frontend, Fullstack, Lead)</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-all"
                >
                  <FileText className="size-3.5" />
                  <span>Open Resume Studio</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-900/40 p-6 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-md text-left space-y-2">
                <div className="h-4 w-32 bg-zinc-900 dark:bg-zinc-100 rounded" />
                <div className="h-2 w-48 bg-zinc-400 dark:bg-zinc-600 rounded" />
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-2.5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-2.5 w-4/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Interactive Modular Resume Engine
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Application Kanban */}
        {activeTab === "tracker" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#e8531f] uppercase tracking-wider">
                04 · Automated Pipeline
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1d1b] dark:text-zinc-100">
                Organize every application effortlessly.
              </h3>
              <p className="text-sm text-[#6e6c68] dark:text-zinc-400 leading-relaxed">
                Save roles with a single click right from the job listing. Keep track of application deadlines, referral notes, interview stages, and offers in an integrated visual board.
              </p>
              <ul className="space-y-2 text-xs text-[#1e1d1b] dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Automatic salary and location extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Track stages: Wishlist → Applied → Interview → Offer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Direct link back to original job posting</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/tracker"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e1d1b] dark:text-white hover:underline"
                >
                  <span>Open Job Tracker</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[#dad8d4]/90 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-900/40 p-6 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Wishlist (4)</div>
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs font-semibold">Stripe</div>
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-xs font-semibold">Linear</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="text-[10px] font-bold text-blue-500 uppercase">Applied (7)</div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Vercel
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Datadog
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase">Interview (2)</div>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Airbnb
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caption Line centered under screenshot as in DESIGN.md */}
        <div className="text-center pt-6 border-t border-[#dad8d4]/60 dark:border-zinc-800/80 text-xs text-[#6e6c68] dark:text-zinc-500">
          Integrated directly into your browser workflow with the Resumely Chrome Extension.
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import ColoredButton from "@/components/custom/colored-button";
import BlinkingGrid from "@/components/custom/blinking-grid";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      id: "free",
      name: "Free Starter",
      creditsBadge: "25 Starter Credits",
      price: "$0",
      cadence: "free on signup",
      unitRate: "No credit card required",
      description: "Set up your verified master career record, test semantic rubric scoring, and calibrate your first tailored resumes.",
      features: [
        "25 non-expiring starter credits included",
        "1 Master Career Ledger with branch memory",
        "Full AI resume tailoring (~2-3 calibrations)",
        "ATS semantic rubric score & keyword scan",
        "Unlimited clean LaTeX source & PDF exports",
        "Full Application Kanban pipeline tracker",
      ],
      cta: "Start with 25 free credits",
      popular: false,
    },
    {
      id: "active",
      name: "Active Seeker",
      creditsBadge: "400 Credits Pack",
      badge: "Most Popular",
      price: "$19",
      cadence: "one-time pack",
      unitRate: "~$0.048 / credit · Save 25%",
      description: "Targeted credit reserve for candidates actively interviewing and calibrating across multiple target roles.",
      features: [
        "400 non-expiring credits in your balance",
        "~40 tailored applications or 15 complete packages",
        "Synchronized Cover Letter generation (6 credits)",
        "Deep ATS semantic rubric audit (10 credits)",
        "Section-Focused Copilot rewrites with instant undo",
        "Credits never expire · Use at your own pace",
      ],
      cta: "Get Active Seeker (400 Credits)",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro Scale",
      creditsBadge: "1,000 Credits Pack",
      badge: "Save 40%",
      price: "$39",
      cadence: "one-time pack",
      unitRate: "~$0.039 / credit · Best value",
      description: "High-volume credit reserve for comprehensive multi-track searches, executive portfolios, and career pivots.",
      features: [
        "1,000 non-expiring credits in your balance",
        "~100 tailored applications or 40+ complete application suites",
        "Multiple distinct career tracks & branch ledgers",
        "Priority AI processing throughput & parser pipeline",
        "Custom LaTeX typesetting & typography tuning",
        "Credits never expire · Retain balance forever",
      ],
      cta: "Get Pro Scale (1,000 Credits)",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full bg-background text-neutral-900 dark:text-neutral-100 py-20 transition-colors duration-200"
    >
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Typographic Header echoing the FAQ section vibe */}
        <div className="max-w-xl mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-[-0.025em] text-neutral-900 dark:text-neutral-100 leading-[1.08] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Pricing,
            <br />
            calibrated
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-balance">
            No recurring monthly charges. Purchase credit packs only when actively applying, and keep your unused balance forever.
          </p>
        </div>

        {/* 3-Column Flat Pricing Cards with Ambient Depth & Drafting Grid */}
        <div className="relative">
          {/* Subtle ambient lighting behind the featured card */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-blue-500/10 dark:bg-blue-500/15 blur-[150px] rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {plans.map((p, idx) => {
              const isPopular = p.popular;

              return (
                <div
                  key={p.name}
                  className={cn(
                    "relative overflow-hidden rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
                    isPopular
                      ? "bg-gradient-to-b from-[#18181b] via-[#141416] to-[#0f0f10] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-white "
                      : "bg-gradient-to-b from-[#ffffff] via-[#f7f7f8] to-[#ededef] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-neutral-900 dark:text-neutral-100"
                  )}
                >

                  {/* Architectural blueprint grid with blinking cells */}
                  <BlinkingGrid
                    cellSize={14}
                    seed={idx}
                    variant={isPopular ? "blue" : "neutral"}
                  />
                  {isPopular && (
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent_70%)]" />
                  )}

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      {/* Card Header & Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3
                            className={cn(
                              "text-base sm:text-lg font-semibold tracking-tight",
                              isPopular ? "text-white" : "text-neutral-900 dark:text-neutral-100"
                            )}
                          >
                            {p.name}
                          </h3>
                        </div>
                        {p.badge && (
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-xs",
                              isPopular
                                ? "bg-blue-500/15 text-blue-300 border-blue-400/30"
                                : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300/50 dark:border-neutral-700/60"
                            )}
                          >
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-xs leading-relaxed min-h-[36px]",
                          isPopular ? "text-neutral-300" : "text-[#71717a] dark:text-[#a1a1aa]"
                        )}
                      >
                        {p.description}
                      </p>

                      {/* Price & Credit Count Block */}
                      <div
                        className={cn(
                          "mt-5 mb-6 pb-5 border-b",
                          isPopular
                            ? "border-neutral-800"
                            : "border-neutral-200/80 dark:border-neutral-800"
                        )}
                      >
                        {/* Prominent Credit Badge */}
                        <div className="mb-2.5">
                          <span
                            className={cn(
                              "inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md",
                              isPopular
                                ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
                            )}
                          >
                            {p.creditsBadge}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={cn(
                              "text-3xl sm:text-4xl font-semibold tracking-tight",
                              isPopular ? "text-white" : "text-neutral-900 dark:text-neutral-100"
                            )}
                          >
                            {p.price}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-mono",
                              isPopular ? "text-neutral-400" : "text-[#71717a] dark:text-[#a1a1aa]"
                            )}
                          >
                            / {p.cadence}
                          </span>
                        </div>

                        {/* Unit Rate / Transparency */}
                        <div
                          className={cn(
                            "mt-1.5 text-[11px] font-mono",
                            isPopular ? "text-blue-300/80" : "text-neutral-500 dark:text-neutral-400"
                          )}
                        >
                          {p.unitRate}
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 text-xs">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check
                              className={cn(
                                "w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[2.2]",
                                isPopular ? "text-blue-400" : "text-emerald-600 dark:text-emerald-400"
                              )}
                            />
                            <span
                              className={cn(
                                "leading-relaxed",
                                isPopular ? "text-neutral-200" : "text-[#52525b] dark:text-[#d4d4d8]"
                              )}
                            >
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom CTA Button using ColoredButton */}
                    <div className="pt-8">
                      {isAuthenticated ? (
                        <ColoredButton
                          asChild
                          color={isPopular ? "blue" : "neutral"}
                          size="lg"
                          className="w-full h-11 rounded-full text-xs font-medium cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          <Link href="/resume">
                            <span>{p.cta}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                          </Link>
                        </ColoredButton>
                      ) : (
                        <ColoredButton
                          type="button"
                          color={isPopular ? "blue" : "neutral"}
                          size="lg"
                          onClick={() => signIn("google")}
                          className="w-full h-11 rounded-full text-xs font-medium cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                          <span>{p.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                        </ColoredButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparent Credit Consumption Breakdown */}
        <div className="mt-12 sm:mt-14 p-5 sm:p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Transparent Credit Consumption
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Spend credits only when triggering AI calibrations. Basic editing, formatting, and exports remain permanently free.
              </p>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              ✓ Non-Expiring Balance
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">1 Credit</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium mt-1 block">AI Resume Tailoring</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">6 Credits</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium mt-1 block">Matched Cover Letter</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">10 Credits</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium mt-1 block">ATS Rubric & Keyword Audit</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-semibold">0 Credits (Free)</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium mt-1 block">PDF/LaTeX Exports & Tracker</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

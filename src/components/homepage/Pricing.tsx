"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Starter Trial",
      price: "$0",
      cadence: "free forever",
      description: "Everything you need to test Resumely and calibrate your first ATS-ready resume.",
      features: [
        "1 Master Career Ledger",
        "3 Full AI Tailoring Calibrations",
        "Unlimited Vector PDF Exports",
        "Full Application Kanban Tracker",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Active Searcher",
      price: "$19",
      cadence: "one-time credits",
      description: "Targeted credits for candidates aggressively applying to high-yield positions.",
      features: [
        "Everything in Starter",
        "25 Role-Tailored Calibrations",
        "Synchronized Cover Letters",
        "ATS Deep Semantic Audit",
        "Priority Customer Support",
      ],
      cta: "Start Applying",
      popular: true,
    },
    {
      name: "Career Pro",
      price: "$39",
      cadence: "unlimited pack",
      description: "Full career acceleration with comprehensive interview coaching and priority tokens.",
      features: [
        "Unlimited Resume Variations",
        "Custom LaTeX & Classic Styling",
        "Automated Application Sync",
        "Personalized Career Calibration Rules",
        "Direct Support & Feedback Channel",
      ],
      cta: "Unlock All Features",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 border-t border-border/50 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Transparent Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-3 leading-[1.12]">
          Simple, credit-based pricing.
          <br />
          <span className="text-neutral-500">No predatory subscriptions.</span>
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-4">
          Pay only when you are actively interviewing. Your master resume and data remain yours forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
              p.popular
                ? "bg-[#1b2820] text-white dark:bg-white dark:text-neutral-950 border-transparent shadow-xl scale-[1.02]"
                : "bg-neutral-50/60 dark:bg-neutral-900/40 border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
            }`}
          >
            <div>
              {p.popular && (
                <span className="inline-block mb-3 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/20 dark:bg-neutral-900/10 text-white dark:text-neutral-900">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-medium">{p.name}</h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${p.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500"}`}>
                {p.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                <span className={`text-xs ml-2 font-mono ${p.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500"}`}>
                  / {p.cadence}
                </span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-current/15 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 shrink-0 ${p.popular ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-600 dark:text-emerald-400"}`} />
                    <span className={p.popular ? "text-neutral-100 dark:text-neutral-900" : "text-neutral-700 dark:text-neutral-300"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              {isAuthenticated ? (
                <Link
                  href="/resume"
                  className={`w-full py-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                    p.popular
                      ? "bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className={`w-full py-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    p.popular
                      ? "bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


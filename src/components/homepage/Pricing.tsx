"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Starter Trial",
      price: "$0",
      cadence: "free forever",
      description: "Everything you need to set up your master career record and test ATS calibration.",
      features: [
        "1 Master Career Ledger",
        "3 Full AI Tailoring Calibrations",
        "Unlimited Vector LaTeX & PDF Exports",
        "Full Application Kanban Tracker",
      ],
      cta: "Start free",
      popular: false,
    },
    {
      name: "Active Seeker",
      price: "$19",
      cadence: "one-time pack",
      description: "Targeted credits for candidates actively applying to high-yield positions.",
      features: [
        "Everything in Starter",
        "40 Role-Tailored Calibrations",
        "Synchronized Cover Letters",
        "ATS Deep Semantic Rubric Audit",
        "Credits never expire",
      ],
      cta: "Get Active Seeker",
      popular: true,
      highlight: "Most Popular",
    },
    {
      name: "Pro Scale",
      price: "$39",
      cadence: "one-time pack",
      description: "Comprehensive credits for high-volume searches and multiple career tracks.",
      features: [
        "100 Role-Tailored Calibrations",
        "Multiple Career Tracks & Branches",
        "Custom LaTeX & Typography Tuning",
        "Priority Parser Throughput",
        "Credits never expire",
      ],
      cta: "Get Pro Scale",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-16 sm:py-24 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200 select-none"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[620px] mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Pay only when you are
            <br />
            actively interviewing.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed">
            No recurring monthly subscriptions. Buy credits once, use them at your own pace, and keep your unused balance forever.
          </p>
        </div>

        {/* 3-Column Equal-Width Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p) => {
            const isPopular = p.popular;
            return (
              <div
                key={p.name}
                className={cn(
                  "p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-[border-color,transform] duration-150 ease-out",
                  isPopular
                    ? "bg-[#edebe6] dark:bg-[#1b1a17] border-2 border-[#1c1b18] dark:border-[#edebe6] shadow-sm relative"
                    : "bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/70 dark:border-[#282622]"
                )}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                      {p.name}
                    </h3>
                    {isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1c1b18] text-[#f5f3ef] dark:bg-[#edebe6] dark:text-[#121110] text-[10px] font-mono font-medium">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  {/* Price */}
                  <div className="mt-5 mb-5 pb-5 border-b border-[#e2e0da]/60 dark:border-[#282622] flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1c1b18] dark:text-[#f3f2ee] font-sans">
                      {p.price}
                    </span>
                    <span className="text-xs font-mono text-[#8b897f] dark:text-[#9c9a8f]">
                      / {p.cadence}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-[#1c1b18] dark:text-[#edebe6]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.2]" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Action Button */}
                <div className="pt-6 sm:pt-7">
                  {isAuthenticated ? (
                    <Link
                      href="/resume"
                      className={cn(
                        "w-full py-2.5 rounded-full text-xs font-medium inline-flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 ease-out active:scale-[0.96] shadow-2xs",
                        isPopular
                          ? "bg-[#1c1b18] hover:bg-[#2b2a26] text-[#f5f3ef] dark:bg-[#edebe6] dark:hover:bg-[#ffffff] dark:text-[#121110]"
                          : "bg-[#ffffff] hover:bg-[#f5f3ef] text-[#1c1b18] border border-[#e2e0da] dark:bg-[#23221f] dark:hover:bg-[#2a2925] dark:text-[#edebe6] dark:border-[#2d2b26]"
                      )}
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signIn("google")}
                      className={cn(
                        "w-full py-2.5 rounded-full text-xs font-medium inline-flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 ease-out cursor-pointer active:scale-[0.96] shadow-2xs",
                        isPopular
                          ? "bg-[#1c1b18] hover:bg-[#2b2a26] text-[#f5f3ef] dark:bg-[#edebe6] dark:hover:bg-[#ffffff] dark:text-[#121110]"
                          : "bg-[#ffffff] hover:bg-[#f5f3ef] text-[#1c1b18] border border-[#e2e0da] dark:bg-[#23221f] dark:hover:bg-[#2a2925] dark:text-[#edebe6] dark:border-[#2d2b26]"
                      )}
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet Reassurance Strip */}
        <div className="mt-12 text-center text-xs text-[#8b897f] dark:text-[#9c9a8f] font-mono flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            No recurring subscription charges
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Credits never expire
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Master resume is free forever
          </span>
        </div>

      </div>
    </section>
  );
}

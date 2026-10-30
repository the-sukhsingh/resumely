"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import ColoredButton from "@/components/custom/colored-button";

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
        "40 Role-Tailored Calibrations",
        "Synchronized Cover Letters",
        "ATS Deep Semantic Rubric Audit",
        "Unlimited Vector PDF & LaTeX Exports",
        "Credits never expire",
      ],
      cta: "Get Active Seeker",
      popular: true,
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
      className="relative w-full bg-[#faf9f6] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-20 sm:py-28 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Typographic Header echoing the FAQ section vibe */}
        <div className="max-w-xl mb-14 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-[-0.025em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.08] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Pricing,
            <br />
            calibrated
          </h2>

          <p className="mt-3.5 text-[13px] text-[#71717a] dark:text-[#a1a1aa] font-normal">
            Pay as you interview · Credits never expire
          </p>

          <p className="mt-6 text-[14px] sm:text-[15px] text-[#52525b] dark:text-[#a1a1aa] font-normal leading-relaxed">
            No recurring monthly charges. Purchase credit packs only when actively applying, and keep your unused balance forever.
          </p>
        </div>

        {/* 3-Column Flat Pricing Cards with Chat/Speech-Bubble Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {plans.map((p) => {
            const isPopular = p.popular;

            return (
              <div
                key={p.name}
                className={cn(
                  "rounded-[24px] p-6 sm:p-7 flex flex-col justify-between transition-[border-color,background-color] duration-150",
                  isPopular
                    ? "bg-[#18181b] dark:bg-[#1c1b18] text-white border border-neutral-800/80 dark:border-neutral-700/80 rounded-br-[4px]"
                    : "bg-white dark:bg-[#1c1b18] text-[#1c1b18] dark:text-[#edebe6] border border-neutral-200/90 dark:border-neutral-800"
                )}
              >
                <div>
                  {/* Card Header & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3
                      className={cn(
                        "text-base sm:text-lg font-semibold tracking-tight",
                        isPopular ? "text-white" : "text-[#1c1b18] dark:text-[#f3f2ee]"
                      )}
                    >
                      {p.name}
                    </h3>
                    {isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-mono font-medium border border-white/20">
                        Most Popular
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

                  {/* Price Block */}
                  <div
                    className={cn(
                      "mt-5 mb-6 pb-5 border-b flex items-baseline gap-1.5",
                      isPopular
                        ? "border-neutral-800"
                        : "border-neutral-200/80 dark:border-neutral-800"
                    )}
                  >
                    <span
                      className={cn(
                        "text-3xl sm:text-4xl font-semibold tracking-tight",
                        isPopular ? "text-white" : "text-[#1c1b18] dark:text-[#f3f2ee]"
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
            );
          })}
        </div>

        {/* Reassurance Footer Strip */}
        <div className="mt-12 pt-6 border-t border-[#e2e0da]/80 dark:border-[#24231f] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] dark:text-[#a1a1aa] gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Zero auto-renewals
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Credits never expire
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Master Ledger export is always free
            </span>
          </div>

          <div>
            Need custom credits or team licenses?{" "}
            <a
              href="mailto:sukhaji65@gmail.com"
              className="underline underline-offset-3 hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors"
            >
              Write to us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

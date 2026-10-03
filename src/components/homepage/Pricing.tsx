"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Heading from "./Heading";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface PricingTier {
  id: "starter" | "active" | "pro";
  name: string;
  tag: string;
  price: string;
  credits: string;
  rate: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "STARTER",
    tag: "OCCASIONAL SEARCH",
    price: "₹99",
    credits: "100 Non-Expiring Credits",
    rate: "₹0.99 / credit",
    features: [
      "10 targeted resume exports",
      "100 AI editing copilot messages",
      "Instant ATS-clean PDF download",
      "Credits never expire",
    ],
    ctaText: "Select Starter",
  },
  {
    id: "active",
    name: "ACTIVE SEEKER",
    tag: "MOST POPULAR",
    price: "₹299",
    credits: "400 Non-Expiring Credits",
    rate: "₹0.75 / credit",
    isPopular: true,
    features: [
      "40 targeted resume exports",
      "Up to 20 synchronized cover letters",
      "Save 25% compared to Starter",
      "Unlimited Master Ledger edits",
    ],
    ctaText: "Select Active Seeker",
  },
  {
    id: "pro",
    name: "PRO SCALE",
    tag: "MAXIMUM VALUE",
    price: "₹599",
    credits: "1,000 Non-Expiring Credits",
    rate: "₹0.59 / credit",
    features: [
      "100 targeted resume exports",
      "Tailor for multiple distinct job tracks",
      "Lowest per-credit rate (40% discount)",
      "Priority parser throughput",
    ],
    ctaText: "Select Pro Scale",
  },
];

const CREDIT_DEDUCTIONS = [
  {
    action: "Tailored resume generation",
    detail: "Full JD analysis, semantic alignment & machine-parseable PDF output",
    cost: "10 credits",
    isFree: false,
  },
  {
    action: "Synchronized cover letter",
    detail: "Targeted narrative matching specific job rubric and verified metrics",
    cost: "5 credits",
    isFree: false,
  },
  {
    action: "Interactive AI copilot message",
    detail: "Refine phrasing, elevate verb strength, or calibrate seniority",
    cost: "1 credit",
    isFree: false,
  },
  {
    action: "Master Profile updates & additions",
    detail: "Add new roles, skills, metrics, and project records anytime",
    cost: "Free",
    isFree: true,
  },
];

export default function PricingSection() {
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<"starter" | "active" | "pro" | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleCheckout = async (planType: "starter" | "active" | "pro") => {
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase credits.");
      signIn("google");
      return;
    }

    setLoadingPlan(planType);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate checkout session");
      }

      if (data.url) {
        toast.success("Redirecting to secure checkout...");
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL was not returned by server");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="px-6 py-24 md:py-32 relative z-10 max-w-6xl mx-auto border-t border-border/40">
      {/* Section Header */}
      <div className="mb-14 md:mb-20 max-w-2xl text-left">
        <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
          TRANSPARENT PRICING // NO SUBSCRIPTIONS
        </div>
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Pay per credit.
          <br />
          <span className="text-muted-foreground font-normal">Never trapped in a recurring subscription.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
          Job searches are temporary; recurring subscriptions shouldn&apos;t be. Buy credits once, use them at your own pace, and keep your unused balance forever.
        </p>
      </div>

      {/* Editorial 3-Column Pricing Grid (Zero Cards, Zero Box Borders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pt-8 border-t border-border/40 text-left items-stretch">
        {PRICING_TIERS.map((tier) => {
          const isMiddle = tier.isPopular;
          const isHovered = hoveredTier === tier.id;

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className="flex flex-col justify-between pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-border/40 md:pl-8 first:border-l-0 first:pl-0 transition-all duration-300"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between font-mono text-xs mb-4">
                  <span
                    className={`font-semibold tracking-wider uppercase transition-colors duration-200 ${
                      isMiddle
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tier.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-colors duration-200 ${
                      isMiddle
                        ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {tier.tag}
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground tabular-nums">
                    {tier.price}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">one-time</span>
                </div>

                {/* Subtitle & Rate */}
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground/80 pb-5 mb-6 border-b border-border/40">
                  <span className="font-medium text-foreground/80">{tier.credits}</span>
                  <span className="text-[11px]">{tier.rate}</span>
                </div>

                {/* Specification Features List (Zero Icons, Pure Typography) */}
                <div className="space-y-3.5 font-mono text-xs text-muted-foreground mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <span className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                      <span className="leading-snug text-foreground/85">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-4 border-t border-border/30">
                <Button
                  variant={isMiddle ? "default" : "outline"}
                  className={`w-full rounded-md h-11 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    isMiddle
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                      : "border-border/60 hover:border-foreground/40 hover:bg-muted/30 text-foreground"
                  }`}
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingPlan !== null}
                >
                  {loadingPlan === tier.id ? "Connecting..." : tier.ctaText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Credit Consumption Schedule (Open Editorial Ledger, Zero Cards) */}
      <div className="mt-16 pt-10 border-t border-border/40 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs mb-6">
          <div className="font-semibold text-foreground uppercase tracking-wider">
            TRANSPARENT CREDIT DEDUCTION SCHEDULE
          </div>
          <div className="text-muted-foreground/70 text-[11px]">
            EXACT CONSUMPTION · NO HIDDEN DEDUCTIONS
          </div>
        </div>

        <div className="border-t border-border/30 divide-y divide-border/30">
          {CREDIT_DEDUCTIONS.map((row, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-muted/10 px-2 -mx-2 rounded-md transition-colors duration-150"
            >
              <div>
                <div className="text-sm font-medium text-foreground">
                  {row.action}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {row.detail}
                </div>
              </div>
              <div className="sm:text-right shrink-0 mt-1 sm:mt-0">
                <span
                  className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-semibold tracking-tight ${
                    row.isFree
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-muted/50 text-foreground border border-border/50"
                  }`}
                >
                  {row.cost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Heading from "./Heading";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<"starter" | "active" | "pro" | null>(null);

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
    <section id="pricing" className="px-6 py-24 md:py-32 relative z-10 max-w-5xl mx-auto">
      <div className="mb-14 md:mb-20 text-left">
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Pay per credit.
          <br />
          <span className="text-muted-foreground font-normal">Never trapped in a subscription.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Job searches are temporary; recurring subscriptions shouldn't be. Buy credits once, use them at your own pace, and keep your unused balance forever.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 items-stretch">
        {/* Starter Plan */}
        <div className="rounded-2xl border border-border/70 bg-card/40 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                STARTER
              </span>
              <span className="text-xs font-mono text-muted-foreground">₹0.99 / credit</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold tracking-tight text-foreground">₹99</span>
              <span className="text-xs text-muted-foreground font-mono">one-time</span>
            </div>
            <p className="text-sm font-medium text-foreground/80 mb-6 pb-6 border-b border-border/50">
              100 Non-Expiring Credits
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>10 targeted resume exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Or 100 AI editing chat messages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>ATS PDF instant download</span>
              </li>
            </ul>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full h-11 text-sm font-semibold active:scale-[0.97] transition-all duration-150 cursor-pointer"
            onClick={() => handleCheckout("starter")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "starter" ? "Connecting..." : "Select Starter"}
          </Button>
        </div>

        {/* Popular Active Plan */}
        <div className="relative rounded-2xl border border-foreground/30 bg-foreground text-background p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-200 md:-translate-y-2">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border border-border shadow-xs uppercase">
            Most Popular
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-background/70">
                ACTIVE SEEKER
              </span>
              <span className="text-xs font-mono text-background/80 font-semibold">₹0.75 / credit</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold tracking-tight text-background">₹299</span>
              <span className="text-xs text-background/70 font-mono">one-time</span>
            </div>
            <p className="text-sm font-medium text-background/90 mb-6 pb-6 border-b border-background/20">
              400 Non-Expiring Credits
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-background/90 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-background shrink-0" />
                <span>40 targeted resume exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-background shrink-0" />
                <span>Up to 20 synchronized cover letters</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-background shrink-0" />
                <span>Save 25% compared to Starter</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-background shrink-0" />
                <span>Unlimited Master Profile revisions</span>
              </li>
            </ul>
          </div>

          <Button
            variant="secondary"
            className="w-full rounded-full h-11 text-sm font-semibold bg-background text-foreground hover:bg-background/90 active:scale-[0.97] transition-all duration-150 cursor-pointer"
            onClick={() => handleCheckout("active")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "active" ? "Connecting..." : "Select Active Seeker"}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border border-border/70 bg-card/40 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between hover:border-border transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                PRO SCALE
              </span>
              <span className="text-xs font-mono text-muted-foreground">₹0.59 / credit</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold tracking-tight text-foreground">₹599</span>
              <span className="text-xs text-muted-foreground font-mono">one-time</span>
            </div>
            <p className="text-sm font-medium text-foreground/80 mb-6 pb-6 border-b border-border/50">
              1000 Non-Expiring Credits
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>100 targeted resume exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Tailor for multiple distinct job tracks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-500 shrink-0" />
                <span>Lowest per-credit rate (40% discount)</span>
              </li>
            </ul>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full h-11 text-sm font-semibold active:scale-[0.97] transition-all duration-150 cursor-pointer"
            onClick={() => handleCheckout("pro")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "pro" ? "Connecting..." : "Select Pro"}
          </Button>
        </div>
      </div>

      {/* Credit Consumption Transparency Table */}
      <div className="rounded-2xl border border-border/70 overflow-hidden bg-card/30 backdrop-blur-xs max-w-2xl mx-auto">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
              Transparent Credit Ledger
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">No hidden charges</span>
        </div>
        <table className="w-full text-xs sm:text-sm text-left">
          <tbody className="divide-y divide-border/50">
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-3.5 text-foreground font-medium">
                Tailored resume generation
                <span className="block text-xs text-muted-foreground">Full JD analysis, semantic alignment & PDF output</span>
              </td>
              <td className="px-6 py-3.5 text-right font-mono font-semibold text-foreground tabular-nums">
                10 credits
              </td>
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-3.5 text-foreground font-medium">
                Synchronized cover letter
                <span className="block text-xs text-muted-foreground">Aligned narrative matching target role and resume points</span>
              </td>
              <td className="px-6 py-3.5 text-right font-mono font-semibold text-foreground tabular-nums">
                5 credits
              </td>
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-3.5 text-foreground font-medium">
                Interactive AI editing prompt
                <span className="block text-xs text-muted-foreground">Refine phrasing, quantify metrics, or change voice</span>
              </td>
              <td className="px-6 py-3.5 text-right font-mono font-semibold text-foreground tabular-nums">
                1 credit
              </td>
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-3.5 text-foreground font-medium">
                Master profile updates & edits
                <span className="block text-xs text-muted-foreground">Add new jobs, skills, or projects anytime</span>
              </td>
              <td className="px-6 py-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                Free
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingSection;
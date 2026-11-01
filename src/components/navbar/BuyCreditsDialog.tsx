'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import ColoredButton from '@/components/custom/colored-button';
import BlinkingGrid from '@/components/custom/blinking-grid';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreditPlan {
  id: 'starter' | 'active' | 'pro';
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  credits: number;
  rate: string;
  description: string;
  popular?: boolean;
  features: string[];
  cta: string;
}

const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    badge: 'Occasional',
    price: '₹99',
    cadence: 'one-time pack',
    credits: 100,
    rate: '₹0.99 / credit',
    description: 'Targeted credits for occasional applications and resume fine-tuning.',
    features: [
      '100 role-tailored credits',
      '10 targeted resume tailors',
      'Full AI ATS rubric & keyword scan',
      'Instant ATS-clean PDF download',
      'Credits never expire',
    ],
    cta: 'Get Starter Pack',
    popular: false,
  },
  {
    id: 'active',
    name: 'Active Seeker',
    badge: 'Most Popular',
    price: '₹299',
    cadence: 'one-time pack',
    credits: 400,
    rate: '₹0.75 / credit',
    description: 'Targeted credits for candidates actively applying to high-yield positions.',
    features: [
      '400 role-tailored credits',
      'Synchronized Cover Letters',
      'ATS Deep Semantic Rubric Audit',
      'Unlimited Vector PDF & LaTeX exports',
      'Credits never expire',
    ],
    cta: 'Get Active Seeker',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Scale',
    badge: 'Best Value',
    price: '₹599',
    cadence: 'one-time pack',
    credits: 1000,
    rate: '₹0.59 / credit',
    description: 'Comprehensive credits for high-volume searches and multiple career tracks.',
    features: [
      '1,000 role-tailored credits',
      'Multiple Career Tracks & Branches',
      'Custom LaTeX & typography tuning',
      'Priority parser throughput',
      'Credits never expire',
    ],
    cta: 'Get Pro Scale',
    popular: false,
  },
];

export default function BuyCreditsDialog({ open, onOpenChange }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'active' | 'pro' | null>(null);

  const handleCheckout = async (planType: 'starter' | 'active' | 'pro') => {
    setLoadingPlan(planType);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout session');
      }

      if (data.url) {
        toast.success('Redirecting to secure checkout...');
        window.location.assign(data.url);
      } else {
        throw new Error('Checkout URL was not returned by server');
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      toast.error(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-[960px] p-0 overflow-hidden bg-background/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-border/70 dark:border-neutral-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="p-6 sm:p-7 pb-4 border-b border-border/50 dark:border-neutral-800 text-left pr-12">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Credit Packs</span>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span>Non-Expiring Balance</span>
          </div>

          <DialogTitle className="text-2xl sm:text-3xl font-normal tracking-[-0.025em] text-neutral-900 dark:text-neutral-100 leading-[1.1] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            Pricing, calibrated
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-xl text-balance">
            No recurring monthly charges. Purchase credit packs only when actively applying, and keep your unused balance forever.
          </DialogDescription>
        </div>

        {/* Plan Cards Grid with Ambient Depth & Drafting Grid */}
        <div className="relative p-5 sm:p-6 lg:p-7">
          {/* Ambient lighting behind the popular center card */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[300px] bg-blue-500/10 dark:bg-blue-500/15 blur-[130px] rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-3 items-stretch">
            {CREDIT_PLANS.map((plan, idx) => {
              const isPopular = plan.popular;
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative overflow-hidden rounded-[22px] p-5 sm:p-5.5 flex flex-col justify-between transition-all duration-200 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] text-left",
                    isPopular
                      ? "bg-gradient-to-b from-[#18181b] via-[#141416] to-[#0f0f10] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-white"
                      : "bg-gradient-to-b from-[#ffffff] via-[#f7f7f8] to-[#ededef] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-neutral-900 dark:text-neutral-100"
                  )}
                >
                  {/* Architectural blueprint grid with blinking cells */}
                  <BlinkingGrid
                    cellSize={14}
                    seed={idx}
                    variant={isPopular ? "blue" : "neutral"}
                    className={cn(isPopular && "opacity-40")}
                  />
                  {isPopular && (
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent_70%)]" />
                  )}

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      {/* Card Header & Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3
                          className={cn(
                            "text-base sm:text-lg font-semibold tracking-tight",
                            isPopular ? "text-white" : "text-neutral-900 dark:text-neutral-100"
                          )}
                        >
                          {plan.name}
                        </h3>
                        {plan.badge && (
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-xs",
                              isPopular
                                ? "bg-blue-500/15 text-blue-300 border-blue-400/30"
                                : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300/50 dark:border-neutral-700/60"
                            )}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-xs leading-relaxed min-h-[34px]",
                          isPopular ? "text-neutral-300" : "text-[#71717a] dark:text-[#a1a1aa]"
                        )}
                      >
                        {plan.description}
                      </p>

                      {/* Price Block */}
                      <div
                        className={cn(
                          "mt-4 mb-5 pb-4 border-b flex items-baseline justify-between gap-1.5",
                          isPopular
                            ? "border-neutral-800"
                            : "border-neutral-200/80 dark:border-neutral-800"
                        )}
                      >
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={cn(
                              "text-3xl sm:text-4xl font-semibold tracking-tight",
                              isPopular ? "text-white" : "text-neutral-900 dark:text-neutral-100"
                            )}
                          >
                            {plan.price}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-mono",
                              isPopular ? "text-neutral-400" : "text-[#71717a] dark:text-[#a1a1aa]"
                            )}
                          >
                            / {plan.cadence}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2 py-0.5 rounded shrink-0",
                            isPopular
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          )}
                        >
                          {plan.rate}
                        </span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2.5 text-xs mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
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
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-2 mt-auto">
                      <ColoredButton
                        type="button"
                        color={isPopular ? "blue" : "neutral"}
                        size="lg"
                        disabled={Boolean(loadingPlan)}
                        onClick={() => handleCheckout(plan.id)}
                        className="w-full h-10 rounded-full text-xs font-medium cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>{plan.cta}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                          </>
                        )}
                      </ColoredButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reassurance Footer Strip */}
        <div className="px-6 sm:px-7 py-3.5 bg-muted/20 border-t border-border/50 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 text-xs">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              <span>Zero auto-renewals</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              <span>Credits never expire</span>
            </span>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              <span>256-bit encrypted checkout via DodoPayments</span>
            </span>
          </div>

          <Link
            href="/#pricing"
            onClick={() => onOpenChange(false)}
            className="text-neutral-800 dark:text-neutral-200 underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-neutral-900 dark:hover:decoration-white transition-colors text-[11px] shrink-0 font-medium"
          >
            Full pricing details →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

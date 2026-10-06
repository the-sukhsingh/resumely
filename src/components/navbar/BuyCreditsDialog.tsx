'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Check, Loader2, Zap, Shield, ArrowRight } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreditPlan {
  id: 'starter' | 'active' | 'pro';
  name: string;
  tag: string;
  price: string;
  credits: number;
  rate: string;
  popular?: boolean;
  highlight?: string;
  bullets: string[];
}

const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'Casual Job Hunt',
    price: '₹99',
    credits: 100,
    rate: '₹0.99 / credit',
    bullets: [
      '10 targeted resume tailors',
      '100 AI copilot chat messages',
      'Instant ATS-compliant PDF',
    ],
  },
  {
    id: 'active',
    name: 'Active Seeker',
    tag: 'Most Popular',
    price: '₹299',
    credits: 400,
    rate: '₹0.75 / credit',
    popular: true,
    highlight: 'Save 25%',
    bullets: [
      '40 targeted resume tailors',
      'Synchronized cover letters',
      'Deep JD keyword alignment',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Scale',
    tag: 'Best Value',
    price: '₹599',
    credits: 1000,
    rate: '₹0.59 / credit',
    highlight: 'Save 40%',
    bullets: [
      '100 targeted resume tailors',
      'Multiple career tracks',
      'Priority ATS parser throughput',
    ],
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
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-background/95 dark:bg-card/95 backdrop-blur-2xl border border-border/70 rounded-3xl shadow-2xl">
        {/* Header with subtle ambient glow */}
        <div className="relative p-6 pb-4 border-b border-border/50 bg-linear-to-b from-primary/5 via-muted/10 to-transparent">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="text-amber-500 inline-flex items-center">
              <Zap className="size-3" />
            </span>
            <span>Billing</span>
            <span className="text-border">/</span>
            <span>Top Up</span>
          </div>

          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground mt-1">
            Purchase Non-Expiring Credits
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
            No recurring monthly subscriptions. Buy credits once, use them at your own pace, and keep your unused balance forever.
          </DialogDescription>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CREDIT_PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-150',
                  plan.popular
                    ? 'border-amber-500/50 bg-amber-500/[0.04] shadow-xs ring-1 ring-amber-500/20'
                    : 'border-border/60 bg-card/60 hover:bg-muted/30 hover:border-border'
                )}
              >
                {/* Popular / Savings Badge */}
                {plan.highlight && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500 text-black shadow-xs">
                    {plan.highlight}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {plan.name}
                    </span>
                  </div>

                  {/* Price & Credits Count */}
                  <div className="mt-2 mb-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                        {plan.price}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-foreground/90 mt-0.5">
                      {plan.credits.toLocaleString()} Credits
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {plan.rate}
                    </span>
                  </div>

                  {/* Feature bullets */}
                  <div className="mt-3.5 pt-3 border-t border-border/40 space-y-2">
                    {plan.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground leading-tight">
                        <Check className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="pt-4 mt-auto">
                  <ColoredButton
                    type="button"
                    color={plan.popular ? 'amber' : 'neutral'}
                    size="sm"
                    disabled={Boolean(loadingPlan)}
                    onClick={() => handleCheckout(plan.id)}
                    className="w-full text-xs font-medium rounded-xl cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Select</span>
                        <ArrowRight className="size-3 ml-1" />
                      </>
                    )}
                  </ColoredButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-muted/20 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Shield className="size-3 text-emerald-500" />
            <span>256-bit encrypted secure checkout via DodoPayments</span>
          </div>
          <Link
            href="/#pricing"
            onClick={() => onOpenChange(false)}
            className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Full pricing details
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

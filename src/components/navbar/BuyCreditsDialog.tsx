'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';
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
    tag: 'Occasional',
    price: '₹99',
    credits: 100,
    rate: '₹0.99 / credit',
    bullets: [
      '10 targeted resume tailors',
      '100 AI copilot chat messages',
      'Instant ATS-clean PDF download',
    ],
  },
  {
    id: 'active',
    name: 'Active Seeker',
    tag: 'Popular',
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
      'Priority parser throughput',
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
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-background/95 dark:bg-card/95 backdrop-blur-xl border border-border/70 rounded-3xl shadow-2xl">
        {/* Header Section */}
        <div className="p-6 sm:p-7 pb-5 border-b border-border/50 text-left">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="text-foreground inline-flex items-center">
              <Zap className="size-3" />
            </span>
            <span>Billing</span>
            <span className="text-border">/</span>
            <span>Credit Balance</span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-2">
            Purchase Non-Expiring Credits
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xl">
            No recurring monthly subscriptions. Buy credits once, use them at your own pace, and keep your unused balance forever.
          </DialogDescription>
        </div>

        {/* Plan Cards Grid */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {CREDIT_PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 group text-left',
                  plan.popular
                    ? 'border-foreground/30 bg-muted/40 dark:bg-muted/20 shadow-xs ring-1 ring-foreground/15'
                    : 'border-border/70 bg-card/50 hover:border-foreground/20 hover:bg-muted/20'
                )}
              >
                {/* Highlight Badge */}
                {plan.highlight && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-foreground text-background shadow-xs">
                    {plan.highlight}
                  </span>
                )}

                <div>
                  {/* Tier Subheader */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {plan.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/70">
                      {plan.tag}
                    </span>
                  </div>

                  {/* Price & Credits Count */}
                  <div className="space-y-0.5 mb-3.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">one-time</span>
                    </div>
                    <div className="text-xs font-medium text-foreground/90">
                      {plan.credits.toLocaleString()} Credits
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {plan.rate}
                    </span>
                  </div>

                  {/* Feature bullets */}
                  <div className="pt-3 border-t border-border/40 space-y-2">
                    {plan.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-snug">
                        <span className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                        <span className="text-foreground/80">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="pt-4 sm:pt-5 mt-auto">
                  <Button
                    type="button"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="sm"
                    disabled={Boolean(loadingPlan)}
                    onClick={() => handleCheckout(plan.id)}
                    className={cn(
                      'w-full h-8.5 rounded-xl text-xs font-mono font-medium tracking-wide uppercase transition-all duration-150 cursor-pointer active:scale-[0.98]',
                      plan.popular
                        ? 'bg-foreground text-background hover:bg-foreground/90 shadow-2xs'
                        : 'border-border/70 hover:border-foreground/30 hover:bg-muted/40 text-foreground'
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 w-full">
                        <span>Select</span>
                        <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info Strip */}
        <div className="px-6 sm:px-7 py-3 bg-muted/20 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
            <span>256-bit encrypted checkout via DodoPayments</span>
          </div>
          <Link
            href="/#pricing"
            onClick={() => onOpenChange(false)}
            className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Full pricing details
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}


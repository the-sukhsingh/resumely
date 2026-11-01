'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WaveBackgroundPreview } from '@/components/custom/bg-shader-modal';
import ColoredButton from '@/components/custom/colored-button';
import BlinkingGrid from '@/components/custom/blinking-grid';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';
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
  badge?: string;
  price: string;
  credits: number;
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
    credits: 100,
    description: 'Targeted credits for occasional job hunts',
    features: [
      '10 targeted resume tailors',
      '100 AI copilot chat messages',
      'Instant ATS-clean PDF download',
      'Credits never expire',
    ],
    cta: 'Get Starter',
    popular: false,
  },
  {
    id: 'active',
    name: 'Active Seeker',
    badge: 'Most Popular',
    price: '₹299',
    credits: 400,
    description: 'Targeted credits for active high-yield applications',
    features: [
      '40 targeted resume tailors',
      'Synchronized Cover Letters',
      'ATS Deep Semantic Rubric Audit',
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
    credits: 1000,
    description: 'Comprehensive credits for multiple career tracks',
    features: [
      '100 targeted resume tailors',
      'Multiple Career Tracks & Branches',
      'Priority parser throughput',
      'Credits never expire',
    ],
    cta: 'Get Pro Scale',
    popular: false,
  },
];

export default function BuyCreditsDialog({ open, onOpenChange }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'active' | 'pro' | null>(null);
  const [mounted, setMounted] = useState(false);
  const isBackdropClickRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    if (loadingPlan) return;
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loadingPlan]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

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

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="buy-credits-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            isBackdropClickRef.current = e.target === e.currentTarget;
          }}
          onClick={(e) => {
            if (isBackdropClickRef.current && e.target === e.currentTarget) {
              handleClose();
            }
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none backdrop-blur-xs bg-black/40"
        >
          {/* Wave Background Preview Shader in Background */}
          <motion.div
            key="buy-credits-shader-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <WaveBackgroundPreview className="w-full h-full mask-t-from-80%" />
          </motion.div>

          {/* Modal Window: Strictly non-scrolling, compact, balanced */}
          <motion.div
            key="buy-credits-modal-window"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
              transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[860px] bg-background/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-border/80 dark:border-neutral-800 shadow-2xl rounded-3xl overflow-hidden text-foreground z-10 select-auto flex flex-col shrink-0"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-border/50 dark:border-neutral-800 shrink-0">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>Credit Packs</span>
                  <span className="text-border">/</span>
                  <span>Non-Expiring Balance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-normal tracking-[-0.02em] text-foreground leading-tight font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif] mt-0.5">
                  Pricing, calibrated
                </h2>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClose}
                disabled={Boolean(loadingPlan)}
                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Plan Cards Grid: Compact & Balanced */}
            <div className="relative px-4 sm:px-5 py-3.5 shrink-0">
              {/* Subtle ambient lighting behind popular center card */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] bg-blue-500/10 dark:bg-blue-500/15 blur-[90px] rounded-full"
                aria-hidden="true"
              />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                {CREDIT_PLANS.map((plan, idx) => {
                  const isPopular = plan.popular;
                  const isLoading = loadingPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between transition-all duration-150 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] text-left",
                        isPopular
                          ? "bg-gradient-to-b from-[#18181b] via-[#141416] to-[#0f0f10] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-white"
                          : "bg-gradient-to-b from-[#ffffff] via-[#f7f7f8] to-[#ededef] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-foreground"
                      )}
                    >
                      {/* Blueprint grid with blinking cells */}
                      <BlinkingGrid
                        cellSize={14}
                        seed={idx}
                        variant={isPopular ? "blue" : "neutral"}
                        className={cn(isPopular ? "opacity-35" : "opacity-20")}
                      />
                      {isPopular && (
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.22),transparent_70%)]" />
                      )}

                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                          {/* Card Header & Badge */}
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <h3
                              className={cn(
                                "text-sm sm:text-base font-semibold tracking-tight",
                                isPopular ? "text-white" : "text-foreground"
                              )}
                            >
                              {plan.name}
                            </h3>
                            {plan.badge && (
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9.5px] font-mono font-medium border shadow-2xs shrink-0",
                                  isPopular
                                    ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                                    : "bg-neutral-200/70 dark:bg-neutral-800 text-muted-foreground border-border/50"
                                )}
                              >
                                {plan.badge}
                              </span>
                            )}
                          </div>

                          <p
                            className={cn(
                              "text-[11px] leading-tight line-clamp-1 mb-2.5",
                              isPopular ? "text-neutral-400" : "text-muted-foreground"
                            )}
                          >
                            {plan.description}
                          </p>

                          {/* Price Row: Clean single-line layout without linebreaks */}
                          <div
                            className={cn(
                              "my-2 pb-2.5 border-b flex items-baseline justify-between",
                              isPopular
                                ? "border-neutral-800"
                                : "border-neutral-200/80 dark:border-neutral-800"
                            )}
                          >
                            <div className="flex items-baseline gap-1">
                              <span
                                className={cn(
                                  "text-2xl sm:text-3xl font-bold tracking-tight font-sans tabular-nums",
                                  isPopular ? "text-white" : "text-foreground"
                                )}
                              >
                                {plan.price}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-mono",
                                  isPopular ? "text-neutral-400" : "text-muted-foreground"
                                )}
                              >
                                / pack
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-[10.5px] font-mono px-2 py-0.5 rounded-full font-medium shrink-0",
                                isPopular
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-neutral-200/70 dark:bg-neutral-800 text-foreground/80"
                              )}
                            >
                              {plan.credits.toLocaleString()} credits
                            </span>
                          </div>

                          {/* Features List: Compact 4 bullets */}
                          <ul className="space-y-1.5 text-[11px] mb-3">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2">
                                <Check
                                  className={cn(
                                    "size-3 shrink-0 stroke-[2.5]",
                                    isPopular ? "text-blue-400" : "text-emerald-500"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "leading-tight truncate",
                                    isPopular ? "text-neutral-200" : "text-neutral-700 dark:text-neutral-300"
                                  )}
                                >
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto pt-1">
                          <ColoredButton
                            type="button"
                            color={isPopular ? "blue" : "neutral"}
                            size="sm"
                            disabled={Boolean(loadingPlan)}
                            onClick={() => handleCheckout(plan.id)}
                            className="w-full h-8.5 rounded-full text-xs font-medium cursor-pointer inline-flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="size-3 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>{plan.cta}</span>
                                <ArrowRight className="size-3 stroke-[2]" />
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
            <div className="px-5 sm:px-6 py-2.5 bg-muted/20 border-t border-border/50 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground shrink-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-500 stroke-[2.5]" />
                  <span>Zero auto-renewals</span>
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-500 stroke-[2.5]" />
                  <span>Credits never expire</span>
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-emerald-500 stroke-[2.5]" />
                  <span>256-bit encrypted checkout via DodoPayments</span>
                </span>
              </div>

              <Link
                href="/#pricing"
                onClick={handleClose}
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors shrink-0 font-medium"
              >
                Full pricing details →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

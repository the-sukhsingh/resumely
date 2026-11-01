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
    description: 'Targeted credits for occasional applications and ATS calibration testing.',
    features: [
      '100 non-expiring credits',
      '10 targeted resume tailors',
      'Full AI ATS rubric & keyword scan',
      'Instant ATS-clean PDF download',
      'Full Kanban application tracker',
    ],
    cta: 'Get Starter Pack',
    popular: false,
  },
  {
    id: 'active',
    name: 'Active Seeker',
    badge: 'Most Popular',
    price: '₹299',
    credits: 400,
    description: 'Targeted credits for active candidates applying to high-yield positions.',
    features: [
      '400 role-tailored credits',
      '40 targeted resume tailors',
      'Synchronized Cover Letters',
      'ATS Deep Semantic Rubric Audit',
      'Unlimited Vector PDF & LaTeX exports',
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
    description: 'Comprehensive credits for high-volume searches and multiple career tracks.',
    features: [
      '1,000 role-tailored credits',
      '100 targeted resume tailors',
      'Multiple Career Tracks & Branches',
      'Custom LaTeX & typography tuning',
      'Priority parser throughput',
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 select-none backdrop-blur-xs bg-black/45"
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

          {/* Modal Window: Wide, spacious, elevated, non-scrolling */}
          <motion.div
            key="buy-credits-modal-window"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
              transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[1040px] bg-background/95 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-border/80 dark:border-neutral-800 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.4)] rounded-[28px] overflow-hidden text-foreground z-10 select-auto flex flex-col shrink-0"
          >
            {/* Header Section: Roomy & Elegant */}
            <div className="flex items-start justify-between px-8 sm:px-9 pt-7 pb-5 border-b border-border/50 dark:border-neutral-800/80 shrink-0">
              <div>
                <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>Credit Packs</span>
                  <span className="text-border">/</span>
                  <span>Non-Expiring Balance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-normal tracking-[-0.025em] text-foreground leading-tight font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                  Pricing, calibrated
                </h2>
                <p className="mt-1.5 text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed max-w-xl text-balance">
                  No recurring monthly charges. Purchase credit packs only when actively applying, and keep your unused balance forever.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClose}
                disabled={Boolean(loadingPlan)}
                className="h-8.5 w-8.5 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-colors -mr-1 mt-0.5"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Plan Cards Grid: Generous Breathing Space */}
            <div className="relative px-8 sm:px-9 py-6 sm:py-7 shrink-0">
              {/* Subtle ambient lighting behind popular center card */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[300px] bg-blue-500/10 dark:bg-blue-500/15 blur-[120px] rounded-full"
                aria-hidden="true"
              />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-4 items-stretch">
                {CREDIT_PLANS.map((plan, idx) => {
                  const isPopular = plan.popular;
                  const isLoading = loadingPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative overflow-hidden rounded-[22px] p-6 sm:p-6.5 flex flex-col justify-between transition-all duration-150 text-left min-h-[420px]",
                        isPopular
                          ? "bg-gradient-to-b from-[#18181b] via-[#141416] to-[#0f0f10] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_-8px_rgba(0,0,0,0.5)]"
                          : "bg-gradient-to-b from-[#ffffff] via-[#f7f7f8] to-[#ededef] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10] text-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
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
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3
                              className={cn(
                                "text-base sm:text-lg font-semibold tracking-tight",
                                isPopular ? "text-white" : "text-foreground"
                              )}
                            >
                              {plan.name}
                            </h3>
                            {plan.badge && (
                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-2xs shrink-0",
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
                              "text-xs leading-relaxed min-h-[36px] mb-4 text-balance",
                              isPopular ? "text-neutral-400" : "text-muted-foreground"
                            )}
                          >
                            {plan.description}
                          </p>

                          {/* Price Row: Roomy, uncluttered, clear tabular typography */}
                          <div
                            className={cn(
                              "my-3.5 pb-4 border-b flex items-baseline justify-between",
                              isPopular
                                ? "border-neutral-800"
                                : "border-neutral-200/80 dark:border-neutral-800"
                            )}
                          >
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={cn(
                                  "text-3xl sm:text-4xl font-semibold tracking-tight font-sans tabular-nums",
                                  isPopular ? "text-white" : "text-foreground"
                                )}
                              >
                                {plan.price}
                              </span>
                              <span
                                className={cn(
                                  "text-xs font-mono",
                                  isPopular ? "text-neutral-400" : "text-muted-foreground"
                                )}
                              >
                                / pack
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium shrink-0",
                                isPopular
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/25"
                                  : "bg-neutral-200/70 dark:bg-neutral-800 text-foreground/85 border border-border/50"
                              )}
                            >
                              {plan.credits.toLocaleString()} credits
                            </span>
                          </div>

                          {/* Features List: 5 clear, unclipped bullets */}
                          <ul className="space-y-3 text-xs mb-6">
                            {plan.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2.5">
                                <Check
                                  className={cn(
                                    "size-3.5 mt-0.5 shrink-0 stroke-[2.2]",
                                    isPopular ? "text-blue-400" : "text-emerald-500"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "leading-relaxed text-[12.5px]",
                                    isPopular ? "text-neutral-200" : "text-neutral-600 dark:text-neutral-300"
                                  )}
                                >
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button with active:scale-[0.96] per better-ui */}
                        <div className="mt-auto pt-3">
                          <ColoredButton
                            type="button"
                            color={isPopular ? "blue" : "neutral"}
                            size="lg"
                            disabled={Boolean(loadingPlan)}
                            onClick={() => handleCheckout(plan.id)}
                            className="w-full h-11 rounded-full text-xs sm:text-[13px] font-medium cursor-pointer inline-flex items-center justify-center gap-2 active:scale-[0.96] transition-transform duration-150 ease-out shadow-xs"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>{plan.cta}</span>
                                <ArrowRight className="size-3.5 stroke-[2]" />
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
            <div className="px-8 sm:px-9 py-3.5 bg-muted/20 border-t border-border/50 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground shrink-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <span className="flex items-center gap-2">
                  <Check className="size-3.5 text-emerald-500 stroke-[2.5]" />
                  <span>Zero auto-renewals</span>
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <Check className="size-3.5 text-emerald-500 stroke-[2.5]" />
                  <span>Credits never expire</span>
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-emerald-500 stroke-[2.5]" />
                  <span>256-bit encrypted checkout via DodoPayments</span>
                </span>
              </div>

              <Link
                href="/#pricing"
                onClick={handleClose}
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors shrink-0 font-medium text-xs"
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

"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Sliders, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import InteractiveResumeDemo from "./InteractiveResumeDemo";

interface HeroSectionProps {
  decreaseFromLeft?: boolean;
  onToggleDecreaseFromLeft?: () => void;
}

const HeroSection = ({
  decreaseFromLeft = true,
  onToggleDecreaseFromLeft,
}: HeroSectionProps) => {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-6 pt-24 sm:pt-28 md:pt-36 pb-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Declarative Typography & Action CTAs */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Subtle Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-card/60 backdrop-blur-xs text-xs font-mono text-muted-foreground mb-6"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground font-semibold">Master Record Model</span>
            <span className="text-border">•</span>
            <span>100% ATS Verified</span>
          </motion.div>

          {/* Upright Roman Headline (No italic per Hallmark) */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground leading-[1.08]"
          >
            Your master career history.
            <br />
            <span className="text-muted-foreground font-normal">
              Tailored to any role in seconds.
            </span>
          </motion.h1>

          {/* Outcome-led Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-5 max-w-lg"
          >
            Stop juggling twenty scattered PDF files. Resumely analyzes any job description rubric, extracts required ATS keywords, and compiles an interview-ready, machine-parseable resume from your master experience.
          </motion.p>

          {/* Primary & Secondary Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 w-full sm:w-auto"
          >
            {user ? (
              <Button
                asChild
                variant="neo"
                size="lg"
                className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide group active:scale-[0.97] transition-transform duration-150"
              >
                <Link href="/resume">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => signIn("google")}
                variant="neo"
                size="lg"
                className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide group active:scale-[0.97] transition-transform duration-150 cursor-pointer"
              >
                Start building for free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-6 rounded-full text-sm font-medium tracking-wide bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-transform duration-150"
            >
              <a href="#how-it-works">
                <Play className="w-4 h-4 mr-2 text-muted-foreground" />
                See workflow
              </a>
            </Button>
          </motion.div>

          {/* Proof Checklist & Shader Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-9 pt-6 border-t border-border/50 w-full space-y-2.5 text-xs text-muted-foreground font-mono"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>Standard single-column ATS export (Greenhouse, Lever, Workday)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>Zero subscription lock-in • Credits never expire</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>Truthful semantic alignment • Zero keyword-stuffing fluff</span>
            </div>

            {/* Interactive Shader Direction Toggle Switch */}
            {onToggleDecreaseFromLeft && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onToggleDecreaseFromLeft}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/70 bg-background/60 hover:bg-muted/40 text-xs font-mono text-muted-foreground transition-all duration-150 active:scale-[0.97] cursor-pointer"
                  title="Toggle background shader height slope direction"
                >
                  <Sliders className="size-3 text-muted-foreground" />
                  <span>Shader slope: {decreaseFromLeft ? "Left ↘ Right" : "Right ↗ Left"}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: The Authentic ATS Resume Document Workbench */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-7 w-full"
        >
          <InteractiveResumeDemo />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
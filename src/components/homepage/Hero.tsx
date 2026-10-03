"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Sliders, Sparkles, CheckCircle2 } from "lucide-react";
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
    <section className="mx-auto max-w-5xl px-6 pt-28 sm:pt-32 md:pt-40 pb-20 flex flex-col items-center justify-center text-center relative z-10">
      {/* Top Tag Pill */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-card/50 backdrop-blur-xs text-xs font-medium text-foreground mb-6"
      >
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Targeted Resumes Without The Rewrite</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground font-mono">100% ATS Validated</span>
      </motion.div>

      {/* Upright, roman display headline (Zero italic headers per Hallmark) */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08] max-w-4xl"
      >
        Optimize once.
        <br />
        <span className="text-muted-foreground">Tailor everywhere.</span>
      </motion.h1>

      {/* Outcome-led subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mt-5"
      >
        Maintain a single master profile of your career achievements. Resumely analyzes any job description and generates an ATS-aligned, interview-ready resume in seconds.
      </motion.p>

      {/* Primary CTAs with Emil Kowalski active press feedback */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto"
      >
        {user ? (
          <Button
            asChild
            variant="neo"
            size="lg"
            className="h-12 px-8 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-transform duration-150"
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
            className="h-12 px-8 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-transform duration-150 cursor-pointer"
          >
            Start building for free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 px-7 rounded-full text-sm font-medium tracking-wide w-full sm:w-auto bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-transform duration-150"
        >
          <a href="#how-it-works">
            <Play className="w-4 h-4 mr-2 text-muted-foreground" />
            See how it works
          </a>
        </Button>

        {/* Shader Direction Toggle Pill (interactive showcase of the left/right decrease boolean) */}
        {onToggleDecreaseFromLeft && (
          <button
            type="button"
            onClick={onToggleDecreaseFromLeft}
            title="Toggle background shader height slope direction"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border/70 bg-background/60 hover:bg-muted/40 text-xs font-mono text-muted-foreground transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <Sliders className="size-3 text-muted-foreground" />
            <span>Shader: {decreaseFromLeft ? "Left ↘" : "Right ↗"}</span>
          </button>
        )}
      </motion.div>

      {/* Trust micro-bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7 text-xs text-muted-foreground font-mono"
      >
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          No Subscription Traps
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          Single-Column ATS PDFs
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          Privacy-First Data
        </span>
      </motion.div>

      {/* Interactive Live Preview Component */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="w-full mt-14"
      >
        <InteractiveResumeDemo />
      </motion.div>
    </section>
  );
};

export default HeroSection;
"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play, Sliders } from "lucide-react";
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
    <section className="mx-auto max-w-5xl px-6 pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center text-center relative z-10">
      {/* Upright Roman Headline (No italic per Hallmark) */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.06] max-w-3xl"
      >
        Optimize once.
        <br />
        <span className="text-muted-foreground font-normal">Apply everywhere.</span>
      </motion.h1>

      {/* Outcome-led Subhead */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mt-5"
      >
        Keep one master record of your experience. Resumely automatically aligns your achievements to any job description and exports an ATS-compliant PDF in seconds.
      </motion.p>

      {/* Primary & Secondary Action CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full sm:w-auto"
      >
        {user ? (
          <Button
            asChild
            variant="neo"
            size="lg"
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-transform duration-150"
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
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-transform duration-150 cursor-pointer"
          >
            Start building for free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 px-6 rounded-full text-sm font-medium tracking-wide w-full sm:w-auto bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-transform duration-150"
        >
          <a href="#how-it-works">
            <Play className="w-4 h-4 mr-2 text-muted-foreground" />
            How it works
          </a>
        </Button>

        {/* Minimal Shader Toggle Pill */}
        {onToggleDecreaseFromLeft && (
          <button
            type="button"
            onClick={onToggleDecreaseFromLeft}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border/60 bg-background/50 hover:bg-muted/40 text-xs font-mono text-muted-foreground transition-all duration-150 active:scale-[0.97] cursor-pointer"
            title="Toggle background shader height slope direction"
          >
            <Sliders className="size-3 text-muted-foreground" />
            <span>Shader: {decreaseFromLeft ? "Left ↘" : "Right ↗"}</span>
          </button>
        )}
      </motion.div>

      {/* Revamped Clean & Minimal Comparison Demo */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="w-full mt-14"
      >
        <InteractiveResumeDemo />
      </motion.div>
    </section>
  );
};

export default HeroSection;
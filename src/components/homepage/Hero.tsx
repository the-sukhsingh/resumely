"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import InteractiveResumeDemo from "./InteractiveResumeDemo";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 sm:pt-44 md:pt-48 pb-16 sm:pb-20 flex flex-col items-start text-left relative z-10">
      {/* Upright Roman Headline (Left-aligned) */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] sm:leading-[1.08] max-w-3xl text-left"
      >
        Optimize once.
        <br />
        <span className="text-muted-foreground font-normal">Apply everywhere.</span>
      </motion.h1>

      {/* Outcome-led Subhead (Left-aligned) */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
        className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mt-5 text-left"
      >
        Keep one master record of your experience. Resumely automatically aligns your achievements to any job description and exports an ATS-compliant PDF in seconds.
      </motion.p>

      {/* Primary & Secondary Action CTAs (Left-aligned) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5 mt-8 w-full sm:w-auto"
      >
        {user ? (
          <Button
            asChild
            variant="neo"
            size="lg"
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-all duration-150"
          >
            <Link href="/resume">
              Go to Dashboard
              <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          </Button>
        ) : (
          <Button
            onClick={() => signIn("google")}
            variant="neo"
            size="lg"
            className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide w-full sm:w-auto group active:scale-[0.97] transition-all duration-150 cursor-pointer"
          >
            Start building for free
            <span className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 px-6 rounded-full text-sm font-medium tracking-wide w-full sm:w-auto bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-all duration-150"
        >
          <a href="#how-it-works">
            How it works
          </a>
        </Button>
      </motion.div>
    </section>
  );
}
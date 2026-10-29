"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JobAvatar from "@/components/tracker/JobAvatar";

export default function BrandOrbitCta() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10 text-left">
      {/* Floating Centered Card Container */}
      <div className="relative rounded-3xl sm:rounded-4xl bg-card/60 dark:bg-card/30 border border-border/80 p-8 sm:p-14 md:p-16 shadow-xl backdrop-blur-xl overflow-hidden">
        {/* Subtle radial ambient glow behind orbit diagram */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

        {/* 2-Column Split: 55/45 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Text & Pill Button Pair (7 cols / 55%) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Uppercase Letter-spaced Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>GET STARTED WITH RESUMELY</span>
            </div>

            {/* Two-Line Bold Headline */}
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
              Start landing more interviews this week.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Equip yourself with the Chrome extension and Master Resume studio designed to cut hours of application friction and bypass algorithmic rejections.
            </p>

            {/* Pill Button Pair */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                variant="neo"
                size="lg"
                className="h-12 px-7 rounded-full text-sm font-semibold tracking-wide active:scale-[0.97] transition-all duration-150"
              >
                <Link href="/resume">
                  <span>Create Master Resume</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-6 rounded-full text-sm font-medium tracking-wide bg-card/40 hover:bg-muted/30 border-border/80 active:scale-[0.97] transition-all duration-150"
              >
                <Link href="/tracker">
                  <span>Open Job Tracker</span>
                </Link>
              </Button>
            </div>

            {/* Caption Row of Three Trust Labels */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-muted-foreground border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Free tier forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-emerald-500" />
                <span>Private &amp; local storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Orbit Diagram (5 cols / 45%) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative size-64 sm:size-72 flex items-center justify-center">
              {/* Outer Orbit Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-border/80 animate-spin-slow" />

              {/* Center Triad / Badge */}
              <div className="size-20 rounded-full bg-foreground text-background flex flex-col items-center justify-center shadow-xl z-10 border-4 border-background">
                <span className="font-mono text-xl font-bold tracking-tight">re.</span>
                <span className="text-[8px] font-mono font-semibold tracking-widest uppercase opacity-70">
                  STUDIO
                </span>
              </div>

              {/* Orbiting Platform Nodes with JobAvatar */}
              {/* Top Node: LinkedIn */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 shadow-md text-xs font-semibold text-foreground font-mono">
                <JobAvatar company="LinkedIn" size={16} />
                <span>LinkedIn</span>
              </div>

              {/* Right Node: Greenhouse */}
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 shadow-md text-xs font-semibold text-foreground font-mono">
                <JobAvatar company="Greenhouse" size={16} />
                <span>Greenhouse</span>
              </div>

              {/* Bottom Node: Workday */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 shadow-md text-xs font-semibold text-foreground font-mono">
                <JobAvatar company="Workday" size={16} />
                <span>Workday</span>
              </div>

              {/* Left Node: Ashby */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 shadow-md text-xs font-semibold text-foreground font-mono">
                <JobAvatar company="Ashby" size={16} />
                <span>Ashby</span>
              </div>

              {/* Counter Badge Node (+5,000 Applications) */}
              <div className="absolute bottom-6 right-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-lg flex items-center gap-1 animate-bounce">
                <Sparkles className="size-3" />
                <span>+5,000 Filled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


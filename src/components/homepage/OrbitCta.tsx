"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

export default function OrbitCta() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Floating Centered Card Container */}
      <div className="relative rounded-3xl sm:rounded-4xl bg-white dark:bg-zinc-900 border border-[#dad8d4] dark:border-zinc-800 p-8 sm:p-14 md:p-16 shadow-xl overflow-hidden">
        {/* Subtle radial warm glow behind orbit diagram */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-radial from-orange-500/10 dark:from-orange-500/15 via-transparent to-transparent pointer-events-none" />

        {/* 2-Column Split: 55/45 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Text & Pill Button Pair (7 cols / 55%) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Uppercase Letter-spaced Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-[#e8531f]">
              <span>GET STARTED WITH RESUMELY</span>
            </div>

            {/* Two-Line Bold Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#1e1d1b] dark:text-zinc-50 leading-[1.12]">
              Start landing more interviews this week.
            </h2>

            <p className="text-sm sm:text-base text-[#6e6c68] dark:text-zinc-400 leading-relaxed max-w-xl">
              Equip yourself with the Chrome extension and Master Resume studio designed to cut hours of application friction and bypass algorithmic rejections.
            </p>

            {/* Pill Button Pair: Solid Black + Outline */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/resume"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 active:scale-98 transition-all shadow-sm"
              >
                <span>Create Master Resume</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/tracker"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-transparent border border-[#dad8d4] dark:border-zinc-700 text-[#1e1d1b] dark:text-zinc-200 text-sm font-medium hover:bg-[#f4f3f1] dark:hover:bg-zinc-800 active:scale-98 transition-all"
              >
                <span>Open Job Tracker</span>
              </Link>
            </div>

            {/* Caption Row of Three Trust Labels */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#6e6c68] dark:text-zinc-400 border-t border-[#dad8d4]/70 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Free tier forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-emerald-500" />
                <span>Private & local storage</span>
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
              <div className="absolute inset-0 rounded-full border border-dashed border-[#dad8d4] dark:border-zinc-800 animate-spin-slow" />

              {/* Center Triad / Badge */}
              <div className="size-20 rounded-full bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 flex flex-col items-center justify-center shadow-xl z-10 border-4 border-white dark:border-zinc-900">
                <span className="font-mono text-xl font-bold tracking-tight">re.</span>
                <span className="text-[8px] font-semibold tracking-widest uppercase opacity-70">STUDIO</span>
              </div>

              {/* Orbiting Platform Nodes */}
              {/* Top Node: LinkedIn */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-[#dad8d4] dark:border-zinc-700 shadow-md text-[10px] font-bold text-[#0a66c2]">
                <span className="size-1.5 rounded-full bg-[#0a66c2]" />
                <span>LinkedIn</span>
              </div>

              {/* Right Node: Greenhouse */}
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-[#dad8d4] dark:border-zinc-700 shadow-md text-[10px] font-bold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Greenhouse</span>
              </div>

              {/* Bottom Node: Workday */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-[#dad8d4] dark:border-zinc-700 shadow-md text-[10px] font-bold text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>Workday</span>
              </div>

              {/* Left Node: Ashby */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-[#dad8d4] dark:border-zinc-700 shadow-md text-[10px] font-bold text-indigo-600">
                <span className="size-1.5 rounded-full bg-indigo-500" />
                <span>Ashby</span>
              </div>

              {/* Counter Badge Node (+5,000 Applications) */}
              <div className="absolute bottom-6 right-2 px-3 py-1 rounded-full bg-[#e8531f] text-white text-[10px] font-bold shadow-lg flex items-center gap-1 animate-bounce">
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

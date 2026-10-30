"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Check,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import HeroShader from "./HeroShader";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const [jobInput, setJobInput] = useState("");

  const handleAction = () => {
    if (isAuthenticated) {
      window.location.href = "/resume";
    } else {
      signIn("google");
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 overflow-hidden border-b border-border/40 select-none">
      
      {/* ======================================================== */}
      {/* FULL-SECTION SCREEN SHADER (No closed box)                */}
      {/* ======================================================== */}
      <HeroShader speed={0.85} />

      {/* Subtle Noise Texture for Physical Screen Tangibility */}
      <div className="pointer-events-none absolute inset-0 noise opacity-35 bg-neutral-900/5 dark:bg-white/5 z-1" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Editorial Typography & Productive Calibrator */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center space-y-7 sm:space-y-9">
            <div className="space-y-5 max-w-xl">
              
              {/* Productive Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-300 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>RESUMELY ENGINE v2.4</span>
                <span className="text-neutral-400 dark:text-neutral-600">&bull;</span>
                <span className="text-emerald-600 dark:text-emerald-400">98.4% ATS Pass Rate</span>
              </div>

              {/* Main Headline (Direct reference cadence & layout) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[74px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.08]">
                A resume that moves{" "}
                <span className="block sm:inline lg:block">
                  while you think ahead.
                </span>
              </h1>

              {/* Subheadline (Refined editorial tone) */}
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-[490px]">
                From ATS keyword calibration to role-tailored applications, build an application pipeline that spends less time catching up and more time moving forward.
              </p>

              {/* Productive Interactive Action Bar */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-white/85 dark:bg-neutral-900/85 border border-neutral-300/80 dark:border-neutral-700/80 shadow-lg shadow-neutral-950/5 backdrop-blur-md">
                  <div className="flex items-center gap-2.5 px-3 py-2 flex-1 min-w-0">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <input
                      type="text"
                      value={jobInput}
                      onChange={(e) => setJobInput(e.target.value)}
                      placeholder="Paste target job link or role to calibrate..."
                      className="bg-transparent text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 outline-none w-full font-mono truncate"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAction}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-[#1b2820] hover:bg-[#25382d] text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>Calibrate ATS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Productive Telemetry Signals */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Workday & Lever Tested
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    Vector PDF (ISO A4)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Zero Hallucinations
                  </span>
                </div>
              </div>
            </div>

            {/* Social Proof & Metrics Strip */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Overlapping Avatar Stack */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                      alt="Sarah C."
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                      alt="Marcus K."
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                      alt="Elena R."
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 font-mono">
                    2,000+ teams
                  </span>
                </div>

                <div className="hidden sm:block h-3.5 w-px bg-neutral-300 dark:bg-neutral-700" />

                <div className="text-xs text-neutral-500 font-mono">
                  <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">10,000+</strong> resumes calibrated
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Floating Telemetry Indicators in Light     */}
          {/* ======================================================== */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-center items-end space-y-4 pointer-events-none select-none">
            
            {/* Telemetry Badge 1: Real-time ATS calibration score */}
            <div className="backdrop-blur-md bg-white/75 dark:bg-neutral-900/75 border border-white/60 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-neutral-950/5 max-w-sm w-full space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  Target: Staff Eng @ Stripe
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  98% Match
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  14 of 14 ATS Core Competencies Verified
                </div>
                <div className="w-full bg-neutral-200/70 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[98%]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1">
                <span>0 Parsing Traps</span>
                <span>Single-Column Standard</span>
              </div>
            </div>

            {/* Telemetry Badge 2: Dynamic narrative synchronizer */}
            <div className="backdrop-blur-md bg-white/70 dark:bg-neutral-900/70 border border-white/60 dark:border-white/10 rounded-2xl p-3.5 shadow-lg shadow-neutral-950/5 max-w-xs w-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  1:1 Narrative Parity
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Synced across Resume & Letter
                </div>
              </div>
            </div>

            {/* Telemetry Badge 3: Turnaround speed */}
            <div className="backdrop-blur-md bg-white/70 dark:bg-neutral-900/70 border border-white/60 dark:border-white/10 rounded-2xl p-3.5 shadow-lg shadow-neutral-950/5 max-w-xs w-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  90s Calibration Pipeline
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Instant Vector PDF Compilation
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

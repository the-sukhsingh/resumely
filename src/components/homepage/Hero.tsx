"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import PrismShader from "@/components/custom/prism-shader";
import HeroProductPreview from "./HeroProductPreview";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 overflow-hidden border-b border-border/40">
      
      {/* ======================================================== */}
      {/* WHOLE-HERO PRISM SHADER (Minimal Vibrant Refraction)      */}
      {/* ======================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <PrismShader className="w-full h-full opacity-90 dark:opacity-80" speed={0.9} />
      </div>

      {/* Subtle Noise Texture for Physical Paper/Screen Tangibility */}
      <div className="pointer-events-none absolute inset-0 noise opacity-40 bg-neutral-900/5 dark:bg-white/5 z-1" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Editorial Typography, CTA & Social Proof     */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 sm:space-y-10">
            <div className="space-y-6 max-w-xl">
              
              {/* Main Headline (Direct reference cadence & layout) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[72px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.08]">
                A resume that moves{" "}
                <span className="block sm:inline lg:block">
                  while you think ahead.
                </span>
              </h1>

              {/* Subheadline (Refined editorial tone) */}
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-[490px]">
                From ATS keyword calibration to role-tailored applications, build an application pipeline that spends less time catching up and more time moving forward.
              </p>

              {/* Primary Call to Action Button */}
              <div className="pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/resume"
                    className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 bg-[#1b2820] hover:bg-[#25382d] text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-[15px] font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Open Your Resumes</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 bg-[#1b2820] hover:bg-[#25382d] text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-[15px] font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>Start Free Trial</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Social Proof (Stacked Avatars + Trust Metric) */}
            <div className="pt-2">
              <div className="flex items-center gap-3.5">
                {/* Overlapping Avatar Stack */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                    alt="Sarah C."
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                    alt="Marcus K."
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face&auto=format&q=80"
                    alt="Elena R."
                  />
                </div>

                {/* Social Proof Copy */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                    Trusted by 2,000+ teams
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Real Software Workbench Product Preview     */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <HeroProductPreview />
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BarsPreview } from "@/components/custom/bg-shader";
import ColoredButton from "@/components/custom/colored-button";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scale down from 1 to 0.92 as user scrolls down, creating an elevated floating card
  const rawScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.92]);
  const rawBorderRadius = useTransform(scrollYProgress, [0, 0.6], ["0px", "32px"]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.98, 0.7]);
  const rawBoxShadow = useTransform(
    scrollYProgress,
    [0, 0.45],
    [
      "0px 0px 0px 0px rgba(0, 0, 0, 0)",
      "0px 25px 60px -15px rgba(0, 0, 0, 0.35)",
    ]
  );

  const scale = shouldReduceMotion ? 1 : rawScale;
  const borderRadius = shouldReduceMotion ? "0px" : rawBorderRadius;
  const opacity = shouldReduceMotion ? 1 : rawOpacity;
  const boxShadow = shouldReduceMotion ? "none" : rawBoxShadow;

  return (
    <div ref={containerRef} className="relative w-full h-[120vh]">
      <div className="sticky top-0 h-dvh w-full flex items-center justify-center overflow-hidden">
        <motion.section
          style={{
            scale,
            borderRadius,
            opacity,
            boxShadow,
          }}
          className="relative w-full h-full flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 overflow-hidden bg-background border border-border/40 select-none will-change-transform"
        >
          {/* Background Architectural Bars Shader */}
          <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none opacity-45 dark:opacity-30">
            <BarsPreview decreaseFromLeft={false} />
          </div>

          {/* Subtle Noise Texture for Physical Screen Tangibility */}
          <div className="pointer-events-none absolute inset-0 noise opacity-40 bg-neutral-900/5 dark:bg-white/5 z-1" />

          {/* Hero Content Container - Centered Editorial Layout */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center justify-center">
            
            {/* Typographic Group */}
            <div className="space-y-5 sm:space-y-6">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] font-medium tracking-[-0.035em] text-neutral-900 dark:text-neutral-50 leading-[1.08] max-w-4xl mx-auto">
                Resumes tailored for{" "}
                <span className="block sm:inline md:block">
                  the roles you want.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-2xl mx-auto">
                From ATS keyword calibration to role-tailored bullet points, build an application pipeline that spends less time in review and more time landing interviews.
              </p>
            </div>

            {/* Primary Call to Action Button - 2x Spacing from text group */}
            <div className="mt-8 sm:mt-10">
              {isAuthenticated ? (
                <ColoredButton
                  asChild
                  color="neutral"
                  size="xl"
                  className="h-12 rounded-full pl-7 pr-6 text-sm sm:text-base font-medium shadow-sm hover:shadow-md active:scale-[0.96] transition-[transform,shadow,color,background-color] duration-150 ease-out cursor-pointer"
                >
                  <Link href="/resume" className="inline-flex items-center gap-2">
                    <span>Open your resumes</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.2] transition-transform duration-150 group-hover/colored-button:translate-x-0.5" />
                  </Link>
                </ColoredButton>
              ) : (
                <ColoredButton
                  type="button"
                  color="neutral"
                  size="xl"
                  onClick={() => signIn("google")}
                  className="h-12 rounded-full pl-7 pr-6 text-sm sm:text-base font-medium shadow-sm hover:shadow-md active:scale-[0.96] transition-[transform,shadow,color,background-color] duration-150 ease-out cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Build your resume</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.2] transition-transform duration-150 group-hover/colored-button:translate-x-0.5" />
                </ColoredButton>
              )}
            </div>

          </div>
        </motion.section>
      </div>
    </div>
  );
}

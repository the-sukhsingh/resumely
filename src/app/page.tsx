"use client";

import React from "react";
import MinimalHero from "@/components/homepage/MinimalHero";
import LogoMarquee from "@/components/homepage/LogoMarquee";
import BentoSteps from "@/components/homepage/BentoSteps";
import FeatureTabs from "@/components/homepage/FeatureTabs";
import OrbitCta from "@/components/homepage/OrbitCta";
import MinimalFooter from "@/components/homepage/MinimalFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f3f1] dark:bg-[#0e0e11] text-[#1e1d1b] dark:text-zinc-100 font-sans selection:bg-[#e8531f]/20 selection:text-[#e8531f] transition-colors">
      {/* Hero Section */}
      <MinimalHero />

      {/* Integration Marquee */}
      <LogoMarquee />

      {/* 3-Step Bento Pipeline */}
      <BentoSteps />

      {/* Deep-Dive Feature Tabs */}
      <FeatureTabs />

      {/* Floating CTA with Orbit Composition */}
      <OrbitCta />

      {/* Asymmetric Minimal Dark Footer */}
      <MinimalFooter />
    </main>
  );
}

"use client";

import React from "react";
import Hero from "@/components/homepage/Hero";
import SocialProofStrip from "@/components/homepage/SocialProofStrip";
import FeatureShowcase from "@/components/homepage/FeatureShowcase";
import LiveTemplates from "@/components/homepage/LiveTemplates";
import Workflow from "@/components/homepage/Workflow";
import Pricing from "@/components/homepage/Pricing";
import Faq from "@/components/homepage/Faq";
import Footer from "@/components/homepage/Footer";
import PrismShader from "@/components/custom/prism-shader";

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground font-sans relative bg-background antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* 1. Hero Section with minimal vibrant prism shader across entire section & real software workbench */}
      <Hero />
      <PrismShader />

      {/* 2. Hiring Teams Trust Strip */}
      <SocialProofStrip />

      {/* 3. Core Platform Capabilities */}
      <FeatureShowcase />

      {/* 4. Live Vector Template Specimens (LaTeX, Classic, Two-Column) */}
      <LiveTemplates />

      {/* 5. 3-Step Calibration Workflow */}
      <Workflow />

      {/* 6. Transparent Credit-Based Pricing */}
      <Pricing />

      {/* 7. Objection-Crushing FAQ */}
      <Faq />

      {/* 8. Modern Editorial Footer */}
      <Footer />
    </div>
  );
}

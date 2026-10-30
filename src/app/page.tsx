"use client";

import React from "react";
import Hero from "@/components/homepage/Hero";
import FeatureShowcase from "@/components/homepage/FeatureShowcase";
import LiveTemplates from "@/components/homepage/LiveTemplates";
import Workflow from "@/components/homepage/Workflow";
import Pricing from "@/components/homepage/Pricing";
import Faq from "@/components/homepage/Faq";
import Footer from "@/components/homepage/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground font-sans relative bg-background antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* 1. Clean, Minimal Editorial Hero with bg-shader BarsPreview */}
      <Hero />

      {/* Main Content Sections with background to glide over floating hero */}
      <div className="relative z-20 bg-background">
        {/* 3. Core Platform Capabilities */}
        <FeatureShowcase />

        {/* 4. Live Vector Template Specimens */}
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
    </div>
  );
}

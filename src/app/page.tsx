"use client";

import React from "react";
import { BarsPreview } from "@/components/custom/bg-shader";
import BrandHero from "@/components/homepage/BrandHero";
import BrandMarquee from "@/components/homepage/BrandMarquee";
import BrandBento from "@/components/homepage/BrandBento";
import FeatureSection from "@/components/homepage/Features";
import WorkflowSection from "@/components/homepage/Workflow";
import BrandOrbitCta from "@/components/homepage/BrandOrbitCta";
import PricingSection from "@/components/homepage/Pricing";
import FaqSection from "@/components/homepage/Faq";
import BrandFooter from "@/components/homepage/BrandFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground font-sans no-scrollbar relative bg-background antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Background Architectural Noise & Shader */}
      <div className="relative z-10 bg-background border-b border-border/60 overflow-hidden">
        <div className="pointer-events-none fixed inset-0 noise opacity-50 bg-primary/5 dark:opacity-30" />

        {/* Background Shader Backdrop */}
        <div className="absolute inset-0 h-dvh overflow-hidden pointer-events-none">
          <BarsPreview decreaseFromLeft={false} />
        </div>

        {/* 1. World-Class Brand Hero with Dual-Pane Specimen Workbench */}
        <BrandHero />

        {/* 2. Platform & ATS Compatibility Marquee Strip */}
        <BrandMarquee />

        {/* 3. 3-Step Bento Interactive Pipeline (Agentwork-inspired) */}
        <BrandBento />

        {/* 4. Deep-Dive Isometric Hairline Engineering Capabilities */}
        <FeatureSection />

        {/* 5. 3-Step Ingestion & Calibration Timeline */}
        <WorkflowSection />

        {/* 6. Floating Orbit CTA Card (Skydive-inspired) */}
        <BrandOrbitCta />

        {/* 7. Pragmatic Credit-Based Pricing */}
        <PricingSection />

        {/* 8. Technical Objection-Crushing FAQ */}
        <FaqSection />
      </div>

      {/* 9. Brand Wordmark & Final Action Footer */}
      <BrandFooter />
    </div>
  );
}

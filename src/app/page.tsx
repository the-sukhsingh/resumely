"use client";

import React from "react";
import { BarsPreview } from "@/components/custom/bg-shader";
import HeroSection from "@/components/homepage/Hero";
import ExtensionShowcase from "@/components/homepage/ExtensionShowcase";
import FeatureSection from "@/components/homepage/Features";
import WorkflowSection from "@/components/homepage/Workflow";
import PricingSection from "@/components/homepage/Pricing";
import FaqSection from "@/components/homepage/Faq";
import Footer from "@/components/homepage/Footer";

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

        {/* Hero Section with Interactive Specimen */}
        <HeroSection />

        {/* Browser Assistant / Extension Showcase */}
        <ExtensionShowcase />

        {/* Core Features: Hairline Ledger, Comparator & Pipeline */}
        <FeatureSection />

        {/* How It Works / 3-Step Pipeline */}
        <WorkflowSection />

        {/* Credit-Based Pricing */}
        <PricingSection />

        {/* Objection-Crushing FAQ */}
        <FaqSection />
      </div>

      {/* Footer / Final Statement CTA */}
      <Footer />
    </div>
  );
}

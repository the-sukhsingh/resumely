'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Marquee Hero · theme: Cobalt · enrichment: E2 · nav: N5 · footer: Ft5 */

import React from 'react';
import { BarsPreview } from '@/components/custom/bg-shader';
import HeroSection from '@/components/homepage/Hero';
import FeatureSection from '@/components/homepage/Features';
import WorkflowSection from '@/components/homepage/Workflow';
import PricingSection from '@/components/homepage/Pricing';
import FaqSection from '@/components/homepage/Faq';
import Footer from '@/components/homepage/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground font-sans no-scrollbar relative bg-background">
      {/* Hero Container with Background Shader */}
      <div className="relative z-10 bg-background border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0 noise dark:opacity-30 pointer-events-none" />
        
        {/* Background Shader: smooth architectural backdrop visible in both light & dark modes */}
        <div className="absolute inset-0 h-dvh overflow-hidden pointer-events-none ">
          <BarsPreview decreaseFromLeft={false} />
        </div>

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeatureSection />

        {/* How It Works (3-step Timeline Pipeline) */}
        <WorkflowSection />

        {/* Pragmatic Credit Pricing */}
        <PricingSection />

        {/* Objection-Crushing FAQ */}
        <FaqSection />
      </div>

      {/* Footer / Final Statement CTA */}
      <Footer />
    </div>
  );
}

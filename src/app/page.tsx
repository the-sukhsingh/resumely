'use client';

/* Hallmark · genre: modern-minimal · macrostructure: Marquee Hero · theme: Cobalt · enrichment: E2 · nav: N5 · footer: Ft5 */

import React, { useState, useRef } from 'react';
import { BarsPreview } from '@/components/custom/bg-shader';
import HeroSection from '@/components/homepage/Hero';
import FeatureSection from '@/components/homepage/Features';
import WorkflowSection from '@/components/homepage/Workflow';
import PricingSection from '@/components/homepage/Pricing';
import FaqSection from '@/components/homepage/Faq';
import Footer from '@/components/homepage/Footer';

export default function HomePage() {
  // Boolean controlling whether bar heights decrease from left to right (true) or right to left (false)
  const [decreaseFromLeft, setDecreaseFromLeft] = useState(true);

  return (
    <div className="min-h-screen text-foreground font-sans no-scrollbar relative bg-background">
      {/* Hero Container with Background Shader */}
      <div className="relative z-10 bg-background border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0 noise dark:opacity-30 pointer-events-none" />
        
        {/* Background Shader: decreases heights from left or right based on decreaseFromLeft boolean */}
        <div className="absolute inset-0 h-[680px] sm:h-[750px] md:h-[820px] overflow-hidden pointer-events-none">
          <BarsPreview decreaseFromLeft={decreaseFromLeft} />
          {/* Subtle gradient to softly blend shader into the content background below */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background pointer-events-none" />
        </div>

        {/* Hero Section */}
        <HeroSection 
          decreaseFromLeft={decreaseFromLeft}
          onToggleDecreaseFromLeft={() => setDecreaseFromLeft((prev) => !prev)}
        />

        {/* Features Section */}
        <FeatureSection />

        {/* How It Works (Video + 3-step Timeline) */}
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


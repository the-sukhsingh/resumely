'use client';


import { BarsPreview } from '@/components/custom/bg-shader';
import FeatureSection from '@/components/homepage/Features';
import WorkflowSection from '@/components/homepage/Workflow';
import Footer from '@/components/homepage/Footer';
import PricingSection from '@/components/homepage/Pricing';
import HeroSection from '@/components/homepage/Hero';
import { motion, useScroll, useTransform } from 'motion/react';
import React from 'react';


export default function HomePage() {
  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  return (
    <div className="min-h-screen text-foreground font-sans no-scrollbar relative">
      {/* Hero Section */}
      <div className='relative z-50 bg-background rounded-b-2xl border-b border-border overflow-hidden'>
        <div className='absolute inset-0 noise dark:opacity-40'></div>
        <motion.div 
          ref={heroRef}
          className='relative'
          style={{
            scale: scale
          }}
        >
          <BarsPreview />
          <HeroSection />
        </motion.div>

        {/* Features Section - Interactive Bento Grid */}
        <FeatureSection />

        {/* How It Works (Video Section) */}
        <WorkflowSection />

        {/* Pricing Section */}
        <PricingSection />
      </div>
      {/* Footer / Final CTA */}
      <Footer />
    </div>
  );
}

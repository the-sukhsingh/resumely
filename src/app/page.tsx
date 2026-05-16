'use client';


import { BarsPreview } from '@/components/custom/bg-shader';
import FeatureSection from '@/components/homepage/Features';
import WorkflowSection from '@/components/homepage/Workflow';
import Footer from '@/components/homepage/Footer';
import PricingSection from '@/components/homepage/Pricing';
import HeroSection from '@/components/homepage/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground font-sans no-scrollbar">
      {/* Hero Section */}
      <BarsPreview />
      <HeroSection />

      {/* Features Section - Interactive Bento Grid */}
      <FeatureSection />

      {/* How It Works (Video Section) */}
      <WorkflowSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer / Final CTA */}
      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import Heading from './Heading';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'active' | 'pro' | null>(null);

  const handleCheckout = async (planType: 'starter' | 'active' | 'pro') => {
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase credits.");
      signIn("google");
      return;
    }

    setLoadingPlan(planType);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout session');
      }

      if (data.url) {
        toast.success("Redirecting to secure checkout...");
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL was not returned by server");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="px-6 py-14 relative z-10">

      <div className="text-left mb-20 mx-auto max-w-5xl ">
        <Heading >Pragmatic Pricing</Heading>
        <p className="text-lg md:text-xl text-muted-foreground text-left">Pay per credit. No sticky subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto ">
        {/* Starter Plan */}
        <div className="border border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-between hover:border-foreground/20 transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">STARTER</p>
            <div className="text-4xl font-semibold mb-2">₹99</div>
            <p className="text-sm text-foreground/80 mb-8 pb-8 border-b border-border/50">100 Credits</p>
            <ul className="space-y-4 text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />10 resumes</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />Or 100 chat messages</li>
            </ul>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-full h-12"
            onClick={() => handleCheckout('starter')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'starter' ? 'Connecting...' : 'Select Starter'}
          </Button>
        </div>

        {/* Popular Plan */}
        <div className="relative bg-foreground/90 dark:bg-foreground/70 text-background rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-100 md:scale-105 z-10 ">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background text-foreground text-xs font-bold px-3 py-1 rounded-full border border-border">MOST POPULAR</div>
          <div>
            <p className="text-sm font-medium text-background/60 mb-4 uppercase tracking-wider">ACTIVE</p>
            <div className="text-4xl font-semibold mb-2">₹299</div>
            <p className="text-sm text-background pb-8 border-b border-background/20 mb-8">400 Credits</p>
            <ul className="space-y-4 text-sm text-background/80 mb-8">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-background" />Best for active job seekers</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-background" />₹0.75 per credit</li>
            </ul>
          </div>
          <Button 
            variant="neo" 
            className="w-full rounded-full h-12 text-foreground font-semibold"
            onClick={() => handleCheckout('active')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'active' ? 'Connecting...' : 'Select Active'}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="border border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl p-8 flex flex-col justify-between hover:border-foreground/20 transition-colors">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">PRO</p>
            <div className="text-4xl font-semibold mb-2">₹599</div>
            <p className="text-sm text-foreground/80 mb-8 pb-8 border-b border-border/50">1000 Credits</p>
            <ul className="space-y-4 text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />Heavy users</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />Multiple role targeting</li>
            </ul>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-full h-12"
            onClick={() => handleCheckout('pro')}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === 'pro' ? 'Connecting...' : 'Select Pro'}
          </Button>
        </div>
      </div>

      {/* Credit Usage */}
      <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/20 backdrop-blur-sm max-w-2xl mx-auto">
        <table className="w-full text-sm text-left">
          <tbody className="divide-y divide-border/50">
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 text-muted-foreground font-medium">Tailored resume generation</td>
              <td className="px-6 py-4 text-right tabular-nums">10 credits</td>
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 text-muted-foreground font-medium">Cover letter generation</td>
              <td className="px-6 py-4 text-right tabular-nums">5 credits</td>
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 text-muted-foreground font-medium">AI chat message</td>
              <td className="px-6 py-4 text-right tabular-nums">1 credit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingSection;
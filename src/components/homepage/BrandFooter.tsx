"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function BrandFooter() {
  const { user } = useAuth();

  return (
    <footer className="w-full bg-background border-t border-border/60 relative z-10 pt-20 pb-12 px-4 sm:px-6">
      {/* Final Action Statement Callout */}
      <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Never write another resume
          <br />
          <span className="text-muted-foreground font-normal">from scratch again.</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Create your master career profile in minutes. Tailor it to any job posting with verified ATS compliance.
        </p>

        <div className="pt-2">
          {user ? (
            <Button
              asChild
              variant="neo"
              size="lg"
              className="h-13 px-9 rounded-full text-base font-semibold tracking-wide active:scale-[0.97] transition-all duration-150 shadow-sm"
            >
              <Link href="/resume">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          ) : (
            <Button
              onClick={() => signIn("google")}
              variant="neo"
              size="lg"
              className="h-13 px-9 rounded-full text-base font-semibold tracking-wide active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-sm"
            >
              <span>Start building for free</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid Links & Brand Specs */}
      <div className="max-w-5xl mx-auto pt-10 border-t border-border/50 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        {/* Brand Column (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <Link href="/" className="inline-block font-mono font-bold text-2xl text-foreground tracking-tight">
            re.
          </Link>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Resumely — Targeted Resume Builder and Application Assistant. Built for engineers and builders to optimize once and apply everywhere.
          </p>
          <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational · v2.0 Production</span>
          </div>
        </div>

        {/* Spacer (1 col) */}
        <div className="hidden md:block md:col-span-1" />

        {/* Column 2: Product (3 cols) */}
        <div className="md:col-span-3 space-y-2.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </div>
          <ul className="space-y-2 text-xs text-foreground/80 font-medium">
            <li>
              <Link href="/resume" className="hover:text-foreground transition-colors">
                Resume Studio
              </Link>
            </li>
            <li>
              <Link href="/tracker" className="hover:text-foreground transition-colors">
                Job Application Tracker
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">
                3-Step Pipeline
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-foreground transition-colors">
                Credit Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources & Source (3 cols) */}
        <div className="md:col-span-3 space-y-2.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Resources
          </div>
          <ul className="space-y-2 text-xs text-foreground/80 font-medium">
            <li>
              <a
                href="https://github.com/the-sukhsingh"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <Link href="/auth" className="hover:text-foreground transition-colors">
                Account Sign In
              </Link>
            </li>
            <li>
              <a href="#faq" className="hover:text-foreground transition-colors">
                FAQ &amp; ATS Guide
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="max-w-5xl mx-auto pt-8 mt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <div>© {new Date().getFullYear()} Resumely Inc. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Notice</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Security Overview</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

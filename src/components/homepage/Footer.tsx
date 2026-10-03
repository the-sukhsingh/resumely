"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="w-full bg-background border-t border-border/60 relative z-10 pt-20 pb-16 px-6">
      {/* Final Action Strip */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider mb-5">
          <Sparkles className="size-3" />
          Ready When You Are
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight">
          Never write another resume
          <br />
          <span className="text-muted-foreground font-normal">from scratch again.</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
          Create your master career profile in minutes. Tailor it to any job posting with verified ATS compliance.
        </p>

        {user ? (
          <Button
            asChild
            variant="neo"
            size="lg"
            className="h-13 px-9 rounded-full text-base font-semibold tracking-wide active:scale-[0.97] transition-all duration-150"
          >
            <Link href="/resume">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button
            onClick={() => signIn("google")}
            variant="neo"
            size="lg"
            className="h-13 px-9 rounded-full text-base font-semibold tracking-wide active:scale-[0.97] transition-all duration-150 cursor-pointer"
          >
            Start building for free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>

      {/* Bottom Bar: Wordmark, Nav & Socials */}
      <div className="max-w-5xl mx-auto pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-mono font-bold text-base text-foreground tracking-tight">
            re.
          </Link>
          <span className="text-border">/</span>
          <span>Resumely — Targeted Resume Builder</span>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            Workflow
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://x.com/thesukhjitbajwa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (formerly Twitter)"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5 fill-current" viewBox="0 0 256 256">
              <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z" />
            </svg>
          </Link>

          <Link
            href="https://www.sukhjitsingh.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Creator Portfolio"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs">Sukhjit</span>
          </Link>

          <Link
            href="mailto:sukhaji65@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5 fill-current" viewBox="0 0 256 256">
              <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
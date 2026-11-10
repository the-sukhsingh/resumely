"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import ColoredButton from "@/components/custom/colored-button";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-background text-neutral-900 dark:text-neutral-100 py-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Seamless Closing Callout (Borderless, Open, Editorial) */}
        <div className="pb-16 sm:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                Ready to land your next
                <br />
                high-impact role?
              </h2>

              <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-lg">
                Start with our free Master Ledger. Calibrate role-tailored resumes in seconds with clean vector ATS compliance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              {isAuthenticated ? (
                <ColoredButton
                  asChild
                  color="neutral"
                  size="xl"
                  className="h-11 rounded-full px-6 text-sm font-medium cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Link href="/resume">
                    <span>Go to Dashboard</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                  </Link>
                </ColoredButton>
              ) : (
                <ColoredButton
                  type="button"
                  color="neutral"
                  size="xl"
                  onClick={() => signIn("google")}
                  className="h-11 rounded-full px-6 text-sm font-medium cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>Start Free Trial</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                </ColoredButton>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="pt-14 sm:pt-16 pb-12 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 text-sm">
          {/* Brand & Purpose (spans 2 cols on desktop) */}
          <div className="col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-mono font-medium tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              <span>re.</span>
              <span className="text-xs text-neutral-500 font-sans font-normal border-l border-border pl-2">
                resumely
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              The ATS-first career engineering ledger. Calibrate verified accomplishments to real employer rubrics and manage applications from submission to offer.
            </p>

            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational · 2026 rubric ready</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Product
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="#features" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Master Ledger
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Vector Templates
                </Link>
              </li>
              <li>
                <Link href="#workflow" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  AI Calibration
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Pricing Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Standards */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Standards
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="#templates" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Single-Column PDF
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  LaTeX Source
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Plaintext Markdown
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  ATS Rubric Audit
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Career Truth Guard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              Company
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <a href="mailto:sukhaji65@gmail.com" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Resumely. Built for career truthfulness and verified ATS compliance.
          </div>

          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer group"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

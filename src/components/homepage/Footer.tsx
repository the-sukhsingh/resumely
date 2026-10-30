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
    <footer className="relative w-full bg-[#faf9f6] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] pt-20 sm:pt-28 pb-12 transition-colors duration-200 border-t border-[#e2e0da] dark:border-[#24231f]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seamless Closing Callout (Borderless, Open, Editorial) */}
        <div className="pb-16 sm:pb-20 border-b border-[#e2e0da] dark:border-[#24231f]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-normal tracking-[-0.025em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.1] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
                Ready to land your next
                <br />
                high-impact role?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#71717a] dark:text-[#a1a1aa] font-normal leading-relaxed max-w-lg">
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

              <Link
                href="#templates"
                className="h-11 px-5 rounded-full inline-flex items-center text-xs sm:text-sm font-medium text-[#71717a] dark:text-[#a1a1aa] hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors"
              >
                Browse templates
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="pt-14 sm:pt-16 pb-12 grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 text-sm">
          {/* Brand & Purpose (spans 2 cols on desktop) */}
          <div className="col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-mono font-medium tracking-tight text-[#1c1b18] dark:text-[#f3f2ee]"
            >
              <span>re.</span>
              <span className="text-xs text-[#8b897f] font-sans font-normal border-l border-[#e2e0da] dark:border-[#282622] pl-2">
                resumely
              </span>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#71717a] dark:text-[#8b897f] max-w-sm leading-relaxed">
              The ATS-first career engineering ledger. Calibrate verified accomplishments to real employer rubrics and manage applications from submission to offer.
            </p>

            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#71717a] dark:text-[#8b897f]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All systems operational · 2026 rubric ready</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#8b897f] dark:text-[#71717a] mb-4">
              Product
            </div>
            <ul className="space-y-2.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <li>
                <Link href="#features" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Master Ledger
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Vector Templates
                </Link>
              </li>
              <li>
                <Link href="#workflow" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  AI Calibration
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Job Tracker
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Pricing Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Standards */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#8b897f] dark:text-[#71717a] mb-4">
              Standards
            </div>
            <ul className="space-y-2.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <li>
                <Link href="#templates" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Single-Column PDF
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  LaTeX Source
                </Link>
              </li>
              <li>
                <Link href="#templates" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Plaintext Markdown
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  ATS Rubric Audit
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Career Truth Guard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#8b897f] dark:text-[#71717a] mb-4">
              Company
            </div>
            <ul className="space-y-2.5 text-xs text-[#71717a] dark:text-[#a1a1aa]">
              <li>
                <Link href="/privacy" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <a href="mailto:sukhaji65@gmail.com" className="hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-[#e2e0da] dark:border-[#24231f] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] dark:text-[#8b897f] gap-4">
          <div>
            © {new Date().getFullYear()} Resumely. Built for career truthfulness and verified ATS compliance.
          </div>

          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors cursor-pointer group"
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

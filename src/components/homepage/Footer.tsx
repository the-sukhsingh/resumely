"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-border/50 bg-neutral-50/50 dark:bg-neutral-950 pt-20 pb-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Call to Action Banner in Footer */}
        <div className="rounded-3xl p-8 sm:p-14 bg-[#1b2820] text-white dark:bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 shadow-xl">
          <div className="max-w-xl space-y-3">
            <h3 className="text-3xl sm:text-4xl font-medium tracking-tight">
              Ready to land your next high-impact role?
            </h3>
            <p className="text-neutral-300 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
              Build your ATS-optimized resume in under two minutes with complete narrative truthfulness.
            </p>
          </div>

          <div>
            {isAuthenticated ? (
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-md"
              >
                <span>Go to Dashboard</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => signIn("google")}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                <span>Start Free Trial</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border/40 text-sm">
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-medium text-neutral-900 dark:text-neutral-100 tracking-tight">
              <svg
                className="w-5 h-5 text-neutral-800 dark:text-neutral-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
              </svg>
              <span>resumely</span>
            </Link>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              The ATS-first career engineering platform. Calibrate your accomplishments to real job rubrics and track your interview journey.
            </p>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3">Product</div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
              <li><Link href="#features" className="hover:text-foreground">Platform</Link></li>
              <li><Link href="#templates" className="hover:text-foreground">Templates</Link></li>
              <li><Link href="/tracker" className="hover:text-foreground">Job Tracker</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3">Resources</div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
              <li><Link href="#solutions" className="hover:text-foreground">ATS Rubric Guide</Link></li>
              <li><Link href="#templates" className="hover:text-foreground">LaTeX Formatting</Link></li>
              <li><Link href="#resources" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3">Legal</div>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-xs">
              <li><span className="text-neutral-500">Privacy Policy</span></li>
              <li><span className="text-neutral-500">Terms of Service</span></li>
              <li><span className="text-neutral-500">Security</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>© {new Date().getFullYear()} Resumely. All rights reserved.</div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}


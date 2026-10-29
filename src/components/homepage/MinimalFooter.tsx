"use client";

import React from "react";
import Link from "next/link";

export default function MinimalFooter() {
  return (
    <footer className="w-full bg-[#111111] text-white pt-16 pb-12 px-4 sm:px-6 mt-16 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Block (Left-Third / 5 cols) */}
          <div className="md:col-span-5 space-y-4 text-left">
            <Link href="/" className="inline-block font-mono text-3xl font-bold tracking-tight text-white">
              re.
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              The intelligent career companion and application assistant. Built to help engineers and ambitious builders land dream roles faster.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400">All systems operational · v2.0 Production</span>
            </div>
          </div>

          {/* Spacer (1 col) */}
          <div className="hidden md:block md:col-span-1" />

          {/* Two Link Columns (Explore + Resources / 6 cols) */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Product
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">
                  Resume Studio
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-white transition-colors">
                  Job Application Tracker
                </Link>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-white transition-colors">
                  ATS Match Engine
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-white transition-colors">
                  Smart Autofill Assistant
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Resources & Legal
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <a
                  href="https://github.com/the-sukhsingh"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/auth" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Thin Legal Row Pinned to Bottom */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Resumely Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-zinc-400 cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-zinc-400 cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

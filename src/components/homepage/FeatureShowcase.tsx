"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  ChevronRight,
} from "lucide-react";

export default function FeatureShowcase() {
  return (
    <section
      id="features"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-16 sm:py-24 border-t border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Slim Top Sub-Nav Bar */}
        <div className="flex items-center justify-between pb-6 mb-16 sm:mb-20 border-b border-[#e2e0da] dark:border-[#24231f]">
          {/* Left: Brand Icon & Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#1c1b18] dark:bg-[#edebe6] text-[#f5f3ef] dark:text-[#121110] flex items-center justify-center text-[10px] font-bold font-mono">
              R
            </div>
            <span className="text-[13px] font-medium tracking-tight text-[#1c1b18] dark:text-[#edebe6]">
              Resumely Studio
            </span>
          </div>

          {/* Center: Five Text Links */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#8b897f] dark:text-[#9c9a8f]">
            <a href="#ledger" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Ledger
            </a>
            <a href="#calibration" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Calibration
            </a>
            <a href="#matcher" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              ATS Matcher
            </a>
            <a href="#templates" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Templates
            </a>
            <a href="#pipeline" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Pipeline
            </a>
          </nav>

          {/* Right: Solid Dark Pill Action Button */}
          <div>
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1c1b18] hover:bg-[#2b2a26] text-[#f5f3ef] dark:bg-[#edebe6] dark:hover:bg-[#ffffff] dark:text-[#121110] text-[13px] font-medium transition-colors shadow-xs active:scale-[0.96]"
            >
              <span>Download</span>
              <Download className="w-3.5 h-3.5 stroke-[2]" />
            </Link>
          </div>
        </div>

        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[620px] mx-auto text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.18] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed">
            Store your accomplishments once. Generate calibrated applications in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Bento Grid with Third Row Cut-Off */}
        <div className="relative overflow-hidden max-h-[810px] sm:max-h-[850px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 1: Quick Capture / Keyboard-Key Chips */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs">
                  <span className="px-2 py-1 rounded-md bg-[#f5f3ef] dark:bg-[#181715] text-[11px] font-mono font-medium text-[#1c1b18] dark:text-[#edebe6] border border-[#e2e0da] dark:border-[#2d2b26] shadow-2xs">
                    ⌘ K
                  </span>
                  <span className="text-xs text-[#8b897f] dark:text-[#9c9a8f] px-1 font-mono">
                    Log 120M events/day...
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Quick Capture
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Record career milestones and quantified impacts directly into your ledger as they happen.
                </p>
              </div>
            </div>

            {/* Card 2: Career Ledger / Inbox List Snippet */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
                <div className="w-full max-w-[210px] rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#1c1b18] dark:text-[#edebe6]">Stripe · Staff</span>
                    <span className="font-mono text-[10px] text-[#8b897f]">34 metrics</span>
                  </div>
                  <div className="h-px bg-[#e2e0da]/60 dark:bg-[#2d2b26]" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#8b897f]">Airbnb · Full Stack</span>
                    <span className="font-mono text-[10px] text-[#8b897f]">18 metrics</span>
                  </div>
                  <div className="h-px bg-[#e2e0da]/60 dark:bg-[#2d2b26]" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#8b897f]">Figma · Systems</span>
                    <span className="font-mono text-[10px] text-[#8b897f]">12 metrics</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Career Ledger
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  One historical ledger for your entire career trajectory. Zero lost bullet points.
                </p>
              </div>
            </div>

            {/* Card 3: Tag Chips with Tiny Colored Dots (with the orange pop) */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[210px]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Distributed
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    {/* Tiny orange accent chip from user spec */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    Latency p99
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Kubernetes
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Rubric Alignment
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Semantic tags verify competency alignment against the hiring rubric without buzzword spam.
                </p>
              </div>
            </div>

            {/* Card 4: Placeholder Panel / Vector Resume Miniature */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[170px] p-3 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-2">
                  <div className="h-2 w-16 bg-[#1c1b18] dark:bg-[#edebe6] rounded-xs" />
                  <div className="h-1.5 w-full bg-[#e2e0da] dark:bg-[#2d2b26] rounded-xs" />
                  <div className="h-1.5 w-4/5 bg-[#e2e0da] dark:bg-[#2d2b26] rounded-xs" />
                  <div className="pt-1 flex items-center justify-between">
                    <div className="h-1.5 w-12 bg-emerald-500/80 rounded-xs" />
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      94% Match
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Vector PDF Specs
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Standard single-column vector output designed for flawless machine parsing and human review.
                </p>
              </div>
            </div>

            {/* Card 5: App-Icon Trio (Workday, Greenhouse, Lever) */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-mono text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    Workday
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-mono text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    Greenhouse
                  </div>
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-mono text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    Lever
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  ✓ 100% Extraction Verified
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Universal Ingestion
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Engineered to pass every major automated parsing engine without formatting degradation.
                </p>
              </div>
            </div>

            {/* Card 6: Search-Pill Mockup */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs">
                  <Search className="w-3.5 h-3.5 text-[#8b897f]" />
                  <span className="text-[12px] text-[#1c1b18] dark:text-[#edebe6] font-medium font-sans">
                    Linear · Staff Frontend
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f5f3ef] dark:bg-[#181715] text-[#8b897f] font-mono border border-[#e2e0da] dark:border-[#2d2b26]">
                    Tailor
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Job Description Sync
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Paste any role link to instantly compare requirement coverage against your historical record.
                </p>
              </div>
            </div>

            {/* Card 7 (Row 3, cut-off): Dark Pill Badge */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="px-3.5 py-2 rounded-full bg-[#1c1b18] text-[#f5f3ef] dark:bg-[#edebe6] dark:text-[#121110] text-[11px] font-mono flex items-center gap-2 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Branch: Staff Systems v2.4</span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Branch Versioning
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Branch your career story into focused tracks for engineering, leadership, or architecture.
                </p>
              </div>
            </div>

            {/* Card 8 (Row 3, cut-off): Application Pipeline Stage Chips */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded-md bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[#8b897f]">
                    Applied
                  </span>
                  <ChevronRight className="w-3 h-3 text-[#8b897f]" />
                  <span className="px-2 py-1 rounded-md bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-emerald-600 dark:text-emerald-400 font-medium">
                    Technical R3
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Pipeline Tracking
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Link every submission to the exact resume version and recruiter contact in your visual board.
                </p>
              </div>
            </div>

            {/* Card 9 (Row 3, cut-off): One-Click Export Tile */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs text-xs">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-[#1c1b18] dark:text-[#edebe6]">resume-staff-v3.pdf</span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  One-Click Export
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Compile crisp vector documents with flawless spacing and typography in under 2 seconds.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Cut-off Fade Overlay suggesting grid continuation */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#f5f3ef] dark:from-[#121110] via-[#f5f3ef]/80 dark:via-[#121110]/80 to-transparent flex items-end justify-center pb-4" />
        </div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  ChevronRight,
  Sliders,
  Check,
  Sparkles,
  Link2,
  Undo2,
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
              Resumely Core
            </span>
          </div>

          {/* Center: Five Text Links corresponding to Resumely's real architecture */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#8b897f] dark:text-[#9c9a8f]">
            <a href="#ledger" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Master Ledger
            </a>
            <a href="#rules" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Agent Rules
            </a>
            <a href="#analyzer" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              ATS Analyzer
            </a>
            <a href="#latex" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              PDF Engine
            </a>
            <a href="#tracker" className="hover:text-[#1c1b18] dark:hover:text-[#edebe6] transition-colors">
              Job Tracker
            </a>
          </nav>

          {/* Right: Solid Dark Pill Action Button */}
          <div>
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1c1b18] hover:bg-[#2b2a26] text-[#f5f3ef] dark:bg-[#edebe6] dark:hover:bg-[#ffffff] dark:text-[#121110] text-[13px] font-medium transition-colors shadow-xs active:scale-[0.96]"
            >
              <span>Build resume</span>
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
            Store your career ledger once. Generate calibrated applications in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Bento Grid with Third Row Cut-Off */}
        <div className="relative overflow-hidden max-h-[810px] sm:max-h-[850px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 1: Master Career Record */}
            <div id="ledger" className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
                <div className="w-full max-w-[210px] rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#1c1b18] dark:text-[#edebe6]">Master Ledger</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-medium">
                      Primary
                    </span>
                  </div>
                  <div className="h-px bg-[#e2e0da]/60 dark:bg-[#2d2b26]" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#1c1b18] dark:text-[#edebe6] truncate font-medium">Stripe · Senior Infra</span>
                    <span className="font-mono text-[10px] text-[#8b897f] shrink-0">34 pts</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#8b897f] truncate">Airbnb · Full Stack</span>
                    <span className="font-mono text-[10px] text-[#8b897f] shrink-0">18 pts</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Master Career Ledger
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Maintain one verified record of all roles, metrics, and skills. Branch tailored versions without duplicating files.
                </p>
              </div>
            </div>

            {/* Card 2: Custom Agent Rules */}
            <div id="rules" className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-[210px] rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs p-2.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Google XYZ Formula</span>
                  </div>
                  <div className="h-px bg-[#e2e0da]/60 dark:bg-[#2d2b26]" />
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>&gt;70% Bullets Quantified</span>
                  </div>
                  <div className="h-px bg-[#e2e0da]/60 dark:bg-[#2d2b26]" />
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8b897f]">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mx-1" />
                    <span>Zero First-Person Pronouns</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Custom Agent Rules
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Enforce strict AI generation constraints: Google XYZ formula, mandatory metric density, and assertive verb choice.
                </p>
              </div>
            </div>

            {/* Card 3: ATS Tag Chips with Tiny Colored Dots (with orange pop!) */}
            <div id="analyzer" className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[210px]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Distributed (3x)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    {/* The design specification's designated orange pop chip */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    p99 Latency Tuning
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[11px] font-medium text-[#1c1b18] dark:text-[#edebe6] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Match: 94%
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Rubric & Skill Matcher
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Extract hiring requirements and keywords from job descriptions to calculate competency coverage in real time.
                </p>
              </div>
            </div>

            {/* Card 4: In-Editor AI Copilot with Section Focus */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[190px] p-2.5 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8b897f]">
                    <span>FOCUS: EXPERIENCE</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <Undo2 className="w-3 h-3" />
                      <span>Undo</span>
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#f5f3ef] dark:bg-[#181715] text-[11px] text-[#1c1b18] dark:text-[#edebe6] leading-tight font-medium">
                    &quot;Sharpen bullet for staff engineer scope&quot;
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Section-Focused Copilot
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Target specific sections with the AI assistant, featuring live preview diffs and complete snapshot undo history.
                </p>
              </div>
            </div>

            {/* Card 5: Real Vector LaTeX & Typography Engine */}
            <div id="latex" className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[170px] p-3 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-[#1c1b18] dark:text-[#edebe6]">LaTeX Modern</span>
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Letter/A4</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e2e0da] dark:bg-[#2d2b26] rounded-xs" />
                  <div className="h-1.5 w-4/5 bg-[#e2e0da] dark:bg-[#2d2b26] rounded-xs" />
                  <div className="h-1.5 w-3/5 bg-[#e2e0da] dark:bg-[#2d2b26] rounded-xs" />
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Vector PDF Engine
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity.
                </p>
              </div>
            </div>

            {/* Card 6: Synchronized Cover Letters */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[12px] text-[#1c1b18] dark:text-[#edebe6] font-medium font-sans">
                    Cover Letter · Synced
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f5f3ef] dark:bg-[#181715] text-[#8b897f] font-mono border border-[#e2e0da] dark:border-[#2d2b26]">
                    1:1 Match
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Matched Cover Letters
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets.
                </p>
              </div>
            </div>

            {/* Card 7 (Row 3, cut-off): Visual Job Application Tracker */}
            <div id="tracker" className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-1 rounded-md bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[#8b897f]">
                    Saved
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] text-[#8b897f]">
                    Applied
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#1c1b18] dark:bg-[#edebe6] text-[#f5f3ef] dark:text-[#121110] font-medium shadow-xs">
                    Interviewing
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Visual Job Tracker
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs.
                </p>
              </div>
            </div>

            {/* Card 8 (Row 3, cut-off): Snapshot Version Link Memory */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="px-3.5 py-2 rounded-full bg-[#1c1b18] text-[#f5f3ef] dark:bg-[#edebe6] dark:text-[#121110] text-[11px] font-mono flex items-center gap-2 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Linked: Resume v3.2 · Linear</span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Resume Snapshot Memory
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Every tracked job is linked to the exact tailored resume version submitted, so you always know what the team is reading.
                </p>
              </div>
            </div>

            {/* Card 9 (Row 3, cut-off): Public Shareable Links */}
            <div className="h-[270px] sm:h-[280px] p-5 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da]/60 dark:border-[#282622] flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ffffff] dark:bg-[#23221f] border border-[#e2e0da] dark:border-[#2d2b26] shadow-xs text-xs font-mono">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium text-[#1c1b18] dark:text-[#edebe6]">resumely.tech/r/share</span>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#e2e0da]/40 dark:border-[#24231f]">
                <h3 className="text-sm font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Public Share Links
                </h3>
                <p className="mt-1 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-2">
                  Share responsive, private view-only web links directly with recruiters and hiring managers without email attachments.
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

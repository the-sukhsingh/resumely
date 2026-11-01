"use client";

import React from "react";
import FeatureCard from "./FeatureCard";
import {
  LedgerIllustration,
  RulesIllustration,
  MatcherIllustration,
  CopilotIllustration,
  VectorPdfIllustration,
  CompanionIllustration,
  TrackerIllustration,
  SnapshotIllustration,
  ShareLinksIllustration,
} from "./FeatureIllustrations";

export default function FeatureShowcase() {
  return (
    <section
      id="features"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121210] py-20 sm:py-24 transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[560px] mx-auto text-center mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-[-0.015em] text-[#1c1b18] dark:text-[#f3f1ec] leading-[1.2] font-[Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-3.5 text-sm sm:text-[14px] text-[#8b897f] dark:text-[#9e9c93] font-normal leading-relaxed">
            Store your verified career ledger once. Generate calibrated applications, LaTeX vector exports, and tailored cover letters in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Quick Capture & Ledger */}
          <FeatureCard
            id="ledger"
            title="Quick Capture & Ledger"
            description="Capture career wins and metrics with a global shortcut. Branch tailored versions with zero duplication."
            preview={<LedgerIllustration />}
          />

          {/* Card 2: Spaces & Target Roles */}
          <FeatureCard
            id="rules"
            title="Spaces & Target Roles"
            description="Organize career achievements and skills by role domain, seniority, or engineering specialty."
            preview={<RulesIllustration />}
          />

          {/* Card 3: Rubric & Skill Matcher */}
          <FeatureCard
            id="analyzer"
            title="Rubric & Skill Matcher"
            description="Extract hiring requirements from job descriptions to calculate competency coverage in real time."
            preview={<MatcherIllustration />}
          />

          {/* Card 4: Section-Focused Copilot */}
          <FeatureCard
            id="copilot"
            title="Section-Focused Copilot"
            description="Target specific bullet points with the AI assistant, featuring instant metric refinement and live diffs."
            preview={<CopilotIllustration />}
          />

          {/* Card 5: Vector PDF Engine */}
          <FeatureCard
            id="latex"
            title="Vector PDF Engine"
            description="Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity."
            preview={<VectorPdfIllustration />}
          />

          {/* Card 6: Matched Cover Letters */}
          <FeatureCard
            id="companion"
            title="Matched Cover Letters"
            description="Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets."
            preview={<CompanionIllustration />}
          />

          {/* Card 7: Visual Job Tracker */}
          <FeatureCard
            id="tracker"
            title="Visual Job Tracker"
            description="Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs."
            preview={<TrackerIllustration />}
          />

          {/* Card 8: Resume Snapshot Memory */}
          <FeatureCard
            id="snapshots"
            title="Snapshot Memory"
            description="Every tracked job is linked to the exact tailored resume version submitted, so you always know what the team is reading."
            preview={<SnapshotIllustration />}
          />

          {/* Card 9: Recruiter Quick Route */}
          <FeatureCard
            id="distribution"
            title="Recruiter Quick Route"
            description="Share responsive, private view-only web links directly with recruiters and hiring managers without email attachments."
            preview={<ShareLinksIllustration />}
          />
        </div>
      </div>
    </section>
  );
}

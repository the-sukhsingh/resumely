"use client";

import React from "react";
import FeatureCard from "./FeatureCard";
import {
  LedgerIllustration,
  SpacesIllustration,
  MatcherIllustration,
  XyzIllustration,
  CopilotIllustration,
  VectorPdfIllustration,
  CompanionIllustration,
  TrackerIllustration,
  SnapshotIllustration,
} from "./FeatureIllustrations";

export default function FeatureShowcase() {
  return (
    <section
      id="features"
      className="relative w-full py-16 sm:py-20 transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[560px] mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-[-0.015em] text-neutral-900 dark:text-neutral-100 leading-[1.2] font-[Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-3.5 text-sm sm:text-[14px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
            Store your verified career ledger once. Generate calibrated applications, LaTeX vector exports, and tailored cover letters in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Bento Grid with exact classname requested */}
        <div className="mt-10 grid grid-cols-1 gap-2 px-6 sm:grid-cols-2 md:mt-12 md:px-8 lg:grid-cols-3">
          {/* Card 1: Master Career Ledger */}
          <FeatureCard
            id="ledger"
            title="Master Career Ledger"
            description="Maintain one verified record of all roles, metrics, and skills. Branch tailored versions with zero duplication."
            preview={<LedgerIllustration />}
          />

          {/* Card 2: Target Roles & Spaces */}
          <FeatureCard
            id="spaces"
            title="Target Roles & Spaces"
            description="Organize achievements, metrics, and technical skills by target role, seniority, or engineering specialty."
            preview={<SpacesIllustration />}
          />

          {/* Card 3: Rubric & Skill Matcher */}
          <FeatureCard
            id="analyzer"
            title="Rubric & Skill Matcher"
            description="Extract hiring requirements from job descriptions to calculate competency coverage in real time."
            preview={<MatcherIllustration />}
          />

          {/* Card 4: Google XYZ Calibrator */}
          <FeatureCard
            id="xyz"
            title="Google XYZ Calibrator"
            description="Enforce strict impact constraints: Accomplished [X], measured by [Y], by doing [Z], eliminating weak passive verbs."
            preview={<XyzIllustration />}
          />

          {/* Card 5: Section-Focused Copilot */}
          <FeatureCard
            id="copilot"
            title="Section-Focused Copilot"
            description="Target specific bullet points with the AI assistant, featuring live metric enhancements and instant snapshot history."
            preview={<CopilotIllustration />}
          />

          {/* Card 6: Vector PDF Engine */}
          <FeatureCard
            id="latex"
            title="Vector PDF Engine"
            description="Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity."
            preview={<VectorPdfIllustration />}
          />

          {/* Card 7: Matched Cover Letters */}
          <FeatureCard
            id="companion"
            title="Matched Cover Letters"
            description="Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets."
            preview={<CompanionIllustration />}
          />

          {/* Card 8: Visual Job Tracker */}
          <FeatureCard
            id="tracker"
            title="Visual Job Tracker"
            description="Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs."
            preview={<TrackerIllustration />}
          />

          {/* Card 9: Snapshot Memory */}
          <FeatureCard
            id="snapshots"
            title="Snapshot Memory"
            description="Every tracked job is linked to the exact tailored resume version submitted, so you always know what hiring teams read."
            preview={<SnapshotIllustration />}
          />
        </div>
      </div>
    </section>
  );
}

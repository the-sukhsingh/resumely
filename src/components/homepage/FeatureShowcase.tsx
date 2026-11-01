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
          <p className="mt-3 text-sm sm:text-[14px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
            Store your verified career ledger once. Tailor applications in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Bento Grid with exact classname requested */}
        <div className="mt-10 grid grid-cols-1 gap-2 px-6 sm:grid-cols-2 md:mt-12 md:px-8 lg:grid-cols-3">
          {/* Card 1: Master Career Ledger */}
          <FeatureCard
            id="ledger"
            title="Master Career Ledger"
            description="One verified career record. Tailor versions in seconds."
            preview={<LedgerIllustration />}
          />

          {/* Card 2: Target Roles & Spaces */}
          <FeatureCard
            id="spaces"
            title="Target Roles & Spaces"
            description="Organize metrics and skills by target role or domain."
            preview={<SpacesIllustration />}
          />

          {/* Card 3: Rubric & Skill Matcher */}
          <FeatureCard
            id="analyzer"
            title="Rubric & Skill Matcher"
            description="Score competency match against any job description."
            preview={<MatcherIllustration />}
          />

          {/* Card 4: Google XYZ Calibrator */}
          <FeatureCard
            id="xyz"
            title="Google XYZ Calibrator"
            description="Turn passive bullets into quantified XYZ impact."
            preview={<XyzIllustration />}
          />

          {/* Card 5: Section-Focused Copilot */}
          <FeatureCard
            id="copilot"
            title="Section-Focused Copilot"
            description="Refine bullets with quantified impact in real time."
            preview={<CopilotIllustration />}
          />

          {/* Card 6: Vector PDF Engine */}
          <FeatureCard
            id="latex"
            title="Vector PDF Engine"
            description="Pixel-perfect vector PDFs that ATS parsers love."
            preview={<VectorPdfIllustration />}
          />

          {/* Card 7: Matched Cover Letters */}
          <FeatureCard
            id="companion"
            title="Matched Cover Letters"
            description="Matching typography and tone, synced with your resume."
            preview={<CompanionIllustration />}
          />

          {/* Card 8: Visual Job Tracker */}
          <FeatureCard
            id="tracker"
            title="Visual Job Tracker"
            description="Track applications from saved role to final offer."
            preview={<TrackerIllustration />}
          />

          {/* Card 9: Snapshot Memory */}
          <FeatureCard
            id="snapshots"
            title="Snapshot Memory"
            description="Lock the exact resume version submitted for every role."
            preview={<SnapshotIllustration />}
          />
        </div>
      </div>
    </section>
  );
}

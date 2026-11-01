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
      className="relative w-full text-neutral-900 dark:text-neutral-100 py-16 sm:py-20 transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Two-Line Editorial Headline + Lede */}
        <div className="max-w-[620px] mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 leading-[1.18] font-[Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Store your verified career ledger once. Generate calibrated applications, LaTeX vector exports, and tailored cover letters in seconds.
          </p>
        </div>

        {/* 3-Column Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Master Career Ledger */}
          <FeatureCard
            id="ledger"
            eyebrow="01 · Career Ledger"
            title="Master Career Ledger"
            description="Maintain one verified record of all roles, metrics, and skills. Branch tailored versions without duplicating files."
            seed={0}
            preview={<LedgerIllustration />}
          />

          {/* Card 2: Custom Agent Rules */}
          <FeatureCard
            id="rules"
            eyebrow="02 · Calibration Rules"
            title="Custom Agent Rules"
            description="Enforce strict AI generation constraints: Google XYZ formula, mandatory metric density, and assertive verb choice."
            seed={1}
            preview={<RulesIllustration />}
          />

          {/* Card 3: Rubric & Skill Matcher */}
          <FeatureCard
            id="analyzer"
            eyebrow="03 · Semantic Rubric"
            title="Rubric & Skill Matcher"
            description="Extract hiring requirements and keywords from job descriptions to calculate competency coverage in real time."
            seed={2}
            preview={<MatcherIllustration />}
          />

          {/* Card 4: Section-Focused Copilot */}
          <FeatureCard
            id="copilot"
            eyebrow="04 · Prompt Copilot"
            title="Section-Focused Copilot"
            description="Target specific sections with the AI assistant, featuring live preview diffs and complete snapshot undo history."
            seed={3}
            preview={<CopilotIllustration />}
          />

          {/* Card 5: Vector PDF Engine */}
          <FeatureCard
            id="latex"
            eyebrow="05 · Typesetting"
            title="Vector PDF Engine"
            description="Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity."
            seed={4}
            preview={<VectorPdfIllustration />}
          />

          {/* Card 6: Matched Cover Letters */}
          <FeatureCard
            id="companion"
            eyebrow="06 · Companion"
            title="Matched Cover Letters"
            description="Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets."
            seed={5}
            preview={<CompanionIllustration />}
          />

          {/* Card 7: Visual Job Tracker */}
          <FeatureCard
            id="tracker"
            eyebrow="07 · Application Pipeline"
            title="Visual Job Tracker"
            description="Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs."
            seed={6}
            preview={<TrackerIllustration />}
          />

          {/* Card 8: Resume Snapshot Memory */}
          <FeatureCard
            id="snapshots"
            eyebrow="08 · Snapshot Binding"
            title="Resume Snapshot Memory"
            description="Every tracked job is linked to the exact tailored resume version submitted, so you always know what the team is reading."
            seed={7}
            preview={<SnapshotIllustration />}
          />

          {/* Card 9: Public Share Links */}
          <FeatureCard
            id="distribution"
            eyebrow="09 · Recruiter Route"
            title="Public Share Links"
            description="Share responsive, private view-only web links directly with recruiters and hiring managers without email attachments."
            seed={8}
            preview={<ShareLinksIllustration />}
          />
        </div>
      </div>
    </section>
  );
}

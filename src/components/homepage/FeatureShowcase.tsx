"use client";

import React from "react";
import FeatureCard from "./FeatureCard";

interface FeatureItem {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  manifestHeader: {
    label: string;
    value: React.ReactNode;
  };
  manifestRows: {
    label: string;
    value: React.ReactNode;
  }[];
}

const FEATURES: FeatureItem[] = [
  {
    id: "ledger",
    eyebrow: "01 / Ledger",
    title: "Master Career Ledger",
    description:
      "Maintain one verified record of all roles, metrics, and skills. Branch tailored versions without duplicating files.",
    manifestHeader: { label: "Record Type", value: "Primary Base" },
    manifestRows: [
      { label: "Stripe · Senior Infra", value: "34 impact metrics" },
      { label: "Airbnb · Full Stack", value: "18 impact metrics" },
    ],
  },
  {
    id: "rules",
    eyebrow: "02 / Rules",
    title: "Custom Agent Rules",
    description:
      "Enforce strict AI generation constraints: Google XYZ formula, mandatory metric density, and assertive verb choice.",
    manifestHeader: { label: "Constraint Check", value: "Strict Mode" },
    manifestRows: [
      { label: "Google XYZ Formula", value: "Enforced" },
      { label: "Bullet Metric Density", value: ">70% Quantified" },
    ],
  },
  {
    id: "analyzer",
    eyebrow: "03 / Analysis",
    title: "Rubric & Skill Matcher",
    description:
      "Extract hiring requirements and keywords from job descriptions to calculate competency coverage in real time.",
    manifestHeader: { label: "Semantic Rubric", value: "94% Coverage" },
    manifestRows: [
      { label: "Distributed Systems (3x)", value: "Matched" },
      { label: "p99 Latency Tuning", value: "Target Keyword" },
    ],
  },
  {
    eyebrow: "04 / Copilot",
    title: "Section-Focused Copilot",
    description:
      "Target specific sections with the AI assistant, featuring live preview diffs and complete snapshot undo history.",
    manifestHeader: { label: "Copilot Scope", value: "Experience" },
    manifestRows: [
      { label: "Prompt Directive", value: "Sharpen staff scope" },
      { label: "Snapshot History", value: "Instant Undo · 1 Click" },
    ],
  },
  {
    id: "latex",
    eyebrow: "05 / Typesetting",
    title: "Vector PDF Engine",
    description:
      "Typeset in clean LaTeX standards with customizable margins, font sizes, section spacing, and single-column purity.",
    manifestHeader: { label: "LaTeX Engine", value: "0 Broken Glyphs" },
    manifestRows: [
      { label: "Typesetting Modern", value: "Single Column · Serif" },
      { label: "Calibrated Formats", value: "Letter / A4 Standard" },
    ],
  },
  {
    eyebrow: "06 / Companion",
    title: "Matched Cover Letters",
    description:
      "Generate matching cover letters in the same typography and tone, synchronized with your tailored resume bullets.",
    manifestHeader: { label: "Letter Companion", value: "1:1 Synchronized" },
    manifestRows: [
      { label: "Typography Voice", value: "Matching Font & Measure" },
      { label: "Metric Continuity", value: "Aligned with Resume" },
    ],
  },
  {
    id: "tracker",
    eyebrow: "07 / Pipeline",
    title: "Visual Job Tracker",
    description:
      "Manage applications in Kanban or list view across 6 stages with deadlines, salaries, and interview contact logs.",
    manifestHeader: { label: "Pipeline Stages", value: "6 Active Tracks" },
    manifestRows: [
      { label: "Stage Movement", value: "Saved → Applied → Offer" },
      { label: "Tracker Views", value: "Journey & List Table" },
    ],
  },
  {
    eyebrow: "08 / Snapshots",
    title: "Resume Snapshot Memory",
    description:
      "Every tracked job is linked to the exact tailored resume version submitted, so you always know what the team is reading.",
    manifestHeader: { label: "Snapshot Binding", value: "Version Locked" },
    manifestRows: [
      { label: "Active Submission", value: "resume-v3.2.pdf" },
      { label: "Ledger State", value: "Immutable Linked Copy" },
    ],
  },
  {
    eyebrow: "09 / Distribution",
    title: "Public Share Links",
    description:
      "Share responsive, private view-only web links directly with recruiters and hiring managers without email attachments.",
    manifestHeader: { label: "Public Route", value: "Live Web View" },
    manifestRows: [
      { label: "Direct URL", value: "resumely.tech/r/..." },
      { label: "Security & Access", value: "Private · Responsive" },
    ],
  },
];

export default function FeatureShowcase() {
  return (
    <section
      id="features"
      className="relative w-full text-[#1c1b18] dark:text-[#edebe6] py-16 transition-colors duration-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Narrow Header Block: Two-Line Serif Headline + Muted Subline */}
        <div className="max-w-[620px] mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.18] font-[Georgia,Cambria,'Times_New_Roman',Times,serif]">
            The quiet system behind
            <br />
            every interview-winning resume.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed">
            Store your career ledger once. Generate calibrated applications in seconds.
          </p>
        </div>

        {/* 3-Column Equal-Width Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              id={feature.id}
              eyebrow={feature.eyebrow}
              title={feature.title}
              description={feature.description}
              manifestHeader={feature.manifestHeader}
              manifestRows={feature.manifestRows}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

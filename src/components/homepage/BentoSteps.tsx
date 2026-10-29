"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Wand2,
  CheckCircle2,
  Sparkles,
  Paperclip,
  ArrowUp,
  RefreshCw,
  Copy,
  Check,
  Zap,
} from "lucide-react";

const SAMPLE_ROLES = [
  {
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    score: 96,
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    missing: ["Redis"],
  },
  {
    title: "Product Designer & UI Engineer",
    company: "Airbnb",
    score: 94,
    tags: ["Figma", "Design Systems", "Tailwind CSS", "React"],
    missing: ["Animation"],
  },
  {
    title: "Frontend Architect",
    company: "Linear",
    score: 98,
    tags: ["TypeScript", "Next.js", "WebSockets", "GraphQL"],
    missing: [],
  },
];

export default function BentoSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const fullPrompt =
    "Highlight my 6+ years designing micro-frontends with 99.99% uptime and Next.js App Router for this application.";

  useEffect(() => {
    let index = 0;
    setTypewriterText("");
    const timer = setInterval(() => {
      if (index < fullPrompt.length) {
        setTypewriterText(fullPrompt.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* 3-Line Step Heading with Superscript Numbers as in DESIGN.md */}
      <div className="max-w-3xl mb-14">
        <div className="space-y-1 text-2xl sm:text-3xl md:text-4xl font-serif text-[#1e1d1b] dark:text-zinc-100">
          <div
            onClick={() => setActiveStep(0)}
            className={`cursor-pointer transition-colors flex items-baseline gap-2 ${
              activeStep === 0 ? "font-medium text-[#1e1d1b] dark:text-white" : "text-[#6e6c68] dark:text-zinc-500"
            }`}
          >
            <span>Scan any job posting across the web.</span>
            <sup className="text-sm font-sans font-bold text-[#e8531f]">01</sup>
          </div>
          <div
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer transition-colors flex items-baseline gap-2 ${
              activeStep === 1 ? "font-medium text-[#1e1d1b] dark:text-white" : "text-[#6e6c68] dark:text-zinc-500"
            }`}
          >
            <span>Auto-tailor bullet points to ATS algorithms.</span>
            <sup className="text-sm font-sans font-bold text-[#e8531f]">02</sup>
          </div>
          <div
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer transition-colors flex items-baseline gap-2 ${
              activeStep === 2 ? "font-medium text-[#1e1d1b] dark:text-white" : "text-[#6e6c68] dark:text-zinc-500"
            }`}
          >
            <span>Autofill entire forms in 0.4 seconds.</span>
            <sup className="text-sm font-sans font-bold text-[#e8531f]">03</sup>
          </div>
        </div>
        <p className="mt-4 text-xs sm:text-sm text-[#6e6c68] dark:text-zinc-400">
          A seamless 3-step pipeline engineered to eliminate repetitive application friction and increase interview callback rates.
        </p>
      </div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Live ATS Match Scanner */}
        <div
          onClick={() => setActiveStep(0)}
          className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900 border transition-all p-6 cursor-pointer ${
            activeStep === 0
              ? "border-[#1e1d1b] dark:border-white shadow-md ring-2 ring-[#e8531f]/20"
              : "border-[#dad8d4] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          {/* Card Mockup Visual */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6e6c68] dark:text-zinc-400">
                Live Scanner Simulator
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready
              </span>
            </div>

            {/* Role Selector Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SAMPLE_ROLES.map((role, idx) => (
                <button
                  key={role.company}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoleIndex(idx);
                  }}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                    selectedRoleIndex === idx
                      ? "bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900"
                      : "bg-[#f4f3f1] dark:bg-zinc-800 text-[#6e6c68] dark:text-zinc-400"
                  }`}
                >
                  {role.company}
                </button>
              ))}
            </div>

            {/* Active Role Card Inside */}
            <div className="rounded-2xl border border-[#dad8d4]/80 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100">
                    {SAMPLE_ROLES[selectedRoleIndex].title}
                  </h4>
                  <div className="text-[11px] text-[#6e6c68] dark:text-zinc-400">
                    {SAMPLE_ROLES[selectedRoleIndex].company} · Remote
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {SAMPLE_ROLES[selectedRoleIndex].score}%
                  </div>
                  <div className="text-[9px] text-[#6e6c68] dark:text-zinc-400">ATS Match</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-[#6e6c68] dark:text-zinc-400">
                  Matched Skills ({SAMPLE_ROLES[selectedRoleIndex].tags.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {SAMPLE_ROLES[selectedRoleIndex].tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Caption block */}
          <div className="mt-6 pt-4 border-t border-[#dad8d4]/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e8531f]">01</span>
              <h3 className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100">Instant ATS Analysis</h3>
            </div>
            <p className="mt-1 text-[11px] text-[#6e6c68] dark:text-zinc-400 leading-normal">
              Extracts title, company, requirements, and compares them with your master resume instantly.
            </p>
          </div>
        </div>

        {/* Card 2: AI Bullet & Pitch Tailor */}
        <div
          onClick={() => setActiveStep(1)}
          className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900 border transition-all p-6 cursor-pointer ${
            activeStep === 1
              ? "border-[#1e1d1b] dark:border-white shadow-md ring-2 ring-[#e8531f]/20"
              : "border-[#dad8d4] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          {/* Card Mockup Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6e6c68] dark:text-zinc-400">
                AI Elevator Pitch
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasCopied(true);
                  setTimeout(() => setHasCopied(false), 2000);
                }}
                className="text-[10px] font-semibold text-[#e8531f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {hasCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {hasCopied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Pseudo AI Input Box with Paperclip & Black Circular Button */}
            <div className="rounded-2xl border border-[#dad8d4]/80 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-950 p-3.5 space-y-3">
              <div className="text-[11px] text-[#1e1d1b] dark:text-zinc-200 font-mono leading-relaxed min-h-[72px]">
                {typewriterText}
                <span className="inline-block w-1.5 h-3 bg-[#e8531f] ml-0.5 animate-pulse" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#dad8d4]/60 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-[#6e6c68] dark:text-zinc-400">
                  <Paperclip className="size-3.5" />
                  <span className="text-[10px] font-mono">Master-Resume.pdf</span>
                </div>
                <div className="size-6 rounded-full bg-[#1e1d1b] dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-2xs">
                  <ArrowUp className="size-3" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-[#dad8d4] dark:border-zinc-800 p-2.5 text-[10px] text-[#6e6c68] dark:text-zinc-400 flex items-center justify-between">
              <span>Optimized for Hiring Managers</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">High Impact</span>
            </div>
          </div>

          {/* Caption block */}
          <div className="mt-6 pt-4 border-t border-[#dad8d4]/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e8531f]">02</span>
              <h3 className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100">Tailored Elevator Pitches</h3>
            </div>
            <p className="mt-1 text-[11px] text-[#6e6c68] dark:text-zinc-400 leading-normal">
              Converts complex experience into concise, persuasive cover notes tailored to company values.
            </p>
          </div>
        </div>

        {/* Card 3: 1-Click Form Autofill Engine */}
        <div
          onClick={() => setActiveStep(2)}
          className={`flex flex-col justify-between rounded-3xl bg-white dark:bg-zinc-900 border transition-all p-6 cursor-pointer ${
            activeStep === 2
              ? "border-[#1e1d1b] dark:border-white shadow-md ring-2 ring-[#e8531f]/20"
              : "border-[#dad8d4] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
          }`}
        >
          {/* Card Mockup Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6e6c68] dark:text-zinc-400">
                Application Autofill
              </span>
              <span className="text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-400">
                0.4s Duration
              </span>
            </div>

            {/* Inline status row from DESIGN.md */}
            <div className="rounded-2xl border border-[#dad8d4]/80 dark:border-zinc-800 bg-[#faf9f7] dark:bg-zinc-950 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1e1d1b] dark:text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="size-3 text-emerald-500 animate-spin" />
                  <span>Updating 14 fields</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">100%</span>
              </div>

              {/* Progress visual */}
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full" />
              </div>

              {/* Simulated fields */}
              <div className="space-y-1 text-[10px] font-mono text-[#6e6c68] dark:text-zinc-400">
                <div className="flex justify-between py-0.5">
                  <span>Legal Name</span>
                  <span className="text-zinc-900 dark:text-zinc-200">Alex Morgan</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Work Authorization</span>
                  <span className="text-zinc-900 dark:text-zinc-200">Authorized (US)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Resume Attached</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Vercel-Senior.pdf</span>
                </div>
              </div>
            </div>

            {/* Portal badges */}
            <div className="flex items-center justify-between text-[10px] text-[#6e6c68] dark:text-zinc-400 px-1">
              <span>Google Forms Validated</span>
              <span>Greenhouse Verified</span>
            </div>
          </div>

          {/* Caption block */}
          <div className="mt-6 pt-4 border-t border-[#dad8d4]/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e8531f]">03</span>
              <h3 className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100">Zero-Error Form Fill</h3>
            </div>
            <p className="mt-1 text-[11px] text-[#6e6c68] dark:text-zinc-400 leading-normal">
              Directly dispatches native input events to avoid required field validation errors on complex portals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

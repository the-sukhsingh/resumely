"use client";

import React, { useState } from "react";
import Heading from "./Heading";
import { UploadCloud, FileSearch, DownloadCloud, Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Import Your Master History",
    description:
      "Upload any existing PDF, paste raw text, or import from LinkedIn. Resumely extracts dates, roles, achievements, and technical competencies into your centralized ledger.",
    tip: "One-time setup · Never lose an achievement again",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Drop In The Target Job Description",
    description:
      "Paste the job listing. Our AI parses the recruiter's exact rubric, flags required keywords, and dynamically tailors your bullets to emphasize matching impact.",
    tip: "Semantic keyword gap analysis · 100% truthful mapping",
  },
  {
    number: "03",
    icon: DownloadCloud,
    title: "Inspect & Export ATS-Clean PDF",
    description:
      "Review the targeted document in real-time preview. Chat to refine any phrasing, then export a clean, machine-parseable PDF ready for one-click submission.",
    tip: "Single-column layout · Zero formatting drift",
  },
];

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative px-6 py-24 md:py-32 z-10 max-w-5xl mx-auto">
      <div className="mb-14 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
          The 3-Step Workflow
        </div>
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          From master history
          <br />
          <span className="text-muted-foreground font-normal">to tailored application in 90 seconds.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          No more creating twenty separate Word files on your desktop. Here is how your single master record handles every job opportunity.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Video Demo Frame */}
        <div className="w-full lg:w-7/12">
          <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-xs p-2 sm:p-3 shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 text-xs font-mono text-muted-foreground mb-2">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Live Walkthrough Demo
              </span>
              <span>2 min overview</span>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/90 border border-border/40">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jZMa3juiB9U"
                title="Resumely Workflow Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 border-0"
              />
            </div>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="w-full lg:w-5/12 flex flex-col gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left",
                  isSelected
                    ? "border-foreground/30 bg-card/80 shadow-xs"
                    : "border-border/60 bg-card/20 hover:bg-card/40 hover:border-border"
                )}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className={cn(
                      "size-7 rounded-lg border font-mono text-xs font-semibold flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted text-muted-foreground border-border/70"
                    )}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-10">
                  {step.description}
                </p>

                <div className="mt-3 pl-10 text-[11px] font-mono text-foreground/70 flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-500 shrink-0" />
                  <span>{step.tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
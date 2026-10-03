"use client";

import React from "react";
import Heading from "./Heading";
import { Database, Target, Bot, FileCheck, ArrowUpRight } from "lucide-react";

const features = [
  {
    index: "01",
    icon: Database,
    title: "Centralized Experience Hub",
    badge: "Master Record",
    description:
      "Maintain a single living ledger of every project, skill, and milestone. Update once, and every subsequent tailored resume inherits the change instantly.",
    highlight: "1 Master Profile → ∞ Targeted Variations",
  },
  {
    index: "02",
    icon: Target,
    title: "Semantic Job Matcher",
    badge: "Keyword Alignment",
    description:
      "Paste any target job description. Resumely extracts explicit ATS requirements and aligns your real accomplishments without awkward keyword stuffing.",
    highlight: "Role-Specific Lexicon • Gap Analysis",
  },
  {
    index: "03",
    icon: Bot,
    title: "Conversational AI Editing",
    badge: "Interactive Copilot",
    description:
      "Chat with your resume in real time. Instruct the AI to quantify fuzzy impact, tighten passive verbs into active voice, or re-level bullets for senior roles.",
    highlight: "Google Gemini 2.5 • Context-Aware",
  },
  {
    index: "04",
    icon: FileCheck,
    title: "Synchronized Cover Letters",
    badge: "Cohesive Applications",
    description:
      "Generate clean, persuasive cover letters that reinforce the exact accomplishments cited in your tailored resume for a unified application package.",
    highlight: "Zero Generic Slop • Matching Typography",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="mx-auto px-6 py-24 md:py-32 relative z-10 max-w-5xl">
      <div className="mb-14 md:mb-20">
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Built for precision.
          <br />
          <span className="text-muted-foreground font-normal">Designed for zero friction.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          The difference between a generic template and an interview invitation is relevance. Everything in Resumely is engineered to make your experience resonate with hiring managers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.index}
              className="group relative rounded-2xl border border-border/70 bg-card/40 hover:bg-card/70 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-foreground/20"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl border border-border/80 bg-muted/50 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform duration-200">
                      <Icon className="size-4.5" />
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
                      {feature.badge}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors duration-150">
                    {feature.index}
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{feature.highlight}</span>
                <ArrowUpRight className="size-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
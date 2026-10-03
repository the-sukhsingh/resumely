"use client";

import React, { useState } from "react";
import Heading from "./Heading";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Will resumes built with Resumely pass modern Applicant Tracking Systems (ATS)?",
    a: "Yes, absolutely. ATS scanners fail when resumes use multi-column tables, text boxes, non-standard symbols, or embedded graphics. Resumely outputs clean, machine-parseable single-column layouts with standard font hierarchies that Workday, Greenhouse, Lever, and Taleo can parse with 100% fidelity.",
  },
  {
    q: "Do purchased credits ever expire?",
    a: "No. Your credits never expire. Job searching happens in seasons—there is no reason you should pay a recurring monthly subscription when you are not actively interviewing. Use what you need today, and keep remaining credits for future career moves.",
  },
  {
    q: "How does the 'Master Profile' differ from typical resume builders?",
    a: "Traditional builders force you to duplicate and juggle 15 different Word or PDF files on your desktop. In Resumely, you maintain one comprehensive master ledger containing every project, metric, and skill. When applying to a specific role, our engine selects, sequences, and tailors the most impactful points for that exact job rubric.",
  },
  {
    q: "Can I manually edit and chat with my resume before exporting?",
    a: "Yes. You have complete control. You can edit any bullet point manually, or chat directly with our AI copilot to quantify fuzzy impact, adopt an executive tone, or shorten bullets to fit a clean one-page layout.",
  },
  {
    q: "Is my personal work history and career data kept private?",
    a: "Your career records belong exclusively to you. Your data is encrypted at rest and in transit, and is never shared, indexed, or sold to third-party recruiters.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="px-6 py-24 md:py-32 relative z-10 max-w-5xl mx-auto">
      <div className="mb-14 md:mb-20 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
          Frequently Asked Questions
        </div>
        <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Clear answers.
          <br />
          <span className="text-muted-foreground font-normal">Zero ambiguity.</span>
        </Heading>
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Everything you need to know about ATS compliance, credit expiration, and managing your master career profile.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border transition-colors duration-150 overflow-hidden",
                isOpen
                  ? "border-foreground/30 bg-card/60 shadow-xs"
                  : "border-border/60 bg-card/20 hover:border-border hover:bg-card/40"
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer active:scale-[0.99] transition-transform duration-100"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                  {faq.q}
                </span>
                <span
                  className={cn(
                    "size-7 rounded-full border border-border/60 flex items-center justify-center shrink-0 transition-transform duration-200",
                    isOpen ? "rotate-180 bg-foreground text-background border-foreground" : "text-muted-foreground"
                  )}
                >
                  <ChevronDown className="size-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/30 animate-in fade-in-50 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

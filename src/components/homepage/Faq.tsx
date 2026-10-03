"use client";

import React, { useState } from "react";
import Heading from "./Heading";

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    id: "01",
    q: "Will resumes built with Resumely pass modern Applicant Tracking Systems (ATS)?",
    a: "Yes, absolutely. ATS scanners fail when resumes use multi-column tables, text boxes, non-standard symbols, or embedded graphics. Resumely outputs clean, machine-parseable single-column layouts with standard font hierarchies that Workday, Greenhouse, Lever, and Taleo can parse with 100% fidelity.",
  },
  {
    id: "02",
    q: "Do purchased credits ever expire?",
    a: "No. Your credits never expire. Job searching happens in seasons—there is no reason you should pay a recurring monthly subscription when you are not actively interviewing. Use what you need today, and keep remaining credits for future career moves.",
  },
  {
    id: "03",
    q: "How does the 'Master Profile' differ from typical resume builders?",
    a: "Traditional builders force you to duplicate and juggle 15 different Word or PDF files on your desktop. In Resumely, you maintain one comprehensive master ledger containing every project, metric, and skill. When applying to a specific role, our engine selects, sequences, and tailors the most impactful points for that exact job rubric.",
  },
  {
    id: "04",
    q: "Can I manually edit and chat with my resume before exporting?",
    a: "Yes. You have complete control. You can edit any bullet point manually, or chat directly with our AI copilot to quantify fuzzy impact, adopt an executive tone, or shorten bullets to fit a clean one-page layout.",
  },
  {
    id: "05",
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
    <section id="faq" className="px-6 py-24 md:py-32 relative z-10 max-w-6xl mx-auto border-t border-border/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start text-left">
        {/* Left Sticky Header */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
            FAQ // COMMON INQUIRIES
          </div>
          <Heading as="h2" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Clear answers.
            <br />
            <span className="text-muted-foreground font-normal">Zero ambiguity.</span>
          </Heading>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Everything you need to know about ATS compliance, non-expiring credits, data privacy, and managing your master ledger.
          </p>
        </div>

        {/* Right Hairline Accordion List (Zero Cards, Smooth Grid-Rows Transition) */}
        <div className="lg:col-span-8 border-t border-border/40 divide-y divide-border/40">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={faq.id} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full py-5 flex items-start justify-between text-left gap-6 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-muted-foreground/50 mt-1 select-none">
                      {faq.id}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                        isOpen
                          ? "text-foreground"
                          : "text-foreground/80 group-hover:text-foreground"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* Smooth Rotating Vector Glyph Toggle */}
                  <span
                    className={`size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      isOpen
                        ? "rotate-45 text-foreground bg-muted/70"
                        : "text-muted-foreground/70 group-hover:text-foreground group-hover:bg-muted/30"
                    }`}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="size-3.5"
                    >
                      <line x1="8" y1="3" x2="8" y2="13" />
                      <line x1="3" y1="8" x2="13" y2="8" />
                    </svg>
                  </span>
                </button>

                {/* CSS Grid-Rows Smooth Height & Opacity Transition */}
                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-8 md:pl-10 pb-6 pr-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

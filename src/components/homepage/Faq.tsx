"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Resumely guarantee ATS compatibility?",
      a: "Resumely generates clean, single-column vector PDFs using native typography. We avoid HTML tables, multi-column floating boxes, graphics, and unreadable fonts that cause parsing errors in Workday, Greenhouse, Lever, and Taleo.",
    },
    {
      q: "Does Resumely invent false accomplishments?",
      a: "Never. Resumely adheres strictly to career honesty. All generated resumes and cover letters pull directly from the verified metrics and roles stored in your Master Ledger. The AI re-orders and emphasizes matching strengths without inventing false facts.",
    },
    {
      q: "Can I export my resume to LaTeX or plain text?",
      a: "Yes. Every resume can be exported as an ATS-tested vector PDF, raw LaTeX source, or clean plaintext markdown to paste directly into company job applications.",
    },
    {
      q: "What is the difference between Resumely and generic AI resume generators?",
      a: "Generic AI writers fabricate generic bullet points and output bloated designs that fail ATS parsers. Resumely functions as an engineering workbench: a single living master ledger, rubric-based calibration against real job descriptions, and a synchronized application tracker.",
    },
    {
      q: "What happens to my data if I cancel or stop using Resumely?",
      a: "You can download your entire master career ledger, all tailored resumes, and cover letters at any time in open standard formats (JSON and PDF). We never lock your career data behind paywalls.",
    },
  ];

  return (
    <section id="resources" className="py-20 sm:py-28 border-t border-border/50 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-3 leading-[1.12]">
          Everything you need to know.
        </h2>
      </div>

      <div className="max-w-3xl divide-y divide-border/50">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.q} className="py-6">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-neutral-500 transition-transform duration-200 shrink-0 ml-4",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400 leading-relaxed pr-8">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}


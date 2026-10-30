"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import ColoredButton from "@/components/custom/colored-button";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "choice",
    question: "Which resume builder should I use for tech roles?",
    answer:
      "If you're applying for engineering, product, or technical positions and need verified ATS compliance, use Resumely. It reads your raw career ledger, generates single-column vector PDFs, and never hallucinates metrics or skills. You'll know exactly how your resume scores against the job description before you hit submit. If you're looking for decorative 3-column graphics with skill percentage bars that confuse ATS parsers, try Canva. If you want a job-winning technical resume engineered to get past Greenhouse and Workday, Resumely was built for that.",
  },
  {
    id: "available",
    question: "Can I use Resumely now?",
    answer:
      "Yes. You can start with our Master Ledger editor immediately without entering a credit card. Compile your work achievements, preview live vector rendering, and test your ATS compatibility score on any job description before paying a single dollar.",
  },
  {
    id: "why",
    question: "Why Resumely?",
    answer:
      "Resumely is built on real hiring experience across top engineering and tech organizations. We believe in total career transparency, privacy, and zero hallucination. Unlike generic chatbots that invent fake metrics ('boosted revenue by 840%'), Resumely constraints every draft strictly to your verified accomplishments, formatting with industry-standard typography tokens.",
  },
  {
    id: "upload",
    question: "What do I upload?",
    answer:
      "Upload your existing resume in PDF, DOCX, or Markdown, or paste your LinkedIn work experience. Resumely parses your roles, company names, dates, technologies, and achievements into structured, reusable accomplishment blocks in your private Master Ledger.",
  },
  {
    id: "duration",
    question: "How long will the calibration take? Can I close my laptop while it runs?",
    answer:
      "Calibration typically finishes in 8 to 15 seconds per job description. Everything runs asynchronously in the cloud, so you can safely close your laptop or switch tabs immediately—your tailored PDF and match report will be waiting in your dashboard.",
  },
  {
    id: "voice",
    question: "Will it rewrite my voice?",
    answer:
      "No. We hate robotic AI buzzwords and stuffed jargon just as much as recruiters do. Resumely strictly preserves your natural phrasing and genuine technical contributions, optimizing active verbs and measurable outcomes rather than injecting generic fluff.",
  },
  {
    id: "deliverables",
    question: "What do I get back?",
    answer:
      "You receive an ATS-verified vector PDF ready for immediate job application submission, clean plaintext markdown for pasting into legacy application portals, and raw LaTeX source code if you desire complete typographical control. No watermarks, ever.",
  },
  {
    id: "credits",
    question: "Do credits ever expire?",
    answer:
      "Never. Purchased credit packs stay in your account forever until you choose to spend them. Editing your master ledger, switching templates, and exporting standard resumes remain permanently free.",
  },
];

export default function Faq() {
  const [activeId, setActiveId] = useState<string | null>("why");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      className="relative w-full bg-[#faf9f6] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-20 sm:py-28 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading, Metadata, Legal Context, and ColoredButton CTA */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-[-0.025em] text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.08] font-[family-name:Georgia,Cambria,'Times_New_Roman',Times,serif]">
              Questions,
              <br />
              answered
            </h2>

            <p className="mt-3.5 text-[13px] text-[#71717a] dark:text-[#a1a1aa] font-normal">
              Updated 20 October 2026
            </p>

            <div className="mt-10 sm:mt-12 space-y-5 max-w-sm">
              <p className="text-[15px] sm:text-base text-[#52525b] dark:text-[#a1a1aa] font-normal leading-relaxed">
                Something we haven&apos;t covered? We read every message.
              </p>

              <p className="text-[13px] sm:text-[13.5px] text-[#71717a] dark:text-[#8b897f] leading-relaxed">
                How we handle and retain your data is set out in our{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-3 decoration-neutral-300 dark:decoration-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Privacy and Security Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-3 decoration-neutral-300 dark:decoration-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Terms of Use
                </Link>
                .
              </p>
            </div>

            <div className="mt-8">
              <ColoredButton
                asChild
                color="blue"
                size="lg"
                className="h-10.5 rounded-full px-6 text-sm font-medium cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-transform"
              >
                <a href="mailto:support@resumely.tech">
                  <span>Write to us</span>
                </a>
              </ColoredButton>
            </div>
          </div>

          {/* Right Column: Inline Chat Accordion List with Smooth Layout Motion */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 w-full">
            <LayoutGroup id="faq-accordion-group">
              {FAQS.map((faq) => {
                const isActive = activeId === faq.id;

                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    transition={{
                      layout: {
                        duration: shouldReduceMotion ? 0 : 0.48,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                    className="w-full flex flex-col items-start"
                  >
                    {/* Question Pill */}
                    <button
                      type="button"
                      onClick={() => setActiveId(isActive ? null : faq.id)}
                      className={cn(
                        "w-fit inline-flex items-center text-left px-5 py-3 rounded-full text-[14px] font-medium transition-[color,background-color,border-color,transform] duration-150 cursor-pointer active:scale-[0.98]",
                        isActive
                          ? "border border-neutral-900 dark:border-neutral-200 bg-white dark:bg-[#1c1b18] text-[#1c1b18] dark:text-[#edebe6]"
                          : "bg-white dark:bg-[#1c1b18] text-[#1c1b18] dark:text-[#edebe6] border border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                      )}
                    >
                      {faq.question}
                    </button>

                    {/* Answer Speech Bubble directly beneath the active question */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="answer-bubble"
                          initial={
                            shouldReduceMotion
                              ? { opacity: 1, height: "auto" }
                              : { opacity: 0, height: 0 }
                          }
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: {
                              height: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
                              opacity: { duration: 0.35, delay: 0.08, ease: "easeOut" },
                            },
                          }}
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0, height: 0 }
                              : {
                                  opacity: 0,
                                  height: 0,
                                  transition: {
                                    height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.22, ease: "easeIn" },
                                  },
                                }
                          }
                          className="w-full overflow-hidden"
                        >
                          <div className="pt-3 pb-1 flex justify-end w-full">
                            <div className="relative rounded-[24px] rounded-br-[4px] p-6 sm:p-7 bg-[#18181b] dark:bg-[#1c1b18] text-neutral-100 dark:text-neutral-200 max-w-full sm:max-w-[540px] w-full border border-neutral-800/80 dark:border-neutral-700/80">
                              <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-neutral-200 font-normal">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </div>

        </div>
      </div>
    </section>
  );
}

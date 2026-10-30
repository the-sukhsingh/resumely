"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, MessageCircle, ArrowRight, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    id: "ats",
    category: "Compatibility",
    q: "How does Resumely guarantee ATS compatibility?",
    a: "Resumely compiles directly to single-column vector PDFs using native typography. We eliminate tables, text boxes, multi-column floating layers, and custom symbol glyphs that cause parsing failures in Workday, Greenhouse, Lever, and Taleo.",
  },
  {
    id: "honesty",
    category: "Career Truth",
    q: "Does Resumely invent or hallucinate accomplishments?",
    a: "Never. Resumely adheres strictly to career truthfulness. Every generated resume and cover letter pulls exclusively from the verified achievements in your Master Ledger. The AI re-ranks and reframes your actual accomplishments to match the job rubric without fabricating metrics.",
  },
  {
    id: "formats",
    category: "Export Formats",
    q: "Can I export my resume to LaTeX source or plain text?",
    a: "Yes. Every version can be exported as an ATS-verified vector PDF, raw LaTeX source, or clean Markdown plaintext ready to paste directly into employer application portals.",
  },
  {
    id: "credits",
    category: "Pricing & Packs",
    q: "How do credits work, and do they ever expire?",
    a: "Credits are purchased in one-time packs and never expire. You only consume credits when performing deep AI calibrations or generating tailored cover letters. Editing, viewing, exporting vector PDFs, and tracking applications in Kanban are always free.",
  },
  {
    id: "versions",
    category: "Application Strategy",
    q: "Can I manage multiple tailored versions for different roles?",
    a: "Yes. Your Master Ledger serves as the single source of truth from which you can branch infinite tailored variations (e.g. Staff Backend, Systems Architect, or Technical Lead), each permanently preserved in your application pipeline.",
  },
  {
    id: "ownership",
    category: "Data Ownership",
    q: "What happens to my data if I stop using Resumely?",
    a: "Your career data belongs to you. You can export your full master ledger, all tailored resumes, and application history at any time in open JSON and PDF formats. We never hold your career history hostage behind paywalls.",
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>("ats");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      className="relative w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1c1b18] dark:text-[#edebe6] py-20 sm:py-28 border-b border-[#e2e0da] dark:border-[#24231f] transition-colors duration-200 overflow-hidden select-none"
    >
      {/* Subtle Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e0da_1px,transparent_1px)] dark:bg-[radial-gradient(#282622_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-25" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric 2-Column Grid (approx 2:3 ratio: 5 cols / 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (~40% width): Intro, CTA, and Vector Mascot */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-10">
            <div>
              {/* Category Pill with Strawberry Red Dot */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] text-xs font-mono text-[#8b897f] dark:text-[#9c9a8f] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                <span>Frequently Asked Questions</span>
              </div>

              {/* Bold Geometric Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#1c1b18] dark:text-[#f3f2ee] leading-[1.12]">
                Everything you need to know.
              </h2>
              
              <p className="mt-4 text-sm sm:text-base text-[#8b897f] dark:text-[#9c9a8f] font-normal leading-relaxed max-w-sm">
                Have questions about our ATS algorithms, privacy, or career branching? Here are straight answers without sales jargon.
              </p>

              {/* Pill-Shaped CTA Button */}
              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1c1b18] hover:bg-[#2b2a26] text-[#f5f3ef] dark:bg-[#edebe6] dark:hover:bg-[#ffffff] dark:text-[#121110] text-xs font-medium transition-[background-color,transform] duration-150 ease-out active:scale-[0.96] shadow-xs"
                >
                  <span>Build your resume</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </Link>
                <a
                  href="mailto:support@resumely.tech"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#8b897f] hover:text-[#1c1b18] dark:hover:text-[#f3f2ee] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Talk to us</span>
                </a>
              </div>
            </div>

            {/* Whimsical Minimalist Vector Mascot Illustration Anchor */}
            <div className="pt-6 hidden sm:flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] flex items-center justify-center p-3 shadow-xs">
                {/* SVG Character Mascot with Strawberry Red Details */}
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Mascot Antenna with Strawberry Pop Dot */}
                  <line x1="50" y1="20" x2="50" y2="12" stroke="#1c1b18" strokeWidth="3" strokeLinecap="round" className="dark:stroke-[#edebe6]" />
                  <circle cx="50" cy="10" r="4" fill="#f43f5e" />

                  {/* Character Body / Head */}
                  <rect x="22" y="20" width="56" height="52" rx="18" fill="#ffffff" stroke="#1c1b18" strokeWidth="3" className="dark:fill-[#23221f] dark:stroke-[#edebe6]" />

                  {/* Expressive Friendly Eyes */}
                  <circle cx="38" cy="42" r="3.5" fill="#1c1b18" className="dark:fill-[#edebe6]" />
                  <circle cx="62" cy="42" r="3.5" fill="#1c1b18" className="dark:fill-[#edebe6]" />

                  {/* Strawberry Red Cheeks */}
                  <circle cx="32" cy="48" r="3" fill="#f43f5e" opacity="0.8" />
                  <circle cx="68" cy="48" r="3" fill="#f43f5e" opacity="0.8" />

                  {/* Gentle Smile */}
                  <path d="M43 51 C47 55, 53 55, 57 51" stroke="#1c1b18" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-[#edebe6]" />

                  {/* Mascot Holding Miniature Resume Document */}
                  <rect x="36" y="60" width="28" height="24" rx="4" fill="#edebe6" stroke="#1c1b18" strokeWidth="2.5" className="dark:fill-[#181715] dark:stroke-[#edebe6]" />
                  <line x1="42" y1="67" x2="58" y2="67" stroke="#1c1b18" strokeWidth="2" strokeLinecap="round" className="dark:stroke-[#edebe6]" />
                  <line x1="42" y1="73" x2="54" y2="73" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="space-y-0.5 text-xs">
                <div className="font-semibold text-[#1c1b18] dark:text-[#f3f2ee]">
                  Career Guard Active
                </div>
                <div className="text-[11px] font-mono text-[#8b897f] dark:text-[#9c9a8f]">
                  Strictly 0% hallucinated metrics.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (~60% width): Stacked Interactive Chat-Bubble Accordions */}
          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div key={faq.id} className="transition-all duration-200">
                  {isOpen ? (
                    /* Selected: Solid Dark Charcoal Message Bubble UI */
                    <div className="rounded-2xl p-5 sm:p-6 bg-[#1c1b18] text-[#f5f3ef] dark:bg-[#1f1e1a] dark:text-[#edebe6] border border-[#2b2a26] dark:border-[#2d2b26] shadow-md transition-all duration-200">
                      
                      {/* Bubble Header */}
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] shrink-0" />
                          <span className="text-sm sm:text-base font-semibold tracking-tight text-white dark:text-[#f3f2ee]">
                            {faq.q}
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0 text-white/70 group-hover:text-white transition-colors">
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </button>

                      {/* Animated Message Bubble Body */}
                      <AnimatePresence initial={false}>
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 text-xs sm:text-[13px] text-neutral-300 dark:text-neutral-300 leading-relaxed font-normal border-t border-white/10 dark:border-white/5 mt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                    </div>
                  ) : (
                    /* Unselected: Flat Pill-Shaped Question Block */
                    <button
                      type="button"
                      onClick={() => setOpenId(faq.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#edebe6] hover:bg-[#e4e1da] dark:bg-[#1b1a17] dark:hover:bg-[#22211e] border border-[#e2e0da]/60 dark:border-[#282622] text-left cursor-pointer transition-[background-color,border-color] duration-150 ease-out group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8b897f] group-hover:bg-[#f43f5e] transition-colors shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-[#1c1b18] dark:text-[#edebe6] truncate">
                          {faq.q}
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 text-[#8b897f] group-hover:text-[#1c1b18] dark:group-hover:text-[#edebe6] transition-colors">
                        <Plus className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

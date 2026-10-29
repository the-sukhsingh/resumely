"use client";

import React from "react";
import {
  Briefcase,
  Layers,
  Building2,
  FileSpreadsheet,
  Globe,
  Compass,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface IntegrationItem {
  name: string;
  category: string;
  initials: string;
  color: string;
  badge?: string;
}

const INTEGRATIONS_ROW_1: IntegrationItem[] = [
  { name: "LinkedIn", category: "Job Board", initials: "in", color: "bg-[#0a66c2] text-white", badge: "Verified" },
  { name: "Greenhouse", category: "ATS Portal", initials: "GH", color: "bg-[#00b274] text-white", badge: "1-Click" },
  { name: "Lever", category: "ATS Portal", initials: "LV", color: "bg-[#2563eb] text-white", badge: "Auto-Fill" },
  { name: "Ashby", category: "Modern ATS", initials: "AB", color: "bg-[#6366f1] text-white", badge: "1-Click" },
  { name: "Workday", category: "Enterprise ATS", initials: "WD", color: "bg-[#f59e0b] text-white", badge: "Auto-Fill" },
  { name: "Indeed", category: "Job Board", initials: "IN", color: "bg-[#2164f3] text-white", badge: "Instant Scan" },
  { name: "Wellfound", category: "Startups", initials: "WF", color: "bg-[#e11d48] text-white", badge: "Direct Sync" },
];

const INTEGRATIONS_ROW_2: IntegrationItem[] = [
  { name: "Google Jobs", category: "Search Portal", initials: "G", color: "bg-[#ea4335] text-white", badge: "JSON-LD" },
  { name: "Stripe Careers", category: "Direct Portal", initials: "ST", color: "bg-[#635bff] text-white", badge: "Verified" },
  { name: "Linear Careers", category: "Direct Portal", initials: "LN", color: "bg-[#5e6ad2] text-white", badge: "Verified" },
  { name: "ZipRecruiter", category: "Job Board", initials: "ZR", color: "bg-[#10b981] text-white", badge: "Instant Scan" },
  { name: "Notion Careers", category: "Direct Portal", initials: "N", color: "bg-[#000000] text-white", badge: "Verified" },
  { name: "Airbnb Jobs", category: "Direct Portal", initials: "AB", color: "bg-[#ff5a5f] text-white", badge: "Verified" },
  { name: "Google Forms", category: "Application Forms", initials: "GF", color: "bg-[#7248b9] text-white", badge: "Bypass Errors" },
];

export default function LogoMarquee() {
  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6e6c68] dark:text-zinc-400">
          Integrated with 50+ Job Boards, ATS Engines & Career Portals
        </h2>
        <p className="mt-2 text-sm text-[#1e1d1b] dark:text-zinc-300 font-medium">
          Instant real-time match scoring and automated form filling across any website.
        </p>
      </div>

      <div className="relative w-full space-y-3 mask-radial-fade">
        {/* Row 1 */}
        <div className="flex w-max animate-marquee gap-3">
          {[...INTEGRATIONS_ROW_1, ...INTEGRATIONS_ROW_1, ...INTEGRATIONS_ROW_1].map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-[#dad8d4]/90 dark:border-zinc-800 shadow-2xs hover:border-[#1e1d1b]/30 dark:hover:border-zinc-700 transition-all shrink-0 cursor-default"
            >
              <div
                className={`size-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${item.color}`}
              >
                {item.initials}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100 flex items-center gap-1">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#6e6c68] dark:text-zinc-400">{item.category}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 (offset) */}
        <div className="flex w-max animate-marquee-reverse gap-3">
          {[...INTEGRATIONS_ROW_2, ...INTEGRATIONS_ROW_2, ...INTEGRATIONS_ROW_2].map((item, idx) => (
            <div
              key={`row2-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-[#dad8d4]/90 dark:border-zinc-800 shadow-2xs hover:border-[#1e1d1b]/30 dark:hover:border-zinc-700 transition-all shrink-0 cursor-default"
            >
              <div
                className={`size-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${item.color}`}
              >
                {item.initials}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#1e1d1b] dark:text-zinc-100 flex items-center gap-1">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#6e6c68] dark:text-zinc-400">{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

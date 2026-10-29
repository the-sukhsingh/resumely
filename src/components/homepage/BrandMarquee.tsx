"use client";

import React from "react";
import JobAvatar from "@/components/tracker/JobAvatar";

interface Platform {
  name: string;
  category: string;
  badge: string;
}

const PLATFORMS_ROW_1: Platform[] = [
  { name: "LinkedIn", category: "Job Search", badge: "Verified" },
  { name: "Greenhouse", category: "ATS Portal", badge: "1-Click Fill" },
  { name: "Lever", category: "ATS Portal", badge: "Auto-Fill" },
  { name: "Ashby", category: "Modern ATS", badge: "1-Click Fill" },
  { name: "Workday", category: "Enterprise ATS", badge: "Auto-Fill" },
  { name: "Indeed", category: "Job Board", badge: "Live Scan" },
  { name: "Wellfound", category: "Startup Roles", badge: "Direct Sync" },
];

const PLATFORMS_ROW_2: Platform[] = [
  { name: "Google Jobs", category: "Search Portal", badge: "Schema.org" },
  { name: "Stripe", category: "Career Portal", badge: "Verified" },
  { name: "Linear", category: "Career Portal", badge: "Verified" },
  { name: "ZipRecruiter", category: "Job Board", badge: "Live Scan" },
  { name: "Airbnb", category: "Career Portal", badge: "Verified" },
  { name: "Notion", category: "Career Portal", badge: "Verified" },
  { name: "Google Forms", category: "Application Forms", badge: "Zero Errors" },
];

export default function BrandMarquee() {
  return (
    <section className="py-12 sm:py-16 overflow-hidden relative z-10 border-y border-border/40 bg-muted/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-7">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          COMPATIBLE WITH 50+ APPLICANT TRACKING SYSTEMS &amp; JOB PORTALS
        </h3>
        <p className="mt-1 text-sm text-foreground/80 font-medium">
          Zero-latency extraction, real-time rubric matching, and automated form filling across any website.
        </p>
      </div>

      <div className="relative w-full space-y-3 mask-radial-fade">
        {/* Row 1 */}
        <div className="flex w-max animate-marquee gap-3">
          {[...PLATFORMS_ROW_1, ...PLATFORMS_ROW_1, ...PLATFORMS_ROW_1].map((p, idx) => (
            <div
              key={`row1-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card/60 dark:bg-card/30 border border-border/70 backdrop-blur-md shadow-2xs hover:border-foreground/20 transition-all shrink-0 cursor-default"
            >
              <JobAvatar company={p.name} size={22} />
              <div className="text-left font-sans">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>{p.name}</span>
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-muted/60 text-muted-foreground">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{p.category}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 (offset) */}
        <div className="flex w-max animate-marquee-reverse gap-3">
          {[...PLATFORMS_ROW_2, ...PLATFORMS_ROW_2, ...PLATFORMS_ROW_2].map((p, idx) => (
            <div
              key={`row2-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card/60 dark:bg-card/30 border border-border/70 backdrop-blur-md shadow-2xs hover:border-foreground/20 transition-all shrink-0 cursor-default"
            >
              <JobAvatar company={p.name} size={22} />
              <div className="text-left font-sans">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>{p.name}</span>
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-muted/60 text-muted-foreground">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{p.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

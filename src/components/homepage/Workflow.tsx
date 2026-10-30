"use client";

import React from "react";
import { Upload, Sparkles, Send } from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      title: "Ingest Your Career Record",
      description:
        "Upload any existing resume or paste your LinkedIn. Resumely extracts every metric, role, and achievement into your private living ledger.",
      icon: Upload,
    },
    {
      step: "02",
      title: "Calibrate to the Target Role",
      description:
        "Paste the job link or JD. The calibration engine aligns your bullets, highlights matching competencies, and previews your live ATS pass score.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Export Vector PDF & Track",
      description:
        "Download an ATS-proof PDF in seconds. Automatically save the application to your visual pipeline to monitor callbacks and interviews.",
      icon: Send,
    },
  ];

  return (
    <section id="solutions" className="py-20 sm:py-28 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          How It Operates
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-3 leading-[1.12]">
          From job description to submission in 90 seconds.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-8 rounded-3xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm text-neutral-400 font-medium">{s.step}</span>
                </div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


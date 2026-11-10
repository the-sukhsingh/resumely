"use client";

import React from "react";

export default function SocialProofStrip() {
  const companies = [
    { name: "Google", label: "Google" },
    { name: "Stripe", label: "Stripe" },
    { name: "Linear", label: "Linear" },
    { name: "Apple", label: "Apple" },
    { name: "Meta", label: "Meta" },
    { name: "Airbnb", label: "Airbnb" },
    { name: "OpenAI", label: "OpenAI" },
  ];

  return (
    <section className="w-full border-y border-border/40 py-10 bg-neutral-50/50 dark:bg-neutral-900/20">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-6">
          Powering interviews at high-velocity product teams
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 opacity-70 hover:opacity-100 transition-opacity">
          {companies.map((c) => (
            <span
              key={c.name}
              className="text-base sm:text-lg font-medium tracking-tight text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


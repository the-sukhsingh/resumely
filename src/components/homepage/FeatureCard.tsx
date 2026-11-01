import React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  id?: string;
  eyebrow?: string | React.ReactNode;
  seed?: number;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  preview?: React.ReactNode;
  manifest?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export default function FeatureCard({
  id,
  title,
  description,
  preview,
  manifest,
  children,
  className,
}: FeatureCardProps) {
  const illustration = preview || manifest;

  return (
    <div
      id={id}
      style={{
        backgroundColor:
          "color-mix(in oklab, oklch(var(--oklch-zinc-900)) 4%, transparent)",
      }}
      className={cn(
        "group relative flex flex-col justify-between p-6 sm:p-7 rounded-[28px]",
        "border border-black/[0.04] dark:border-white/[0.06]",
        "min-h-[320px] sm:min-h-[340px]",
        "transition-[background-color,border-color,transform] duration-150 ease-out select-none overflow-hidden",
        "hover:bg-[color-mix(in_oklab,oklch(var(--oklch-zinc-900))_6%,transparent)]",
        className
      )}
    >
      {/* 1. Illustration (centered in upper area) */}
      <div className="flex-1 min-h-[160px] sm:min-h-[175px] flex items-center justify-center relative w-full py-2">
        {illustration}
      </div>

      {/* 2. Heading & 3. Sub-heading (clean, smooth, refined typography - not heavy bold) */}
      <div className="mt-auto pt-2">
        <h3 className="text-[15px] sm:text-[16px] font-medium text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

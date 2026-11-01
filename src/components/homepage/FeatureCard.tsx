import React from "react";
import { cn } from "@/lib/utils";

export interface FeatureCardManifestRow {
  label: string;
  value: React.ReactNode;
}

export interface FeatureCardProps {
  id?: string;
  eyebrow?: string | React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  preview?: React.ReactNode;
  manifestHeader?: {
    label: string;
    value: React.ReactNode;
  };
  manifestRows?: FeatureCardManifestRow[];
  manifest?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  seed?: number;
  gridVariant?: "neutral" | "blue" | "emerald";
  cellSize?: number;
}

export default function FeatureCard({
  id,
  eyebrow,
  title,
  description,
  preview,
  manifestHeader,
  manifestRows,
  manifest,
  children,
  className,
}: FeatureCardProps) {
  const mockup = preview || manifest;

  return (
    <div
      id={id}
      className={cn(
        "group relative flex flex-col justify-between p-6 sm:p-7 rounded-[26px]",
        // Flat, soft rounded rectangle with very low-contrast warm fill (inspired by MyMind minimalist bento)
        "bg-[#edebe6] dark:bg-[#1a1917]",
        "border border-[#e2e0da]/60 dark:border-neutral-800/60",
        "min-h-[340px] sm:min-h-[360px]",
        "transition-colors duration-200 select-none overflow-hidden",
        "hover:bg-[#eae7e0] dark:hover:bg-[#1f1e1b]",
        className
      )}
    >
      {/* Centered Mockup Area (takes ~60% of card height, centered with flex) */}
      {mockup ? (
        <div className="flex-1 min-h-[170px] sm:min-h-[190px] flex items-center justify-center relative w-full mb-4">
          {mockup}
        </div>
      ) : manifestHeader || (manifestRows && manifestRows.length > 0) ? (
        <div className="flex-1 min-h-[170px] sm:min-h-[190px] flex flex-col justify-center w-full mb-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#252523] border border-[#e2e0da] dark:border-neutral-700/80 shadow-[0_4px_14px_rgba(0,0,0,0.04)] space-y-2 font-mono text-[11px]">
            {manifestHeader && (
              <div className="flex items-center justify-between text-[#8b897f] dark:text-[#9e9c93]">
                <span className="uppercase tracking-wider text-[10px]">{manifestHeader.label}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{manifestHeader.value}</span>
              </div>
            )}
            {manifestRows?.map((row, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-baseline justify-between",
                  idx === 0
                    ? "text-xs font-medium text-[#1c1b18] dark:text-[#f3f1ec]"
                    : "text-[10px] pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[#8b897f] dark:text-[#9e9c93]"
                )}
              >
                <span className="truncate">{row.label}</span>
                <span className="tabular-nums shrink-0 ml-2 text-[#1c1b18] dark:text-[#f3f1ec] font-medium">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Left-Aligned Bottom Text Block */}
      <div className="mt-auto">
        {eyebrow && (
          <div className="text-[10.5px] font-mono font-medium text-[#8b897f] dark:text-[#9e9c93] uppercase tracking-wider mb-1.5">
            {eyebrow}
          </div>
        )}
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1c1b18] dark:text-[#f3f1ec] leading-snug">
          {title}
        </h3>
        <p className="mt-1.5 text-[12.5px] sm:text-[13px] text-[#8b897f] dark:text-[#9e9c93] leading-relaxed">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

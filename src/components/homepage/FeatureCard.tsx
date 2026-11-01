import React from "react";
import { cn } from "@/lib/utils";
import BlinkingGrid from "@/components/custom/blinking-grid";

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
  seed = 0,
  gridVariant = "neutral",
  cellSize = 14,
}: FeatureCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "group relative p-6 sm:p-7 rounded-[22px]",
        // Luminous card surface with fine vertical elevation gradient
        "bg-gradient-to-b from-white via-[#f9f9fa] to-[#f1f1f3] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10]",
        "border border-neutral-200/80 dark:border-neutral-800/80",
        "hover:border-neutral-300 dark:hover:border-neutral-700",
        "flex flex-col justify-between min-h-[340px] sm:min-h-[360px]",
        "transition-all duration-300 ease-out select-none overflow-hidden",
        "shadow-[0_1px_3px_rgba(0,0,0,0.02),0_8px_20px_-4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)]",
        "dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),0_12px_28px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {/* Blueprint drafting grid with subtle mask so it never competes with text */}
      <BlinkingGrid
        cellSize={cellSize}
        seed={seed}
        variant={gridVariant}
        maskClassName="[mask-image:radial-gradient(ellipse_75%_45%_at_50%_0%,#000_25%,transparent_100%)]"
        className="opacity-70 dark:opacity-30"
      />

      {/* Subtle hover spotlight bloom */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(0,0,0,0.02),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Text Block */}
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                {eyebrow}
              </span>
            </div>
          )}

          <h3 className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-neutral-900 dark:text-neutral-100 leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tangible Micro-UI Preview or Manifest */}
        {preview ? (
          <div className="mt-5 pt-3">
            {preview}
          </div>
        ) : manifest ? (
          <div className="mt-5 pt-3">{manifest}</div>
        ) : manifestHeader || (manifestRows && manifestRows.length > 0) ? (
          <div className="mt-5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2 font-mono text-[11px]">
            {manifestHeader && (
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
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
                    ? "text-xs font-medium text-neutral-900 dark:text-neutral-100"
                    : "text-[10px] pt-1 border-t border-neutral-200/50 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400"
                )}
              >
                <span className="truncate">{row.label}</span>
                <span
                  className={cn(
                    "tabular-nums shrink-0 ml-2",
                    idx === 0
                      ? "font-normal text-[11px] text-neutral-500 dark:text-neutral-400"
                      : "text-neutral-900 dark:text-neutral-100 font-medium"
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}


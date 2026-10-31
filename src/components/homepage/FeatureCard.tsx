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
        "group relative p-6 sm:p-7 rounded-3xl",
        // Shader-aligned cool neutral palette with fine vertical gradient
        "bg-gradient-to-b from-[#f4f4f4] via-[#ededed] to-[#e4e4e4] dark:from-[#18181b] dark:via-[#141416] dark:to-[#0f0f10]",
        "border border-neutral-300/80 dark:border-neutral-800",
        "hover:border-neutral-400 dark:hover:border-neutral-700",
        "flex flex-col justify-between min-h-[300px] sm:min-h-[320px] transition-all duration-200 select-none overflow-hidden",
        "shadow-[0_2px_8px_rgba(0,0,0,0.02),0_8px_20px_-6px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]",
        "dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_8px_20px_-6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className
      )}
    >
      {/* Subtle top edge highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-400/50 dark:via-white/12 to-transparent"
        aria-hidden="true"
      />

      {/* Blueprint drafting grid with blinking cells & paper noise texture */}
      <BlinkingGrid
        cellSize={cellSize}
        seed={seed}
        variant={gridVariant}
        maskClassName="[mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_45%,transparent_100%)]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {eyebrow && (
            <span className="font-mono text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
              {eyebrow}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-semibold tracking-[-0.01em] text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Integrated Technical Manifest at Bottom */}
        {manifest ? (
          <div className="mt-auto pt-4">{manifest}</div>
        ) : manifestHeader || (manifestRows && manifestRows.length > 0) ? (
          <div className="mt-auto pt-4 border-t border-neutral-300/70 dark:border-neutral-800 space-y-2 font-mono text-[11px]">
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
                    : "text-[10px] pt-1 border-t border-neutral-300/40 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400"
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


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
}: FeatureCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "group relative p-6 sm:p-7 rounded-3xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] flex flex-col justify-between min-h-[300px] sm:min-h-[320px] transition-all duration-200 select-none overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02),0_8px_20px_-6px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25),0_8px_20px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#c8c5bc] dark:hover:border-[#38352f]",
        className
      )}
    >
      {/* Subtle top edge highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/70 dark:via-white/12 to-transparent"
        aria-hidden="true"
      />

      {/* Blueprint drafting grid with blinking cells & paper noise texture */}
      <BlinkingGrid
        cellSize={24}
        seed={seed}
        variant={gridVariant}
        maskClassName="[mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_45%,transparent_100%)]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {eyebrow && (
            <span className="font-mono text-[11px] font-medium text-[#8b897f] dark:text-[#9c9a8f] uppercase tracking-wider block mb-2">
              {eyebrow}
            </span>
          )}

          <h3 className="text-base sm:text-lg font-semibold tracking-[-0.01em] text-[#1c1b18] dark:text-[#f3f2ee]">
            {title}
          </h3>
          <p className="mt-2 text-xs text-[#8b897f] dark:text-[#9c9a8f] leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Integrated Technical Manifest at Bottom */}
        {manifest ? (
          <div className="mt-auto pt-4">{manifest}</div>
        ) : manifestHeader || (manifestRows && manifestRows.length > 0) ? (
          <div className="mt-auto pt-4 border-t border-[#e2e0da] dark:border-[#282622] space-y-2 font-mono text-[11px]">
            {manifestHeader && (
              <div className="flex items-center justify-between text-[#8b897f] dark:text-[#9c9a8f]">
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
                    ? "text-xs font-medium text-[#1c1b18] dark:text-[#edebe6]"
                    : "text-[10px] pt-1 border-t border-[#e2e0da]/50 dark:border-[#282622]/50 text-[#8b897f] dark:text-[#9c9a8f]"
                )}
              >
                <span className="truncate">{row.label}</span>
                <span
                  className={cn(
                    "tabular-nums shrink-0 ml-2",
                    idx === 0
                      ? "font-normal text-[11px] text-[#8b897f] dark:text-[#9c9a8f]"
                      : "text-[#1c1b18] dark:text-[#edebe6] font-medium"
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


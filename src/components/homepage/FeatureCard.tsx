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
  return (
    <div
      id={id}
      className={cn(
        "group relative p-6 sm:p-7 rounded-[24px]",
        // Smooth sapphire-infused dark surface inspired by the tactile luminous button,
        // paired with refined porcelain in light mode (no muddy gray or AI slop)
        "bg-gradient-to-b from-white via-[#f7f9fc] to-[#eef4fb]",
        "dark:bg-gradient-to-b dark:from-[#0d1e3a] dark:via-[#09152b] dark:to-[#050d1c]",
        // Delicate luminous hairline border with subtle sky/cyan tint
        "border border-sky-900/10 dark:border-sky-500/25",
        "hover:border-sky-500/40 dark:hover:border-sky-400/50",
        "flex flex-col justify-between min-h-[350px] sm:min-h-[370px]",
        // Emil Kowalski craft: smooth transitions on explicit properties, never transition: all
        "transition-[border-color,box-shadow,transform] duration-300 ease-out select-none overflow-hidden",
        // Multi-layered depth shadow with inner hairline bevel highlight
        "shadow-[0_1px_3px_rgba(15,23,42,0.04),0_12px_28px_-6px_rgba(14,165,233,0.07),inset_0_1px_0_rgba(255,255,255,0.95)]",
        "dark:shadow-[0_2px_12px_rgba(0,0,0,0.45),0_18px_38px_-8px_rgba(2,6,23,0.75),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_24px_-6px_rgba(14,165,233,0.12)]",
        "dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.55),0_24px_48px_-8px_rgba(14,165,233,0.22),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_32px_-4px_rgba(56,189,248,0.22)]",
        className
      )}
    >
      {/* Top subtle sapphire spotlight reflection for optical curvature */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_-15%,rgba(14,165,233,0.06),transparent_75%)] dark:bg-[radial-gradient(ellipse_85%_50%_at_50%_-15%,rgba(56,189,248,0.16),transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_50%_105%,rgba(2,132,199,0.04),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_35%_at_50%_105%,rgba(14,165,233,0.08),transparent_70%)]" />
        
        {/* Soft dynamic hover highlight glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(56,189,248,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(56,189,248,0.14),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Text Block */}
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[10.5px] font-medium text-sky-800/80 dark:text-sky-300/80 uppercase tracking-wider block">
                {eyebrow}
              </span>
            </div>
          )}

          <h3 className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-neutral-900 dark:text-slate-100 leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] text-neutral-600 dark:text-slate-300/85 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tangible Micro-UI Preview or Manifest (Integrated canvas, zero card-in-card clutter) */}
        {preview ? (
          <div className="mt-5 pt-3">
            {preview}
          </div>
        ) : manifest ? (
          <div className="mt-5 pt-3">{manifest}</div>
        ) : manifestHeader || (manifestRows && manifestRows.length > 0) ? (
          <div className="mt-5 pt-3 border-t border-sky-900/10 dark:border-sky-500/20 space-y-2 font-mono text-[11px]">
            {manifestHeader && (
              <div className="flex items-center justify-between text-neutral-500 dark:text-sky-200/70">
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
                    ? "text-xs font-medium text-neutral-900 dark:text-slate-100"
                    : "text-[10px] pt-1 border-t border-sky-900/5 dark:border-sky-500/15 text-neutral-500 dark:text-slate-400"
                )}
              >
                <span className="truncate">{row.label}</span>
                <span
                  className={cn(
                    "tabular-nums shrink-0 ml-2",
                    idx === 0
                      ? "font-normal text-[11px] text-neutral-500 dark:text-slate-400"
                      : "text-neutral-900 dark:text-slate-100 font-medium"
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

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
  manifestHeader?: {
    label: string;
    value: React.ReactNode;
  };
  manifestRows?: FeatureCardManifestRow[];
  manifest?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
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
}: FeatureCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "p-6 sm:p-7 rounded-3xl bg-[#edebe6] dark:bg-[#1b1a17] border border-[#e2e0da] dark:border-[#282622] flex flex-col justify-between min-h-[300px] sm:min-h-[320px] transition-colors duration-150 select-none",
        className
      )}
    >
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
  );
}


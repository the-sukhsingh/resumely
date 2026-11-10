"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type GlassIconVariant = "default" | "active" | "coral" | "emerald" | "amber";
export type GlassIconSize = "sm" | "md" | "lg" | "xl";

interface GlassIconProps {
  children: React.ReactNode;
  variant?: GlassIconVariant;
  size?: GlassIconSize;
  className?: string;
  glow?: boolean;
}

const sizeClasses: Record<GlassIconSize, string> = {
  sm: "w-7 h-7 rounded-lg text-xs",
  md: "w-9 h-9 rounded-xl text-sm",
  lg: "w-11 h-11 rounded-[14px] text-base",
  xl: "w-13 h-13 rounded-2xl text-lg",
};

const variantClasses: Record<GlassIconVariant, string> = {
  default: cn(
    "bg-white/60 dark:bg-white/[0.05]",
    "border border-black/[0.08] dark:border-white/[0.12]",
    "text-neutral-700 dark:text-neutral-300",
    "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)]",
    "dark:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
  ),
  active: cn(
    "bg-[#c15f3c]/10 dark:bg-[#D97757]/15",
    "border border-[#c15f3c]/35 dark:border-[#D97757]/40",
    "text-[#c15f3c] dark:text-[#D97757]",
    "shadow-[0_4px_16px_rgba(217,119,87,0.15),inset_0_1px_1px_rgba(255,255,255,0.5)]",
    "dark:shadow-[0_4px_20px_rgba(217,119,87,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]"
  ),
  coral: cn(
    "bg-[#c15f3c]/10 dark:bg-[#D97757]/15",
    "border border-[#c15f3c]/35 dark:border-[#D97757]/40",
    "text-[#c15f3c] dark:text-[#D97757]",
    "shadow-[0_4px_16px_rgba(217,119,87,0.15),inset_0_1px_1px_rgba(255,255,255,0.5)]",
    "dark:shadow-[0_4px_20px_rgba(217,119,87,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)]"
  ),
  emerald: cn(
    "bg-emerald-500/10 dark:bg-emerald-500/15",
    "border border-emerald-500/30 dark:border-emerald-400/35",
    "text-emerald-600 dark:text-emerald-400",
    "shadow-[0_4px_16px_rgba(16,185,129,0.12),inset_0_1px_1px_rgba(255,255,255,0.5)]",
    "dark:shadow-[0_4px_20px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
  ),
  amber: cn(
    "bg-amber-500/10 dark:bg-amber-500/15",
    "border border-amber-500/30 dark:border-amber-400/35",
    "text-amber-600 dark:text-amber-400",
    "shadow-[0_4px_16px_rgba(245,158,11,0.12),inset_0_1px_1px_rgba(255,255,255,0.5)]",
    "dark:shadow-[0_4px_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]"
  ),
};

export default function GlassIcon({
  children,
  variant = "default",
  size = "md",
  className,
  glow = false,
}: GlassIconProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 backdrop-blur-md transition-all duration-200 select-none",
        sizeClasses[size],
        variantClasses[variant],
        glow && "after:absolute after:inset-0 after:rounded-[inherit] after:blur-md after:-z-10 after:opacity-60",
        glow && variant === "coral" && "after:bg-[#D97757]/30",
        glow && variant === "active" && "after:bg-[#D97757]/30",
        glow && variant === "emerald" && "after:bg-emerald-500/30",
        className
      )}
    >
      {/* Specular glass sheen highlight (light reflection from top-left) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_25%_20%,rgba(255,255,255,0.55)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_25%_20%,rgba(255,255,255,0.2)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      {/* Center Icon Graphic */}
      <span className="relative z-10 inline-flex items-center justify-center">
        {children}
      </span>
    </div>
  );
}


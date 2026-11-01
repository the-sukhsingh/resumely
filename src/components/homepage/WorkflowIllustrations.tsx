"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import hairlineData from "./hairlineData.json";

/**
 * Hairline Isometric Figures
 * Built according to /hairline-create:
 * - 45-degree 2:1 isometric projection from @lucasmarkes/hairline
 * - Rounded solids with silhouette (sil), crease (cr), and highlight (hi)
 * - Rule 10 (quiet): Zero words or text inside the drawing; geometry carries identity
 * - Rule 04 (accent): The stroke is the only highlight (Claude-coral #c15f3c / #D97757)
 * - Rule 09 (radius): Round every corner, then draw less
 * - No pills, no gradient borders, no cards-in-cards
 */

/* ==========================================================================
   01 · INGEST: The Career Ledger (Card Deck & Tray)
   ========================================================================== */
export function HairlineLedger({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const { tray, cards } = hairlineData.ledger;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full aspect-[4/3] max-w-[320px] mx-auto select-none transition-transform duration-300 ease-out",
        isHovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 300 230"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric illustration: career ledger cards in tray"
      >
        {/* Tray Body (Silhouette + Plate fill to occlude far background) */}
        <path
          d={tray.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tray Inner Crease */}
        <path
          d={tray.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The 4 Ledger Cards, back to front */}
        {cards.map((c, i) => {
          const isHi = c.isHi || (isHovered && i === 3);

          return (
            <g key={i}>
              {/* Card Face & Plate */}
              <path
                d={c.outline}
                className={cn(
                  "fill-white dark:fill-[#181817] transition-all duration-200",
                  isHi
                    ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
                    : "stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1px]"
                )}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Internal hairline rule lines (punched records) */}
              {c.rules.map((r, ri) => (
                <path
                  key={ri}
                  d={r}
                  className="fill-none stroke-neutral-300/80 dark:stroke-neutral-700/80"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ==========================================================================
   02 · CALIBRATE: The Semantic Reticle (Rotary Dial & Caliper)
   ========================================================================== */
export function HairlineCalibrate({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const { base, dial, ticks, needle, centerP } = hairlineData.calibrate;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full aspect-[4/3] max-w-[320px] mx-auto select-none transition-transform duration-300 ease-out",
        isHovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 300 230"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric illustration: calibration rotary dial"
      >
        {/* Base Stage Plinth */}
        <path
          d={base.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={base.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rotary Dial Turntable */}
        <path
          d={dial.sil}
          className="fill-white dark:fill-[#181817] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={dial.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Radial Calibration Ticks */}
        {ticks.map((t, i) => (
          <path
            key={i}
            d={t}
            className="fill-none stroke-neutral-300 dark:stroke-neutral-700"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}

        {/* The Claude-coral Highlight Reticle / Needle (Rule 04) */}
        <path
          d={needle}
          className="fill-none stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Center Pivot Bead */}
        <circle
          cx={centerP[0]}
          cy={centerP[1]}
          r={3.2}
          className="fill-[#c15f3c] dark:fill-[#D97757]"
        />
      </svg>
    </div>
  );
}

/* ==========================================================================
   03 · COMPILE: The Vector Sheet & Slotted Dock
   ========================================================================== */
export function HairlineCompile({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const { dock, slot, sheet, fold, lines, beadP } = hairlineData.compile;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full aspect-[4/3] max-w-[320px] mx-auto select-none transition-transform duration-300 ease-out",
        isHovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 300 230"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric illustration: vector document sheet in dock"
      >
        {/* Slotted Dock Base */}
        <path
          d={dock.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={dock.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Slotted Track Groove */}
        <path
          d={slot}
          className="fill-neutral-100 dark:fill-[#10100f] stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Standing Vector Document Sheet */}
        <path
          d={sheet}
          className={cn(
            "fill-white dark:fill-[#181817] transition-all duration-200",
            isHovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
              : "stroke-neutral-700 dark:stroke-neutral-300 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Document Corner Dog-Ear Fold */}
        <path
          d={fold}
          className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Architectural Hairline Text Rules */}
        {lines.map((l, i) => (
          <path
            key={i}
            d={l}
            className="fill-none stroke-neutral-300/80 dark:stroke-neutral-700/80"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}

        {/* Application Tracker Anchor Bead */}
        <circle
          cx={beadP[0]}
          cy={beadP[1]}
          r={3}
          className="fill-emerald-600 dark:fill-emerald-400"
        />
      </svg>
    </div>
  );
}

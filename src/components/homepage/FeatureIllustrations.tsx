"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import featureHairlineData from "./featureHairlineData.json";

/**
 * Hairline Isometric Feature Illustrations
 * Built according to /hairline-create:
 * - 45-degree 2:1 isometric projection from @lucasmarkes/hairline
 * - Pure rounded solids (prism, rings, fillet, circ, rrect)
 * - Single stroke weights: silhouette (sil 1.2px), crease (lo 0.9px), highlight (hi 1.5px)
 * - Restrained Claude-coral accent (#c15f3c / #D97757) on the focal stroke of each object
 * - Rule 10 (quiet): Geometry carries identity, zero words inside the drawing
 * - Responsive, clean, minimal and tactile
 */

/* ==========================================================================
   01 · Master Career Ledger: Stepped Ledger Tray
   ========================================================================== */
export function LedgerIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { tray, cards } = featureHairlineData.ledger;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: career ledger tray"
      >
        {/* Tray Solid (plate fill to hide background) */}
        <path
          d={tray.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={tray.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Stepped Ledger Cards */}
        {cards.map((c, i) => {
          const isHi = c.isHi || (hovered && i === 2);

          return (
            <g key={i}>
              <path
                d={c.outline}
                className={cn(
                  "fill-white dark:fill-[#181817] transition-colors duration-200",
                  isHi
                    ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
                    : "stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1px]"
                )}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {c.rules.map((r, ri) => (
                <path
                  key={ri}
                  d={r}
                  className="fill-none stroke-neutral-300 dark:stroke-neutral-700"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        01 // LEDGER
      </span>
    </div>
  );
}

/* ==========================================================================
   02 · Target Roles & Spaces: Tri-Compartment Sorter Tray
   ========================================================================== */
export function SpacesIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { tray, div1, div2, plates } = featureHairlineData.spaces;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: tri-compartment spaces tray"
      >
        <path
          d={tray.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={tray.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={div1} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.9" />
        <path d={div2} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.9" />

        {/* Categorized Role Plates */}
        {plates.map((p, idx) => (
          <g key={idx}>
            <path
              d={p.outline}
              className={cn(
                "fill-white dark:fill-[#181817] transition-colors duration-200",
                p.isHi || (hovered && idx === 1)
                  ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
                  : "stroke-neutral-400 dark:stroke-neutral-600 stroke-[1.1px]"
              )}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {p.rules.map((r, ri) => (
              <path
                key={ri}
                d={r}
                className="fill-none stroke-neutral-300 dark:stroke-neutral-700"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        02 // SPACES
      </span>
    </div>
  );
}

/* ==========================================================================
   03 · Rubric & Skill Matcher: Vernier Caliper Gauge
   ========================================================================== */
export function MatcherIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { bar, ticks, jaw, needle, block } = featureHairlineData.matcher;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: vernier caliper gauge"
      >
        {/* Measured competency block */}
        <path
          d={block}
          className="fill-neutral-100 dark:fill-[#161615] stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Caliper Scale Bar */}
        <path
          d={bar.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={bar.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {ticks.map((t, ti) => (
          <path key={ti} d={t} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" />
        ))}

        {/* Sliding Jaw (Focal Stroke) */}
        <path
          d={jaw.sil}
          className={cn(
            "fill-white dark:fill-[#181817] transition-colors duration-200",
            hovered ? "stroke-[#c15f3c] dark:stroke-[#D97757]" : "stroke-neutral-400 dark:stroke-neutral-600"
          )}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={jaw.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <path
          d={needle}
          className="fill-none stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        03 // MATCHER
      </span>
    </div>
  );
}

/* ==========================================================================
   04 · Google XYZ Calibrator: 3-Tier Stepped Balancing Blocks
   ========================================================================== */
export function XyzIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { b1, b2, b3, ticks } = featureHairlineData.xyz;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: 3-tier XYZ balancing scale"
      >
        {/* Tier 1 (Z: Bottom) */}
        <path
          d={b1.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={b1.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />

        {/* Tier 2 (Y: Middle) */}
        <path
          d={b2.sil}
          className="fill-white dark:fill-[#181817] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={b2.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />

        {/* Tier 3 (X: Top - Highlight Prism) */}
        <path
          d={b3.sil}
          className={cn(
            "fill-white dark:fill-[#1c1c1a] transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.5px]"
              : "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.3px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={b3.crease}
          className="fill-none stroke-[#c15f3c]/50 dark:stroke-[#D97757]/50"
          strokeWidth="0.85"
          strokeLinecap="round"
        />

        {ticks.map((t, ti) => (
          <path key={ti} d={t} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" />
        ))}
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        04 // XYZ
      </span>
    </div>
  );
}

/* ==========================================================================
   05 · Section-Focused Copilot: Optical Loupe over Etched Document
   ========================================================================== */
export function CopilotIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { doc, lines, lens, crosshair, focalDot } = featureHairlineData.copilot;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: optical loupe inspector"
      >
        {/* Document Plate */}
        <path
          d={doc.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={doc.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        {lines.map((l, li) => (
          <path key={li} d={l} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" />
        ))}

        {/* Elevated Loupe Ring (Highlight Stroke) */}
        <path
          d={lens.sil}
          className={cn(
            "fill-white/80 dark:fill-[#181817]/80 backdrop-blur-sm transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.5px]"
              : "stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={lens.crease}
          className="fill-none stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        {crosshair.map((ch, ci) => (
          <path
            key={ci}
            d={ch}
            className="fill-none stroke-[#c15f3c] dark:stroke-[#D97757]"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
        <circle cx={focalDot[0]} cy={focalDot[1]} r={2.5} className="fill-[#c15f3c] dark:fill-[#D97757]" />
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        05 // COPILOT
      </span>
    </div>
  );
}

/* ==========================================================================
   06 · Vector PDF Engine: Drafting Board with T-Square
   ========================================================================== */
export function VectorPdfIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { board, sheet, fold, rules, tsquare } = featureHairlineData.vectorPdf;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: vector drafting board"
      >
        <path
          d={board.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={board.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />

        {/* Vector Sheet with Dog-Ear Fold */}
        <path
          d={sheet}
          className={cn(
            "fill-white dark:fill-[#181817] transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
              : "stroke-neutral-600 dark:stroke-neutral-300 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d={fold} className="fill-none stroke-neutral-400 dark:stroke-neutral-600" strokeWidth="0.9" strokeLinecap="round" />
        {rules.map((r, ri) => (
          <path key={ri} d={r} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" strokeLinecap="round" />
        ))}

        {/* T-Square Rule */}
        <path
          d={tsquare.sil}
          className="fill-white dark:fill-[#1a1a18] stroke-[#c15f3c] dark:stroke-[#D97757]"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={tsquare.crease}
          className="fill-none stroke-[#c15f3c]/40 dark:stroke-[#D97757]/40"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        06 // VECTOR PDF
      </span>
    </div>
  );
}

/* ==========================================================================
   07 · Matched Cover Letters: Dual Tandem Folios
   ========================================================================== */
export function CompanionIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { folio1, f1Lines, folio2, f2Lines, bridge } = featureHairlineData.companion;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: paired tandem folios"
      >
        {/* Folio 1 (Back) */}
        <path
          d={folio1.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={folio1.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        {f1Lines.map((l, li) => (
          <path key={li} d={l} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" />
        ))}

        {/* Sync Bridge Tangent Line */}
        <path d={bridge} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" strokeDasharray="2 2" />

        {/* Folio 2 (Front: Highlight) */}
        <path
          d={folio2.sil}
          className={cn(
            "fill-white dark:fill-[#181817] transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.4px]"
              : "stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={folio2.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        {f2Lines.map((l, li) => (
          <path
            key={li}
            d={l}
            className={cn(
              "fill-none transition-colors",
              li === 0 ? "stroke-[#c15f3c] dark:stroke-[#D97757]" : "stroke-neutral-300 dark:stroke-neutral-700"
            )}
            strokeWidth="0.8"
          />
        ))}
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        07 // COMPANION
      </span>
    </div>
  );
}

/* ==========================================================================
   08 · Visual Job Tracker: Linear Track with Detent Stations
   ========================================================================== */
export function TrackerIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { track, groove, stations, puck, puckPin } = featureHairlineData.tracker;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: kanban conduit track"
      >
        <path
          d={track.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={track.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <path
          d={groove}
          className="fill-neutral-100 dark:fill-[#10100f] stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {stations.map((st, si) => (
          <path key={si} d={st} className="fill-none stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="0.8" />
        ))}

        {/* Active Station Puck (Highlight) */}
        <path
          d={puck.sil}
          className={cn(
            "fill-white dark:fill-[#181817] transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.5px]"
              : "stroke-neutral-600 dark:stroke-neutral-300 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={puck.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <circle cx={puckPin[0]} cy={puckPin[1]} r={2.8} className="fill-[#c15f3c] dark:fill-[#D97757]" />
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        08 // TRACKER
      </span>
    </div>
  );
}

/* ==========================================================================
   09 · Snapshot Memory: Archival Vault Cassette Chassis
   ========================================================================== */
export function SnapshotIllustration({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);
  const { chassis, cavity, disc, keyway, lockPin } = featureHairlineData.snapshot;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-[150px] sm:h-[160px] flex items-center justify-center select-none transition-transform duration-300 ease-out",
        hovered && "-translate-y-1",
        className
      )}
    >
      <svg
        viewBox="0 0 220 160"
        className="w-full h-full block overflow-visible"
        role="img"
        aria-label="Hairline isometric: archival vault cassette"
      >
        <path
          d={chassis.sil}
          className="fill-white dark:fill-[#141413] stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={chassis.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <path
          d={cavity}
          className="fill-neutral-100 dark:fill-[#10100f] stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Locking Memory Disc */}
        <path
          d={disc.sil}
          className={cn(
            "fill-white dark:fill-[#181817] transition-all duration-200",
            hovered
              ? "stroke-[#c15f3c] dark:stroke-[#D97757] stroke-[1.5px]"
              : "stroke-neutral-500 dark:stroke-neutral-400 stroke-[1.2px]"
          )}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={disc.crease}
          className="fill-none stroke-neutral-200 dark:stroke-neutral-800"
          strokeWidth="0.85"
          strokeLinecap="round"
        />
        <path d={keyway} className="fill-none stroke-[#c15f3c] dark:stroke-[#D97757]" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={lockPin[0]} cy={lockPin[1]} r={2.5} className="fill-[#c15f3c] dark:fill-[#D97757]" />
      </svg>

      <span className="absolute bottom-1 right-3 font-mono text-[8.5px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        09 // SNAPSHOT
      </span>
    </div>
  );
}

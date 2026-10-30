"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function HeroMeadow({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"ats" | "story">("ats");

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] rounded-tl-[44px] sm:rounded-tl-[56px] rounded-tr-3xl lg:rounded-tr-none rounded-b-3xl lg:rounded-b-none overflow-hidden select-none",
        "bg-gradient-to-b from-[#63a9d4] via-[#5ba4cf] to-[#4e98c5]",
        "shadow-2xl shadow-sky-900/15 border border-sky-300/30",
        className
      )}
    >
      {/* Subtle Atmospheric Sky Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.22),transparent_70%)] pointer-events-none" />

      {/* Floating Career Calibration Pill (Editorial Resumely Overlay) */}
      <div className="absolute top-6 sm:top-8 left-6 sm:left-8 z-20 max-w-[calc(100%-3rem)] sm:max-w-xs">
        <div className="backdrop-blur-md bg-white/85 dark:bg-neutral-900/85 border border-white/60 dark:border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-sky-950/10 transition-all hover:bg-white/95">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-medium tracking-wide text-neutral-600 dark:text-neutral-300 uppercase">
                ATS Pass Rate
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
              98% Match
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              <span>Staff Product Designer</span>
              <span className="text-[10px] text-neutral-500 font-normal">v3.4 calibrated</span>
            </div>
            <div className="w-full bg-neutral-200/70 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[98%] transition-all duration-1000" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ATS Parsable
            </span>
            <span className="font-mono text-[10px] text-neutral-500">PDF • ISO A4</span>
          </div>
        </div>
      </div>

      {/* SVG Meadow Landscape with Swaying Grasses & Flowers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg
          viewBox="0 0 800 700"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Linear and Radial Gradients for Petals */}
            <linearGradient id="petal-grad-1" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#fae77c" />
              <stop offset="35%" stopColor="#fff8b8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <linearGradient id="petal-grad-2" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#edd055" />
              <stop offset="40%" stopColor="#fef3a3" />
              <stop offset="100%" stopColor="#fffef2" />
            </linearGradient>

            <linearGradient id="petal-back" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e2c548" />
              <stop offset="60%" stopColor="#faeec0" />
              <stop offset="100%" stopColor="#f5f2db" />
            </linearGradient>

            <radialGradient id="flower-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#69651f" />
              <stop offset="60%" stopColor="#968931" />
              <stop offset="90%" stopColor="#b4a748" />
              <stop offset="100%" stopColor="#7a7022" />
            </radialGradient>

            {/* Grass Stems Gradients */}
            <linearGradient id="grass-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#255437" />
              <stop offset="100%" stopColor="#143120" />
            </linearGradient>

            <linearGradient id="grass-mid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3c7a4b" />
              <stop offset="100%" stopColor="#224c2e" />
            </linearGradient>

            <linearGradient id="grass-bright" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#589e66" />
              <stop offset="100%" stopColor="#2d6a3a" />
            </linearGradient>
          </defs>

          {/* ========================================================= */}
          {/* LAYER 1: Deep Background Grass Reeds (Slower Sway)       */}
          {/* ========================================================= */}
          <g className="animate-[meadowSwaySlow_7s_ease-in-out_infinite] origin-bottom">
            {/* Far background blades */}
            <path
              d="M 50 720 Q 80 500 120 400 Q 150 330 180 280 Q 140 370 110 520 Z"
              fill="#214a31"
              opacity="0.85"
            />
            <path
              d="M 220 720 Q 250 510 310 390 Q 360 300 410 240 Q 350 340 300 520 Z"
              fill="#245136"
              opacity="0.9"
            />
            <path
              d="M 440 720 Q 480 480 540 340 Q 580 250 620 180 Q 560 280 510 490 Z"
              fill="#1e462d"
              opacity="0.9"
            />
            <path
              d="M 680 720 Q 710 490 750 360 Q 780 280 810 210 Q 760 330 720 520 Z"
              fill="#245136"
              opacity="0.85"
            />
          </g>

          {/* ========================================================= */}
          {/* LAYER 2: Midground Grasses & Stems (Medium Sway)          */}
          {/* ========================================================= */}
          <g className="animate-[meadowSwayMed_5.5s_ease-in-out_infinite] origin-bottom">
            {/* Left side grass clusters */}
            <path
              d="M 0 720 Q 40 560 90 440 Q 120 370 160 320 Q 110 420 70 570 Z"
              fill="url(#grass-mid)"
            />
            <path
              d="M 120 720 Q 140 580 180 470 Q 210 400 250 350 Q 200 440 165 580 Z"
              fill="url(#grass-bright)"
            />

            {/* Central upright slender reeds with side blades */}
            <path
              d="M 330 720 Q 340 530 380 380 Q 410 280 440 210 Q 415 310 375 480 Q 355 590 350 720 Z"
              fill="url(#grass-mid)"
            />
            {/* Leaves off central reed */}
            <path
              d="M 368 490 Q 430 460 480 470 Q 430 490 365 515 Z"
              fill="url(#grass-bright)"
            />
            <path
              d="M 383 420 Q 450 370 510 380 Q 450 410 382 440 Z"
              fill="url(#grass-mid)"
            />
            <path
              d="M 398 340 Q 450 280 490 270 Q 445 315 397 355 Z"
              fill="url(#grass-bright)"
            />
            <path
              d="M 358 530 Q 310 480 260 480 Q 305 520 352 555 Z"
              fill="url(#grass-dark)"
            />

            {/* Tall right-side arching reeds */}
            <path
              d="M 520 720 Q 535 520 580 360 Q 610 260 645 190 Q 625 280 585 460 Q 555 580 545 720 Z"
              fill="url(#grass-mid)"
            />
            <path
              d="M 565 470 Q 640 430 700 450 Q 630 470 560 500 Z"
              fill="url(#grass-bright)"
            />
            <path
              d="M 585 390 Q 660 330 720 340 Q 650 380 582 415 Z"
              fill="url(#grass-mid)"
            />
            <path
              d="M 602 310 Q 660 240 710 230 Q 660 280 600 325 Z"
              fill="url(#grass-bright)"
            />

            {/* Extreme right blades */}
            <path
              d="M 720 720 Q 730 540 760 420 Q 780 340 810 290 Q 775 390 750 530 Z"
              fill="url(#grass-mid)"
            />
            <path
              d="M 750 720 Q 770 580 800 480 Q 820 420 840 380 Q 815 460 785 580 Z"
              fill="url(#grass-bright)"
            />
          </g>

          {/* ========================================================= */}
          {/* LAYER 3: Flower Stems & Blooming Wildflowers              */}
          {/* ========================================================= */}

          {/* Stem for Main Flower */}
          <g className="animate-[meadowSwayFlower_4.8s_ease-in-out_infinite] origin-bottom">
            {/* Main Flower Stem */}
            <path
              d="M 590 720 Q 585 640 575 580 Q 565 520 585 450 Q 600 400 618 360 Q 612 360 598 405 Q 580 470 570 535 Q 560 620 580 720 Z"
              fill="#275638"
            />
            {/* Leaf shoots off stem */}
            <path
              d="M 580 540 Q 620 510 660 520 Q 620 535 578 555 Z"
              fill="#3a7a49"
            />
            <path
              d="M 575 480 Q 535 440 490 450 Q 530 475 572 495 Z"
              fill="#326a40"
            />

            {/* ===================================================== */}
            {/* WILDFLOWER 01: Hero Bloom (Facing forward/upward)    */}
            {/* Center at (620, 350)                                  */}
            {/* ===================================================== */}
            <g transform="translate(620, 350) rotate(-8)">
              {/* Back Petals */}
              {/* Petal Top-Right */}
              <path
                d="M 0 0 C 15 -35 45 -65 65 -55 C 80 -45 75 -15 45 5 Z"
                fill="url(#petal-back)"
                opacity="0.95"
              />
              {/* Petal Top */}
              <path
                d="M 0 0 C -10 -40 10 -75 30 -75 C 50 -75 55 -40 30 -10 Z"
                fill="url(#petal-grad-2)"
              />
              {/* Petal Top-Left */}
              <path
                d="M 0 0 C -35 -35 -65 -45 -70 -25 C -75 -5 -45 10 -15 15 Z"
                fill="url(#petal-back)"
              />

              {/* Front/Mid Petals (Lush, Creamy, Broad) */}
              {/* Left Petal */}
              <path
                d="M -5 5 C -45 0 -85 15 -80 35 C -75 55 -35 50 -10 25 Z"
                fill="url(#petal-grad-1)"
              />
              {/* Bottom-Left Petal */}
              <path
                d="M -5 10 C -30 40 -50 75 -25 85 C 0 95 25 60 15 20 Z"
                fill="url(#petal-grad-2)"
              />
              {/* Bottom-Right Petal */}
              <path
                d="M 5 10 C 25 45 60 70 75 50 C 90 30 55 10 20 5 Z"
                fill="url(#petal-grad-1)"
              />
              {/* Main Right Petal */}
              <path
                d="M 10 0 C 45 -10 80 5 85 25 C 90 45 55 45 15 15 Z"
                fill="url(#petal-grad-2)"
              />

              {/* Petal Delicates Creases / Veins */}
              <path
                d="M -5 20 Q -40 35 -65 32"
                stroke="#ead065"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 0 25 Q -10 60 -20 75"
                stroke="#ead065"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 12 15 Q 45 40 60 45"
                stroke="#ead065"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />

              {/* Golden Center Disc */}
              <circle cx="3" cy="8" r="16" fill="url(#flower-center)" />
              <circle cx="2" cy="7" r="13" fill="#605c1b" opacity="0.8" />

              {/* Stamen Dots around center */}
              <circle cx="-5" cy="4" r="1.6" fill="#fae878" />
              <circle cx="0" cy="-2" r="1.6" fill="#fdf29f" />
              <circle cx="8" cy="0" r="1.6" fill="#fae878" />
              <circle cx="12" cy="7" r="1.6" fill="#fef5b5" />
              <circle cx="8" cy="14" r="1.6" fill="#fae878" />
              <circle cx="0" cy="17" r="1.6" fill="#fef5b5" />
              <circle cx="-7" cy="12" r="1.6" fill="#fae878" />
              <circle cx="2" cy="7" r="2.2" fill="#d9c34a" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* WILDFLOWER 02: Lower Secondary Bloom (Peeking from below) */}
          {/* ========================================================= */}
          <g className="animate-[meadowSwaySlow_6.2s_ease-in-out_infinite] origin-bottom">
            {/* Stem */}
            <path
              d="M 505 720 Q 510 660 520 600 Q 525 570 535 540 Q 528 545 515 585 Q 500 645 498 720 Z"
              fill="#224c2e"
            />
            {/* Flower 2 Center around (535, 540) */}
            <g transform="translate(535, 550) rotate(15)">
              <path
                d="M 0 0 C 10 -25 35 -40 50 -30 C 65 -20 50 5 25 10 Z"
                fill="url(#petal-back)"
              />
              <path
                d="M 0 0 C -20 -30 -40 -35 -45 -15 C -50 5 -25 15 -5 10 Z"
                fill="url(#petal-grad-2)"
              />
              <path
                d="M -5 5 C -35 10 -55 35 -40 50 C -25 65 0 40 5 15 Z"
                fill="url(#petal-grad-1)"
              />
              <path
                d="M 5 5 C 20 25 45 45 55 30 C 65 15 40 5 10 5 Z"
                fill="url(#petal-grad-2)"
              />
              {/* Center */}
              <circle cx="2" cy="5" r="11" fill="url(#flower-center)" />
              <circle cx="-2" cy="3" r="1.3" fill="#fdf29f" />
              <circle cx="4" cy="1" r="1.3" fill="#fae878" />
              <circle cx="7" cy="6" r="1.3" fill="#fef5b5" />
              <circle cx="2" cy="10" r="1.3" fill="#fae878" />
            </g>
          </g>

          {/* ========================================================= */}
          {/* LAYER 4: Foreground Lush Grass Blades & Highlights       */}
          {/* ========================================================= */}
          <g className="animate-[meadowSwayFast_4.2s_ease-in-out_infinite] origin-bottom">
            {/* Foreground crisp blades cutting across */}
            <path
              d="M 260 720 Q 280 560 330 450 Q 360 380 400 320 Q 350 420 310 570 Z"
              fill="url(#grass-dark)"
            />
            <path
              d="M 460 720 Q 475 550 510 430 Q 535 340 565 270 Q 530 380 495 540 Z"
              fill="url(#grass-bright)"
            />
            <path
              d="M 640 720 Q 660 560 705 440 Q 735 350 770 280 Q 730 390 690 560 Z"
              fill="url(#grass-dark)"
            />
            <path
              d="M 680 720 Q 720 540 760 420 Q 790 320 830 250 Q 780 370 740 560 Z"
              fill="url(#grass-mid)"
            />
          </g>
        </svg>
      </div>

      {/* Floating Interactive Badge (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-white/40 dark:border-white/10 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
        <span>Live Career Intelligence</span>
      </div>
    </div>
  );
}

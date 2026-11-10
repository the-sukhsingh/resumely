'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface BlinkingGridProps {
  className?: string;
  cellSize?: number;
  seed?: number;
  variant?: 'neutral' | 'blue' | 'emerald';
  maskClassName?: string;
}

// 4 distinct sets of coordinates distributed across a fine grid (up to 24 cols x 16 rows)
// so adjacent cards have unique organic distributions
const PATTERN_SETS = [
  // Set 0: balanced constellation across top & middle
  [
    { x: 2, y: 1, duration: 3.2, delay: 0.1 },
    { x: 8, y: 2, duration: 4.0, delay: 1.4 },
    { x: 15, y: 1, duration: 2.8, delay: 0.7 },
    { x: 20, y: 3, duration: 4.4, delay: 1.8 },
    { x: 4, y: 4, duration: 3.6, delay: 2.0 },
    { x: 11, y: 5, duration: 3.0, delay: 2.5 },
    { x: 18, y: 6, duration: 4.1, delay: 0.3 },
    { x: 1, y: 7, duration: 3.7, delay: 1.7 },
    { x: 7, y: 8, duration: 3.9, delay: 2.9 },
    { x: 14, y: 9, duration: 3.4, delay: 0.8 },
    { x: 21, y: 7, duration: 4.2, delay: 1.5 },
    { x: 5, y: 11, duration: 3.8, delay: 2.2 },
    { x: 12, y: 12, duration: 4.5, delay: 0.5 },
    { x: 19, y: 11, duration: 3.3, delay: 2.1 },
  ],
  // Set 1: gentle drift across cards
  [
    { x: 3, y: 2, duration: 3.5, delay: 0.4 },
    { x: 10, y: 1, duration: 2.9, delay: 1.8 },
    { x: 17, y: 2, duration: 4.2, delay: 0.9 },
    { x: 6, y: 3, duration: 3.1, delay: 2.3 },
    { x: 13, y: 4, duration: 4.0, delay: 1.2 },
    { x: 21, y: 4, duration: 3.6, delay: 0.6 },
    { x: 2, y: 6, duration: 3.3, delay: 2.6 },
    { x: 9, y: 7, duration: 4.5, delay: 1.9 },
    { x: 16, y: 7, duration: 3.7, delay: 2.7 },
    { x: 4, y: 9, duration: 3.2, delay: 0.2 },
    { x: 12, y: 10, duration: 4.3, delay: 1.5 },
    { x: 18, y: 11, duration: 3.8, delay: 2.4 },
    { x: 7, y: 13, duration: 4.1, delay: 0.8 },
    { x: 15, y: 13, duration: 3.4, delay: 1.6 },
  ],
  // Set 2: ambient top-weighted dusting
  [
    { x: 1, y: 1, duration: 2.7, delay: 0.5 },
    { x: 6, y: 2, duration: 4.3, delay: 1.6 },
    { x: 12, y: 1, duration: 3.4, delay: 0.3 },
    { x: 19, y: 2, duration: 3.8, delay: 2.1 },
    { x: 4, y: 3, duration: 4.1, delay: 1.1 },
    { x: 15, y: 4, duration: 3.0, delay: 2.4 },
    { x: 22, y: 5, duration: 4.4, delay: 0.7 },
    { x: 8, y: 6, duration: 3.6, delay: 1.9 },
    { x: 2, y: 8, duration: 3.2, delay: 2.8 },
    { x: 14, y: 7, duration: 4.0, delay: 1.3 },
    { x: 20, y: 9, duration: 3.7, delay: 0.6 },
    { x: 5, y: 10, duration: 4.2, delay: 2.0 },
    { x: 11, y: 12, duration: 3.5, delay: 1.4 },
    { x: 17, y: 12, duration: 3.9, delay: 0.2 },
  ],
  // Set 3: diagonal rhythmic cluster
  [
    { x: 2, y: 0, duration: 3.6, delay: 0.8 },
    { x: 8, y: 1, duration: 4.2, delay: 2.2 },
    { x: 16, y: 2, duration: 2.9, delay: 0.4 },
    { x: 5, y: 3, duration: 3.7, delay: 1.7 },
    { x: 12, y: 4, duration: 4.5, delay: 1.0 },
    { x: 21, y: 3, duration: 3.3, delay: 2.6 },
    { x: 1, y: 5, duration: 3.9, delay: 0.2 },
    { x: 9, y: 6, duration: 4.1, delay: 1.4 },
    { x: 17, y: 6, duration: 3.1, delay: 2.5 },
    { x: 4, y: 8, duration: 3.5, delay: 0.9 },
    { x: 14, y: 9, duration: 4.3, delay: 1.8 },
    { x: 20, y: 10, duration: 3.8, delay: 0.7 },
    { x: 7, y: 12, duration: 3.2, delay: 2.3 },
    { x: 13, y: 13, duration: 4.0, delay: 1.1 },
  ],
];

export default function BlinkingGrid({
  className,
  cellSize = 14,
  seed = 0,
  variant = 'neutral',
  maskClassName,
}: BlinkingGridProps) {
  const reactId = useId();
  const patternId = `grid-pattern-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const patternIndex = Math.abs(seed) % PATTERN_SETS.length;
  const squares = PATTERN_SETS[patternIndex];

  const gridStrokeStyles = {
    neutral: 'stroke-neutral-900/[0.04] dark:stroke-white/[0.04]',
    blue: 'stroke-blue-400/[0.1] dark:stroke-blue-400/[0.12]',
    emerald: 'stroke-emerald-500/[0.09] dark:stroke-emerald-400/[0.12]',
  }[variant];

  const cellFillStyles = {
    neutral: 'fill-neutral-900/15 dark:fill-white/20',
    blue: 'fill-blue-500/35 dark:fill-blue-400/40',
    emerald: 'fill-emerald-500/30 dark:fill-emerald-400/35',
  }[variant];

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <svg
        className={cn(
          'absolute inset-0 w-full h-full',
          maskClassName || '[mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)]',
          gridStrokeStyles
        )}
      >
        <defs>
          <pattern
            id={patternId}
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Base Grid lines */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* Blinking Grid Cells */}
        {squares.map((sq, i) => (
          <rect
            key={i}
            x={sq.x * cellSize + 1}
            y={sq.y * cellSize + 1}
            width={cellSize - 1}
            height={cellSize - 1}
            className={cn(cellFillStyles, 'animate-grid-cell-blink')}
            style={{
              animationDuration: `${sq.duration}s`,
              animationDelay: `${sq.delay}s`,
            }}
          />
        ))}
      </svg>

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 noise opacity-18 pointer-events-none" />
    </div>
  );
}


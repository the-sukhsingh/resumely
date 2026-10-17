'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { JobStage } from './types';
import { cn } from '@/lib/utils';
import { Bookmark, Send, MessageSquare, Trophy, AlertCircle } from 'lucide-react';
import { MILESTONE_ANCHORS, getCurveY, getCurvedBaselineD } from './journeyCurve';

export interface MilestoneDef {
  id: JobStage;
  label: string;
  shortLabel: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  percent: number; // 0 to 100
  yPercent: number; // vertical height %
}

export const JOURNEY_MILESTONES: MilestoneDef[] = [
  {
    id: 'saved',
    label: 'Saved for later',
    shortLabel: 'Saved',
    color: '#94a3b8', // slate-400
    glowColor: 'rgba(148, 163, 184, 0.35)',
    icon: Bookmark,
    percent: MILESTONE_ANCHORS[0].percent,
    yPercent: MILESTONE_ANCHORS[0].yPercent,
  },
  {
    id: 'applied',
    label: 'Application Submitted',
    shortLabel: 'Applied',
    color: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.4)',
    icon: Send,
    percent: MILESTONE_ANCHORS[1].percent,
    yPercent: MILESTONE_ANCHORS[1].yPercent,
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    shortLabel: 'Interviewing',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: MessageSquare,
    percent: MILESTONE_ANCHORS[2].percent,
    yPercent: MILESTONE_ANCHORS[2].yPercent,
  },
  {
    id: 'offered',
    label: 'Job Offer',
    shortLabel: 'Offer',
    color: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.45)',
    icon: Trophy,
    percent: MILESTONE_ANCHORS[3].percent,
    yPercent: MILESTONE_ANCHORS[3].yPercent,
  },
  {
    id: 'rejected',
    label: 'Declined / Closed',
    shortLabel: 'Declined',
    color: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.45)',
    icon: AlertCircle,
    percent: MILESTONE_ANCHORS[4].percent,
    yPercent: MILESTONE_ANCHORS[4].yPercent,
  },
];

interface JourneyPathProps {
  currentStage: JobStage;
  onSelectStage: (stage: JobStage) => void;
  hoveredStage?: JobStage | null;
  className?: string;
}

const CURVE_VIEWBOX_WIDTH = 1000;
const CURVE_VIEWBOX_HEIGHT = 96;
const BASELINE_CURVE_D = getCurvedBaselineD(CURVE_VIEWBOX_WIDTH, CURVE_VIEWBOX_HEIGHT);

export default function JourneyPath({
  currentStage,
  onSelectStage,
  hoveredStage,
  className,
}: JourneyPathProps) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <div
      className={cn('absolute inset-0 w-full h-full select-none pointer-events-none', className)}
    >
      {/* SVG Canvas for the Clean, Minimal Curved Path */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        viewBox={`0 0 ${CURVE_VIEWBOX_WIDTH} ${CURVE_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Crisp, Vibrant 5-Stage Multi-Stop Gradient */}
          <linearGradient id={`clean-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="16%" stopColor="#94a3b8" />
            <stop offset="26%" stopColor="#3b82f6" />
            <stop offset="46%" stopColor="#3b82f6" />
            <stop offset="52%" stopColor="#f59e0b" />
            <stop offset="68%" stopColor="#f59e0b" />
            <stop offset="74%" stopColor="#10b981" />
            <stop offset="86%" stopColor="#10b981" />
            <stop offset="92%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Ambient Subtle Track Line */}
        <path
          d={BASELINE_CURVE_D}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.06}
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Main Clean, Crisp Curved Journey Path */}
        <path
          d={BASELINE_CURVE_D}
          fill="none"
          stroke={`url(#clean-gradient-${gradientId})`}
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Milestone Checkpoint Nodes along the curve */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        {JOURNEY_MILESTONES.map((milestone) => {
          // Both 'rejected' and 'archived' map cleanly to the terminal milestone
          const isCurrent =
            currentStage === milestone.id ||
            (currentStage === 'archived' && milestone.id === 'rejected');
          const isHovered = hoveredStage === milestone.id;

          // Deterministic y position in pixels matching 96px container height
          const yPos = CURVE_VIEWBOX_HEIGHT * (milestone.yPercent / 100);

          // If this milestone is active, the draggable beacon docks right here!
          if (isCurrent) {
            return (
              <div
                key={milestone.id}
                style={{
                  left: `${milestone.percent}%`,
                  top: `${yPos}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                {/* Clean, minimalist anchor dot */}
                <span
                  className="size-1.5 rounded-full block opacity-60"
                  style={{ backgroundColor: milestone.color }}
                />
              </div>
            );
          }

          return (
            <div
              key={milestone.id}
              style={{
                left: `${milestone.percent}%`,
                top: `${yPos}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
              onClick={() => onSelectStage(milestone.id)}
            >
              {/* Checkpoint Dot on the Curve (Clickable & Draggable) */}
              <button
                type="button"
                title={`Advance to ${milestone.label}`}
                className={cn(
                  'rounded-full flex items-center justify-center transition-transform duration-150 cursor-grab active:cursor-grabbing outline-none active:scale-[0.9]',
                  'size-3.5 bg-card border-2 shadow-2xs hover:scale-135',
                  isHovered && 'scale-135 ring-2 ring-primary/40'
                )}
                style={{
                  borderColor: milestone.color,
                }}
              >
                <span
                  className="size-1.5 rounded-full block"
                  style={{ backgroundColor: milestone.color }}
                />
              </button>

              {/* Milestone Label Underneath (positioned well below the curve to prevent ANY overlap) */}
              <div className="absolute top-4 flex flex-col items-center pointer-events-none whitespace-nowrap">
                <span className="text-[10px] font-mono tracking-tight text-muted-foreground/60 group-hover:text-foreground transition-colors duration-150">
                  {milestone.shortLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
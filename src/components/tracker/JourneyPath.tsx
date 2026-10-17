'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { JobStage } from './types';
import { cn } from '@/lib/utils';
import { Bookmark, Send, MessageSquare, Trophy, AlertCircle, Archive } from 'lucide-react';
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
];

interface JourneyPathProps {
  currentStage: JobStage;
  onSelectStage: (stage: JobStage) => void;
  hoveredStage?: JobStage | null;
  className?: string;
  onDimensionsChange?: (dims: { width: number; height: number }) => void;
}

export default function JourneyPath({
  currentStage,
  onSelectStage,
  hoveredStage,
  className,
  onDimensionsChange,
}: JourneyPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 96,
  });
  const gradientId = useId().replace(/:/g, '');

  // Measure container dimensions responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0) {
          const dims = { width, height: height > 0 ? height : 96 };
          setDimensions(dims);
          onDimensionsChange?.(dims);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onDimensionsChange]);

  const pathD = getCurvedBaselineD(dimensions.width, dimensions.height);
  const currentMilestoneIndex = JOURNEY_MILESTONES.findIndex((m) => m.id === currentStage);
  const isRejectedOrArchived = currentStage === 'rejected' || currentStage === 'archived';

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 w-full h-full select-none pointer-events-none', className)}
    >
      {/* SVG Canvas for the Clean, Minimal Curved Path */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* Crisp, Vibrant Multi-Stage Gradient */}
          <linearGradient id={`clean-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="18%" stopColor="#94a3b8" />
            <stop offset="28%" stopColor="#3b82f6" />
            <stop offset="52%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="82%" stopColor="#f59e0b" />
            <stop offset="88%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Terminal state gradient for Rejected */}
          <linearGradient id={`clean-gradient-rejected-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="40%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Ambient Subtle Track Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={4}
            strokeLinecap="round"
          />
        )}

        {/* Main Clean, Crisp Curved Journey Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={
              isRejectedOrArchived
                ? `url(#clean-gradient-rejected-${gradientId})`
                : `url(#clean-gradient-${gradientId})`
            }
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        )}
      </svg>

      {/* Milestone Checkpoint Nodes along the curve */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        {JOURNEY_MILESTONES.map((milestone) => {
          const isCurrent = currentStage === milestone.id;
          const isHovered = hoveredStage === milestone.id;

          // Exact position on the non-straight curve
          const xPos = dimensions.width * (milestone.percent / 100);
          const yPos = getCurveY(xPos, dimensions.width, dimensions.height);

          // If this milestone is current, the draggable pinpoint beacon handles it!
          // We DO NOT render duplicate text or duplicate circles underneath.
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
                {/* Subtle, soft ground anchor dot */}
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
              {/* Minimalist Checkpoint Dot on the Curve */}
              <button
                type="button"
                title={`Advance to ${milestone.label}`}
                className={cn(
                  'rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer outline-none active:scale-[0.9]',
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

        {/* Terminal state pill if Rejected or Archived */}
        {isRejectedOrArchived && (
          <div
            style={{
              left: '96%',
              top: `${getCurveY(dimensions.width * 0.96, dimensions.width, dimensions.height)}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
          >
            <div
              className={cn(
                'size-6 rounded-full flex items-center justify-center border shadow-xs',
                currentStage === 'rejected'
                  ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/25'
                  : 'bg-neutral-600 text-white border-neutral-700'
              )}
              title={currentStage === 'rejected' ? 'Application Declined' : 'Archived'}
            >
              {currentStage === 'rejected' ? (
                <AlertCircle size={11} />
              ) : (
                <Archive size={11} />
              )}
            </div>
            <span className="text-[10px] font-mono font-bold mt-2 text-rose-500 capitalize">
              {currentStage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useRef, useState, useId, useCallback } from 'react';
import { JobStage } from './types';
import { cn } from '@/lib/utils';
import { Bookmark, Send, MessageSquare, Trophy, AlertCircle, Archive } from 'lucide-react';

export interface MilestoneDef {
  id: JobStage;
  label: string;
  shortLabel: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  percent: number; // 0 to 100
}

export const JOURNEY_MILESTONES: MilestoneDef[] = [
  {
    id: 'saved',
    label: 'Saved for later',
    shortLabel: 'Saved',
    color: '#94a3b8', // slate-400
    glowColor: 'rgba(148, 163, 184, 0.45)',
    icon: Bookmark,
    percent: 10,
  },
  {
    id: 'applied',
    label: 'Application Submitted',
    shortLabel: 'Applied',
    color: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.5)',
    icon: Send,
    percent: 38,
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    shortLabel: 'Interviewing',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.5)',
    icon: MessageSquare,
    percent: 68,
  },
  {
    id: 'offered',
    label: 'Job Offer',
    shortLabel: 'Offer',
    color: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.55)',
    icon: Trophy,
    percent: 94,
  },
];

interface JourneyPathProps {
  currentStage: JobStage;
  onSelectStage: (stage: JobStage) => void;
  hoveredStage?: JobStage | null;
  seed?: string;
  rowIndex?: number;
  replayTrigger?: number;
  className?: string;
}

export default function JourneyPath({
  currentStage,
  onSelectStage,
  hoveredStage,
  seed = 'resumely',
  rowIndex = 0,
  replayTrigger = 0,
  className,
}: JourneyPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 84,
  });
  const [pathData, setPathData] = useState<string>('');
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const gradientId = useId().replace(/:/g, '');

  // Numeric seed derived from string for unique per-job wobble frequencies
  const numSeed = useRef(
    Array.from(seed).reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) % 1000
  ).current;

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0) {
          setDimensions({ width, height: height > 0 ? height : 84 });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute baseline path (smooth, settled line when drawing finishes completely)
  const computeBaselinePath = useCallback((w: number, h: number) => {
    const midY = h / 2;
    // Straight, clean line across the row
    return `M 0 ${midY} L ${w} ${midY}`;
  }, []);

  // Dynamic Wobble Draw Animation
  useEffect(() => {
    let animFrame: number;
    let timeoutId: NodeJS.Timeout;

    // Stagger start slightly per row index
    const startDelay = Math.min(rowIndex * 90, 360);
    const duration = 1600; // ms for the path to draw across
    setIsDrawn(false);
    setDrawProgress(0);

    timeoutId = setTimeout(() => {
      const startTime = performance.now();
      const w = dimensions.width || 600;
      const h = dimensions.height || 84;
      const midY = h / 2;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        setDrawProgress(progress);

        if (progress >= 1) {
          // Drawing complete: snap into the clean, smooth baseline path!
          // Wobble stops completely!
          setPathData(computeBaselinePath(w, h));
          setIsDrawn(true);
          return;
        }

        // Ease-out progress curve for the advancing head of the line
        const easedProgress = 1 - Math.pow(1 - progress, 2.5);
        const currentEndX = Math.max(12, w * easedProgress);

        // Amplitude of the random wobble: starts high (~22px), decays to 0 at progress = 1
        const decay = Math.pow(1 - progress, 1.25);
        const maxAmp = 22 * decay;

        // Sample points along the currently drawn line
        const sampleCount = 44;
        const points: { x: number; y: number }[] = [];
        const timeSec = elapsed / 1000;

        for (let i = 0; i <= sampleCount; i++) {
          const stepFraction = i / sampleCount;
          const x = stepFraction * currentEndX;

          // Spatial envelope: tip and trailing wave undulate dynamically
          const envelope = Math.sin(stepFraction * Math.PI);

          // Multi-frequency harmonic wave with organic fluctuations
          const wave1 = Math.sin(x * 0.04 + timeSec * 14 + numSeed * 0.05);
          const wave2 = Math.cos(x * 0.08 - timeSec * 22 + numSeed * 0.1) * 0.45;
          const wave3 = Math.sin(x * 0.16 + timeSec * 32) * 0.25;

          const wobbleY = (wave1 + wave2 + wave3) * maxAmp * envelope;
          points.push({ x, y: midY + wobbleY });
        }

        // Construct smooth curve through points
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midX = (prev.x + curr.x) / 2;
          const midYCoord = (prev.y + curr.y) / 2;
          d += ` Q ${prev.x} ${prev.y}, ${midX} ${midYCoord}`;
        }
        const last = points[points.length - 1];
        d += ` L ${last.x} ${last.y}`;

        setPathData(d);
        animFrame = requestAnimationFrame(animate);
      };

      animFrame = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrame);
    };
  }, [dimensions.width, dimensions.height, replayTrigger, rowIndex, computeBaselinePath, numSeed]);

  const currentMilestoneIndex = JOURNEY_MILESTONES.findIndex((m) => m.id === currentStage);
  const isRejectedOrArchived = currentStage === 'rejected' || currentStage === 'archived';

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-20 select-none flex items-center', className)}
    >
      {/* SVG Canvas for the Journey Track with Multi-Color Gradient */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* Distinct Multi-Stop Color Gradient across the Journey */}
          <linearGradient id={`journey-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="24%" stopColor="#94a3b8" />
            <stop offset="25%" stopColor="#3b82f6" />
            <stop offset="54%" stopColor="#3b82f6" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="84%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Terminal state gradient for Rejected */}
          <linearGradient id={`journey-gradient-rejected-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="40%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Ambient Glow Filter */}
          <filter id={`journey-glow-${gradientId}`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle background track guide line across full row */}
        <line
          x1={0}
          y1={dimensions.height / 2}
          x2={dimensions.width}
          y2={dimensions.height / 2}
          stroke="currentColor"
          strokeOpacity={0.07}
          strokeWidth={3}
          strokeDasharray="4 4"
        />

        {/* Dynamic Wobbling & Drawing Path */}
        {pathData && (
          <>
            {/* Ambient Neon Glow */}
            <path
              d={pathData}
              fill="none"
              stroke={
                isRejectedOrArchived
                  ? `url(#journey-gradient-rejected-${gradientId})`
                  : `url(#journey-gradient-${gradientId})`
              }
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
              filter={`url(#journey-glow-${gradientId})`}
            />

            {/* Core Crisp Journey Line */}
            <path
              d={pathData}
              fill="none"
              stroke={
                isRejectedOrArchived
                  ? `url(#journey-gradient-rejected-${gradientId})`
                  : `url(#journey-gradient-${gradientId})`
              }
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          </>
        )}

        {/* Animated Drawing Tip Flare while wobbling */}
        {!isDrawn && pathData && (
          <circle
            cx={dimensions.width * drawProgress}
            cy={dimensions.height / 2}
            r={5}
            fill="#ffffff"
            className="animate-ping"
            opacity={0.8}
          />
        )}
      </svg>

      {/* Milestone Checkpoints along the path */}
      <div className="absolute inset-0 w-full h-full flex items-center pointer-events-auto">
        {JOURNEY_MILESTONES.map((milestone, idx) => {
          const isPassed = currentMilestoneIndex >= idx && !isRejectedOrArchived;
          const isCurrent = currentStage === milestone.id;
          const isHovered = hoveredStage === milestone.id;
          const Icon = milestone.icon;

          return (
            <div
              key={milestone.id}
              style={{ left: `${milestone.percent}%` }}
              className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10"
              onClick={() => onSelectStage(milestone.id)}
            >
              {/* Checkpoint Node Bubble */}
              <button
                type="button"
                title={`Advance to ${milestone.label}`}
                className={cn(
                  'relative size-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer outline-none active:scale-[0.93]',
                  isCurrent
                    ? 'ring-4 shadow-md scale-110 z-20'
                    : isPassed
                    ? 'bg-card/95 border border-border/80 text-foreground hover:scale-105'
                    : 'bg-muted/40 border border-border/40 text-muted-foreground/60 hover:text-foreground hover:bg-muted/80',
                  isHovered && 'scale-120 ring-2'
                )}
                style={{
                  backgroundColor: isCurrent ? milestone.color : undefined,
                  color: isCurrent ? '#ffffff' : undefined,
                  boxShadow: isCurrent ? `0 0 16px ${milestone.glowColor}` : undefined,
                }}
              >
                {/* Pulse ring for active milestone */}
                {isCurrent && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-35"
                    style={{ backgroundColor: milestone.color }}
                  />
                )}
                <Icon size={isCurrent ? 14 : 12} className="relative z-10" />
              </button>

              {/* Milestone Label Underneath */}
              <div className="mt-1.5 flex flex-col items-center pointer-events-none">
                <span
                  className={cn(
                    'text-[10px] font-mono tracking-tight transition-colors duration-150 whitespace-nowrap',
                    isCurrent
                      ? 'font-bold text-foreground scale-105'
                      : isPassed
                      ? 'font-medium text-foreground/80'
                      : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                  )}
                >
                  {milestone.shortLabel}
                </span>
              </div>
            </div>
          );
        })}

        {/* Terminal state pill if Rejected or Archived */}
        {isRejectedOrArchived && (
          <div
            style={{ left: '96%' }}
            className="absolute -translate-x-1/2 flex flex-col items-center z-20"
          >
            <div
              className={cn(
                'size-8 rounded-full flex items-center justify-center border shadow-xs',
                currentStage === 'rejected'
                  ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/30'
                  : 'bg-neutral-600 text-white border-neutral-700'
              )}
              title={currentStage === 'rejected' ? 'Application Declined' : 'Archived'}
            >
              {currentStage === 'rejected' ? (
                <AlertCircle size={13} />
              ) : (
                <Archive size={13} />
              )}
            </div>
            <span className="text-[10px] font-mono font-bold mt-1.5 text-rose-500 capitalize">
              {currentStage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
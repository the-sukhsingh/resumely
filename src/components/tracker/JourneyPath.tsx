'use client';

import React, { useEffect, useRef, useState, useId, useCallback } from 'react';
import { JobStage, STAGE_CONFIGS } from './types';
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
    glowColor: 'rgba(148, 163, 184, 0.4)',
    icon: Bookmark,
    percent: 10,
  },
  {
    id: 'applied',
    label: 'Application Submitted',
    shortLabel: 'Applied',
    color: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.45)',
    icon: Send,
    percent: 38,
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    shortLabel: 'Interviewing',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.45)',
    icon: MessageSquare,
    percent: 68,
  },
  {
    id: 'offered',
    label: 'Job Offer',
    shortLabel: 'Offer',
    color: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.5)',
    icon: Trophy,
    percent: 94,
  },
];

interface JourneyPathProps {
  currentStage: JobStage;
  onSelectStage: (stage: JobStage) => void;
  hoveredStage?: JobStage | null;
  seed?: string;
  replayTrigger?: number;
  className?: string;
}

export default function JourneyPath({
  currentStage,
  onSelectStage,
  hoveredStage,
  seed = 'resumely',
  replayTrigger = 0,
  className,
}: JourneyPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 72,
  });
  const [pathData, setPathData] = useState<string>('');
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const gradientId = useId().replace(/:/g, '');

  // Numeric seed derived from string
  const numSeed = useRef(
    Array.from(seed).reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0) % 1000
  ).current;

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute baseline path (smooth, settled line with subtle wave)
  const computeBaselinePath = useCallback(
    (w: number, h: number) => {
      const midY = h / 2;
      const startX = 0;
      const endX = w;
      // Gentle subtle curve connecting start to end through milestone elevations
      const p1X = w * 0.33;
      const p2X = w * 0.66;
      return `M ${startX} ${midY} C ${p1X} ${midY - 4}, ${p2X} ${midY + 4}, ${endX} ${midY}`;
    },
    []
  );

  // Wobble animation loop: runs when mounted or when replayTrigger changes
  useEffect(() => {
    let animFrame: number;
    const startTime = performance.now();
    const duration = 1400; // ms to draw fully
    setIsDrawn(false);
    setDrawProgress(0);

    const w = dimensions.width || 600;
    const h = dimensions.height || 72;
    const midY = h / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      setDrawProgress(progress);

      if (progress >= 1) {
        // Complete drawing, settle completely to baseline smooth path!
        setPathData(computeBaselinePath(w, h));
        setIsDrawn(true);
        return;
      }

      // Ease-out progress for organic line extension
      const easedProgress = 1 - Math.pow(1 - progress, 2.2);
      const currentEndX = Math.max(10, w * easedProgress);

      // Wobble amplitude decays as drawing approaches 100%
      // Starts high (~16px), decays smoothly to 0
      const decay = Math.pow(1 - progress, 1.4);
      const baseAmp = 15 * decay;

      // Sample 32 points along the currently drawn length
      const sampleCount = 36;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= sampleCount; i++) {
        const stepFraction = i / sampleCount;
        const x = stepFraction * currentEndX;

        // Wave oscillation: multiple harmonic sine waves with phase shift from seed & time
        const timeSec = elapsed / 1000;
        const tipProximity = Math.sin(stepFraction * Math.PI); // stronger in middle & tip
        const wave1 = Math.sin(x * 0.035 + timeSec * 12 + numSeed * 0.1);
        const wave2 = Math.cos(x * 0.07 - timeSec * 18 + numSeed * 0.2) * 0.5;
        const wave3 = Math.sin(x * 0.12 + timeSec * 24) * 0.25;

        const wobbleY = (wave1 + wave2 + wave3) * baseAmp * tipProximity;
        points.push({ x, y: midY + wobbleY });
      }

      // Build smooth SVG path using Catmull-Rom or cubic Bezier approximation
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

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [dimensions.width, dimensions.height, replayTrigger, computeBaselinePath, numSeed]);

  // Determine stage progression percentage for the active glowing path
  const currentMilestoneIndex = JOURNEY_MILESTONES.findIndex((m) => m.id === currentStage);
  const activePercent =
    currentMilestoneIndex >= 0 ? JOURNEY_MILESTONES[currentMilestoneIndex].percent : 10;

  const isRejectedOrArchived = currentStage === 'rejected' || currentStage === 'archived';

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-18 select-none flex items-center', className)}
    >
      {/* SVG Canvas for the Journey Track */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* Multi-stop colorful journey gradient */}
          <linearGradient id={`journey-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.85" />
            <stop offset="10%" stopColor="#94a3b8" />
            <stop offset="38%" stopColor="#3b82f6" />
            <stop offset="68%" stopColor="#f59e0b" />
            <stop offset="94%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Rejected / Archived gradient */}
          <linearGradient id={`journey-gradient-rejected-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Glowing blur filter for ambient neon trail */}
          <filter id={`journey-glow-${gradientId}`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient guide line (subtle background track across full width) */}
        <line
          x1={0}
          y1={dimensions.height / 2}
          x2={dimensions.width}
          y2={dimensions.height / 2}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeWidth={3}
          strokeDasharray="4 4"
        />

        {/* Dynamic wobbling & drawing colored path */}
        {pathData && (
          <>
            {/* Soft Ambient Glow of the path */}
            <path
              d={pathData}
              fill="none"
              stroke={
                isRejectedOrArchived
                  ? `url(#journey-gradient-rejected-${gradientId})`
                  : `url(#journey-gradient-${gradientId})`
              }
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.35}
              filter={`url(#journey-glow-${gradientId})`}
            />

            {/* Core Crisp Path */}
            <path
              d={pathData}
              fill="none"
              stroke={
                isRejectedOrArchived
                  ? `url(#journey-gradient-rejected-${gradientId})`
                  : `url(#journey-gradient-${gradientId})`
              }
              strokeWidth={2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          </>
        )}

        {/* Dynamic spark on the drawing tip while wobbling */}
        {!isDrawn && pathData && (
          <circle
            cx={dimensions.width * drawProgress}
            cy={dimensions.height / 2}
            r={4}
            fill="#ffffff"
            className="animate-ping"
            opacity={0.7}
          />
        )}
      </svg>

      {/* Milestone Checkpoint Nodes along the path */}
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
              className="absolute -translate-x-1/2 flex flex-col items-center group cursor-pointer"
              onClick={() => onSelectStage(milestone.id)}
            >
              {/* Checkpoint Node Bubble */}
              <button
                type="button"
                title={`Move to ${milestone.label}`}
                className={cn(
                  'relative size-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer outline-none active:scale-[0.93]',
                  isCurrent
                    ? 'ring-4 shadow-md scale-110 z-20'
                    : isPassed
                    ? 'bg-card/90 border border-border/80 text-foreground hover:scale-105 z-10'
                    : 'bg-muted/40 border border-border/40 text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 z-0',
                  isHovered && 'scale-115 ring-2'
                )}
                style={{
                  backgroundColor: isCurrent ? milestone.color : undefined,
                  color: isCurrent ? '#ffffff' : undefined,
                  boxShadow: isCurrent ? `0 0 16px ${milestone.glowColor}` : undefined,
                }}
              >
                {/* Ping animation when active */}
                {isCurrent && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
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

        {/* Special Terminal Indicator for Rejected / Archived if applicable */}
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
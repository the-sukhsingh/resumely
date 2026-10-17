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
    glowColor: 'rgba(148, 163, 184, 0.45)',
    icon: Bookmark,
    percent: MILESTONE_ANCHORS[0].percent,
    yPercent: MILESTONE_ANCHORS[0].yPercent,
  },
  {
    id: 'applied',
    label: 'Application Submitted',
    shortLabel: 'Applied',
    color: '#3b82f6', // blue-500
    glowColor: 'rgba(59, 130, 246, 0.5)',
    icon: Send,
    percent: MILESTONE_ANCHORS[1].percent,
    yPercent: MILESTONE_ANCHORS[1].yPercent,
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    shortLabel: 'Interviewing',
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.5)',
    icon: MessageSquare,
    percent: MILESTONE_ANCHORS[2].percent,
    yPercent: MILESTONE_ANCHORS[2].yPercent,
  },
  {
    id: 'offered',
    label: 'Job Offer',
    shortLabel: 'Offer',
    color: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.55)',
    icon: Trophy,
    percent: MILESTONE_ANCHORS[3].percent,
    yPercent: MILESTONE_ANCHORS[3].yPercent,
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
  onDimensionsChange?: (dims: { width: number; height: number }) => void;
}

export default function JourneyPath({
  currentStage,
  onSelectStage,
  hoveredStage,
  seed = 'resumely',
  rowIndex = 0,
  replayTrigger = 0,
  className,
  onDimensionsChange,
}: JourneyPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 110,
  });
  const [pathData, setPathData] = useState<string>('');
  const [drawProgress, setDrawProgress] = useState<number>(0);
  const [isDrawn, setIsDrawn] = useState<boolean>(false);
  const gradientId = useId().replace(/:/g, '');

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
          const dims = { width, height: height > 60 ? height : 110 };
          setDimensions(dims);
          onDimensionsChange?.(dims);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onDimensionsChange]);

  // Dynamic Wobble Draw Animation on the Non-Straight Curve
  useEffect(() => {
    let animFrame: number;
    let timeoutId: NodeJS.Timeout;

    const startDelay = Math.min(rowIndex * 80, 320);
    const duration = 1500; // ms for the path to draw across
    setIsDrawn(false);
    setDrawProgress(0);

    timeoutId = setTimeout(() => {
      const startTime = performance.now();
      const w = dimensions.width || 600;
      const h = dimensions.height || 110;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        setDrawProgress(progress);

        if (progress >= 1) {
          // Drawing complete: lock permanently into the silky smooth non-straight curve!
          // Wobble stops completely!
          setPathData(getCurvedBaselineD(w, h));
          setIsDrawn(true);
          return;
        }

        // Ease-out progress for line advancement
        const easedProgress = 1 - Math.pow(1 - progress, 2.4);
        const currentEndX = Math.max(16, w * easedProgress);

        // Wobble amplitude decays smoothly to 0 as progress approaches 1
        const decay = Math.pow(1 - progress, 1.3);
        const maxAmp = 20 * decay;

        // Sample points along the currently drawn length on the curve
        const sampleCount = 48;
        const points: { x: number; y: number }[] = [];
        const timeSec = elapsed / 1000;

        for (let i = 0; i <= sampleCount; i++) {
          const stepFraction = i / sampleCount;
          const x = stepFraction * currentEndX;

          // Base height on the non-straight curve
          const baseY = getCurveY(x, w, h);

          // Spatial wave envelope: tip and trailing wave undulate dynamically
          const envelope = Math.sin(stepFraction * Math.PI);

          // Multi-frequency harmonic wave with organic fluctuations
          const wave1 = Math.sin(x * 0.04 + timeSec * 14 + numSeed * 0.05);
          const wave2 = Math.cos(x * 0.08 - timeSec * 20 + numSeed * 0.1) * 0.45;
          const wave3 = Math.sin(x * 0.16 + timeSec * 28) * 0.2;

          const wobbleY = (wave1 + wave2 + wave3) * maxAmp * envelope;
          points.push({ x, y: baseY + wobbleY });
        }

        // Build smooth SVG curve through points
        let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midX = (prev.x + curr.x) / 2;
          const midYCoord = (prev.y + curr.y) / 2;
          d += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${midYCoord.toFixed(1)}`;
        }
        const last = points[points.length - 1];
        d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

        setPathData(d);
        animFrame = requestAnimationFrame(animate);
      };

      animFrame = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrame);
    };
  }, [dimensions.width, dimensions.height, replayTrigger, rowIndex, numSeed]);

  const currentMilestoneIndex = JOURNEY_MILESTONES.findIndex((m) => m.id === currentStage);
  const isRejectedOrArchived = currentStage === 'rejected' || currentStage === 'archived';

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-28 select-none flex items-center', className)}
    >
      {/* SVG Canvas for the Non-Straight Journey Track */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* Multi-Stop Color Gradient across the Journey */}
          <linearGradient id={`journey-gradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="20%" stopColor="#94a3b8" />
            <stop offset="28%" stopColor="#3b82f6" />
            <stop offset="52%" stopColor="#3b82f6" />
            <stop offset="58%" stopColor="#f59e0b" />
            <stop offset="82%" stopColor="#f59e0b" />
            <stop offset="88%" stopColor="#10b981" />
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
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background curved guide track (soft, continuous, no ugly dots) */}
        <path
          d={getCurvedBaselineD(dimensions.width, dimensions.height)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.06}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Dynamic Wobbling & Drawing Path */}
        {pathData && (
          <>
            {/* Ambient Neon Glow underneath */}
            <path
              d={pathData}
              fill="none"
              stroke={
                isRejectedOrArchived
                  ? `url(#journey-gradient-rejected-${gradientId})`
                  : `url(#journey-gradient-${gradientId})`
              }
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.35}
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
              strokeWidth={3.5}
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
            cy={getCurveY(dimensions.width * drawProgress, dimensions.width, dimensions.height)}
            r={5}
            fill="#ffffff"
            className="animate-ping"
            opacity={0.85}
          />
        )}
      </svg>

      {/* Milestone Checkpoint Nodes resting on the curve */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        {JOURNEY_MILESTONES.map((milestone, idx) => {
          const isPassed = currentMilestoneIndex >= idx && !isRejectedOrArchived;
          const isCurrent = currentStage === milestone.id;
          const isHovered = hoveredStage === milestone.id;
          const Icon = milestone.icon;

          // Exact position on the non-straight curve
          const xPos = dimensions.width * (milestone.percent / 100);
          const yPos = getCurveY(xPos, dimensions.width, dimensions.height);

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
              {/* Checkpoint Target Node (clean, no duplicate button when pinpoint is here) */}
              <button
                type="button"
                title={`Advance to ${milestone.label}`}
                className={cn(
                  'relative rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer outline-none active:scale-[0.93]',
                  isCurrent
                    ? 'size-9 border-2 border-dashed opacity-40 z-10' // Subtle docking ring for the active pinpoint
                    : isPassed
                    ? 'size-7 bg-card/90 border border-border/70 text-foreground hover:scale-110 shadow-2xs z-10'
                    : 'size-6.5 bg-muted/40 border border-border/40 text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 z-0',
                  isHovered && 'scale-125 ring-2 ring-primary/40'
                )}
                style={{
                  borderColor: isCurrent ? milestone.color : undefined,
                }}
              >
                {/* Only render icon inside milestone if it's NOT the active stage (avoids duplicate overlap!) */}
                {!isCurrent && (
                  <Icon size={isPassed ? 12 : 11} className="relative z-10" />
                )}
              </button>

              {/* Milestone Label Underneath with generous vertical breathing room */}
              <div className="absolute top-6.5 flex flex-col items-center pointer-events-none whitespace-nowrap">
                <span
                  className={cn(
                    'text-[10px] font-mono tracking-tight transition-colors duration-150',
                    isCurrent
                      ? 'font-bold text-foreground opacity-90'
                      : isPassed
                      ? 'font-medium text-foreground/75'
                      : 'text-muted-foreground/50 group-hover:text-muted-foreground'
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
            style={{
              left: '96%',
              top: `${getCurveY(dimensions.width * 0.96, dimensions.width, dimensions.height)}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
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
            <span className="text-[10px] font-mono font-bold mt-2 text-rose-500 capitalize">
              {currentStage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
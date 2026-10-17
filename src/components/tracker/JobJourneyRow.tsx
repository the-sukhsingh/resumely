'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import JourneyPath, { JOURNEY_MILESTONES } from './JourneyPath';
import JobAvatar from './JobAvatar';
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover';
import {
  ExternalLinkDuo,
  File as DuoFile,
  LinkDuo,
  TrashDuo,
} from '@/components/icons';
import {
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
  MoreHorizontal,
  ArrowRight,
  AlertCircle,
  Archive,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  application: TrackedJobApplication;
  index: number;
  onSelect: (application: TrackedJobApplication) => void;
  masterResumeId?: Id<'resumeVersions'>;
}

export default function JobJourneyRow({
  application,
  index,
  onSelect,
  masterResumeId,
}: Props) {
  const router = useRouter();
  const updateStage = useMutation(api.jobTracker.updateJobApplicationStage);
  const deleteJob = useMutation(api.jobTracker.deleteJobApplication);
  const tailorForJob = useAction(api.jobTracker.tailorResumeForJob);

  const [isTailoring, setIsTailoring] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [dragHoverStage, setDragHoverStage] = useState<JobStage | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const trackContainerRef = useRef<HTMLDivElement>(null);

  // Milestone matching
  const currentMilestone =
    JOURNEY_MILESTONES.find((m) => m.id === application.stage) || JOURNEY_MILESTONES[0];
  const targetPercent = currentMilestone.percent;

  // Handle stage change with optimistic feedback
  const handleStageChange = async (newStage: JobStage) => {
    if (newStage === application.stage) return;
    try {
      await updateStage({
        applicationId: application._id,
        stage: newStage,
      });
      const stageName = STAGE_CONFIGS[newStage]?.label || newStage;
      toast.success(`${application.company}: Moved to "${stageName}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to change stage');
    }
  };

  // 1-click Tailor Resume
  const handleTailorClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!masterResumeId) {
      toast.error('Please create a Master Resume first before tailoring');
      return;
    }

    setIsTailoring(true);
    try {
      const { versionId } = await tailorForJob({
        applicationId: application._id,
        masterResumeId,
      });
      toast.success(`Tailored resume ready for ${application.company}!`);
      router.push(`/resume/${versionId}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Tailoring failed';
      toast.error(msg);
    } finally {
      setIsTailoring(false);
    }
  };

  // Copy Public Resume link
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!application.resumeVersionId) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/r/${application.resumeVersionId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success('Public resume link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy link');
    }
  };

  // Delete Job
  const handleDelete = async () => {
    try {
      await deleteJob({ applicationId: application._id });
      toast.success('Job application removed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete application');
    }
  };

  // Replay wobble draw animation
  const handleReplayWobble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplayCount((c) => c + 1);
  };

  // Calculate nearest milestone while dragging
  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
      if (!trackContainerRef.current) return;
      const rect = trackContainerRef.current.getBoundingClientRect();
      const relativeX = info.point.x - rect.left;
      const currentPercent = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

      // Find closest milestone
      let closest = JOURNEY_MILESTONES[0];
      let minDiff = 100;
      for (const m of JOURNEY_MILESTONES) {
        const diff = Math.abs(m.percent - currentPercent);
        if (diff < minDiff) {
          minDiff = diff;
          closest = m;
        }
      }
      setDragHoverStage(closest.id);
    },
    []
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
      setIsDragging(false);
      if (!trackContainerRef.current) return;
      const rect = trackContainerRef.current.getBoundingClientRect();
      const relativeX = info.point.x - rect.left;
      const currentPercent = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

      let closest = JOURNEY_MILESTONES[0];
      let minDiff = 100;
      for (const m of JOURNEY_MILESTONES) {
        const diff = Math.abs(m.percent - currentPercent);
        if (diff < minDiff) {
          minDiff = diff;
          closest = m;
        }
      }
      setDragHoverStage(null);
      handleStageChange(closest.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [application.stage, application._id, updateStage]
  );

  const PinIcon = currentMilestone.icon;
  const isSpecialTerminal = application.stage === 'rejected' || application.stage === 'archived';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.23, 1, 0.32, 1], // Emil Kowalski custom ease-out
      }}
      className={cn(
        'group relative rounded-2xl sm:rounded-3xl border transition-all duration-200 shadow-2xs overflow-hidden',
        'bg-card/60 dark:bg-card/25 backdrop-blur-xl border-border/70 hover:border-border',
        isSpecialTerminal && 'opacity-90 dark:opacity-80'
      )}
    >
      {/* Ambient background glow according to stage */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full blur-3xl opacity-15 dark:opacity-20 transition-all duration-500"
        style={{
          backgroundColor: isSpecialTerminal
            ? '#f43f5e'
            : currentMilestone.color,
        }}
      />

      <div className="flex flex-col lg:flex-row items-stretch min-w-0">
        {/* ─── LEFT SIDE: Job Identity & Metadata ─── */}
        <div
          onClick={() => onSelect(application)}
          className="lg:w-80 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer select-none shrink-0"
        >
          {/* Company & Actions Row */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <JobAvatar
                  company={application.company}
                  companyUrl={application.companyUrl}
                  jobUrl={application.jobUrl}
                  size={38}
                  index={index}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-foreground tracking-tight truncate max-w-[170px]">
                      {application.company}
                    </h4>
                    {application.jobUrl && (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                        title="Open job link"
                      >
                        <ExternalLinkDuo size={13} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-foreground/85 font-medium truncate max-w-[210px] mt-0.5">
                    {application.title}
                  </p>
                </div>
              </div>

              {/* Overflow Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                    title="Job options"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-1 rounded-xl border-border/60 bg-popover/95 backdrop-blur-xl shadow-lg z-50 text-xs"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(application);
                    }}
                    className="cursor-pointer"
                  >
                    <span>View full details</span>
                  </DropdownMenuItem>

                  {application.resumeVersionId && (
                    <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                      <LinkDuo size={13} className="mr-2" />
                      <span>{copiedLink ? 'Link Copied!' : 'Copy resume link'}</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-muted-foreground">
                    Change Stage
                  </div>
                  {JOURNEY_MILESTONES.map((m) => (
                    <DropdownMenuItem
                      key={m.id}
                      onClick={() => handleStageChange(m.id)}
                      className={cn(
                        'cursor-pointer flex items-center justify-between',
                        application.stage === m.id && 'font-semibold bg-muted/60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <span>{m.label}</span>
                      </div>
                      {application.stage === m.id && <Check size={12} />}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleStageChange('rejected')}
                    className={cn(
                      'cursor-pointer text-rose-500 focus:text-rose-600',
                      application.stage === 'rejected' && 'font-bold'
                    )}
                  >
                    <AlertCircle size={13} className="mr-2" />
                    <span>Mark as Rejected</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleStageChange('archived')}
                    className="cursor-pointer text-neutral-500"
                  >
                    <Archive size={13} className="mr-2" />
                    <span>Archive application</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <div onClick={(e) => e.stopPropagation()}>
                    <DeleteConfirmPopover
                      title={`Delete ${application.company}?`}
                      description="Are you sure you want to delete this tracked job application?"
                      onConfirm={handleDelete}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer text-xs"
                      >
                        <TrashDuo size={13} />
                        <span>Delete job</span>
                      </button>
                    </DeleteConfirmPopover>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Chips: Location, Salary & Match Score */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {application.location && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/40">
                  <MapPin size={10} className="shrink-0 text-muted-foreground/80" />
                  <span className="truncate max-w-[110px]">{application.location}</span>
                </span>
              )}

              {application.salary && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/40">
                  <DollarSign size={10} className="shrink-0 text-emerald-500" />
                  <span>{application.salary}</span>
                </span>
              )}

              {/* Match Score Badge or Tailor Button */}
              {application.resumeVersion?.matchScore != null ? (
                <Link
                  href={`/resume/${application.resumeVersionId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                  title="View tailored resume"
                >
                  <Sparkles size={9} />
                  <span>{application.resumeVersion.matchScore}% Match</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleTailorClick}
                  disabled={isTailoring}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer active:scale-[0.97]"
                  title="Generate tailored resume"
                >
                  {isTailoring ? (
                    <Loader2 size={9} className="animate-spin" />
                  ) : (
                    <Sparkles size={9} />
                  )}
                  <span>Tailor Resume</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Timestamp & Current Stage */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 mt-3 pt-2.5 border-t border-border/40">
            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
              <Calendar size={11} />
              <span>
                {application.appliedAt
                  ? `Applied ${formatDistanceToNow(application.appliedAt, { addSuffix: true })}`
                  : `Added ${formatDistanceToNow(application.createdAt, { addSuffix: true })}`}
              </span>
            </span>

            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold',
                STAGE_CONFIGS[application.stage]?.badgeClass || 'bg-muted/70 text-foreground'
              )}
            >
              {STAGE_CONFIGS[application.stage]?.shortLabel || application.stage}
            </span>
          </div>
        </div>

        {/* ─── RIGHT SIDE: The Journey Path & Interactive Pinpoint ─── */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center relative min-w-0">
          {/* Journey Header with Replay & Instruction */}
          <div className="flex items-center justify-between mb-1.5 px-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Application Journey
              </span>
              <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">
                • Drag the pinpoint or click a checkpoint to advance
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Replay Wobble Draw Button */}
              <button
                type="button"
                onClick={handleReplayWobble}
                title="Replay journey line animation"
                className="size-6 rounded-md flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Interactive Journey Canvas Track */}
          <div
            ref={trackContainerRef}
            className="relative w-full py-4 select-none flex items-center"
          >
            {/* The Wobbling & Drawing Path Component */}
            <JourneyPath
              currentStage={application.stage}
              onSelectStage={handleStageChange}
              hoveredStage={dragHoverStage}
              seed={application._id}
              replayTrigger={replayCount}
            />

            {/* ─── Draggable Pinpoint Marker ─── */}
            {!isSpecialTerminal && (
              <motion.div
                drag="x"
                dragConstraints={trackContainerRef}
                dragElastic={0.06}
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={{
                  left: `${targetPercent}%`,
                  x: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 35,
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                className={cn(
                  'z-30 cursor-grab active:cursor-grabbing flex flex-col items-center group/pin select-none',
                  isDragging && 'scale-110 z-40'
                )}
              >
                {/* Floating Tooltip / Stage Indicator above Pin */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isDragging ? -10 : -4,
                    scale: isDragging ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight shadow-md border whitespace-nowrap pointer-events-none transition-colors mb-1',
                    isDragging
                      ? 'bg-foreground text-background border-foreground shadow-lg'
                      : 'bg-card/95 backdrop-blur-md text-foreground border-border/80'
                  )}
                >
                  {isDragging && dragHoverStage
                    ? `Drop on ${STAGE_CONFIGS[dragHoverStage]?.shortLabel}`
                    : currentMilestone.shortLabel}
                </motion.div>

                {/* Pinpoint Core Beacon */}
                <div
                  className="relative size-7 rounded-full flex items-center justify-center text-white shadow-lg transition-transform"
                  style={{
                    backgroundColor: currentMilestone.color,
                    boxShadow: `0 0 16px ${currentMilestone.glowColor}, 0 2px 8px rgba(0,0,0,0.25)`,
                  }}
                >
                  {/* Subtle inner pulse ring */}
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ backgroundColor: currentMilestone.color }}
                  />
                  <PinIcon size={13} className="relative z-10 stroke-[2.5]" />
                </div>

                {/* Downward Pointer Triangle */}
                <div
                  className="w-0 h-0 border-x-4 border-x-transparent border-t-5 -mt-0.5"
                  style={{ borderTopColor: currentMilestone.color }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
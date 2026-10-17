'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import JourneyPath, { JOURNEY_MILESTONES } from './JourneyPath';
import { getCurveY } from './journeyCurve';
import JobAvatar from './JobAvatar';
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover';
import {
  ExternalLinkDuo,
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
  MoreHorizontal,
  AlertCircle,
  Archive,
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

const TRACK_HEIGHT = 96;

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
  const [dragHoverStage, setDragHoverStage] = useState<JobStage | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const trackContainerRef = useRef<HTMLDivElement>(null);

  // Active milestone and target coordinates on the curve
  // Map 'archived' to the terminal milestone
  const currentMilestone =
    JOURNEY_MILESTONES.find(
      (m) =>
        m.id === application.stage ||
        (application.stage === 'archived' && m.id === 'rejected')
    ) || JOURNEY_MILESTONES[0];

  const targetPercent = currentMilestone.percent;
  // Constant, deterministic vertical coordinate on the curve — zero jitter!
  const currentTargetY = TRACK_HEIGHT * (currentMilestone.yPercent / 100);

  // Check if a tailored or attached resume exists for this job
  const hasAttachedResume = Boolean(application.resumeVersionId || application.resumeVersion);
  const effectiveResumeId = application.resumeVersionId || application.resumeVersion?._id;

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
    if (!effectiveResumeId) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/r/${effectiveResumeId}`;
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

  // Calculate nearest milestone while dragging
  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
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

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl border transition-colors duration-200 shadow-2xs overflow-hidden bg-card/70 dark:bg-card/25 backdrop-blur-xl border-border/70 hover:border-border">
      <div className="flex flex-col lg:flex-row items-stretch min-w-0">
        {/* ─── LEFT SIDE: Clean Job Details ─── */}
        <div
          onClick={() => onSelect(application)}
          className="lg:w-80 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer select-none shrink-0"
        >
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

              {/* Action Dropdown Menu */}
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

                  {effectiveResumeId && (
                    <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                      <LinkDuo size={13} className="mr-2" />
                      <span>{copiedLink ? 'Link Copied!' : 'Copy resume link'}</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-muted-foreground">
                    Move Stage
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
                    <span>Mark as Declined</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleStageChange('archived')}
                    className="cursor-pointer text-neutral-500"
                  >
                    <Archive size={13} className="mr-2" />
                    <span>Archive role</span>
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

            {/* Chips: Location, Salary & Resume Status */}
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

              {/* Resume Attached Badge OR Tailor Resume Button */}
              {hasAttachedResume ? (
                <Link
                  href={`/resume/${effectiveResumeId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                  title="View tailored resume"
                >
                  <Sparkles size={9} />
                  <span>
                    {application.resumeVersion?.matchScore != null
                      ? `${application.resumeVersion.matchScore}% Match`
                      : application.resumeVersion?.name || 'Resume Attached'}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleTailorClick}
                  disabled={isTailoring}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer active:scale-[0.97]"
                  title="Tailor resume for this role"
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

        {/* ─── RIGHT SIDE: Clean, Minimal Curved Path & Draggable Beacon ─── */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center relative min-w-0">
          {/* Track Canvas Container (Exact 96px height matching JourneyPath, no header clutter!) */}
          <div
            ref={trackContainerRef}
            className="relative w-full h-24 select-none"
          >
            {/* The Clean, Minimal Curved Path Component */}
            <JourneyPath
              currentStage={application.stage}
              onSelectStage={handleStageChange}
              hoveredStage={dragHoverStage}
            />

            {/* ─── Draggable Pinpoint Marker (Tip touches curve with 100% precision) ─── */}
            <motion.div
              initial={false}
              drag="x"
              dragConstraints={trackContainerRef}
              dragElastic={0.04}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              animate={{
                left: `${targetPercent}%`,
                top: `${currentTargetY}px`,
                x: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 35,
              }}
              style={{
                position: 'absolute',
              }}
              className={cn(
                'z-30 cursor-grab active:cursor-grabbing select-none',
                isDragging && 'z-40'
              )}
            >
              {/* 
                Inner container shifted by -50% horizontal and -100% vertical:
                (0, 0) is the bottom center tip of the downward pointer cone!
                It touches the curve with exact mathematical precision.
              */}
              <div className="-translate-x-1/2 -translate-y-full flex flex-col items-center cursor-grab active:cursor-grabbing pb-0.5">
                {/* Floating Stage Chip above Pin (directly draggable!) */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isDragging ? -4 : 0,
                    scale: isDragging ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight shadow-sm border whitespace-nowrap transition-colors mb-1 cursor-grab active:cursor-grabbing select-none',
                    isDragging
                      ? 'bg-foreground text-background border-foreground shadow-md'
                      : 'bg-card text-foreground border-border/80 hover:bg-muted/80'
                  )}
                >
                  {isDragging && dragHoverStage
                    ? `Drop on ${STAGE_CONFIGS[dragHoverStage]?.shortLabel || dragHoverStage}`
                    : currentMilestone.shortLabel}
                </motion.div>

                {/* Pinpoint Beacon Orb */}
                <div
                  className={cn(
                    'size-7 rounded-full flex items-center justify-center text-white shadow-md transition-transform cursor-grab active:cursor-grabbing',
                    isDragging && 'scale-110'
                  )}
                  style={{
                    backgroundColor: currentMilestone.color,
                    boxShadow: `0 0 14px ${currentMilestone.glowColor}, 0 2px 6px rgba(0,0,0,0.25)`,
                  }}
                >
                  <PinIcon size={13} className="relative z-10 stroke-[2.5]" />
                </div>

                {/* Pointer Cone pointing directly down at the SVG curve */}
                <div
                  className="w-0 h-0 border-x-[3.5px] border-x-transparent border-t-[5px] -mt-0.5"
                  style={{ borderTopColor: currentMilestone.color }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
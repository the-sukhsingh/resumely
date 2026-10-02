'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileText,
  Loader2,
  Check,
  Link2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface Props {
  application: TrackedJobApplication;
  index: number;
  onSelect: (application: TrackedJobApplication) => void;
  masterResumeId?: Id<'resumeVersions'>;
  onDragStart?: (applicationId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export default function JobCard({
  application,
  onSelect,
  masterResumeId,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: Props) {
  const router = useRouter();
  const updateStage = useMutation(api.jobTracker.updateJobApplicationStage);
  const tailorForJob = useAction(api.jobTracker.tailorResumeForJob);

  const [isTailoring, setIsTailoring] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleStageChange = async (newStage: JobStage) => {
    try {
      await updateStage({
        applicationId: application._id,
        stage: newStage,
      });
      toast.success(`Moved to "${STAGE_CONFIGS[newStage].label}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to change stage');
    }
  };

  // Determine the next logical pipeline stage
  const nextStageAction = (() => {
    if (application.stage === 'saved') {
      return {
        stage: 'applied' as JobStage,
        label: 'Applied',
        colorClass: 'text-blue-500 hover:text-blue-400',
      };
    }
    if (application.stage === 'applied') {
      return {
        stage: 'interviewing' as JobStage,
        label: 'Interviewing',
        colorClass: 'text-amber-500 hover:text-amber-400',
      };
    }
    if (application.stage === 'interviewing') {
      return {
        stage: 'offered' as JobStage,
        label: 'Offer',
        colorClass: 'text-emerald-500 hover:text-emerald-400',
      };
    }
    return null;
  })();

  const handleQuickAdvance = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nextStageAction) return;
    await handleStageChange(nextStageAction.stage);
  };

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
      toast.success(`Tailored resume generated for ${application.company || 'job'}!`);
      router.push(`/resume/${versionId}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Tailoring failed';
      toast.error(msg);
    } finally {
      setIsTailoring(false);
    }
  };

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

  const companyName = application.company?.trim() || 'Direct Role';

  return (
    <motion.div
      layout="position"
      layoutId={application._id}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
      }}
      draggable
      onDragStart={(e) => {
        const dataTransfer = (e as unknown as React.DragEvent).dataTransfer;
        if (dataTransfer) {
          dataTransfer.setData('text/plain', application._id);
          dataTransfer.effectAllowed = 'move';
        }
        onDragStart?.(application._id);
      }}
      onDragEnd={() => {
        onDragEnd?.();
      }}
      onClick={() => onSelect(application)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(application);
        }
      }}
      className={cn(
        'group relative rounded-xl border border-border/70 dark:border-white/8 bg-card/85 dark:bg-neutral-900/60 hover:bg-card dark:hover:bg-neutral-900/90 hover:border-foreground/25 hover:shadow-xs p-3.5 space-y-2.5 transition-all duration-150 cursor-pointer active:cursor-grabbing select-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20',
        isDragging && 'opacity-35 scale-[0.98] ring-1 ring-primary/40'
      )}
    >
      {/* Top Header: Company + External Link */}
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span
          className="font-medium text-xs text-muted-foreground truncate"
          title={companyName}
        >
          {companyName}
        </span>
        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open job posting"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 p-0.5"
          >
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      {/* Role / Position Title */}
      <h4 className="font-semibold text-sm text-foreground tracking-tight leading-snug line-clamp-2">
        {application.title}
      </h4>

      {/* Bottom Section: Tailor Resume & Move to Next Stage */}
      <div
        className="pt-2 border-t border-border/40 space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tailor Resume Action */}
        {application.resumeVersionId && application.resumeVersion ? (
          <div className="flex items-center justify-between gap-1.5 p-1.5 px-2 rounded-lg bg-muted/25 hover:bg-muted/40 border border-border/40 transition-colors">
            <div
              onClick={() => router.push(`/resume/${application.resumeVersionId}`)}
              className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
              title="Open tailored resume"
            >
              <FileText className="size-3.5 text-primary shrink-0" />
              <span className="text-[11px] font-medium text-foreground truncate">
                {application.resumeVersion.name}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {application.resumeVersion.matchScore != null && (
                <span className="text-[10px] font-mono font-medium text-emerald-500">
                  {application.resumeVersion.matchScore}%
                </span>
              )}
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy public resume link"
                className="size-5 rounded flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Link2 className="size-3" />
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/resume/${application.resumeVersionId}`)}
                title="Edit tailored resume"
                className="size-5 rounded flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTailorClick}
            disabled={isTailoring}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] hover:bg-amber-500/[0.12] hover:border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer group/tailor"
          >
            {isTailoring ? (
              <>
                <Loader2 className="size-3 animate-spin text-amber-500" />
                <span>Tailoring with AI...</span>
              </>
            ) : (
              <>
                <span>Tailor Resume</span>
              </>
            )}
          </button>
        )}

        {/* Move to Next Stage Action */}
        {nextStageAction && (
          <div className="flex items-center justify-end pt-0.5">
            <button
              type="button"
              onClick={handleQuickAdvance}
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer group/adv',
                nextStageAction.colorClass
              )}
            >
              <span>{nextStageAction.label}</span>
              <ArrowRight className="size-3 transition-transform group-hover/adv:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

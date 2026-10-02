'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import StageBadge from './StageBadge';
import DitheredSphere from '@/components/custom/dithered-sphere';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Check,
  Link2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  application: TrackedJobApplication;
  index: number;
  onSelect: (application: TrackedJobApplication) => void;
  masterResumeId?: Id<'resumeVersions'>;
}

export default function JobCard({
  application,
  index,
  onSelect,
  masterResumeId,
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

  const handleQuickAdvance = async (e: React.MouseEvent) => {
    e.stopPropagation();
    let nextStage: JobStage | null = null;
    if (application.stage === 'saved') nextStage = 'applied';
    else if (application.stage === 'applied') nextStage = 'interviewing';
    else if (application.stage === 'interviewing') nextStage = 'offered';

    if (!nextStage) return;
    await handleStageChange(nextStage);
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
      toast.success(`Tailored resume generated for ${application.company}!`);
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

  return (
    <div
      onClick={() => onSelect(application)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(application);
        }
      }}
      className="group relative rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-foreground/25 p-4 transition-all duration-150 cursor-pointer shadow-2xs space-y-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 select-none active:scale-[0.99]"
    >
      {/* Top Header: Sphere + Company + External Link + Stage Pill */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <DitheredSphere index={index} seed={application._id} size={28} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground truncate block">
              {application.company}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open job posting"
              className="size-6 rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="size-3" />
            </a>
          )}
          <StageBadge
            stage={application.stage}
            size="sm"
            interactive
            onStageChange={handleStageChange}
          />
        </div>
      </div>

      {/* Role Title */}
      <div>
        <h4 className="font-medium text-sm text-foreground tracking-tight leading-snug line-clamp-2 group-hover:text-foreground">
          {application.title}
        </h4>

        {/* Location & Salary pills */}
        {(application.location || application.salary) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {application.location && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground bg-muted/40 border border-border/40">
                <MapPin className="size-2.5 shrink-0" />
                <span className="truncate max-w-[120px]">{application.location}</span>
              </span>
            )}
            {application.salary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground bg-muted/40 border border-border/40">
                <DollarSign className="size-2.5 shrink-0" />
                <span className="truncate max-w-[100px]">{application.salary}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Resumely Superpower: Tailored Resume Block */}
      <div
        className="pt-1.5 border-t border-border/40"
        onClick={(e) => e.stopPropagation()}
      >
        {application.resumeVersionId && application.resumeVersion ? (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-muted/20 border border-border/40">
            <div
              onClick={() => router.push(`/resume/${application.resumeVersionId}`)}
              className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <FileText className="size-3.5 text-primary shrink-0" />
              <span className="text-[11px] font-medium text-foreground truncate">
                {application.resumeVersion.name}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {application.resumeVersion.matchScore && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="size-2.5" />
                  {application.resumeVersion.matchScore}%
                </span>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy public resume link"
                className="size-6 rounded-md flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors"
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
                className="size-6 rounded-md flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors"
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
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium transition-all active:scale-[0.98] cursor-pointer"
          >
            {isTailoring ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Tailoring with AI...</span>
              </>
            ) : (
              <>
                Tailor Resume
              </>
            )}
          </button>
        )}
      </div>

      {/* Card Footer: Timestamp & Quick Action */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/80 pt-0.5">
        <span className="truncate">
          {application.stage === 'applied' && application.appliedAt
            ? `Applied ${formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}`
            : `Updated ${formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}`}
        </span>

        {/* Quick Advance Button */}
        {application.stage === 'saved' && (
          <button
            type="button"
            onClick={handleQuickAdvance}
            className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>Mark Applied</span>
            <Send className="size-2.5" />
          </button>
        )}

        {application.stage === 'applied' && (
          <button
            type="button"
            onClick={handleQuickAdvance}
            className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <span>Interviewing</span>
            <ArrowRight className="size-2.5" />
          </button>
        )}
      </div>
    </div>
  );
}

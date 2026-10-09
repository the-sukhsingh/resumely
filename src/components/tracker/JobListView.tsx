'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import StageBadge from './StageBadge';
import { TrashDuo, ExternalLinkDuo, File as DuoFile, LinkDuo } from '@/components/icons';
import JobAvatar from './JobAvatar';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import ColoredButton from '@/components/custom/colored-button';
import {
  Loader2,
  Check,
  Plus,
  Globe,
} from 'lucide-react';
import { DeleteConfirmPopover } from '@/components/ui/delete-confirm-popover';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  applications: TrackedJobApplication[];
  totalApplicationsCount?: number;
  onSelectApplication: (application: TrackedJobApplication) => void;
  masterResumeId?: Id<'resumeVersions'>;
  userId?: Id<'users'>;
  stageFilter?: string;
  onResetStageFilter?: () => void;
  search?: string;
  onClearSearch?: () => void;
}

export default function JobListView({
  applications,
  totalApplicationsCount,
  onSelectApplication,
  masterResumeId,
  userId,
  stageFilter = 'all',
  onResetStageFilter,
  search = '',
  onClearSearch,
}: Props) {
  const router = useRouter();
  const updateStage = useMutation(api.jobTracker.updateJobApplicationStage);
  const deleteJob = useMutation(api.jobTracker.deleteJobApplication);
  const tailorForJob = useAction(api.jobTracker.tailorResumeForJob);

  const [tailoringId, setTailoringId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleStageChange = async (appId: Id<'jobApplications'>, newStage: JobStage) => {
    try {
      await updateStage({ applicationId: appId, stage: newStage });
      toast.success(`Stage moved to "${STAGE_CONFIGS[newStage].label}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to change stage');
    }
  };

  const handleTailor = async (e: React.MouseEvent, app: TrackedJobApplication) => {
    e.stopPropagation();
    if (!masterResumeId) {
      toast.error('Please create a Master Resume first before tailoring');
      return;
    }

    setTailoringId(app._id);
    try {
      const { versionId } = await tailorForJob({
        applicationId: app._id,
        masterResumeId,
      });
      toast.success(`Tailored resume generated for ${app.company}!`);
      router.push(`/resume/${versionId}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Tailoring failed';
      toast.error(msg);
    } finally {
      setTailoringId(null);
    }
  };


  const handleCopyLink = async (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/r/${resumeId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(resumeId);
      toast.success('Public resume link copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy link');
    }
  };

  if (applications.length === 0) {
    const isFiltered = (stageFilter && stageFilter !== 'all') || (search && search.trim().length > 0);

    return (
      <div className="py-16 px-4 text-center rounded-2xl border border-border/70 bg-card/40">
        {isFiltered ? (
          <div className="max-w-md mx-auto space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">No applications matching current filters</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {stageFilter !== 'all' && search.trim() ? (
                  <>
                    No jobs in stage <strong className="text-foreground">{STAGE_CONFIGS[stageFilter as JobStage]?.label || stageFilter}</strong> matching &ldquo;<span className="text-foreground">{search}</span>&rdquo;
                  </>
                ) : stageFilter !== 'all' ? (
                  <>
                    No jobs currently in stage <strong className="text-foreground">{STAGE_CONFIGS[stageFilter as JobStage]?.label || stageFilter}</strong>
                  </>
                ) : (
                  <>
                    No jobs matching search query &ldquo;<span className="text-foreground">{search}</span>&rdquo;
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              {stageFilter !== 'all' && onResetStageFilter && (
                <button
                  type="button"
                  onClick={onResetStageFilter}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Show all stages
                </button>
              )}
              {search.trim() && onClearSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-sm font-medium text-foreground">No applications found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add a job from a URL or manual entry to begin tracking.
            </p>
            {userId && (
              <div className="pt-2">
                <AddTrackedJobDialog
                  userId={userId}
                  masterResumeId={masterResumeId}
                  trigger={
                    <ColoredButton
                      color="amber"
                      size="default"
                      className="rounded-full px-5 text-xs font-medium cursor-pointer"
                    >
                      <Plus className="size-3.5 mr-1" />
                      <span>Track New Job</span>
                    </ColoredButton>
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs shadow-xs overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-border/60 bg-muted/20 text-[11px] font-medium text-muted-foreground">
          <div className="col-span-4">Role & Company</div>
          <div className="col-span-2">Stage</div>
          <div className="col-span-3">Tailored Resume</div>
          <div className="col-span-2">Applied / Saved</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Rows Body */}
        <div className="divide-y divide-border/40">
          {applications.map((app, index) => {
            return (
              <div
                key={app._id}
                onClick={() => onSelectApplication(app)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectApplication(app);
                  }
                }}
                className="group relative px-4 sm:px-5 py-3 hover:bg-muted/35 active:bg-muted/50 transition-colors duration-150 cursor-pointer outline-none focus-visible:bg-muted/40 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/20"
              >
                {/* ── Mobile Layout (< md) ── */}
                <div className="flex md:hidden flex-col gap-2.5 w-full">
                  {/* Top: Role title & Row Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <JobAvatar
                        company={app.company}
                        companyUrl={app.companyUrl}
                        jobUrl={app.jobUrl}
                        seed={app._id}
                        index={index}
                        size={30}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-sm text-foreground truncate block tracking-tight">
                          {app.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          <span className="font-mono text-[11px] uppercase tracking-wider font-medium">{app.company}</span>
                          {app.location && <span>· {app.location}</span>}
                          {app.companyUrl && (
                            <a
                              href={app.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Visit company website"
                              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 font-mono text-[10px]"
                            >
                              <Globe className="size-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {app.companyUrl && (
                        <a
                          href={app.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visit company website"
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        >
                          <Globe className="size-4" />
                        </a>
                      )}
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open job posting"
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        >
                          <ExternalLinkDuo className="size-4" />
                        </a>
                      )}
                      <DeleteConfirmPopover
                        title="Delete tracked job?"
                        description={
                          <>
                            Are you sure you want to remove <strong className="text-foreground">{app.title}</strong> at{' '}
                            <strong className="text-foreground">{app.company}</strong>?
                          </>
                        }
                        confirmText="Delete Job"
                        onConfirm={async () => {
                          try {
                            await deleteJob({ applicationId: app._id });
                            toast.success(`Deleted application for ${app.company}`);
                          } catch (err) {
                            console.error(err);
                            toast.error('Failed to delete job application');
                          }
                        }}
                        side="top"
                        align="end"
                      >
                        <button
                          type="button"
                          title="Delete application"
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 data-[state=open]:text-destructive data-[state=open]:bg-destructive/10 cursor-pointer"
                        >
                          <TrashDuo className="size-4" />
                        </button>
                      </DeleteConfirmPopover>
                    </div>
                  </div>

                  {/* Middle: Stage badge & Tailored Resume connection */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/30">
                    <div onClick={(e) => e.stopPropagation()}>
                      <StageBadge
                        stage={app.stage}
                        size="sm"
                        interactive
                        onStageChange={(newStage) => handleStageChange(app._id, newStage)}
                      />
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {app.resumeVersionId && app.resumeVersion ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => router.push(`/resume/${app.resumeVersionId}`)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 hover:bg-muted/70 text-foreground text-[11px] font-medium max-w-[140px] truncate cursor-pointer"
                          >
                            <DuoFile className="size-3 text-primary shrink-0" />
                            <span className="truncate">{app.resumeVersion.name}</span>
                          </button>
                          {app.resumeVersion.matchScore && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                              {app.resumeVersion.matchScore}%
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleCopyLink(e, app.resumeVersionId!)}
                            className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            {copiedId === app.resumeVersionId ? <Check className="size-3.5 text-emerald-500" /> : <LinkDuo className="size-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleTailor(e, app)}
                          disabled={tailoringId === app._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs font-medium cursor-pointer"
                        >
                          {tailoringId === app._id ? <Loader2 className="size-3 animate-spin" /> : null}
                          <span>Tailor Resume</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Date */}
                  <div className="text-[10px] font-mono text-muted-foreground/70">
                    {app.stage === 'applied' && app.appliedAt
                      ? `Applied: ${format(new Date(app.appliedAt), 'MMM d, yyyy')}`
                      : `Updated: ${formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}`}
                  </div>
                </div>

                {/* ── Desktop Layout (md+) ── */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center w-full">
                  {/* 1. Role & Company */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <JobAvatar
                      company={app.company}
                      companyUrl={app.companyUrl}
                      jobUrl={app.jobUrl}
                      seed={app._id}
                      index={index}
                      size={32}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm text-foreground truncate block tracking-tight group-hover:text-foreground">
                        {app.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider truncate">
                          {app.company}
                        </span>
                        {app.companyUrl && (
                          <a
                            href={app.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Visit ${app.company} website`}
                            className="text-muted-foreground/60 hover:text-foreground inline-flex items-center gap-0.5 font-mono text-[10px]"
                          >
                            <Globe className="size-2.5" />
                          </a>
                        )}
                        {app.location && (
                          <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground/70 truncate">
                            · {app.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Stage (Interactive) */}
                  <div className="col-span-2 flex items-center">
                    <StageBadge
                      stage={app.stage}
                      size="sm"
                      interactive
                      onStageChange={(newStage) => handleStageChange(app._id, newStage)}
                    />
                  </div>

                  {/* 3. Tailored Resume connection */}
                  <div
                    className="col-span-3 flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {app.resumeVersionId && app.resumeVersion ? (
                      <div className="flex items-center gap-2 min-w-0 max-w-full">
                        <button
                          type="button"
                          onClick={() => router.push(`/resume/${app.resumeVersionId}`)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 hover:bg-muted/70 text-foreground transition-colors min-w-0 max-w-[180px] cursor-pointer"
                        >
                          <DuoFile className="size-3 text-primary shrink-0" />
                          <span className="text-[11px] font-medium truncate">
                            {app.resumeVersion.name}
                          </span>
                        </button>

                        {app.resumeVersion.matchScore && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                            {app.resumeVersion.matchScore}%
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(e, app.resumeVersionId!)}
                          title="Copy public resume link"
                          className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
                        >
                          {copiedId === app.resumeVersionId ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <LinkDuo className="size-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleTailor(e, app)}
                        disabled={tailoringId === app._id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
                      >
                        {tailoringId === app._id ? (
                          <>
                            <Loader2 className="size-3 animate-spin" />
                            <span>Tailoring...</span>
                          </>
                        ) : (
                          <>
                            Tailor Resume
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 4. Applied / Saved Date */}
                  <div className="col-span-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {app.stage === 'applied' && app.appliedAt
                        ? format(new Date(app.appliedAt), 'MMM d, yyyy')
                        : formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* 5. Row Actions */}
                  <div
                    className="col-span-1 flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {app.companyUrl && (
                      <a
                        href={app.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit company website"
                        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <Globe className="size-3.5" />
                      </a>
                    )}
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open job posting"
                        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <ExternalLinkDuo className="size-3.5" />
                      </a>
                    )}

                    <DeleteConfirmPopover
                      title="Delete tracked job?"
                      description={
                        <>
                          Are you sure you want to remove <strong className="text-foreground">{app.title}</strong> at{' '}
                          <strong className="text-foreground">{app.company}</strong>?
                        </>
                      }
                      confirmText="Delete Job"
                      onConfirm={async () => {
                        try {
                          await deleteJob({ applicationId: app._id });
                          toast.success(`Deleted application for ${app.company}`);
                        } catch (err) {
                          console.error(err);
                          toast.error('Failed to delete job application');
                        }
                      }}
                      side="top"
                      align="end"
                    >
                      <button
                        type="button"
                        title="Delete application"
                        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 data-[state=open]:text-destructive data-[state=open]:bg-destructive/10 active:scale-[0.93] transition-all cursor-pointer"
                      >
                        <TrashDuo className="size-3.5" />
                      </button>
                    </DeleteConfirmPopover>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Footer: Inline Add Row Trigger */}
        {userId && applications.length > 0 && (
          <AddTrackedJobDialog
            userId={userId}
            masterResumeId={masterResumeId}
            trigger={
              <div className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 border-t border-border/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Plus className="size-3.5" />
                  </div>
                  <span className="font-medium">Track another job posting...</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground/70 hidden sm:inline">
                  Showing {applications.length} {applications.length === 1 ? 'role' : 'roles'}
                  {typeof totalApplicationsCount === 'number' && totalApplicationsCount !== applications.length && (
                    <span> of {totalApplicationsCount}</span>
                  )}
                </span>
              </div>
            }
          />
        )}
      </div>
    </>
  );
}

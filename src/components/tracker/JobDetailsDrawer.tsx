'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import StageBadge from './StageBadge';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import DitheredSphere from '@/components/custom/dithered-sphere';
import { Textarea } from '@/components/ui/textarea';
import {
  X,
  ExternalLink,
  Sparkles,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  Share2,
  Check,
  Link2,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  application: TrackedJobApplication | null;
  open: boolean;
  onClose: () => void;
  masterResumeId?: Id<'resumeVersions'>;
}

export default function JobDetailsDrawer({
  application,
  open,
  onClose,
  masterResumeId,
}: Props) {
  const router = useRouter();
  const updateStage = useMutation(api.jobTracker.updateJobApplicationStage);
  const updateJob = useMutation(api.jobTracker.updateJobApplication);
  const deleteJob = useMutation(api.jobTracker.deleteJobApplication);
  const tailorForJob = useAction(api.jobTracker.tailorResumeForJob);

  const [notes, setNotes] = useState(application?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
    }
  }, [application]);

  if (!open || !application) return null;

  const handleStageChange = async (newStage: JobStage) => {
    try {
      await updateStage({
        applicationId: application._id,
        stage: newStage,
      });
      toast.success(`Stage moved to "${STAGE_CONFIGS[newStage].label}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update stage');
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await updateJob({
        applicationId: application._id,
        notes: notes.trim() || undefined,
      });
      toast.success('Notes saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleTailorResume = async () => {
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
      toast.success('Tailored resume created and linked!');
      router.push(`/resume/${versionId}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Tailoring failed';
      toast.error(msg);
    } finally {
      setIsTailoring(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteJob({ applicationId: application._id });
      toast.success(`Deleted application for ${application.company}`);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyPublicResume = async () => {
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
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-auto animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-lg h-full bg-background border-l border-border/70 shadow-2xl flex flex-col overflow-hidden text-foreground animate-in slide-in-from-right duration-250"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border/60 shrink-0">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <DitheredSphere index={0} seed={application._id} size={40} className="shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground truncate">
                    {application.company}
                  </h3>
                  {application.jobUrl && (
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 text-[11px] underline underline-offset-2 shrink-0"
                    >
                      <span>Posting</span>
                      <ExternalLink className="size-2.5" />
                    </a>
                  )}
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground truncate mt-0.5">
                  {application.title}
                </h2>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stage Selector Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card/40">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Current Status
                </span>
                <p className="text-xs text-muted-foreground">
                  Click to transition application stage
                </p>
              </div>
              <StageBadge
                stage={application.stage}
                interactive
                onStageChange={handleStageChange}
                size="default"
              />
            </div>

            {/* Resume Connection Block (The Resumely Superpower) */}
            <div className="p-4 rounded-2xl border border-border/70 bg-card/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    Tailored Resume
                  </span>
                </div>
                {application.resumeVersion?.matchScore && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="size-3" />
                    {application.resumeVersion.matchScore}% ATS Match
                  </span>
                )}
              </div>

              {application.resumeVersionId && application.resumeVersion ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3 rounded-xl border border-border/50 bg-background/80 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground truncate">
                        {application.resumeVersion.name}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        Updated {formatDistanceToNow(new Date(application.resumeVersion.updatedAt), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyPublicResume}
                        title="Copy public link"
                        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-[0.94] transition-all cursor-pointer"
                      >
                        {copiedLink ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Link2 className="size-3.5" />
                        )}
                      </button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => router.push(`/resume/${application.resumeVersionId}`)}
                        className="h-7 text-xs px-2.5 rounded-lg gap-1"
                      >
                        <span>Edit</span>
                        <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No tailored resume linked yet. Use your Master Resume to generate bullets and match keywords specifically for {application.company}.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleTailorResume}
                    disabled={isTailoring}
                    className="w-full h-8 text-xs font-medium gap-1.5 rounded-xl shadow-xs"
                  >
                    {isTailoring ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Tailoring with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3.5 text-amber-300" />
                        <span>Tailor Master Resume for this Job</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {application.location && (
                <div className="p-3 rounded-xl border border-border/50 bg-card/30 flex items-start gap-2.5">
                  <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Location
                    </span>
                    <span className="font-medium text-foreground">{application.location}</span>
                  </div>
                </div>
              )}

              {application.salary && (
                <div className="p-3 rounded-xl border border-border/50 bg-card/30 flex items-start gap-2.5">
                  <DollarSign className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Compensation
                    </span>
                    <span className="font-medium text-foreground">{application.salary}</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl border border-border/50 bg-card/30 flex items-start gap-2.5">
                <Calendar className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    {application.appliedAt ? 'Applied On' : 'Saved On'}
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {format(new Date(application.appliedAt || application.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border/50 bg-card/30 flex items-start gap-2.5">
                <Clock className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Activity
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Skills / Tags */}
            {application.jobDescription?.extractedSkills &&
              application.jobDescription.extractedSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground block">
                    Identified Skills & Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {application.jobDescription.extractedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-muted/70 text-muted-foreground border border-border/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Notes & Interview Prep */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Interview Prep & Notes
                </span>
                {notes !== (application.notes || '') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="h-6 text-[11px] text-primary"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save changes'}
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Log interviewer names, questions asked, follow-up dates, referral info..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleSaveNotes}
                className="min-h-[120px] text-xs resize-none rounded-xl"
              />
            </div>
          </div>

          {/* Footer with Delete Action */}
          <div className="p-4 border-t border-border/60 bg-background/80 backdrop-blur-sm flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs text-destructive hover:opacity-80 transition-opacity cursor-pointer font-medium"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Job</span>
            </button>

            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this tracked job?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong className="text-foreground">{application.title}</strong> at{' '}
              <strong className="text-foreground">{application.company}</strong>?
              {application.resumeVersionId && ' Your tailored resume will remain intact.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Job'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

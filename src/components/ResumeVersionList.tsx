'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Link from 'next/link';
import ResumeUploader from './ResumeUploader';
import Feedback from './custom/feedback';
import { TrashDuo } from '@/components/icons';
import {
  Search,
  Plus,
  ArrowUpRight,
  FileText,
  Briefcase,
  X,
  Target,
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
import AddJobDescriptionDialog from './AddJobDescriptionDialog';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import ColoredButton from './custom/colored-button';
import DitheredSphere from './custom/dithered-sphere';
import { cn } from 'cn';
interface Props {
  userId: Id<'users'>;
}

export default function ResumeVersionList({ userId }: Props) {
  const router = useRouter();
  const versions = useQuery(api.resumeVersions.getResumeVersionsByUser, { userId });
  const masterResume = useQuery(api.masterResumes.getMasterResumeByUser, { userId });

  const deleteVersion = useMutation(api.resumeVersions.deleteResumeVersion);

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<'resumeVersions'>; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const master = useMemo(() => {
    return versions?.find((v) => v.isMasterResume) || masterResume;
  }, [versions, masterResume]);

  const tailoredVersions = useMemo(() => {
    return (versions ?? [])
      .filter((v) => !v.isMasterResume)
      .sort((a, b) => (b.updatedAt || b._creationTime) - (a.updatedAt || a._creationTime));
  }, [versions]);

  const filteredTailored = useMemo(() => {
    if (!search.trim()) return tailoredVersions;
    const q = search.toLowerCase();
    return tailoredVersions.filter((v) => (v.name ?? '').toLowerCase().includes(q));
  }, [tailoredVersions, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteVersion({ versionId: deleteTarget.id });
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };



  // Loading skeleton
  if (versions === undefined) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <div className="h-28 rounded-2xl bg-muted/40 border border-border/50" />
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 space-y-3">
          <div className="h-10 rounded-lg bg-muted/30" />
          <div className="h-14 rounded-lg bg-muted/20" />
          <div className="h-14 rounded-lg bg-muted/20" />
          <div className="h-14 rounded-lg bg-muted/20" />
        </div>
      </div>
    );
  }

  // Zero resumes state
  if (versions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 text-center">
        <Feedback />
        <div className="p-8 md:p-10 rounded-2xl border border-dashed border-border/80 bg-card/40 backdrop-blur-xs">
          <div className="size-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-4">
            <FileText className="size-6" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            No Resumes Yet
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
            Upload your existing resume to generate your Master Profile, or start clean from scratch.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ResumeUploader userId={userId} />
            <Link
              href="/resume/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border/80 bg-background hover:bg-muted/60 text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Create from Scratch</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <Feedback />

      {/* ─── Master Resume Anchor Card ─── */}
      {master && (
        <section className="group relative rounded-[30px] bg-linear-to-b from-card/90 to-card/40 dark:from-card/40 dark:to-card/10 p-5 sm:p-6 transition-all duration-200 shadow-xs overflow-hidden outline-2 outline-white">
          {/* <VelocityStreakPreview className="absolute inset-0 opacity-45 pointer-events-none" /> */}
          <div className={cn("absolute inset-0 blur-2xl")}>
          <span className='size-80 rounded-full bg-violet-100 inline-flex absolute left-1/5 -translate-x-1/2 -translate-y-1/2'></span>
          <span className='size-80 rounded-full bg-emerald-100 inline-flex absolute right-5 -translate-y-1/8'></span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                      {master.name || 'Master Resume'}
                    </h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your complete career record and baseline credentials for all tailored versions
                  </p>
                </div>

                {/* Structured Stat Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1  rounded-md  text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">{master.experience?.length || 0}</strong>
                    <span className="text-muted-foreground">positions</span>
                  </span>
                  <span className="inline-flex items-center gap-1  rounded-md  text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">
                      {master.skills?.reduce((a, s) => a + (s.items?.length || 0), 0) || 0}
                    </strong>
                    <span className="text-muted-foreground">skills</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md  text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">{master.projects?.length || 0}</strong>
                    <span className="text-muted-foreground">projects</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA with Emil Kowalski Micro-interactions */}
            <div className="flex items-center self-end sm:self-center shrink-0">
              <Link href={`/resume/${master._id}`}>
                <ColoredButton color="amber" className="px-5 rounded-full active:scale-[0.97]" size="lg">
                  <span>Edit Base Profile</span>
                </ColoredButton>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tailored Resumes Section ─── */}
      <section className="space-y-3.5">
        {/* Section Header & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Tailored Resumes
            </h3>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search versions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-7 py-2 rounded-full bg-card/80 border border-border/70 focus:outline-none focus:ring-1 focus:ring-foreground/25 focus:border-foreground/30 text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Primary Action Button */}
            {master && (
              <div className="shrink-0">
                <AddJobDescriptionDialog
                  buttonLabel="Tailor for Job"
                  userId={userId}
                  masterResumeId={master._id}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── Redesigned Table / Rows Container ─── */}
        <div className="rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs shadow-xs overflow-hidden">
          {/* Table Header (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-b border-border/60 bg-muted/20 text-[11px] font-medium text-muted-foreground">
            <span>Target Role / Version</span>
            <div className="flex items-center gap-8 pr-1">
              <span>Updated</span>
              <span className="w-8 text-right"></span>
            </div>
          </div>

          {/* Table Rows Body */}
          <div className="divide-y divide-border/40">
            {filteredTailored.length === 0 ? (
              <div className="py-12 px-4 text-center">
                {search.trim() ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      No tailored versions matching &ldquo;<span className="text-foreground font-medium">{search}</span>&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-xs text-primary hover:underline font-medium cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="size-10 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                      <Target className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">No Tailored Resumes Yet</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Create job-targeted versions to adapt your bullets, highlight key skills, and boost your ATS match score.
                      </p>
                    </div>
                    {master && (
                      <div className="pt-2">
                        <AddJobDescriptionDialog
                          buttonLabel="Tailor for Job"
                          userId={userId}
                          masterResumeId={master._id}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              filteredTailored.map((item, index) => {
                return (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/resume/${item._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/resume/${item._id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="group relative flex items-center justify-between gap-4 px-4 sm:px-5 py-3 hover:bg-muted/35 active:bg-muted/50 transition-colors duration-150 cursor-pointer outline-none focus-visible:bg-muted/40 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/20"
                  >
                    {/* Role Name & Dithered Sphere */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <DitheredSphere index={index} seed={item._id} size={32} />

                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-sm text-foreground truncate block group-hover:text-foreground tracking-tight">
                          {item.name || 'Untitled Version'}
                        </span>

                        {/* Mobile-only secondary info line */}
                        <span className="sm:hidden font-mono text-[10px] text-muted-foreground block mt-0.5">
                          {formatDistanceToNow(new Date(item.updatedAt || item._creationTime), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Last Modified & Single Delete Action */}
                    <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                      <span className="hidden sm:inline-block font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(item.updatedAt || item._creationTime), {
                          addSuffix: true,
                        })}
                      </span>

                      {/* Single Action Button: Delete */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: item._id,
                              name: item.name || 'Untitled Version',
                            })
                          }
                          title="Delete version"
                          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 active:scale-[0.93] transition-all duration-150 cursor-pointer"
                        >
                          <TrashDuo className="size-4" />
                          <span className="sr-only">Delete Version</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Table Footer: Inline Add Row Trigger */}
          {master && filteredTailored.length > 0 && (
            <AddJobDescriptionDialog
              userId={userId}
              masterResumeId={master._id}
              trigger={
                <div className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 border-t border-border/40 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <div className="size-7.5 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Plus className="size-4" />
                    </div>
                    <span className="font-medium">Tailor for another job description...</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/70 hidden sm:inline">
                    Showing {filteredTailored.length} of {tailoredVersions.length}
                  </span>
                </div>
              }
            />
          )}
        </div>
      </section>

      {/* Accessible Custom Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume version?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>? This action cannot be undone. Your Master Resume remains untouched.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="active:scale-[0.98]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]"
            >
              {isDeleting ? 'Deleting...' : 'Delete Version'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
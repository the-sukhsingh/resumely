'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Link from 'next/link';
import ResumeUploader from './ResumeUploader';
import Feedback from './custom/feedback';
import {
  Search,
  Plus,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit3,
  ArrowUpRight,
  FileText,
  Sparkles,
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  X,
  Target,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { VelocityStreakPreview } from './custom/vel-streak';
import DitheredSphere from './custom/dithered-sphere';

interface Props {
  userId: Id<'users'>;
}

export default function ResumeVersionList({ userId }: Props) {
  const router = useRouter();
  const versions = useQuery(api.resumeVersions.getResumeVersionsByUser, { userId });
  const masterResume = useQuery(api.masterResumes.getMasterResumeByUser, { userId });

  const deleteVersion = useMutation(api.resumeVersions.deleteResumeVersion);
  const duplicateVersionAction = useAction(api.resumeVersions.duplicateVersion);

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

  const handleDuplicate = async (e: React.MouseEvent, versionId: Id<'resumeVersions'>, currentName: string) => {
    e.stopPropagation();
    try {
      await duplicateVersionAction({
        versionId,
        newName: `${currentName} (Copy)`,
      });
      toast.success(`Duplicated "${currentName}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to duplicate resume');
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
        <section className="group relative rounded-2xl bg-linear-to-b from-card/90 to-card/40 dark:from-card/40 dark:to-card/10 p-5 sm:p-6 transition-all duration-200 border border-border/60 shadow-xs overflow-hidden">
          <VelocityStreakPreview className="absolute inset-0 opacity-45 pointer-events-none" />
          
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">{master.experience?.length || 0}</strong>
                    <span className="text-muted-foreground">positions</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">
                      {master.skills?.reduce((a, s) => a + (s.items?.length || 0), 0) || 0}
                    </strong>
                    <span className="text-muted-foreground">skills</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                    <strong className="text-foreground font-semibold">{master.projects?.length || 0}</strong>
                    <span className="text-muted-foreground">projects</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA with Emil Kowalski Micro-interactions */}
            <div className="flex items-center self-end sm:self-center shrink-0">
              <Link href={`/resume/${master._id}`}>
                <ColoredButton color="dark" className="px-5 rounded-full active:scale-[0.97]" size="lg">
                  <span>Edit Base Profile</span>
                  <ArrowUpRight className="size-3.5 group-hover/colored-button:translate-x-0.5 group-hover/colored-button:-translate-y-0.5 transition-transform duration-150 ease-out" />
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
          <div className="hidden sm:grid sm:grid-cols-12 items-center gap-4 px-5 py-2.5 border-b border-border/60 bg-muted/20 text-[11px] font-medium text-muted-foreground">
            <div className="col-span-6 md:col-span-5 flex items-center gap-1.5">
              <span>Target Role / Version</span>
            </div>
            <div className="hidden md:flex md:col-span-2 items-center gap-1.5">
              <span>Scope</span>
            </div>
            <div className="col-span-3 md:col-span-2 flex items-center gap-1.5">
              <span>ATS Fit</span>
            </div>
            <div className="col-span-3 md:col-span-3 flex items-center justify-end text-right">
              <span>Activity / Actions</span>
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
                const positionsCount = item.experience?.length || 0;
                const skillsCount =
                  item.skills?.reduce((acc, cat) => acc + (cat.items?.length || 0), 0) || 0;
                const score = item.matchScore;

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
                    className="group relative flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-muted/35 active:bg-muted/50 transition-colors duration-150 cursor-pointer outline-none focus-visible:bg-muted/40 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-foreground/20"
                  >
                    {/* Col 1: Role Name & Dithered Sphere (col-span-6 / col-span-5) */}
                    <div className="sm:col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                      <DitheredSphere index={index} seed={item._id} size={32} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate group-hover:text-foreground tracking-tight">
                            {item.name || 'Untitled Version'}
                          </span>
                        </div>

                        {/* Mobile-only secondary info line */}
                        <div className="flex items-center gap-2 mt-0.5 sm:hidden text-[11px] text-muted-foreground">
                          <span>{positionsCount} roles</span>
                          <span>·</span>
                          <span>{skillsCount} skills</span>
                          <span>·</span>
                          <span className="font-mono text-[10px]">
                            {formatDistanceToNow(new Date(item.updatedAt || item._creationTime), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Content Scope (col-span-2, hidden on mobile) */}
                    <div className="hidden md:flex md:col-span-2 items-center text-xs text-muted-foreground">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded-md bg-muted/40 border border-border/40">
                        <span className="text-foreground/90 font-medium">{positionsCount}</span>
                        <span className="text-muted-foreground/80">exp</span>
                        <span className="text-muted-foreground/40">/</span>
                        <span className="text-foreground/90 font-medium">{skillsCount}</span>
                        <span className="text-muted-foreground/80">skills</span>
                      </div>
                    </div>

                    {/* Col 3: ATS Match Score / Status (col-span-3 / col-span-2) */}
                    <div className="sm:col-span-3 md:col-span-2 flex items-center">
                      {score != null ? (
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            score >= 85
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                              : score >= 70
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              score >= 85
                                ? 'bg-emerald-500 animate-pulse'
                                : score >= 70
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <span className="font-mono font-semibold">{score}%</span>
                          <span className="text-[10px] opacity-80 uppercase tracking-wider font-sans">
                            Match
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/50 text-muted-foreground border border-border/50">
                          <Sparkles className="size-3 text-muted-foreground/70" />
                          <span>Tailored</span>
                        </span>
                      )}
                    </div>

                    {/* Col 4: Last Modified & Fast Actions (col-span-3) */}
                    <div className="sm:col-span-3 md:col-span-3 flex items-center justify-between sm:justify-end gap-3 text-right">
                      <span className="hidden sm:inline-block font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(item.updatedAt || item._creationTime), {
                          addSuffix: true,
                        })}
                      </span>

                      {/* Interactive Button Group with Emil Kowalski Microinteractions */}
                      <div
                        className="flex items-center gap-1 ml-auto sm:ml-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Open Button */}
                        <Link
                          href={`/resume/${item._id}`}
                          className="group/btn inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-foreground bg-secondary/80 hover:bg-secondary border border-border/50 hover:border-border active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-2xs"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="size-3 text-muted-foreground group-hover/btn:text-foreground group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150 ease-out" />
                        </Link>

                        {/* More Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.95] transition-all cursor-pointer"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 text-xs">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/resume/${item._id}`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit3 className="size-3.5 text-muted-foreground" />
                                <span>Open Editor</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDuplicate(e, item._id, item.name || 'Resume')}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="size-3.5 text-muted-foreground" />
                              <span>Duplicate Version</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteTarget({
                                  id: item._id,
                                  name: item.name || 'Untitled Version',
                                })
                              }
                              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete Version</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                    <div className="size-5 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Plus className="size-3" />
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
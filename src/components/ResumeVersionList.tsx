'use client';

import React, { useState, useMemo } from 'react';
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
  ShieldCheck,
  Sparkles,
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

interface Props {
  userId: Id<'users'>;
}

export default function ResumeVersionList({ userId }: Props) {
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

  const handleDuplicate = async (versionId: Id<'resumeVersions'>, currentName: string) => {
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
        <div className="h-24 rounded-2xl bg-muted/40 border border-border/50" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-44 rounded-2xl bg-muted/30 border border-border/40" />
          <div className="h-44 rounded-2xl bg-muted/30 border border-border/40" />
          <div className="h-44 rounded-2xl bg-muted/30 border border-border/40" />
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
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
            <span className="font-medium tracking-tight text-foreground flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Primary Resume
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Source of truth for all versions
            </span>
          </div>

          <div className="group relative rounded-2xl border border-border/70 hover:border-foreground/20 bg-card/40 hover:bg-card/70 p-5 transition-all duration-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-xl bg-muted/60 text-foreground flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      {master.name || 'Master Resume'}
                    </h2>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Active Base
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete career history · {master.experience?.length || 0} positions · {master.skills?.reduce((a, s) => a + (s.items?.length || 0), 0) || 0} skills · {master.projects?.length || 0} projects
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="text-xs font-mono text-muted-foreground">
                  {formatDistanceToNow(new Date(master.updatedAt || master._creationTime), { addSuffix: true })}
                </span>
                <Link
                  href={`/resume/${master._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/80 bg-background hover:bg-muted/70 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <span>Edit Base</span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Search and Section Header ─── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Tailored Resumes
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tailoredVersions.length}
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search versions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border/70 focus:outline-none focus:ring-1 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* ─── Cards Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTailored.map((item) => {
            const skillCount = item.skills?.reduce((a, s) => a + (s.items?.length || 0), 0) || 0;
            const expCount = item.experience?.length || 0;

            return (
              <div
                key={item._id}
                className="group relative flex flex-col justify-between min-h-[155px] rounded-2xl border border-border/60 hover:border-foreground/20 bg-card/40 hover:bg-card/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
              >
                {/* Top Row: Icon + Badge + Menu */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="size-8 rounded-lg bg-muted/50 text-muted-foreground group-hover:text-foreground flex items-center justify-center transition-colors">
                      <FileText className="size-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.matchScore ? (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {item.matchScore}% ATS
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                          Ready
                        </span>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 text-xs">
                          <DropdownMenuItem asChild>
                            <Link href={`/resume/${item._id}`} className="flex items-center gap-2 cursor-pointer">
                              <Edit3 className="size-3.5" />
                              <span>Open Editor</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(item._id, item.name || 'Resume')}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Copy className="size-3.5" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget({ id: item._id, name: item.name || 'Untitled Version' })}
                            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Link href={`/resume/${item._id}`} className="block">
                    <h4 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.name || 'Untitled Version'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {expCount > 0 || skillCount > 0
                        ? `${expCount} roles · ${skillCount} skills`
                        : 'Targeted application'}
                    </p>
                  </Link>
                </div>

                {/* Bottom Row: Timestamp + Open Link */}
                <div className="pt-3.5 mt-3.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-[11px]">
                    {formatDistanceToNow(new Date(item.updatedAt || item._creationTime), { addSuffix: true })}
                  </span>
                  <Link
                    href={`/resume/${item._id}`}
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:opacity-80 transition-opacity"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="size-3 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* ─── Matching Card Slot: Target New Job ─── */}
          {master && (
            <div className="min-h-[155px] h-full">
              <AddJobDescriptionDialog
                buttonLabel="Target New Job"
                userId={userId}
                masterResumeId={master._id}
                variant="card"
              />
            </div>
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Version'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
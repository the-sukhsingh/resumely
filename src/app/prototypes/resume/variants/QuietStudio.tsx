'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PrototypeResumeItem } from '../data';
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
import AddJobDescriptionDialog from '@/components/AddJobDescriptionDialog';
import { Id } from '../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';

interface QuietStudioProps {
  resumes: PrototypeResumeItem[];
  userName?: string;
  userId?: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
  onDelete?: (id: string) => Promise<void>;
  onDuplicate?: (item: PrototypeResumeItem) => Promise<void>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
}

export default function QuietStudio({
  resumes,
  userName = 'Sukhjit',
  userId,
  masterResumeId,
  onDelete,
  onDuplicate,
  onCreated,
}: QuietStudioProps) {
  const [items, setItems] = useState<PrototypeResumeItem[]>(resumes);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PrototypeResumeItem | null>(null);

  React.useEffect(() => {
    setItems(resumes);
  }, [resumes]);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.targetRole && item.targetRole.toLowerCase().includes(search.toLowerCase()))
  );

  const master = items.find((i) => i.isMasterResume);
  const tailored = filtered.filter((i) => !i.isMasterResume);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (onDelete && !deleteTarget.id.startsWith('mock-') && !deleteTarget.id.startsWith('copy-') && deleteTarget.id !== 'master') {
        await onDelete(deleteTarget.id);
      } else {
        setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      }
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch {
      toast.error('Failed to delete version');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = async (item: PrototypeResumeItem) => {
    try {
      if (onDuplicate && !item.id.startsWith('mock-') && !item.id.startsWith('copy-')) {
        await onDuplicate(item);
      } else {
        const copy: PrototypeResumeItem = {
          ...item,
          id: `copy-${Date.now()}`,
          name: `${item.name} (Copy)`,
          isMasterResume: false,
          lastUpdated: 'Just now',
        };
        setItems((prev) => [copy, ...prev]);
        toast.success(`Duplicated "${item.name}"`);
      }
    } catch {
      toast.error('Failed to duplicate version');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Workspace</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Hi, {userName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Maintain your master profile and generate tailored resumes for specific job descriptions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {userId && masterResumeId ? (
              <AddJobDescriptionDialog
                buttonLabel="Tailor for Job"
                userId={userId}
                masterResumeId={masterResumeId}
                onCreated={onCreated}
                variant="minimal"
              />
            ) : (
              <button
                type="button"
                onClick={() => toast.info('Add Job Description dialog')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>Tailor for Job</span>
              </button>
            )}
          </div>
        </header>

        {/* Master Resume Anchor Card (Emil Kowalski Craft Overhaul) */}
        {master && (
          <section className="group relative rounded-2xl border border-border/80 hover:border-foreground/25 bg-linear-to-b from-card/80 to-card/40 dark:from-card/40 dark:to-card/10 p-5 sm:p-6 transition-all duration-200 hover:shadow-md shadow-xs">
            {/* Top Status & Sync Row inside the card */}
            <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground tracking-tight">Master Profile</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                  Active Source
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-mono">
                <span className="hidden sm:inline">Syncs to all versions ·</span>
                <span>Updated {master.lastUpdated}</span>
              </div>
            </div>

            {/* Main Content & Stats Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-xl bg-muted/60 dark:bg-muted/30 border border-border/50 text-foreground flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                      {master.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your complete career record and baseline credentials
                    </p>
                  </div>

                  {/* Structured Stat Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                      <strong className="text-foreground font-semibold">{master.metrics.experiences}</strong>
                      <span className="text-muted-foreground">positions</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                      <strong className="text-foreground font-semibold">{master.metrics.skills}</strong>
                      <span className="text-muted-foreground">skills</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/30 border border-border/50 text-[11px] font-medium text-foreground/90">
                      <strong className="text-foreground font-semibold">{master.metrics.projects}</strong>
                      <span className="text-muted-foreground">projects</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA with Emil Kowalski Micro-interactions */}
              <div className="flex items-center self-end sm:self-center shrink-0">
                <Link
                  href={`/resume/${master.id}`}
                  className="group/btn inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-xs"
                >
                  <span>Edit Base Profile</span>
                  <ArrowUpRight className="size-3.5 text-background/80 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-150" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Filter and Search Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Tailored Resumes
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tailored.length}
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

          {/* Resumes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tailored.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between min-h-[155px] rounded-2xl border border-border/60 hover:border-foreground/20 bg-card/40 hover:bg-card/80 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
              >
                {/* Card Top */}
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
                            <Link href={`/resume/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                              <Edit3 className="size-3.5" />
                              <span>Open Editor</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(item)} className="flex items-center gap-2 cursor-pointer">
                            <Copy className="size-3.5" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(item)}
                            className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Link href={`/resume/${item.id}`} className="block">
                    <h4 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.metrics.experiences > 0 || item.metrics.skills > 0
                        ? `${item.metrics.experiences} roles · ${item.metrics.skills} skills`
                        : item.targetRole || 'Targeted application'}
                    </p>
                  </Link>
                </div>

                {/* Card Footer */}
                <div className="pt-3.5 mt-3.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-[11px]">{item.lastUpdated}</span>
                  <Link
                    href={`/resume/${item.id}`}
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:opacity-80 transition-opacity"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="size-3 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}

            {/* New Tailored Card slot matching other cards */}
            <div className="min-h-[155px] h-full">
              {userId && masterResumeId ? (
                <AddJobDescriptionDialog
                  buttonLabel="Target New Job"
                  userId={userId}
                  masterResumeId={masterResumeId}
                  onCreated={onCreated}
                  variant="card"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => toast.info('Paste job description')}
                  className="group flex flex-col items-center justify-center min-h-[155px] h-full w-full rounded-2xl border border-dashed border-border/80 hover:border-foreground/30 bg-muted/10 hover:bg-muted/25 p-5 text-center transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <div className="size-9 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors mb-2.5">
                    <Plus className="size-4" />
                  </div>
                  <p className="text-xs font-semibold text-foreground tracking-tight">Target New Job</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">Tailor resume for a job posting</p>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume version?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>? This action cannot be undone. Your Master Resume remains untouched.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

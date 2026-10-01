'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PrototypeResumeItem } from '../data';
import {
  Plus,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  Copy,
  Trash2,
  Layers,
  FileText,
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

interface EditorialBentoProps {
  resumes: PrototypeResumeItem[];
  userName?: string;
  userId?: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
  onDelete?: (id: string) => Promise<void>;
  onDuplicate?: (item: PrototypeResumeItem) => Promise<void>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
}

export default function EditorialBento({
  resumes,
  userName = 'Sukhjit',
  userId,
  masterResumeId,
  onDelete,
  onDuplicate,
  onCreated,
}: EditorialBentoProps) {
  const [items, setItems] = useState<PrototypeResumeItem[]>(resumes);
  const [filter, setFilter] = useState<'all' | 'tailored' | 'master'>('all');
  const [deleteTarget, setDeleteTarget] = useState<PrototypeResumeItem | null>(null);

  React.useEffect(() => {
    setItems(resumes);
  }, [resumes]);

  const master = items.find((i) => i.isMasterResume);
  const tailored = items.filter((i) => !i.isMasterResume);

  const displayItems =
    filter === 'master'
      ? (master ? [master] : [])
      : filter === 'tailored'
      ? tailored
      : items;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (onDelete && !deleteTarget.id.startsWith('mock-') && !deleteTarget.id.startsWith('copy-') && deleteTarget.id !== 'master') {
        await onDelete(deleteTarget.id);
      } else {
        setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      }
      toast.success(`Removed "${deleteTarget.name}"`);
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
          lastUpdated: 'Just now',
        };
        setItems((prev) => [copy, ...prev]);
        toast.success(`Created duplicate of "${item.name}"`);
      }
    } catch {
      toast.error('Failed to duplicate version');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased pb-24">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-linear-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 md:pt-16">
        
        {/* Editorial Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-border/40">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/60 text-xs font-medium text-muted-foreground mb-3">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Resume Studio · {userName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Your Resume Portfolio
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
              Every job deserves a tailored application. Keep your master profile updated to automatically generate ATS-ready resumes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-muted/50 border border-border/50 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('tailored')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === 'tailored'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tailored ({tailored.length})
            </button>
            <button
              onClick={() => setFilter('master')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === 'master'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Master (1)
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento Tile 1: Master Resume Feature (Spans 2 cols on md+) */}
          {master && (filter === 'all' || filter === 'master') && (
            <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card to-muted/20 p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-200">
              <div className="flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium">
                      <Layers className="size-3.5" />
                      <span>Single Source of Truth</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">Updated {master.lastUpdated}</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    {master.name}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                    This is your comprehensive profile containing your full employment record, education, project details, and verified skills.
                  </p>

                  {/* Stylized Miniature Document Visual */}
                  <div className="mt-5 p-4 rounded-xl border border-border/60 bg-background/60 backdrop-blur-xs">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/40 text-xs">
                      <span className="font-semibold tracking-tight text-foreground">{userName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">Master Profile Snapshot</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="block font-bold text-foreground">{master.metrics.experiences}</span>
                        <span className="text-[10px] text-muted-foreground">Experiences</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="block font-bold text-foreground">{master.metrics.skills}</span>
                        <span className="text-[10px] text-muted-foreground">Core Skills</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40">
                        <span className="block font-bold text-foreground">{master.metrics.projects}</span>
                        <span className="text-[10px] text-muted-foreground">Projects</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">Powers all tailored applications</span>
                  <Link
                    href={`/resume/${master.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Edit Master Data</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bento Tile 2: Action Tile (Tailor for Job) */}
          {(filter === 'all' || filter === 'tailored') && (
            <div className="flex flex-col">
              {userId && masterResumeId ? (
                <div className="flex-1 rounded-2xl border-2 border-dashed border-border/80 hover:border-foreground/30 bg-muted/10 hover:bg-muted/30 p-6 md:p-8 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="size-11 rounded-2xl bg-foreground/5 dark:bg-foreground/10 flex items-center justify-center text-foreground mb-4">
                      <Plus className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      Tailor for a Job
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Paste any job description to instantly generate an ATS-optimized resume version matched to the role.
                    </p>
                  </div>
                  <div className="pt-4">
                    <AddJobDescriptionDialog
                      buttonLabel="Start Tailoring"
                      userId={userId}
                      masterResumeId={masterResumeId}
                      onCreated={onCreated}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => toast.info('Add Job Description dialog')}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-dashed border-border/80 hover:border-foreground/30 bg-muted/10 hover:bg-muted/30 p-6 md:p-8 transition-all duration-200 cursor-pointer active:scale-[0.98] flex-1"
                >
                  <div>
                    <div className="size-11 rounded-2xl bg-foreground/5 dark:bg-foreground/10 flex items-center justify-center text-foreground mb-4 group-hover:scale-105 transition-transform">
                      <Plus className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      Tailor for a Job
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Paste any job description to instantly generate an ATS-optimized resume version matched to the role.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                    <span>Start Tailoring</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bento Tiles: Tailored Versions */}
          {tailored.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 hover:border-foreground/20 bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-muted/60 text-muted-foreground group-hover:text-foreground transition-colors">
                    <FileText className="size-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.matchScore ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {item.matchScore}% Match
                      </span>
                    ) : null}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem asChild>
                          <Link href={`/resume/${item.id}`}>Open Editor</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteTarget(item)} className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Link href={`/resume/${item.id}`} className="block">
                  <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {item.targetRole || 'Target Application'}
                  </p>
                </Link>

                {item.keywords && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.keywords.slice(0, 2).map((k, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">{item.lastUpdated}</span>
                <Link
                  href={`/resume/${item.id}`}
                  className="font-medium text-foreground inline-flex items-center gap-1 group-hover:underline"
                >
                  <span>Open</span>
                  <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this tailored resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget?.name}</strong>? Your Master Resume will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

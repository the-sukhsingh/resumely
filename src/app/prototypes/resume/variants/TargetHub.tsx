'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PrototypeResumeItem } from '../data';
import {
  Search,
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  Target,
  LayoutGrid,
  List,
  ChevronRight,
  Zap,
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

interface TargetHubProps {
  resumes: PrototypeResumeItem[];
  userName?: string;
  userId?: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
  onDelete?: (id: string) => Promise<void>;
  onDuplicate?: (item: PrototypeResumeItem) => Promise<void>;
  onCreated?: (versionId: Id<'resumeVersions'>) => void;
}

export default function TargetHub({
  resumes,
  userName = 'Sukhjit',
  userId,
  masterResumeId,
  onDelete,
  onDuplicate,
  onCreated,
}: TargetHubProps) {
  const [items, setItems] = useState<PrototypeResumeItem[]>(resumes);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<PrototypeResumeItem | null>(null);

  React.useEffect(() => {
    setItems(resumes);
  }, [resumes]);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.targetRole && item.targetRole.toLowerCase().includes(search.toLowerCase())) ||
    (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())))
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
        toast.success(`Cloned version for ${item.name}`);
      }
    } catch {
      toast.error('Failed to duplicate version');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-[#0c0d0e] text-foreground font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        
        {/* Top Command Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold">
                <Target className="size-3" /> Job Pipeline
              </span>
              <span className="text-xs text-muted-foreground">· {tailored.length} Active Targets</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Application Hub</h1>
          </div>

          <div className="flex items-center gap-2.5">
            {userId && masterResumeId ? (
              <AddJobDescriptionDialog
                buttonLabel="Tailor for New Job"
                userId={userId}
                masterResumeId={masterResumeId}
                onCreated={onCreated}
              />
            ) : (
              <button
                type="button"
                onClick={() => toast.info('New Job Tailoring flow')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-sm active:scale-[0.97] transition-all cursor-pointer"
              >
                <Zap className="size-3.5 fill-current" />
                <span>Tailor for New Job</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Resume Spotlight Banner */}
        {master && (
          <div className="mb-8 p-4 md:p-5 rounded-xl border border-blue-500/20 bg-linear-to-r from-blue-500/5 via-card to-background shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                  MR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold tracking-tight">{master.name}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Anchor Profile
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Synced source for skills, history, and achievements ({master.metrics.experiences} jobs · {master.metrics.skills} skills)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/resume/${master.id}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 hover:bg-muted/70 active:scale-[0.98] transition-all"
                >
                  Manage Master Data
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search, Filter & Layout Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role, company, or keyword (e.g. Next.js)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-card border border-border/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* View Switcher */}
            <div className="inline-flex p-0.5 rounded-lg border border-border/80 bg-muted/30">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                title="Grid view"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'list' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                title="List view"
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tailored.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 hover:border-blue-500/40 bg-card hover:shadow-md transition-all duration-200 p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {item.matchScore ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span>{item.matchScore}%</span>
                          <span className="font-sans font-normal text-[10px] text-muted-foreground">ATS match</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Ready
                        </span>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="size-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem asChild>
                          <Link href={`/resume/${item.id}`} className="flex items-center gap-2">
                            <span>Open Editor</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(item)} className="flex items-center gap-2">
                          <Copy className="size-3.5" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteTarget(item)} className="text-destructive">
                          <Trash2 className="size-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Link href={`/resume/${item.id}`} className="block">
                    <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {item.targetCompany ? `${item.targetRole} · ${item.targetCompany}` : item.targetRole}
                    </p>
                  </Link>

                  {/* Keyword Pills */}
                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {item.keywords.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
                        >
                          {kw}
                        </span>
                      ))}
                      {item.keywords.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                          +{item.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-[11px]">{item.lastUpdated}</span>
                  <Link
                    href={`/resume/${item.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:underline"
                  >
                    <span>Launch</span>
                    <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* View Mode: List */
          <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
            <div className="divide-y divide-border/60">
              {tailored.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    {item.matchScore ? (
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 w-12 text-center">
                        {item.matchScore}%
                      </span>
                    ) : null}
                    <div>
                      <Link href={`/resume/${item.id}`} className="font-semibold text-sm hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.targetRole} {item.targetCompany && `· ${item.targetCompany}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-xs font-mono text-muted-foreground">{item.lastUpdated}</span>
                    <Link
                      href={`/resume/${item.id}`}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-border/80 hover:bg-muted"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this version?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong className="text-foreground">{deleteTarget?.name}</strong> from your pipeline? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

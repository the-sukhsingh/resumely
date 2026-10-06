'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { Id } from '../../../convex/_generated/dataModel';
import { X, ChevronDown, SlidersHorizontal, Check } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';
import { Menu, Dashboard, SearchDuo, AddCircle, ExternalLinkDuo } from '@/components/icons';
import AnimatedSwitcher from '@/components/custom/animated-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Props {
  applications: TrackedJobApplication[];
  search: string;
  onSearchChange: (search: string) => void;
  viewMode: 'board' | 'list';
  onViewModeChange: (mode: 'board' | 'list') => void;
  stageFilter: string;
  onStageFilterChange: (stage: string) => void;
  userId: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
}

const STAGE_KEYS: JobStage[] = [
  'saved',
  'applied',
  'interviewing',
  'offered',
  'rejected',
  'archived',
];

export default function JobTrackerHeader({
  applications,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  stageFilter,
  onStageFilterChange,
  userId,
  masterResumeId,
}: Props) {
  // Compute metric stats
  const totalCount = applications.length;
  const savedCount = applications.filter((a) => a.stage === 'saved').length;
  const appliedCount = applications.filter((a) => a.stage === 'applied').length;
  const interviewCount = applications.filter((a) => a.stage === 'interviewing').length;
  const offerCount = applications.filter((a) => a.stage === 'offered').length;
  const rejectedCount = applications.filter((a) => a.stage === 'rejected').length;
  const archivedCount = applications.filter((a) => a.stage === 'archived').length;

  const stageCounts: Record<string, number> = useMemo(() => {
    return {
      all: totalCount,
      saved: savedCount,
      applied: appliedCount,
      interviewing: interviewCount,
      offered: offerCount,
      rejected: rejectedCount,
      archived: archivedCount,
    };
  }, [totalCount, savedCount, appliedCount, interviewCount, offerCount, rejectedCount, archivedCount]);

  const activeStageConfig = stageFilter !== 'all' ? STAGE_CONFIGS[stageFilter as JobStage] : null;

  return (
    <div className="w-full space-y-8">
      {/* ─── Hero Anchor Card (Redesigned to match /resume Header) ─── */}
      <section className="group relative rounded-[30px] bg-linear-to-b from-card/90 to-card/40 dark:from-card/40 dark:to-card/10 p-5 sm:p-6 transition-all duration-200 shadow-xs overflow-hidden outline-2 outline-white dark:outline-black">
        {/* Soft ambient glow blobs matching /resume */}
        <div className={cn('absolute inset-0 blur-2xl pointer-events-none')}>
          <span className="size-100 rounded-full bg-violet-200/50 dark:bg-violet-400/20 inline-flex absolute -left-5 -translate-y-1/2" />
          <span className="size-100 rounded-full bg-emerald-200/50 dark:bg-emerald-400/10 inline-flex absolute -right-5 -translate-y-1/3" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    Job Tracker
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track applications from link to offer, with 1-click resume tailoring and ATS match metrics
                </p>
              </div>

              {/* Structured Stat Chips matching /resume pattern */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-foreground/90">
                  <strong className="text-foreground font-semibold">{totalCount}</strong>
                  <span className="text-muted-foreground">tracked</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-foreground/90">
                  <strong className="text-foreground font-semibold">{savedCount}</strong>
                  <span className="text-muted-foreground">saved</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-foreground/90">
                  <strong className="text-foreground font-semibold">{appliedCount}</strong>
                  <span className="text-muted-foreground">applied</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-foreground/90">
                  <strong className="text-foreground font-semibold">{interviewCount}</strong>
                  <span className="text-muted-foreground">interviewing</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-foreground/90">
                  <strong className="text-foreground font-semibold">{offerCount}</strong>
                  <span className="text-muted-foreground">offers</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs matching /resume pattern */}
          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0 flex-wrap">
            <AddTrackedJobDialog
              userId={userId}
              masterResumeId={masterResumeId}
              trigger={
                <ColoredButton color="amber" className="px-5 rounded-full active:scale-[0.97]" size="lg">
                  <span className="inline-flex items-center mr-1.5">
                    <AddCircle size={16} />
                  </span>
                  <span>Track New Job</span>
                </ColoredButton>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── Controls Section Bar (mirrors /resume section header) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        {/* Left: Section Title, Resumes Link, and View Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Tracked Roles
            </h3>
            <Link
              href="/resume"
              prefetch={true}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 transition-colors border border-border/40"
            >
              <span>Manage Resumes</span>
              <ExternalLinkDuo className="size-3" />
            </Link>
          </div>

          <AnimatedSwitcher
            value={viewMode}
            onChange={onViewModeChange}
            items={[
              { value: 'list', label: 'List', icon: Menu, title: 'List Table view' },
              { value: 'board', label: 'Board', icon: Dashboard, title: 'Kanban Board view' },
            ]}
          />
        </div>

        {/* Right: Stage Filter (in list view, on left side of search) & Search Input */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {/* Stage Filter Dropdown (shown in list view, on left side of search) */}
          {viewMode === 'list' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1.5 h-8.5 px-3 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none border outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 active:scale-[0.98]',
                    stageFilter === 'all'
                      ? 'border-border/70 bg-card/80 text-muted-foreground hover:text-foreground hover:bg-muted/40 shadow-2xs'
                      : 'border-foreground/30 bg-muted/70 text-foreground ring-1 ring-foreground/10 shadow-2xs'
                  )}
                  title="Filter jobs by stage"
                >
                  {activeStageConfig ? (
                    <>
                      <span className={cn('size-2 rounded-full shrink-0', activeStageConfig.dotClass)} />
                      <span className="font-medium text-foreground">{activeStageConfig.shortLabel}</span>
                      <span className="font-mono text-[10px] text-muted-foreground px-1 py-0.2 rounded-full bg-muted/60">
                        {stageCounts[stageFilter] ?? 0}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStageFilterChange('all');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            onStageFilterChange('all');
                          }
                        }}
                        className="size-3.5 rounded-full hover:bg-foreground/10 inline-flex items-center justify-center -mr-0.5 ml-0.5 transition-colors cursor-pointer"
                        title="Clear stage filter"
                      >
                        <X className="size-2.5 text-muted-foreground hover:text-foreground" />
                      </span>
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="size-3 text-muted-foreground shrink-0" />
                      <span>All Stages</span>
                      <span className="font-mono text-[10px] text-muted-foreground px-1 py-0.2 rounded-full bg-muted/60">
                        {stageCounts.all}
                      </span>
                      <ChevronDown className="size-3 text-muted-foreground/70 ml-0.5 shrink-0" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-xl border-border/60 bg-popover/95 backdrop-blur-xl shadow-lg z-50"
              >
                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                  <span>Filter by Stage</span>
                  {stageFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStageFilterChange('all');
                      }}
                      className="text-primary hover:underline lowercase text-[10px] cursor-pointer"
                    >
                      reset
                    </button>
                  )}
                </div>

                {/* All Stages option */}
                <DropdownMenuItem
                  onClick={() => onStageFilterChange('all')}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors',
                    stageFilter === 'all' ? 'bg-muted/70 font-medium' : 'hover:bg-muted/40'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full border border-muted-foreground/40 bg-muted/30" />
                    <span>All Stages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {stageCounts.all}
                    </span>
                    {stageFilter === 'all' && <Check className="size-3.5 text-foreground shrink-0" />}
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-border/40" />

                {/* Stage List Options */}
                {STAGE_KEYS.map((key) => {
                  const cfg = STAGE_CONFIGS[key];
                  const isSelected = stageFilter === key;
                  const count = stageCounts[key] ?? 0;
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => onStageFilterChange(key)}
                      className={cn(
                        'flex items-center justify-between px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors',
                        isSelected ? 'bg-muted/70 font-medium' : 'hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full shrink-0', cfg.dotClass)} />
                        <span>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
                        {isSelected && <Check className="size-3.5 text-foreground shrink-0" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px] sm:w-64">
            <SearchDuo className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-2 rounded-full bg-card/80 border border-border/70 focus:outline-none focus:ring-1 focus:ring-foreground/25 focus:border-foreground/30 text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


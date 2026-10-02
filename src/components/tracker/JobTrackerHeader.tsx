'use client';

import React from 'react';
import { JobStage, STAGE_CONFIGS, TrackedJobApplication } from './types';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { Id } from '../../../convex/_generated/dataModel';
import { Search, X, Plus } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';
import { cn } from '@/lib/utils';
import { Menu } from '@duo-icons/react';
import { Dashboard } from '@duo-icons/react';
import AnimatedSwitcher from '@/components/custom/animated-switcher';

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

export default function JobTrackerHeader({
  applications,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  userId,
  masterResumeId,
}: Props) {
  // Compute metric stats
  const totalCount = applications.length;
  const savedCount = applications.filter((a) => a.stage === 'saved').length;
  const appliedCount = applications.filter((a) => a.stage === 'applied').length;
  const interviewCount = applications.filter((a) => a.stage === 'interviewing').length;
  const offerCount = applications.filter((a) => a.stage === 'offered').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Integrated Stats */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground indent-0.5">
          <span>Application Pipeline</span>
          <span className="text-border">/</span>
          <span>Live Sync</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-1">
          Job Tracker
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
          Track applications from link to offer, with 1-click resume tailoring and ATS match metrics.
        </p>

        {/* Integrated Stat Chips (matching the Master Resume pattern) */}
        <div className="flex flex-wrap items-center gap-2 pt-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90">
            <strong className="text-foreground font-semibold">{totalCount}</strong>
            <span className="text-muted-foreground">tracked</span>
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90">
            <strong className="text-foreground font-semibold">{savedCount}</strong>
            <span className="text-muted-foreground">saved</span>
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90">
            <strong className="text-foreground font-semibold">{appliedCount}</strong>
            <span className="text-muted-foreground">applied</span>
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90">
            <strong className="text-foreground font-semibold">{interviewCount}</strong>
            <span className="text-muted-foreground">interviewing</span>
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/90">
            <strong className="text-foreground font-semibold">{offerCount}</strong>
            <span className="text-muted-foreground">offers</span>
          </span>
        </div>
      </div>

      {/* Controls Bar: View Mode Switcher on Left, Search & "+ Track New Job" on Right (mirroring /resume) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* View Mode Switcher (List vs Board) */}
        <div className="flex items-center gap-2 shrink-0">
          <AnimatedSwitcher
            value={viewMode}
            onChange={onViewModeChange}
            items={[
              { value: 'list', label: 'List', icon: Menu, title: 'List Table view' },
              { value: 'board', label: 'Board', icon: Dashboard, title: 'Kanban Board view' },
            ]}
          />
        </div>

        {/* Search Input & Action Button Grouped together */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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

          <AddTrackedJobDialog
            userId={userId}
            masterResumeId={masterResumeId}
            trigger={
              <ColoredButton
                color="amber"
                size="default"
                className="rounded-full px-4 text-xs font-medium shrink-0"
              >
                <Plus className="size-3.5 mr-1" />
                <span>Track New Job</span>
              </ColoredButton>
            }
          />
        </div>
      </div>
    </div>
  );
}

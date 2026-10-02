'use client';

import React from 'react';
import { JobStage, STAGE_CONFIGS, TrackedJobApplication } from './types';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { Id } from '../../../convex/_generated/dataModel';
import { Search, X, LayoutGrid, List, Plus } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';
import { cn } from '@/lib/utils';
import { Menu } from '@duo-icons/react';
import { Dashboard } from '@duo-icons/react';
import { motion, AnimatePresence } from 'motion/react';
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

  const statItems = [
    { label: 'Total Tracked', count: totalCount, filterKey: 'all', dot: 'bg-foreground' },
    { label: 'Saved for later', count: savedCount, filterKey: 'saved', dot: 'bg-slate-400' },
    { label: 'Applied', count: appliedCount, filterKey: 'applied', dot: 'bg-blue-500' },
    { label: 'Interviewing', count: interviewCount, filterKey: 'interviewing', dot: 'bg-amber-500' },
    { label: 'Offers', count: offerCount, filterKey: 'offered', dot: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <AddTrackedJobDialog
            userId={userId}
            masterResumeId={masterResumeId}
            trigger={
              <ColoredButton
                color="amber"
                size="default"
                className="rounded-full px-4 text-xs font-medium"
              >
                <Plus className="size-3.5 mr-1" />
                <span>Track New Job</span>
              </ColoredButton>
            }
          />
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {statItems.map((item) => {
          const isActive = stageFilter === item.filterKey;
          return (
            <button
              key={item.filterKey}
              type="button"
              onClick={() => onStageFilterChange(item.filterKey)}
              className={cn(
                'flex flex-col p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer shadow-2xs select-none active:scale-[0.98]',
                isActive
                  ? 'border-foreground/30 bg-muted/40 ring-1 ring-foreground/20'
                  : 'border-border/60 bg-card/40 hover:bg-muted/20 hover:border-border/90'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground truncate">
                  {item.label}
                </span>
                <span className={cn('size-1.5 rounded-full shrink-0', item.dot)} />
              </div>
              <span className="text-xl font-semibold font-mono text-foreground mt-1">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Stage Filter Pills, View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by company or role..."
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

        {/* View Mode Switcher (Board vs List) */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <motion.div className="flex p-0.5 bg-muted/40 rounded-full border border-border/50 ">

            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              title="Kanban Board view"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer relative',
              )}
            >
              <AnimatePresence mode='wait'>
                {viewMode === 'board' && <motion.span
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }
                  }}
                  layoutId='tabbg' className='absolute inset-0 bg-background rounded-full shadow-2xs'></motion.span>}
              </AnimatePresence>
              <span className='flex items-center gap-1.5 relative'>

                <Dashboard size={16} />
                <span>Board</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              title="List Table view"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer relative',

              )}
            >
              <AnimatePresence mode='wait'>
                {viewMode === 'list' && <motion.span
                  transition={{
                    layout: {
                      // Spring Effect
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }
                  }}
                  layoutId='tabbg' className='absolute inset-0 bg-background rounded-full shadow-2xs'></motion.span>}
              </AnimatePresence>
              <span className='flex items-center gap-1.5 relative'>
                <Menu size={16} />
                <span>List</span>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );

}

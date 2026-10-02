'use client';

import React from 'react';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import JobCard from './JobCard';
import { Id } from '../../../convex/_generated/dataModel';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  applications: TrackedJobApplication[];
  onSelectApplication: (application: TrackedJobApplication) => void;
  userId: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
}

interface ColumnDef {
  id: string;
  label: string;
  stages: JobStage[];
  colorDot: string;
  headerBorder: string;
  defaultStage: JobStage;
}

const KANBAN_COLUMNS: ColumnDef[] = [
  {
    id: 'saved',
    label: 'Saved for later',
    stages: ['saved'],
    colorDot: 'bg-slate-400',
    headerBorder: 'border-slate-500/30',
    defaultStage: 'saved',
  },
  {
    id: 'applied',
    label: 'Applied',
    stages: ['applied'],
    colorDot: 'bg-blue-500',
    headerBorder: 'border-blue-500/30',
    defaultStage: 'applied',
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    stages: ['interviewing'],
    colorDot: 'bg-amber-500',
    headerBorder: 'border-amber-500/30',
    defaultStage: 'interviewing',
  },
  {
    id: 'offered',
    label: 'Offer',
    stages: ['offered'],
    colorDot: 'bg-emerald-500',
    headerBorder: 'border-emerald-500/30',
    defaultStage: 'offered',
  },
  {
    id: 'closed',
    label: 'Rejected / Archived',
    stages: ['rejected', 'archived'],
    colorDot: 'bg-neutral-400',
    headerBorder: 'border-neutral-500/30',
    defaultStage: 'rejected',
  },
];

export default function JobKanbanBoard({
  applications,
  onSelectApplication,
  userId,
  masterResumeId,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
      {KANBAN_COLUMNS.map((col) => {
        const colApps = applications.filter((app) => col.stages.includes(app.stage));

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl bg-card/40 border border-border/60 overflow-hidden shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn('size-2 rounded-full shrink-0', col.colorDot)} />
                <h3 className="font-semibold text-xs text-foreground tracking-tight truncate">
                  {col.label}
                </h3>
                <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.2 rounded-full bg-muted/70 border border-border/40">
                  {colApps.length}
                </span>
              </div>

              {/* Quick Add Button to this specific column stage */}
              <AddTrackedJobDialog
                userId={userId}
                masterResumeId={masterResumeId}
                initialStage={col.defaultStage}
                trigger={
                  <button
                    type="button"
                    title={`Add job to ${col.label}`}
                    className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                }
              />
            </div>

            {/* Column Cards Container */}
            <div className="p-2.5 space-y-2.5 min-h-[160px] max-h-[calc(100vh-280px)] overflow-y-auto">
              {colApps.length === 0 ? (
                <div className="h-28 rounded-xl border border-dashed border-border/60 flex flex-col items-center justify-center p-3 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">No roles</p>
                  <AddTrackedJobDialog
                    userId={userId}
                    masterResumeId={masterResumeId}
                    initialStage={col.defaultStage}
                    trigger={
                      <button
                        type="button"
                        className="text-[10px] text-primary hover:underline mt-1 font-medium cursor-pointer"
                      >
                        + Add for {col.label.toLowerCase()}
                      </button>
                    }
                  />
                </div>
              ) : (
                colApps.map((app, idx) => (
                  <JobCard
                    key={app._id}
                    application={app}
                    index={idx}
                    onSelect={onSelectApplication}
                    masterResumeId={masterResumeId}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

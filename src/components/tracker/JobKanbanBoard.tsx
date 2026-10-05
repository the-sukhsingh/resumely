'use client';

import React, { useState } from 'react';
import { TrackedJobApplication, JobStage } from './types';
import JobCard from './JobCard';
import { Id } from '../../../convex/_generated/dataModel';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { AddCircle } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { AnimatePresence } from 'motion/react';

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
  defaultStage: JobStage;
}

const KANBAN_COLUMNS: ColumnDef[] = [
  {
    id: 'saved',
    label: 'Saved for later',
    stages: ['saved'],
    colorDot: 'bg-slate-400',
    defaultStage: 'saved',
  },
  {
    id: 'applied',
    label: 'Applied',
    stages: ['applied'],
    colorDot: 'bg-blue-500',
    defaultStage: 'applied',
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    stages: ['interviewing'],
    colorDot: 'bg-amber-500',
    defaultStage: 'interviewing',
  },
  {
    id: 'offered',
    label: 'Offer',
    stages: ['offered'],
    colorDot: 'bg-emerald-500',
    defaultStage: 'offered',
  },
  {
    id: 'closed',
    label: 'Rejected / Archived',
    stages: ['rejected', 'archived'],
    colorDot: 'bg-neutral-400',
    defaultStage: 'rejected',
  },
];

export default function JobKanbanBoard({
  applications,
  onSelectApplication,
  userId,
  masterResumeId,
}: Props) {
  const updateStage = useMutation(api.jobTracker.updateJobApplicationStage);

  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dragOverColId === colId) {
        setDragOverColId(null);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent, col: ColumnDef) => {
    e.preventDefault();
    setDragOverColId(null);
    setDraggedAppId(null);

    const appId = e.dataTransfer.getData('text/plain') as Id<'jobApplications'>;
    if (!appId) return;

    const app = applications.find((a) => a._id === appId);
    if (!app) return;

    if (col.stages.includes(app.stage)) return;

    try {
      await updateStage({
        applicationId: appId,
        stage: col.defaultStage,
      });
      toast.success(`Moved to "${col.label}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to move job');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start w-full">
      {KANBAN_COLUMNS.map((col) => {
        const colApps = applications.filter((app) => col.stages.includes(app.stage));
        const isOver = dragOverColId === col.id;
        const isDraggedHere =
          draggedAppId &&
          !col.stages.includes(
            applications.find((a) => a._id === draggedAppId)?.stage || 'saved'
          );

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col)}
            className={cn(
              'min-w-0 flex flex-col rounded-2xl bg-card/40 dark:bg-neutral-900/40 border border-border/50 overflow-hidden shadow-2xs transition-colors duration-150 ',
              isOver && 'border-primary/40 bg-accent/8 ring-1 ring-primary/30'
            )}
          >
            {/* Clean Column Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={cn('size-2 rounded-full shrink-0', col.colorDot)} />
                <h3 className="font-semibold text-xs text-foreground tracking-tight truncate">
                  {col.label}
                </h3>
                <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.2 rounded-full bg-muted/70 border border-border/40 shrink-0">
                  {colApps.length}
                </span>
              </div>

              {/* Quick Add Button */}
              <AddTrackedJobDialog
                userId={userId}
                masterResumeId={masterResumeId}
                initialStage={col.defaultStage}
                trigger={
                  <button
                    type="button"
                    title={`Add job to ${col.label}`}
                    className="size-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <AddCircle className="size-3.5" />
                  </button>
                }
              />
            </div>

            {/* Column Cards Container */}
            <div className="p-2 space-y-2.5 min-h-[140px] max-h-[calc(100vh-270px)] overflow-y-auto scrollbar-thin">
              {colApps.length === 0 ? (
                /* Quiet, clean empty state */
                <div
                  className={cn(
                    'h-24 rounded-xl border border-dashed flex flex-col items-center justify-center p-2.5 text-center transition-colors',
                    isOver
                      ? 'border-primary/50 bg-primary/[0.04] text-primary'
                      : 'border-border/40 hover:border-border/70 bg-muted/[0.03]'
                  )}
                >
                  {isOver ? (
                    <span className="text-xs font-medium text-primary">Drop here</span>
                  ) : (
                    <>
                      <p className="text-[11px] text-muted-foreground/70 font-medium">No roles</p>
                      <AddTrackedJobDialog
                        userId={userId}
                        masterResumeId={masterResumeId}
                        initialStage={col.defaultStage}
                        trigger={
                          <button
                            type="button"
                            className="text-[10px] text-primary/80 hover:text-primary hover:underline mt-1 font-medium cursor-pointer inline-flex items-center gap-1"
                          >
                            <AddCircle className="size-3" />
                            <span>Add job</span>
                          </button>
                        }
                      />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {colApps.map((app, idx) => (
                      <JobCard
                        key={app._id}
                        application={app}
                        index={idx}
                        onSelect={onSelectApplication}
                        masterResumeId={masterResumeId}
                        onDragStart={(id) => setDraggedAppId(id)}
                        onDragEnd={() => {
                          setDraggedAppId(null);
                          setDragOverColId(null);
                        }}
                        isDragging={draggedAppId === app._id}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Drop zone indicator when dragging over an active column */}
                  {isOver && isDraggedHere && (
                    <div className="h-10 rounded-xl border border-dashed border-primary/50 bg-primary/[0.04] flex items-center justify-center text-xs text-primary font-medium animate-pulse">
                      Drop here
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

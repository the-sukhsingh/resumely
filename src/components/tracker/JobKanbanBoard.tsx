'use client';

import React, { useState } from 'react';
import { TrackedJobApplication, JobStage, STAGE_CONFIGS } from './types';
import JobJourneyRow from './JobJourneyRow';
import { Id } from '../../../convex/_generated/dataModel';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { AddCircle } from '@/components/icons';
import { Sparkles, MapPin, Compass, Trophy, Send, Bookmark, MessageSquare, Plus } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';
import { cn } from '@/lib/utils';

interface Props {
  applications: TrackedJobApplication[];
  onSelectApplication: (application: TrackedJobApplication) => void;
  userId: Id<'users'>;
  masterResumeId?: Id<'resumeVersions'>;
}

export default function JobKanbanBoard({
  applications,
  onSelectApplication,
  userId,
  masterResumeId,
}: Props) {
  // Metric counts
  const savedCount = applications.filter((a) => a.stage === 'saved').length;
  const appliedCount = applications.filter((a) => a.stage === 'applied').length;
  const interviewCount = applications.filter((a) => a.stage === 'interviewing').length;
  const offerCount = applications.filter((a) => a.stage === 'offered').length;

  return (
    <div className="w-full space-y-4">
      {/* ─── Journey Pipeline Summary & Legend Bar ─── */}
      <div className="rounded-2xl border border-border/50 bg-card/40 dark:bg-card/15 backdrop-blur-md px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        {/* Left: Journey Overview Info */}
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Compass className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-tight flex items-center gap-2">
              <span>Interactive Pipeline Journey</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-muted/80 text-muted-foreground border border-border/40">
                {applications.length} {applications.length === 1 ? 'Role' : 'Roles'}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Drag the glowing pinpoint along the path to advance stages, or click any checkpoint
            </p>
          </div>
        </div>

        {/* Right: Milestone Legend Chips & Quick Add */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <span className="size-1.5 rounded-full bg-slate-400" />
              <span>Saved ({savedCount})</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <span className="size-1.5 rounded-full bg-blue-500" />
              <span>Applied ({appliedCount})</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>Interviewing ({interviewCount})</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 border border-border/40">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Offer ({offerCount})</span>
            </span>
          </div>

          <AddTrackedJobDialog
            userId={userId}
            masterResumeId={masterResumeId}
            initialStage="saved"
            trigger={
              <button
                type="button"
                className="h-8 px-3 rounded-full text-xs font-medium border border-border/70 bg-card hover:bg-muted/60 text-foreground transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.97]"
              >
                <Plus className="size-3.5" />
                <span>Track Role</span>
              </button>
            }
          />
        </div>
      </div>

      {/* ─── Journey Rows Container ─── */}
      {applications.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/60 bg-muted/[0.04] p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="size-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground">
            <Compass className="size-6 text-muted-foreground/80" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">No job applications found</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Track a new job posting or adjust your search filters to view your application journeys.
            </p>
          </div>
          <AddTrackedJobDialog
            userId={userId}
            masterResumeId={masterResumeId}
            trigger={
              <ColoredButton color="amber" size="default" className="rounded-full px-5 text-xs font-medium mt-2">
                <Plus className="size-3.5 mr-1" />
                <span>Track New Job</span>
              </ColoredButton>
            }
          />
        </div>
      ) : (
        /* Journey Full-Width Rows */
        <div className="space-y-3.5">
          {applications.map((app, index) => (
            <JobJourneyRow
              key={app._id}
              application={app}
              index={index}
              onSelect={onSelectApplication}
              masterResumeId={masterResumeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
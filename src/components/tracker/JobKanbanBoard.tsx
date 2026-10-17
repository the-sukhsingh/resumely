'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrackedJobApplication } from './types';
import JobJourneyRow from './JobJourneyRow';
import { Id } from '../../../convex/_generated/dataModel';
import AddTrackedJobDialog from './AddTrackedJobDialog';
import { Compass, Plus } from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';

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
  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-3xl border border-dashed border-border/60 bg-muted/[0.03] p-12 text-center flex flex-col items-center justify-center space-y-3"
      >
        <div className="size-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground">
          <Compass className="size-6 text-muted-foreground/80" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">No job applications tracked yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Track a new job posting link to visualize its journey from application to offer.
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="w-full space-y-3.5 origin-center"
    >
      {applications.map((app, index) => (
        <JobJourneyRow
          key={app._id}
          application={app}
          index={index}
          onSelect={onSelectApplication}
          masterResumeId={masterResumeId}
        />
      ))}
    </motion.div>
  );
}
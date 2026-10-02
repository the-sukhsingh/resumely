'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { TrackedJobApplication } from '@/components/tracker/types';
import JobTrackerHeader from '@/components/tracker/JobTrackerHeader';
import JobKanbanBoard from '@/components/tracker/JobKanbanBoard';
import JobListView from '@/components/tracker/JobListView';
import JobDetailsDrawer from '@/components/tracker/JobDetailsDrawer';
import AddTrackedJobDialog from '@/components/tracker/AddTrackedJobDialog';
import { PaymentStatusDialog } from '@/components/resume/PaymentStatusDialog';
import Feedback from '@/components/custom/feedback';
import ColoredButton from '@/components/custom/colored-button';
import { Plus } from 'lucide-react';

export default function JobTrackerPage() {
  const { user } = useAuth();

  const masterResume = useQuery(
    api.masterResumes.getMasterResumeByUser,
    user ? { userId: user._id } : 'skip'
  );

  const applications = useQuery(
    api.jobTracker.getJobApplications,
    user ? { userId: user._id } : 'skip'
  );

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<TrackedJobApplication | null>(null);

  // Filter applications by search and stage
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    let list = applications as TrackedJobApplication[];

    // Stage filter
    if (stageFilter !== 'all') {
      list = list.filter((app) => app.stage === stageFilter);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.title.toLowerCase().includes(q) ||
          (app.location && app.location.toLowerCase().includes(q))
      );
    }

    return list;
  }, [applications, search, stageFilter]);

  // Keep selectedApplication synced with live database updates
  const activeSelectedApp = useMemo(() => {
    if (!selectedApplication || !applications) return null;
    return (applications as TrackedJobApplication[]).find((a) => a._id === selectedApplication._id) || selectedApplication;
  }, [selectedApplication, applications]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-muted-foreground text-sm gap-2">
        <p>Please log in to view and track your job applications.</p>
        <Link href="/" className="text-xs text-foreground underline underline-offset-4 hover:opacity-80">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <PaymentStatusDialog />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 noise opacity-50 bg-primary/5 dark:opacity-30" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 space-y-7">
        <Feedback />

        {/* Loading skeleton */}
        {applications === undefined ? (
          <div className="w-full space-y-6 animate-pulse">
            <div className="h-28 rounded-2xl bg-muted/40 border border-border/50" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="h-16 rounded-xl bg-muted/30" />
              <div className="h-16 rounded-xl bg-muted/30" />
              <div className="h-16 rounded-xl bg-muted/30" />
              <div className="h-16 rounded-xl bg-muted/30" />
              <div className="h-16 rounded-xl bg-muted/30" />
            </div>
            <div className="h-80 rounded-2xl bg-muted/20 border border-border/40" />
          </div>
        ) : applications.length === 0 ? (
          /* Zero tracked jobs state */
          <div className="space-y-6">
            <JobTrackerHeader
              applications={[]}
              search={search}
              onSearchChange={setSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              stageFilter={stageFilter}
              onStageFilterChange={setStageFilter}
              userId={user._id}
              masterResumeId={masterResume?._id}
            />

            {/* Onboarding Workbench Card */}
            <div className="relative rounded-3xl border border-border/70 bg-card/40 dark:bg-card/20 backdrop-blur-md overflow-hidden p-8 sm:p-12 text-center shadow-xs">
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                    Start Tracking Your Job Applications
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Paste a job posting URL to automatically extract the role, save it for later, or generate a tailored resume with matching ATS keywords.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <AddTrackedJobDialog
                    userId={user._id}
                    masterResumeId={masterResume?._id}
                    trigger={
                      <ColoredButton
                        color="amber"
                        size="default"
                        className="rounded-full px-5 text-xs font-medium"
                      >
                        <Plus className="size-3.5 mr-1" />
                        <span>Track From Job Link</span>
                      </ColoredButton>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Pipeline */
          <>
            <JobTrackerHeader
              applications={applications as TrackedJobApplication[]}
              search={search}
              onSearchChange={setSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              stageFilter={stageFilter}
              onStageFilterChange={setStageFilter}
              userId={user._id}
              masterResumeId={masterResume?._id}
            />

            {viewMode === 'board' ? (
              <JobKanbanBoard
                applications={filteredApplications}
                onSelectApplication={(app) => setSelectedApplication(app)}
                userId={user._id}
                masterResumeId={masterResume?._id}
              />
            ) : (
              <JobListView
                applications={filteredApplications}
                onSelectApplication={(app) => setSelectedApplication(app)}
                masterResumeId={masterResume?._id}
              />
            )}
          </>
        )}

        {/* Slide-out details drawer */}
        <JobDetailsDrawer
          application={activeSelectedApp}
          open={Boolean(selectedApplication)}
          onClose={() => setSelectedApplication(null)}
          masterResumeId={masterResume?._id}
        />
      </main>
    </div>
  );
}

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
import { AnimatePresence, motion } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';

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

    // Stage filter applies in list view
    if (viewMode === 'list' && stageFilter !== 'all') {
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
  }, [applications, search, stageFilter, viewMode]);

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

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 space-y-4">
        <Feedback />

        {/* Loading skeleton */}
        {applications === undefined ? (
          <div className="w-full space-y-6">
            {/* Header skeleton */}
            <div className="p-4 sm:p-5 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-stretch justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-6 w-36 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-64 rounded-md" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <Skeleton className="h-9 w-44 rounded-xl" />
                <Skeleton className="h-9 w-28 rounded-xl" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>


            {/* Journey rows skeleton */}
            <div className="space-y-3.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden"
                >
                  {/* Left Side: Job Details */}
                  <div className="lg:w-80 flex flex-col justify-between gap-4 shrink-0 lg:border-r border-border/40 lg:pr-6">
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-10 rounded-2xl shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-3.5 w-24 rounded-md" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                  </div>

                  {/* Right Side: Journey Track */}
                  <div className="flex-1 flex flex-col justify-center relative min-h-[96px] py-2">
                    <div className="relative w-full h-12 flex items-center justify-between px-6">
                      <Skeleton className="absolute left-6 right-6 h-1 rounded-full" />
                      <Skeleton className="size-4 rounded-full relative z-10" />
                      <Skeleton className="size-4 rounded-full relative z-10" />
                      <Skeleton className="size-4 rounded-full relative z-10" />
                      <Skeleton className="size-4 rounded-full relative z-10" />
                      <Skeleton className="size-4 rounded-full relative z-10" />
                    </div>
                    <div className="flex items-center justify-between px-4 pt-1">
                      <Skeleton className="h-3 w-10 rounded-md" />
                      <Skeleton className="h-3 w-12 rounded-md" />
                      <Skeleton className="h-3 w-16 rounded-md" />
                      <Skeleton className="h-3 w-10 rounded-md" />
                      <Skeleton className="h-3 w-12 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

            <AnimatePresence mode="popLayout" initial={false}>
              {viewMode === 'board' ? (
                <motion.div
                  key="board-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.33, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full origin-center"
                >
                  <JobKanbanBoard
                    applications={filteredApplications}
                    onSelectApplication={(app) => setSelectedApplication(app)}
                    userId={user._id}
                    masterResumeId={masterResume?._id}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.33, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full origin-center"
                >
                  <JobListView
                    applications={filteredApplications}
                    totalApplicationsCount={applications.length}
                    onSelectApplication={(app) => setSelectedApplication(app)}
                    masterResumeId={masterResume?._id}
                    userId={user._id}
                    stageFilter={stageFilter}
                    onResetStageFilter={() => setStageFilter('all')}
                    search={search}
                    onClearSearch={() => setSearch('')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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

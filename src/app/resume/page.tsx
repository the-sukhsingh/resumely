'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import ResumeVersionList from '@/components/ResumeVersionList';
import AddJobDescriptionDialog from '@/components/AddJobDescriptionDialog';
import { PaymentStatusDialog } from '@/components/resume/PaymentStatusDialog';

export default function ResumePage() {
  const { user } = useAuth();
  const resume = useQuery(
    api.masterResumes.getMasterResumeByUser,
    user ? { userId: user._id } : 'skip'
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-muted-foreground text-sm gap-2">
        <p>Please log in to view and manage your resumes.</p>
        <Link href="/" className="text-xs text-foreground underline underline-offset-4 hover:opacity-80">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <PaymentStatusDialog />
      
      {/* Subtle, soft ambient background */}
      <div className="pointer-events-none fixed inset-0 noise opacity-20 dark:opacity-30" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Workspace</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Hi, {user.name?.split(' ')[0] ?? 'there'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Maintain your master profile and generate tailored resumes for specific job descriptions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {resume && (
              <AddJobDescriptionDialog
                buttonLabel="Tailor for Job"
                userId={user._id}
                masterResumeId={resume._id}
              />
            )}
          </div>
        </header>

        {/* Resume Version List */}
        <ResumeVersionList userId={user._id} />
      </main>
    </div>
  );
}

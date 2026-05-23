'use client';

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
      <>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
          Please log in to view your resumes.
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto max-w-5xl border-x border-border/50">
      <PaymentStatusDialog />
      <div className='absolute inset-0 noise dark:opacity-40'></div>
      <div className='bg-background relative z-50 h-full min-h-screen pt-14'>

        {/* Top bar */}
        <div className="w-full ">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
            <div className="text-xl font-medium text-muted-foreground">
              Hi, <span className="text-foreground font-semibold ">{user.name?.split(' ')[0] ?? 'there'}</span>
            </div>
            {resume && (
              <AddJobDescriptionDialog
                userId={user._id}
                masterResumeId={resume._id}
              />
            )}
          </div>
        </div>

        {/* Main layout */}
        {/* Left: version list */}
        <div className="flex flex-1 gap-4 p-4 min-h-0 h-full">
          <div className="flex-1 shrink-0 flex flex-col gap-3">
            <ResumeVersionList
              userId={user._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

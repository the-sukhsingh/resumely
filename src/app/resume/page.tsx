'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ResumeVersionList from '@/components/ResumeVersionList';
import { PaymentStatusDialog } from '@/components/resume/PaymentStatusDialog';

export default function ResumePage() {
  const { user } = useAuth();

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
      <div className="pointer-events-none fixed inset-0 noise opacity-50 bg-primary/5 dark:opacity-30"
      >
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24">

        {/* Resume Version List */}
        <ResumeVersionList userId={user._id} />
      </main>
    </div>
  );
}

'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ResumeUploader from './ResumeUploader';
import { cn } from '@/lib/utils';
import Feedback from './custom/feedback';

interface Props {
  userId: Id<'users'>;
}

export default function ResumeVersionList({ userId }: Props) {
  const versions = useQuery(api.resumeVersions.getResumeVersionsByUser, { userId });

  const deleteVersion = useMutation(api.resumeVersions.deleteResumeVersion);

  const deleteResume = async (id: Id<'resumeVersions'>) => {
    // Ask for confirmation before deleting
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    await deleteVersion({ versionId: id as Id<'resumeVersions'> });
  };

  const masterResume = versions?.find((v) => v.isMasterResume);
  const otherVersions = (versions ?? []).filter((v) => !v.isMasterResume).sort((a, b) => b._creationTime - a._creationTime);

  const items = [
    ...(masterResume ? [{ id: masterResume._id, label: masterResume.name ?? 'Master Resume', ...masterResume }] : []),
    ...otherVersions.map((v) => ({ id: v._id, label: v.name ?? 'Untitled Version', ...v })),
  ];

  const totalRenders = items.length === 0 ? 6 : items.length + 1;
  const emptySlotsCount = Math.max(0, 7 - totalRenders);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-5xl mx-auto">
      <Feedback />
      {items.length === 0 ? (
        <>
        <div className="h-44 text-sm text-muted-foreground text-center">
          <ResumeUploader userId={userId} />
        </div>
          <Link
            href="/resume/create"
            className="group relative flex flex-col justify-center items-center px-4 py-4 h-44 rounded-xl cursor-pointer bg-[#f0f0f0]/60 dark:bg-[#202020ce]/60 hover:bg-[#f7f7f7]/80 dark:hover:bg-[#202020]/80 border border-dashed border-border/80 dark:border-border/40 hover:border-primary/50 dark:hover:border-primary/40 transition-colors shadow-sm"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="size-6 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <p className="text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                  Create from Scratch
                </p>
                <p className="text-xs text-muted-foreground mt-1 transition-colors">
                  Start building a new resume
                </p>
              </div>
            </div>
          </Link>
        </>
      ) : (
        items.map((item) => (
          <Link
            href={`/resume/${item.id}`}
            key={item.id}
            className="group relative grid grid-cols-5 px-4 py-4 h-44 rounded-xl cursor-pointer bg-[#f0f0f0] dark:bg-[#202020ce] backdrop-blur-sm transition-colors hover:bg-[#f7f7f7] dark:hover:bg-[#202020] shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] outline-[#f3f3f3] dark:outline-[#202020] ring-[#f3f3f3] dark:ring-[#202020] "
          >
            <div className="col-span-4 flex flex-col flex-1 justify-between items-start">
              <div className="flex flex-col ">
                <span className="text-lg font-medium text-foreground/90 group-hover:text-foreground">
                  {item.label}
                </span>
              </div>
            </div>

            <div className="col-span-1 flex flex-col justify-between items-end shrink-0">
              <div className={cn(
                item.isMasterResume ? 'opacity-0 pointer-events-none' : 'opacity-100',
              )}>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    deleteResume(item.id);
                  }}
                  variant="ghost"
                  size="icon"
                  className="size-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-out delay-100 group-focus-visible:opcity-100 group-focus:opacity-100 group-focus-within:opacity-100 focus-visible:ring-0"
                >
                  <svg viewBox="0 0 24 24" className='size-full' fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M3 6.38597C3 5.90152 3.34538 5.50879 3.77143 5.50879L6.43567 5.50832C6.96502 5.49306 7.43202 5.11033 7.61214 4.54412C7.61688 4.52923 7.62232 4.51087 7.64185 4.44424L7.75665 4.05256C7.8269 3.81241 7.8881 3.60318 7.97375 3.41617C8.31209 2.67736 8.93808 2.16432 9.66147 2.03297C9.84457 1.99972 10.0385 1.99986 10.2611 2.00002H13.7391C13.9617 1.99986 14.1556 1.99972 14.3387 2.03297C15.0621 2.16432 15.6881 2.67736 16.0264 3.41617C16.1121 3.60318 16.1733 3.81241 16.2435 4.05256L16.3583 4.44424C16.3778 4.51087 16.3833 4.52923 16.388 4.54412C16.5682 5.11033 17.1278 5.49353 17.6571 5.50879H20.2286C20.6546 5.50879 21 5.90152 21 6.38597C21 6.87043 20.6546 7.26316 20.2286 7.26316H3.77143C3.34538 7.26316 3 6.87043 3 6.38597Z" className="fill-[#000000] dark:fill-[#ffffff]" /> <path d="M9.42543 11.4815C9.83759 11.4381 10.2051 11.7547 10.2463 12.1885L10.7463 17.4517C10.7875 17.8855 10.4868 18.2724 10.0747 18.3158C9.66253 18.3592 9.29499 18.0426 9.25378 17.6088L8.75378 12.3456C8.71256 11.9118 9.01327 11.5249 9.42543 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd" /> <path d="M14.5747 11.4815C14.9868 11.5249 15.2875 11.9118 15.2463 12.3456L14.7463 17.6088C14.7051 18.0426 14.3376 18.3592 13.9254 18.3158C13.5133 18.2724 13.2126 17.8855 13.2538 17.4517L13.7538 12.1885C13.795 11.7547 14.1625 11.4381 14.5747 11.4815Z" className="fill-[#000000] dark:fill-[#ffffff]" fillRule="evenodd" clipRule="evenodd" /> <path opacity="0.3" d="M11.5956 22.0001H12.4044C15.1871 22.0001 16.5785 22.0001 17.4831 21.1142C18.3878 20.2283 18.4803 18.7751 18.6654 15.8686L18.9321 11.6807C19.0326 10.1037 19.0828 9.31524 18.6289 8.81558C18.1751 8.31592 17.4087 8.31592 15.876 8.31592H8.12405C6.59127 8.31592 5.82488 8.31592 5.37105 8.81558C4.91722 9.31524 4.96744 10.1037 5.06788 11.6807L5.33459 15.8686C5.5197 18.7751 5.61225 20.2283 6.51689 21.1142C7.42153 22.0001 8.81289 22.0001 11.5956 22.0001Z" className="fill-[#000000] dark:fill-[#ffffff]" /> </g></svg>
                </Button>
              </div>
              <div className="size-5">
                <svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0" /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" className='fill-[#323232] dark:fill-[#b8b8b8]' /> <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" /> <path d="M16 12L8 12" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M13 15L15.913 12.087V12.087C15.961 12.039 15.961 11.961 15.913 11.913V11.913L13 9" className='stroke-[#323232] dark:stroke-[#b8b8b8]' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
              </div>
            </div>
          </Link>
        ))
      )}

     

      {emptySlotsCount > 0 && (
        <>
          {Array.from({ length: emptySlotsCount }, (_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-muted/20 dark:bg-muted/10 border border-dashed border-border"
            >
            </div>
          ))}
        </>
      )}
    </div>
  );
}
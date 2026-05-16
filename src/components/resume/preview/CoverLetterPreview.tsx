import React from 'react';
import { ResumeData } from '@/types/resume';
import Markdown from 'react-markdown';

interface CoverLetterPreviewProps {
  resumeData: ResumeData;
}

export default function CoverLetterPreview({ resumeData }: CoverLetterPreviewProps) {
  const coverLetter = resumeData?.coverLetter;
  
  return (
    <div className="nobar bg-sidebar rounded-lg h-full w-full overflow-y-auto flex justify-center py-8">
      <div className="w-full max-w-[210mm] min-h-[297mm]  bg-white dark:bg-[#1c1c1c] shadow-md p-[20mm] rounded-sm text-black dark:text-neutral-100 ring-1 ring-neutral-200 dark:ring-neutral-800">
        {/* <header className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            {resumeData.personalInfo.name}
          </h1>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            {resumeData.personalInfo.email && (
              <span className="flex items-center gap-1">
                {resumeData.personalInfo.email}
              </span>
            )}
            {resumeData.personalInfo.phone && (
              <span className="flex items-center gap-1">
                {resumeData.personalInfo.phone}
              </span>
            )}
            {resumeData.personalInfo.location && (
              <span className="flex items-center gap-1">
                {resumeData.personalInfo.location}
              </span>
            )}
            {resumeData.personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                {resumeData.personalInfo.linkedin}
              </span>
            )}
          </div>
        </header> */}
        
        <div className="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-300 leading-[1.4] wrap-break-word overflow-hidden w-full max-w-full [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:break-all">
          {coverLetter ? <Markdown>{coverLetter}</Markdown> : (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 italic mt-20 space-y-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-12 h-12 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>No cover letter content found. Use the Agent to generate a cover letter.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

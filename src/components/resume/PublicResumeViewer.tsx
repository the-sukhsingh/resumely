'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { ResumeData } from '@/types/resume';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ColoredButton from '@/components/custom/colored-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Link2,
  Check,
  Printer,
  ChevronDown,
  FileText,
  Edit3,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { createPdfBlob } from '@/lib/pdf/create-pdf-blob';
import { createBlobUrl } from '@/lib/pdf/create-blob-url';
import { createPdfToImage } from '@/lib/pdf/create-pdf-to-image';
import { downloadFile } from '@/lib/pdf/download-file';
import CoverLetterPreview from './preview/CoverLetterPreview';

// Dynamically import ResumePreview with ssr: false due to browser canvas and pdfjs-dist
const ResumePreview = dynamic(() => import('@/components/resume/preview/resume-preview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[600px] w-full">
      <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
        <div className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-mono">Rendering resume preview...</span>
      </div>
    </div>
  ),
});

interface PublicResumeViewerProps {
  resumeId: string;
}

export default function PublicResumeViewer({ resumeId }: PublicResumeViewerProps) {
  const resume = useQuery(api.resumeVersions.getPublicResumeVersion, {
    resumeId,
  });
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<'resume' | 'cover-letter'>('resume');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  // Loading skeleton
  if (resume === undefined) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl w-full mx-auto space-y-6">
          <div className="h-14 rounded-2xl bg-muted/40 border border-border/60 animate-pulse flex items-center justify-between px-6" />
          <div className="w-full max-w-[210mm] mx-auto min-h-[297mm] rounded-2xl bg-card/40 border border-border/60 p-8 space-y-6 animate-pulse">
            <div className="h-8 w-1/3 bg-muted/50 rounded-lg" />
            <div className="h-4 w-1/2 bg-muted/30 rounded-lg" />
            <div className="space-y-3 pt-6">
              <div className="h-4 w-full bg-muted/30 rounded-md" />
              <div className="h-4 w-5/6 bg-muted/30 rounded-md" />
              <div className="h-4 w-4/6 bg-muted/30 rounded-md" />
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-6 w-1/4 bg-muted/40 rounded-lg" />
              <div className="h-20 w-full bg-muted/20 rounded-xl" />
              <div className="h-20 w-full bg-muted/20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (resume === null) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md shadow-lg">
          <div className="size-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <FileText className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Resume Not Found</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This resume link may be invalid, removed, or no longer available.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button variant="default" className="rounded-full px-6 text-xs h-9 font-medium shadow-xs">
                Back to Resumely Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const typedResume = resume as unknown as ResumeData & {
    _id: string;
    userId: string;
    isMasterResume?: boolean;
    name?: string;
  };

  const candidateName = typedResume.personalInfo?.name || typedResume.name || 'Candidate Resume';
  const hasCoverLetter = Boolean(typedResume.coverLetter && typedResume.coverLetter.trim().length > 0);
  const isOwner = user && user._id === typedResume.userId;

  const handleCopyLink = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/r/${resumeId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Resume link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const blob = await createPdfBlob({ resumeData: typedResume, theme: 'classic' });
      const url = createBlobUrl({ blob });
      const link = document.createElement('a');
      link.href = url;
      link.download = `${candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Resume PDF downloaded!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsDownloadingImage(true);
    try {
      const pdfBlob = await createPdfBlob({ resumeData: typedResume, theme: 'classic' });
      const imgBlob = await createPdfToImage({ pdfBlob, scale: 3 });
      const url = createBlobUrl({ blob: imgBlob });
      downloadFile({ url, fileName: `${candidateName.replace(/\s+/g, '_')}_Resume.png` });
      toast.success('Resume image downloaded!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleViewPdf = async () => {
    try {
      const blob = await createPdfBlob({ resumeData: typedResume, theme: 'classic' });
      const url = createBlobUrl({ blob });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-muted/30 text-foreground flex flex-col pt-14 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Background ambient texture */}
      <div className="pointer-events-none fixed inset-0 noise opacity-40 dark:opacity-20" />

      {/* Floating Action Subheader */}
      <div className="sticky top-12 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-all shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: Candidate info & optional tabs */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm sm:text-base text-foreground truncate tracking-tight">
                {candidateName}
              </span>
              {typedResume.name && typedResume.name !== candidateName && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/70 truncate max-w-[180px]">
                  {typedResume.name}
                </span>
              )}
            </div>

            {hasCoverLetter && (
              <Tabs
                value={activeView}
                onValueChange={(v) => setActiveView(v as 'resume' | 'cover-letter')}
                className="hidden sm:inline-flex ml-2"
              >
                <TabsList className="h-8 p-0.5 rounded-lg bg-muted/60 border border-border/60">
                  <TabsTrigger value="resume" className="text-xs h-7 px-2.5 rounded-md">
                    Resume
                  </TabsTrigger>
                  <TabsTrigger value="cover-letter" className="text-xs h-7 px-2.5 rounded-md">
                    Cover Letter
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Owner Edit Button */}
            {isOwner && (
              <Link href={`/resume/${resumeId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg border-border/70 hover:bg-muted text-xs font-medium gap-1.5 active:scale-[0.97]"
                >
                  <Edit3 className="size-3.5" />
                  <span className="hidden sm:inline">Edit Resume</span>
                </Button>
              </Link>
            )}

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy shareable link"
              className="h-8 px-2.5 rounded-lg border border-border/70 bg-card hover:bg-muted/70 active:scale-[0.97] transition-all text-xs font-medium text-foreground flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500 animate-in fade-in" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="size-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            {/* Primary Download Button & Dropdown Group */}
            <div className="flex items-center rounded-lg shadow-xs overflow-hidden border border-border/60">
              <ColoredButton
                color="amber"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="rounded-none! h-8 px-3 text-xs font-medium flex items-center gap-1.5 active:scale-[0.98]"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3.5" />
                    <span>Download</span>
                  </>
                )}
              </ColoredButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ColoredButton
                    color="amber"
                    size="sm"
                    className="rounded-none! border-l border-amber-600/20 dark:border-amber-400/20 h-8 px-1.5"
                  >
                    <ChevronDown className="size-3.5" />
                  </ColoredButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleViewPdf} className="cursor-pointer gap-2">
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                      <span>View PDF in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDownloadImage}
                      disabled={isDownloadingImage}
                      className="cursor-pointer gap-2"
                    >
                      <Download className="size-3.5 text-muted-foreground" />
                      <span>{isDownloadingImage ? 'Generating Image...' : 'Download as PNG Image'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint} className="cursor-pointer gap-2">
                      <Printer className="size-3.5 text-muted-foreground" />
                      <span>Print Resume</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Toggle (if cover letter present) */}
      {hasCoverLetter && (
        <div className="sm:hidden w-full px-4 pt-3 flex justify-center">
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as 'resume' | 'cover-letter')}
            className="w-full max-w-xs"
          >
            <TabsList className="w-full h-8 p-0.5 rounded-lg bg-card border border-border/60">
              <TabsTrigger value="resume" className="flex-1 text-xs h-7 rounded-md">
                Resume
              </TabsTrigger>
              <TabsTrigger value="cover-letter" className="flex-1 text-xs h-7 rounded-md">
                Cover Letter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Main Canvas Document Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-6 sm:py-8 px-2 sm:px-6 flex flex-col items-center">
        <div className="w-full flex justify-center">
          {activeView === 'resume' ? (
            <div className="w-full flex justify-center">
              <ResumePreview resumeData={typedResume} theme="classic" />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <CoverLetterPreview resumeData={typedResume} />
            </div>
          )}
        </div>

        {/* Footer / Resumely Attribution CTA */}
        {!isOwner && (
          <footer className="mt-12 text-center pb-8 space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border/70 bg-card/80 hover:bg-card text-[11px] font-medium text-muted-foreground hover:text-foreground shadow-2xs transition-all active:scale-[0.98]"
            >
              <Sparkles className="size-3 text-amber-500" />
              <span>Created with Resumely • Build your resume free</span>
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ResumeData } from '@/types/resume';
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
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { createPdfBlob } from '@/lib/pdf/create-pdf-blob';
import { createBlobUrl, revokeBlobUrl } from '@/lib/pdf/create-blob-url';
import { createPdfToImage } from '@/lib/pdf/create-pdf-to-image';
import { downloadFile } from '@/lib/pdf/download-file';

// Fallback logic preview if browser PDF element cannot be loaded
const ResumePreview = dynamic(() => import('@/components/resume/preview/resume-preview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[600px] w-full">
      <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
        <div className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-mono">Loading resume...</span>
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

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [copied, setCopied] = useState(false);

  const typedResume = resume as unknown as ResumeData & {
    _id: string;
    userId: string;
    isMasterResume?: boolean;
    name?: string;
  };

  const candidateName = typedResume?.personalInfo?.name || typedResume?.name || 'Resume';

  // Generate browser PDF blob URL
  useEffect(() => {
    if (!resume) return;

    let active = true;
    let createdUrl: string | null = null;
    setIsGeneratingPdf(true);
    setPdfError(false);

    (async () => {
      try {
        const blob = await createPdfBlob({ resumeData: typedResume, theme: 'classic' });
        if (!active) return;
        createdUrl = createBlobUrl({ blob });
        setPdfUrl(createdUrl);
      } catch (err) {
        console.error('Failed to generate browser PDF blob:', err);
        if (active) {
          setPdfError(true);
        }
      } finally {
        if (active) {
          setIsGeneratingPdf(false);
        }
      }
    })();

    return () => {
      active = false;
      if (createdUrl) {
        revokeBlobUrl({ url: createdUrl });
      }
    };
  }, [resume]);

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

  const handleViewPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      return;
    }
    void (async () => {
      try {
        const blob = await createPdfBlob({ resumeData: typedResume, theme: 'classic' });
        const url = createBlobUrl({ blob });
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error opening PDF:', error);
        toast.error('Failed to open PDF');
      }
    })();
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading skeleton
  if (resume === undefined) {
    return (
      <div className="h-screen w-full bg-background flex flex-col p-4">
        <div className="h-14 w-full rounded-xl bg-muted/40 border border-border/60 animate-pulse mb-4" />
        <div className="flex-1 w-full rounded-xl bg-muted/20 border border-border/60 animate-pulse" />
      </div>
    );
  }

  // Not found state
  if (resume === null) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center p-4">
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

  return (
    <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="shrink-0 h-14 w-full border-b border-border/60 bg-background/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30">
        {/* Candidate Name Only (No badge, no cover letter tab) */}
        <div className="flex items-center min-w-0 pr-4">
          <h1 className="font-semibold text-base sm:text-lg text-foreground tracking-tight truncate">
            {candidateName}
          </h1>
        </div>

        {/* Action Buttons: Copy Link & Download (No Edit Resume button) */}
        <div className="flex items-center gap-2 shrink-0">
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
      </header>

      {/* Main Content: Browser PDF Element with Fallback */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
        {isGeneratingPdf && !pdfUrl ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
              <div className="size-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <span className="text-xs font-mono">Loading PDF viewer...</span>
            </div>
          </div>
        ) : pdfUrl && !pdfError ? (
          /* Browser Native PDF Element */
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title={`${candidateName} Resume`}
            onError={() => setPdfError(true)}
          />
        ) : (
          /* Fallback using custom preview logic */
          <div className="w-full h-full overflow-y-auto py-8 flex justify-center">
            <ResumePreview resumeData={typedResume} theme="classic" />
          </div>
        )}
      </main>
    </div>
  );
}

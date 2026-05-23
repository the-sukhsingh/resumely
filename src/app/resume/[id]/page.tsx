'use client';

import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import ChatPanel from '@/components/resume/ChatPanel';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMemo, useRef, useState, useEffect } from 'react';
import { EditorForm } from '@/components/resume/editor/EditorForm';
import { ResumeData, ResumeSettings } from '@/types/resume';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SettingsPanel, { DEFAULT_SETTINGS } from '@/components/resume/SettingsPanel';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
const ResumePreview = dynamic(() => import('@/components/resume/preview/resume-preview'), { ssr: false });
import CoverLetterPreview from '@/components/resume/preview/CoverLetterPreview';
import { Clipboard, Message2, Settings } from '@duo-icons/react';
import { createPdfBlob } from '@/lib/pdf/create-pdf-blob';
import { createBlobUrl } from '@/lib/pdf/create-blob-url';
import Manager from '@/components/resume/preview/manager';
import { downloadFile } from '@/lib/pdf/download-file';
import { createPdfToImage } from '@/lib/pdf/create-pdf-to-image';

export default function ResumeVersionPage() {
  const { id } = useParams<{ id: string }>();
  const resume = useQuery(api.resumeVersions.getResumeVersionById, {
    versionId: id as Id<'resumeVersions'>,
  });


  if (resume === undefined) {
    return (
      <>
        <div className='h-dvh p-3 space-y-2 fixed inset-0 z-20 flex flex-col pt-14'>

          <div className="flex gap-2 flex-1">
            <Skeleton className="flex-1 h-full rounded-lg" />
            <Skeleton className="w-130 h-full rounded-lg" />
          </div>
        </div>
      </>
    );
  }

  if (resume === null) {
    return (
      <>
        {/* TODO: Add Proper UI */}
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
          Resume not found.
          <Link href="/resume">
            <Button variant="link" className="ml-2">
              Back to list
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return <ResumeEditorContent key={resume._id} resume={resume} resumeId={id} />;
}

function ResumeEditorContent({
  resume,
  resumeId,
}: {
  resume: ResumeData & {
    _id: Id<'resumeVersions'>;
    masterResumeId?: Id<'resumeVersions'>;
  };
  resumeId: string;
}) {
  const [activeTab, setActiveTab] = useState<'editor' | 'agent' | 'setting'>('editor');
  const [activeView, setActiveView] = useState<'resume' | 'cover-letter'>('resume');
  const [draft, setDraft] = useState<ResumeData>(resume);
  const [previewDraft, setPreviewDraft] = useState<ResumeData>(resume);
  const isEditingRef = useRef(false);
  const editingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [settings, setSettings] = useState<ResumeSettings>(
    (resume as ResumeData & { settings?: ResumeSettings }).settings ?? DEFAULT_SETTINGS
  );

  const updateResumeVersion = useMutation(api.resumeVersions.updateResumeVersion);

  const debouncedPreviewUpdate = useMemo(
    () =>
      debounce((nextDraft: ResumeData) => {
        setPreviewDraft(nextDraft);
      }, 500),
    []
  );

  const debouncedSave = useMemo(
    () =>
      debounce(
        (nextDraft: ResumeData) => {
          const payload = {
            ...nextDraft,
            certifications: nextDraft.certifications ?? undefined,
            achievements: nextDraft.achievements ?? undefined,
          };
          void updateResumeVersion({
            versionId: resumeId as Id<'resumeVersions'>,
            ...payload,
            matchScore: undefined, // Don't save matchScore to version, it will be recalculated when needed
          });
        },
        3000
      ),
    [resumeId, updateResumeVersion]
  );

  // Sync preview (and draft) when Convex data changes externally (e.g. AI edits)
  useEffect(() => {
    if (isEditingRef.current) return;
    setDraft(resume);
    setPreviewDraft(resume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  const handleDraftChange = (nextDraft: ResumeData) => {
    // Mark as editing so the useEffect above doesn't overwrite local changes
    isEditingRef.current = true;
    if (editingTimerRef.current) clearTimeout(editingTimerRef.current);
    editingTimerRef.current = setTimeout(() => { isEditingRef.current = false; }, 5000);
    setDraft(nextDraft);
    debouncedPreviewUpdate(nextDraft);
    debouncedSave(nextDraft);
  };


  const handleDownloadPdf = async () => {
    const blob = await createPdfBlob({ resumeData: previewDraft, theme: resume.settings?.layout && resume.settings.layout === "two-column" ? "twoColumn" : "classic" });
    const newUrl = createBlobUrl({ blob });
    const link = document.createElement('a');
    link.href = newUrl;
    link.download = `${previewDraft.personalInfo.name || 'resume'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const pdfBlob = await createPdfBlob({ resumeData: previewDraft, theme: resume.settings?.layout && resume.settings.layout === "two-column" ? "twoColumn" : "classic" });
      const blob = await createPdfToImage({ pdfBlob, scale: 3 });
      const url = createBlobUrl({ blob });
      downloadFile({ url, fileName: `${previewDraft.personalInfo.name || 'resume'}.png` });
      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewPdf = async () => {
    const blob = await createPdfBlob({ resumeData: previewDraft, theme: resume.settings?.layout && resume.settings.layout === "two-column" ? "twoColumn" : "classic" });
    const url = createBlobUrl({ blob });
    window.open(url, '_blank');
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(previewDraft.coverLetter || '');
    // alert("Copied to clipboard")
  };

  return (
    <>
      <div className="flex flex-col h-dvh p-2 pt-14 bg-muted/80">
        <div className='absolute inset-0 noise dark:opacity-40'></div>

        <ResizablePanelGroup
          orientation="horizontal"
          className="w-full h-full gap-2"
        >
          <ResizablePanel minSize="32%" className='flex flex-col rounded-xl relative bg-background'>
            <div className='h-10 bg-background flex justify-between px-1' >
              <Manager resumeName={previewDraft.name} handleViewPdf={handleViewPdf} isDownloading={isDownloading} onDownloadPdf={handleDownloadPdf} onDownloadImage={handleDownloadImage} activeView={activeView} setActiveView={setActiveView} handleCopyCoverLetter={handleCopyCoverLetter}  />
            </div>
            {activeView === 'resume' ? (
              <ResumePreview resumeData={previewDraft} theme={resume.settings?.layout ?? "classic"} />
            ) : (
              <CoverLetterPreview resumeData={previewDraft} />
            )}
          </ResizablePanel>

          <ResizablePanel minSize="30%" defaultSize="35%" className='nobar relative pt-10 rounded-xl bg-background'>
            <Tabs defaultValue={activeTab} onValueChange={(val) => {
              setActiveTab(val as 'editor' | 'agent' | 'setting');
            }} className='absolute top-0 inset-x-0 border-b z-10' >
              <TabsList variant={"line"} className=''>
                <TabsTrigger value="editor">
                  <span className="flex items-center gap-2">
                    <Clipboard size={18} />
                    Editor
                  </span>
                </TabsTrigger>
                <TabsTrigger value="agent">
                  <span className="flex items-center gap-2">
                    <Message2 size={18} />
                    Agent
                  </span>
                </TabsTrigger>
                <TabsTrigger value="setting">
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    Settings
                  </span>
                </TabsTrigger>
              </TabsList>

            </Tabs>

            <div className={activeTab === 'editor' ? 'h-full' : 'hidden'}>
              <EditorForm data={draft} onChange={handleDraftChange} />
            </div>
            <div className={activeTab === 'agent' ? 'h-full' : 'hidden'}>
              <ChatPanel versionId={resumeId as Id<'resumeVersions'>} />
            </div>
            <div className={activeTab === 'setting' ? 'h-full' : 'hidden'}>
              <SettingsPanel
                resumeId={resumeId}
                settings={settings}
                onChange={setSettings}
              />
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </>
  );
}

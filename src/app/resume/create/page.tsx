'use client';

import { useMutation } from 'convex/react';
import { useAuth } from '@/context/AuthContext';
import { api } from '../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { EditorForm } from '@/components/resume/editor/EditorForm';
import { ResumeData, ResumeSettings } from '@/types/resume';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsPanel, { DEFAULT_SETTINGS } from '@/components/resume/SettingsPanel';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { Clipboard, Message2, Settings } from '@duo-icons/react';
import { createPdfBlob } from '@/lib/pdf/create-pdf-blob';
import { createBlobUrl } from '@/lib/pdf/create-blob-url';
import Manager from '@/components/resume/preview/manager';
import { downloadFile } from '@/lib/pdf/download-file';
import { createPdfToImage } from '@/lib/pdf/create-pdf-to-image';
import { toast } from 'sonner';

const ResumePreview = dynamic(() => import('@/components/resume/preview/resume-preview'), { ssr: false });

const INITIAL_RESUME: ResumeData = {
  name: "Master Resume",
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    website: "johndoe.dev",
  },
  summary: "A passionate software engineer with experience building modern web applications...",
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2024-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Developed and maintained responsive web applications using React and Next.js.",
        "Collaborated with cross-functional teams to deliver high-quality features ahead of schedule."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Cityville, ST",
      startDate: "2020-09",
      endDate: "2024-05",
      gpa: "3.8/4.0"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "HTML/CSS"]
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "Next.js", "Tailwind CSS", "Node.js"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-Commerce Platform",
      description: "A full-featured online store with cart, payments, and search capabilities.",
      technologies: ["Next.js", "React", "Tailwind CSS", "Convex"],
      link: "github.com/johndoe/ecommerce",
      bullets: [
        "Built dynamic storefront and product catalog pages optimized for SEO.",
        "Integrated secure payment processing using Stripe."
      ]
    }
  ],
  certifications: [],
  achievements: [],
  settings: {
    font: "Inter",
    layout: "one-column",
  }
};

export default function ResumeCreatePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<ResumeData | null>(null);
  const [previewDraft, setPreviewDraft] = useState<ResumeData | null>(null);
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_SETTINGS);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'agent' | 'setting'>('editor');
  const [activeView, setActiveView] = useState<'resume' | 'cover-letter'>('resume');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const createNewResume = useMutation(api.resumeVersions.createNewResume);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('resumely_create_resume_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ResumeData;
        setDraft(parsed);
        setPreviewDraft(parsed);
        if (parsed.settings) {
          setSettings(parsed.settings);
        }
      } catch (e) {
        console.error('Error parsing draft from localStorage:', e);
        setDraft(INITIAL_RESUME);
        setPreviewDraft(INITIAL_RESUME);
      }
    } else {
      setDraft(INITIAL_RESUME);
      setPreviewDraft(INITIAL_RESUME);
    }
  }, []);

  const debouncedPreviewUpdate = useMemo(
    () =>
      debounce((nextDraft: ResumeData) => {
        setPreviewDraft(nextDraft);
      }, 500),
    []
  );

  const handleDraftChange = (nextDraft: ResumeData) => {
    setDraft(nextDraft);
    debouncedPreviewUpdate(nextDraft);
    localStorage.setItem('resumely_create_resume_draft', JSON.stringify(nextDraft));
  };

  const handleSettingsChange = (nextSettings: ResumeSettings) => {
    setSettings(nextSettings);
    if (draft) {
      const nextDraft = { ...draft, settings: nextSettings };
      setDraft(nextDraft);
      setPreviewDraft(nextDraft);
      localStorage.setItem('resumely_create_resume_draft', JSON.stringify(nextDraft));
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please log in to save your resume.");
      return;
    }
    if (!draft) return;

    setIsSaving(true);
    const savePromise = createNewResume({
      userId: user._id,
      name: draft.name || "Untitled Resume",
      personalInfo: draft.personalInfo,
      summary: draft.summary || undefined,
      experience: draft.experience,
      education: draft.education,
      skills: draft.skills,
      projects: draft.projects,
      certifications: draft.certifications || undefined,
      achievements: draft.achievements || undefined,
      settings: settings,
    });

    toast.promise(savePromise, {
      loading: 'Saving your resume to database...',
      success: (newId) => {
        localStorage.removeItem('resumely_create_resume_draft');
        router.push(`/resume/${newId}`);
        return 'Resume saved successfully!';
      },
      error: () => 'Failed to save resume. Please try again.'
    });

    try {
      await savePromise;
    } catch (e) {
      console.error('Error saving resume:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewDraft) return;
    const blob = await createPdfBlob({ 
      resumeData: previewDraft, 
      theme: settings.layout === "two-column" ? "twoColumn" : "classic" 
    });
    const newUrl = createBlobUrl({ blob });
    const link = document.createElement('a');
    link.href = newUrl;
    link.download = `${previewDraft.personalInfo.name || 'resume'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadImage = async () => {
    if (!previewDraft) return;
    setIsDownloading(true);
    try {
      const pdfBlob = await createPdfBlob({ 
        resumeData: previewDraft, 
        theme: settings.layout === "two-column" ? "twoColumn" : "classic" 
      });
      const blob = await createPdfToImage({ pdfBlob, scale: 3 });
      const url = createBlobUrl({ blob });
      downloadFile({ url, fileName: `${previewDraft.personalInfo.name || 'resume'}.png` });
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewPdf = async () => {
    if (!previewDraft) return;
    const blob = await createPdfBlob({ 
      resumeData: previewDraft, 
      theme: settings.layout === "two-column" ? "twoColumn" : "classic" 
    });
    const url = createBlobUrl({ blob });
    window.open(url, '_blank');
  };

  const handleCopyCoverLetter = () => {
    if (!previewDraft) return;
    navigator.clipboard.writeText(previewDraft.coverLetter || '');
  };

  if (authLoading || !mounted || !draft || !previewDraft) {
    return (
      <div className='h-dvh p-3 space-y-2 fixed inset-0 z-20 flex flex-col pt-14'>
        <div className="flex gap-2 flex-1">
          <Skeleton className="flex-1 h-full rounded-lg" />
          <Skeleton className="w-130 h-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground pt-14">
        Please log in to build and save your resume.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh p-2 pt-14 bg-muted/80">
      <div className='absolute inset-0 noise dark:opacity-40'></div>

      <ResizablePanelGroup
        orientation="horizontal"
        className="w-full h-full gap-2"
      >
        <ResizablePanel minSize="32%" className='flex flex-col rounded-xl relative bg-background'>
          <div className='h-10 bg-background flex justify-between px-1' >
            <Manager 
              resumeName={previewDraft.name} 
              handleViewPdf={handleViewPdf} 
              isDownloading={isDownloading} 
              onDownloadPdf={handleDownloadPdf} 
              onDownloadImage={handleDownloadImage} 
              activeView={activeView} 
              setActiveView={setActiveView} 
              handleCopyCoverLetter={handleCopyCoverLetter}
              isCreateMode={true}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
          <ResumePreview resumeData={previewDraft} theme={settings.layout ?? "classic"} />
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
          
          <div className={activeTab === 'agent' ? 'h-full flex flex-col justify-center items-center p-6 text-center' : 'hidden'}>
            <div className="max-w-sm space-y-4">
              <div className="mx-auto size-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Message2 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">AI Resume Agent</h3>
              <p className="text-sm text-muted-foreground">
                Save your resume first to activate the AI Agent! Once saved, you can chat with the AI to tailor your resume, suggest bullet points, and calculate ATS scores.
              </p>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full mt-2"
              >
                {isSaving ? "Saving..." : "Save Resume & Activate Agent"}
              </Button>
            </div>
          </div>

          <div className={activeTab === 'setting' ? 'h-full' : 'hidden'}>
            <SettingsPanel
              resumeId="create"
              settings={settings}
              onChange={handleSettingsChange}
            />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}

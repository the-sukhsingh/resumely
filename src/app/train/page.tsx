'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ResumeData, ResumeTemplate } from '@/types/resume';
import { createPdfBlob } from '@/lib/pdf/create-pdf-blob';
import { createBlobUrl } from '@/lib/pdf/create-blob-url';
import { createPdfToImage } from '@/lib/pdf/create-pdf-to-image';
import { downloadFile } from '@/lib/pdf/download-file';
import { Button } from '@/components/ui/button';
import {
  FileDown,
  Image as ImageIcon,
  Eye,
  RefreshCw,
  Edit
} from 'lucide-react';
import ColoredButton from '@/components/custom/colored-button';

const ResumePreview = dynamic(() => import('@/components/resume/preview/resume-preview'), { ssr: false });

const MOCK_RESUME: ResumeData = {
  name: "Master Resume Draft",
  personalInfo: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 019-2834",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    website: "alexmorgan.dev",
  },
  summary: "Innovative and results-driven Senior Software Engineer with 6+ years of experience designing, building, and deploying highly scalable web applications and cloud architectures.",
  experience: [
    {
      id: "exp-1",
      company: "CloudScale Solutions",
      position: "Senior Software Engineer",
      location: "Seattle, WA",
      startDate: "2023-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and built a microservices-based analytics platform handling over 10M requests daily, reducing latency by 35%.",
        "Mentored a team of 4 junior developers and established modern CI/CD pipelines using GitHub Actions and AWS."
      ]
    },
    {
      id: "exp-2",
      company: "Innovate Tech",
      position: "Software Engineer II",
      location: "Boston, MA",
      startDate: "2020-06",
      endDate: "2023-02",
      current: false,
      bullets: [
        "Developed core features for a collaborative SaaS application using React, TypeScript, and Node.js.",
        "Optimized complex database queries in PostgreSQL, leading to a 20% improvement in load times."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Washington",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Seattle, WA",
      startDate: "2016-09",
      endDate: "2020-06",
      gpa: "3.9/4.0"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Go", "Python", "SQL"]
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"]
    },
    {
      category: "DevOps & Tools",
      items: ["AWS (S3, Lambda, EC2)", "Docker", "Git", "Kubernetes", "GraphQL"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Dynamic Portfolio Builder",
      description: "An open-source template editor allowing users to design and render portfolio sites programmatically.",
      technologies: ["Next.js", "Tailwind CSS", "Lexical Editor"],
      link: "github.com/alexmorgan/portfolio-builder",
      bullets: [
        "Implemented a drag-and-drop builder interface that handles component states dynamically.",
        "Configured direct export options to Vercel and Netlify APIs."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2024-02",
      link: ""
    }
  ],
  achievements: [],
  settings: {
    font: "Inter",
    layout: "one-column",
  }
};

const Page = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const loadResumeData = () => {
    try {
      const saved = localStorage.getItem('resumely_create_resume_draft');
      if (saved) {
        const parsed = JSON.parse(saved) as ResumeData;
        setResumeData(parsed);
        setIsUsingMock(false);
        if (parsed.settings?.layout === 'two-column') {
          setSelectedTemplate('twoColumn');
        } else {
          setSelectedTemplate('classic');
        }
        toast.success("Resume data successfully loaded from local storage!");
      } else {
        setResumeData(MOCK_RESUME);
        setIsUsingMock(true);
        setSelectedTemplate('classic');
        toast.info("No saved draft found. Using a demo template.", {
          duration: 4000
        });
      }
    } catch (e) {
      console.error('Error loading resume draft:', e);
      setResumeData(MOCK_RESUME);
      setIsUsingMock(true);
      setSelectedTemplate('classic');
      toast.error("Failed to load local storage draft. Loaded mock data.");
    }
  };

  useEffect(() => {
    setMounted(true);
    loadResumeData();
  }, []);

  const handleDownloadPdf = async () => {
    if (!resumeData) return;
    setIsDownloading(true);
    try {
      const blob = await createPdfBlob({
        resumeData,
        theme: selectedTemplate
      });
      const newUrl = createBlobUrl({ blob });
      const link = document.createElement('a');
      link.href = newUrl;
      link.download = `${resumeData.personalInfo.name || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!resumeData) return;
    setIsDownloadingImage(true);
    try {
      const pdfBlob = await createPdfBlob({
        resumeData,
        theme: selectedTemplate
      });
      const blob = await createPdfToImage({ pdfBlob, scale: 3 });
      const url = createBlobUrl({ blob });
      downloadFile({ url, fileName: `${resumeData.personalInfo.name || 'resume'}.png` });
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleViewPdf = async () => {
    if (!resumeData) return;
    try {
      const blob = await createPdfBlob({
        resumeData,
        theme: selectedTemplate
      });
      const url = createBlobUrl({ blob });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error("Failed to open PDF view. Please try again.");
    }
  };

  if (!mounted || !resumeData) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-muted/30 flex flex-col justify-center items-center gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Initializing PDF renderer...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-6 px-4 md:px-8 bg-linear-to-b from-background to-muted/20 relative flex flex-col items-center">
      <title>Resume PDF Preview | Resumely</title>
      {/* <div className="absolute inset-0 noise opacity-20 pointer-events-none z-0"></div> */}
      <div className='grid grid-cols-2 gap-4 items-center justify-center'>

        
        <ColoredButton className='rounded-full h-8 px-4' color='amber'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='blue'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='cyan'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='emerald'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='indigo'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='neutral'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='orange'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='pink'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='purple'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='rose'>Get Started</ColoredButton>
        <ColoredButton className='rounded-full h-8 px-4' color='teal'>Get Started</ColoredButton>
      </div>


      <div className="relative z-10 w-full max-w-4xl hidden flex-col gap-4 flex-1">
        {/* Unified Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-xs">

          {/* Left Actions & Status */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/resume/create')}
              className="h-8 gap-1.5 hover:bg-muted active:scale-95 transition-all text-xs font-semibold"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Resume
            </Button>

            <div className="flex items-center gap-2">
              {isUsingMock ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  Demo
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                  Synced
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={loadResumeData}
                title="Sync from Local Storage"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Center: Template Selector */}
          <div className="flex p-0.5 bg-muted/60 rounded-lg border border-border/20 shrink-0">
            <button
              onClick={() => setSelectedTemplate('classic')}
              className={`py-1 px-3 text-2xs font-semibold rounded-md transition-all ${selectedTemplate === 'classic'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Classic
            </button>
            <button
              onClick={() => setSelectedTemplate('twoColumn')}
              className={`py-1 px-3 text-2xs font-semibold rounded-md transition-all ${selectedTemplate === 'twoColumn'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Two-Column
            </button>
          </div>

          {/* Right Actions: Downloads */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <Button
              onClick={handleViewPdf}
              variant="ghost"
              size="icon"
              title="Open PDF in new tab"
              className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleDownloadImage}
              disabled={isDownloadingImage}
              variant="ghost"
              size="icon"
              title="Download PNG Image"
              className="h-8 w-8 text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-all"
            >
              {isDownloadingImage ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              variant="default"
              size="sm"
              className="h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm active:scale-95 transition-all gap-1.5"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              Download PDF
            </Button>
          </div>

        </div>

        {/* Clean Center Document Viewer */}
        <div className="flex-1 min-h-[500px] w-full bg-card/20 border border-border/80 rounded-2xl overflow-hidden shadow-xs relative flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex-1 overflow-hidden relative p-1 bg-neutral-900/5 dark:bg-neutral-950/15">
            <ResumePreview
              resumeData={resumeData}
              theme={selectedTemplate}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
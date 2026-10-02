import type { Metadata } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import PublicResumeViewer from '@/components/resume/PublicResumeViewer';

interface PageProps {
  params: Promise<{ id: string }>;
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const resume = await convex.query(api.resumeVersions.getPublicResumeVersion, {
      resumeId: id,
    });

    if (!resume) {
      return {
        title: 'Resume Not Found | Resumely',
        description: 'The requested resume could not be found.',
      };
    }

    const candidateName = resume.personalInfo?.name || resume.name || 'Candidate';
    const roleTitle = resume.experience?.[0]?.position;
    const title = roleTitle
      ? `${candidateName} - ${roleTitle} | Resumely`
      : `${candidateName}'s Resume | Resumely`;

    const description =
      resume.summary ||
      `View ${candidateName}'s professional resume on Resumely. ATS-friendly formatting and live preview.`;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beta.resumely.tech';
    const pageUrl = `${appUrl}/r/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'profile',
        siteName: 'Resumely',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for /r/[id]:', error);
    return {
      title: 'Resume | Resumely',
      description: 'View professional resume on Resumely.',
    };
  }
}

export default async function PublicResumePage({ params }: PageProps) {
  const { id } = await params;
  return <PublicResumeViewer resumeId={id} />;
}

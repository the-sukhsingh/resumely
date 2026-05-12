import { Resume } from './types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function exportResume(
  resumeId: Id<"resumeVersions">,
  format: 'pdf' | 'docx' | 'json' | 'txt'
): Promise<{ url: string; filename: string }> {
  return await client.action(api.resumeVersions.exportResume, {
    resumeId,
    format,
  });
}

export async function visitExternalSource(
  sourceType: 'linkedin' | 'github' | 'portfolio',
  url: string
): Promise<{
  data: any;
  extractedInfo: {
    skills?: string[];
    projects?: Array<{ name: string; description: string }>;
    experience?: Array<{ company: string; role: string; description: string }>;
  };
}> {
  return await client.action(api.resumeVersions.visitExternalSource, {
    sourceType,
    url,
  });
}

export async function askClarifyingQuestions(
  resume: Resume,
  context: string
): Promise<string[]> {
  return await client.action(api.resumeVersions.askClarifyingQuestions, {
    resume,
    context,
  });
}

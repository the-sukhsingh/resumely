import { Resume, JobDescription, MatchScore } from './types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function calculateMatchScore(
  resume: Resume,
  jobDescription: JobDescription
): Promise<MatchScore> {
  return await client.action(api.resumeVersions.calculateMatchScore, {
    resume,
    jobDescription,
  });
}

export async function identifyGaps(
  resume: Resume,
  jobDescription: JobDescription
): Promise<{
  missingSkills: string[];
  missingKeywords: string[];
  suggestions: string[];
}> {
  return await client.action(api.resumeVersions.identifyGaps, {
    resume,
    jobDescription,
  });
}

export async function atsChecker(resume: Resume): Promise<{
  score: number;
  issues: string[];
  recommendations: string[];
}> {
  return await client.action(api.resumeVersions.atsChecker, { resume });
}

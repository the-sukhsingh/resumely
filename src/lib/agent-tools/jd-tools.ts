import { JobDescription } from './types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function parseJobDescription(jdText: string): Promise<JobDescription> {
  return await client.action(api.jobDescriptions.parseJobDescription, { jdText });
}

export async function extractKeywords(jdText: string): Promise<string[]> {
  return await client.action(api.jobDescriptions.extractKeywords, { jdText });
}

export async function analyzeJobRequirements(jdText: string): Promise<{
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
}> {
  return await client.action(api.jobDescriptions.analyzeJobRequirements, { jdText });
}

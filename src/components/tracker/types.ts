import { Id } from '../../../convex/_generated/dataModel';

export type JobStage = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'archived';

export interface StageConfig {
  id: JobStage;
  label: string;
  shortLabel: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  dotClass: string;
}

export const STAGE_CONFIGS: Record<JobStage, StageConfig> = {
  saved: {
    id: 'saved',
    label: 'Saved for later',
    shortLabel: 'Saved',
    description: 'Saved roles to apply for later',
    colorClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-500/10 hover:bg-slate-500/20',
    borderClass: 'border-slate-500/20',
    badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    dotClass: 'bg-slate-400',
  },
  applied: {
    id: 'applied',
    label: 'Applied',
    shortLabel: 'Applied',
    description: 'Application submitted',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderClass: 'border-blue-500/20',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    dotClass: 'bg-blue-500',
  },
  interviewing: {
    id: 'interviewing',
    label: 'Interviewing',
    shortLabel: 'Interviewing',
    description: 'In active interview rounds',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/10 hover:bg-amber-500/20',
    borderClass: 'border-amber-500/20',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  offered: {
    id: 'offered',
    label: 'Offer Received',
    shortLabel: 'Offer',
    description: 'Job offer extended',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderClass: 'border-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    shortLabel: 'Rejected',
    description: 'Application declined',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-500/10 hover:bg-rose-500/20',
    borderClass: 'border-rose-500/20',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    dotClass: 'bg-rose-500',
  },
  archived: {
    id: 'archived',
    label: 'Archived',
    shortLabel: 'Archived',
    description: 'Withdrawn or closed',
    colorClass: 'text-neutral-500 dark:text-neutral-400',
    bgClass: 'bg-neutral-500/10 hover:bg-neutral-500/20',
    borderClass: 'border-neutral-500/20',
    badgeClass: 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-300 border-neutral-500/20',
    dotClass: 'bg-neutral-400',
  },
};

export interface TrackedJobApplication {
  _id: Id<'jobApplications'>;
  _creationTime: number;
  userId: Id<'users'>;
  company: string;
  title: string;
  stage: JobStage;
  jobUrl?: string | null;
  companyUrl?: string | null;
  location?: string | null;
  salary?: string | null;
  appliedAt?: number | null;
  deadline?: number | null;
  notes?: string | null;
  description?: string | null;
  jobDescriptionId?: Id<'jobDescriptions'> | null;
  resumeVersionId?: Id<'resumeVersions'> | null;
  tags?: string[];
  contacts?: Array<{
    name: string;
    role?: string | null;
    email?: string | null;
    phone?: string | null;
  }>;
  createdAt: number;
  updatedAt: number;
  resumeVersion?: {
    _id: Id<'resumeVersions'>;
    name: string;
    matchScore?: number | null;
    updatedAt: number;
  } | null;
  jobDescription?: {
    _id: Id<'jobDescriptions'>;
    description?: string | null;
    extractedSkills: string[];
    requirements: string[];
    responsibilities?: string[];
  } | null;
}

import type { ResumeTemplate as RegistryTemplate } from '@/components/resume/preview/variants/registry';

export type ResumeTemplate = RegistryTemplate;

export type PersonalInfo = {
  name: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
};



export type Experience = {
  id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  bullets: (string | null)[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  gpa?: string | null;
};

export type SkillCategory = {
  category: string;
  items: (string | null)[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: (string | null)[];
  link?: string | null;
  bullets: (string | null)[];
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date?: string | null;
  link?: string | null;
};

export type Certificate = Certification;

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary?: string | null;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications?: Certification[] | null;
  achievements?: Achievement[] | null;
  settings?: ResumeSettings;
  matchScore?: number | null;
  name?: string;
  coverLetter?: string | null;
};


export type ResumeSettings = {
  font: string;
  layout: 'one-column' | 'two-column';
}
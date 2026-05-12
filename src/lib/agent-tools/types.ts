export interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications?: Certification[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  bullets: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
  keywords: string[];
}

export interface MatchScore {
  overall: number;
  skillsMatch: number;
  experienceMatch: number;
  keywordMatch: number;
  suggestions: string[];
}

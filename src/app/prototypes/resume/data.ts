export interface PrototypeResumeItem {
  id: string;
  name: string;
  isMasterResume: boolean;
  targetRole?: string;
  targetCompany?: string;
  matchScore?: number;
  keywords?: string[];
  lastUpdated: string;
  metrics: {
    experiences: number;
    skills: number;
    projects: number;
  };
}

export const MOCK_RESUMES: PrototypeResumeItem[] = [
  {
    id: "master",
    name: "Master Resume",
    isMasterResume: true,
    targetRole: "Primary Profile & Baseline",
    lastUpdated: "Just now",
    metrics: {
      experiences: 4,
      skills: 14,
      projects: 5,
    },
  },
  {
    id: "v1",
    name: "Web Designer",
    isMasterResume: false,
    targetRole: "Senior UI/Web Designer",
    targetCompany: "Creative Agency & Studio",
    matchScore: 94,
    keywords: ["Figma", "Design Systems", "Tailwind CSS", "Micro-animations"],
    lastUpdated: "2h ago",
    metrics: {
      experiences: 3,
      skills: 8,
      projects: 4,
    },
  },
  {
    id: "v2",
    name: "Web Application Developer",
    isMasterResume: false,
    targetRole: "Frontend / Web App Engineer",
    targetCompany: "Modern SaaS Platform",
    matchScore: 89,
    keywords: ["Next.js 15", "TypeScript", "React 19", "State Management"],
    lastUpdated: "Yesterday",
    metrics: {
      experiences: 4,
      skills: 11,
      projects: 4,
    },
  },
  {
    id: "v3",
    name: "Full Stack Developer Intern",
    isMasterResume: false,
    targetRole: "Full Stack Engineering Intern",
    targetCompany: "Tech Incubator / Early Stage",
    matchScore: 92,
    keywords: ["Convex", "Next.js", "Node.js", "PostgreSQL"],
    lastUpdated: "3 days ago",
    metrics: {
      experiences: 2,
      skills: 9,
      projects: 3,
    },
  },
  {
    id: "v4",
    name: "Web Developer Intern",
    isMasterResume: false,
    targetRole: "Junior Web Developer",
    targetCompany: "Digital Products Team",
    matchScore: 86,
    keywords: ["JavaScript", "HTML/CSS", "Git", "REST APIs"],
    lastUpdated: "Sep 28",
    metrics: {
      experiences: 2,
      skills: 7,
      projects: 3,
    },
  },
  {
    id: "v5",
    name: "UI/UX Designer",
    isMasterResume: false,
    targetRole: "Product Designer (UI/UX)",
    targetCompany: "Fintech & Developer Tools",
    matchScore: 96,
    keywords: ["User Research", "Wireframing", "Figma", "Design Tokens"],
    lastUpdated: "Sep 24",
    metrics: {
      experiences: 3,
      skills: 10,
      projects: 4,
    },
  },
];

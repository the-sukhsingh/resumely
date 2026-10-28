// Typesafe ATS Matcher & Keyword Gap Engine

import { ResumeVersion } from "./storage";

export interface MatchAnalysis {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export const ResumelyMatcher = {
  TAXONOMY: [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Svelte",
    "Node.js", "Express", "NestJS", "Python", "Django", "FastAPI", "Flask",
    "Java", "Spring Boot", "Kotlin", "Go", "Golang", "Rust", "C++", "C#", ".NET",
    "PHP", "Laravel", "Ruby", "Ruby on Rails", "Swift", "React Native", "Flutter",
    "GraphQL", "REST APIs", "gRPC", "WebSockets", "Kafka", "RabbitMQ", "Redis",
    "PostgreSQL", "MySQL", "MongoDB", "Cassandra", "DynamoDB", "SQLite", "Convex", "Supabase",
    "AWS", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform",
    "CI/CD", "GitHub Actions", "GitLab CI", "Linux", "Serverless",
    "Tailwind CSS", "CSS3", "HTML5", "Sass", "Redux", "Zustand", "Webpack", "Vite",
    "Jest", "Vitest", "Cypress", "Playwright", "Mocha",
    "System Design", "Microservices", "Event-Driven", "Agile", "Scrum",
  ],

  normalize(str: string): string {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  },

  extractSkillsFromText(text: string): string[] {
    if (!text) return [];
    const lower = text.toLowerCase();
    const found: string[] = [];

    for (const skill of this.TAXONOMY) {
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const pattern = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
      if (pattern.test(lower)) {
        found.push(skill);
      }
    }
    return found;
  },

  extractResumeSkills(resume: ResumeVersion): string[] {
    const skillsSet = new Set<string>();

    if (Array.isArray(resume.skills)) {
      resume.skills.forEach((s) => {
        if (typeof s === "string") skillsSet.add(s);
      });
    } else if (resume.skills && typeof resume.skills === "object") {
      Object.values(resume.skills).forEach((val) => {
        if (Array.isArray(val)) {
          val.forEach((s) => typeof s === "string" && skillsSet.add(s));
        }
      });
    }

    if (resume.summary) {
      this.extractSkillsFromText(resume.summary).forEach((s) => skillsSet.add(s));
    }

    if (Array.isArray(resume.experience)) {
      resume.experience.forEach((exp) => {
        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((h) => {
            this.extractSkillsFromText(h).forEach((s) => skillsSet.add(s));
          });
        }
      });
    }

    return Array.from(skillsSet);
  },

  analyzeMatch(jobDescription: string, resume: ResumeVersion): MatchAnalysis {
    const jobSkills = this.extractSkillsFromText(jobDescription);
    const resumeSkills = this.extractResumeSkills(resume);

    if (jobSkills.length === 0) {
      return {
        score: 75,
        matchedSkills: resumeSkills.slice(0, 8),
        missingSkills: [],
        recommendations: ["Ensure your resume highlights quantifiable impact and metrics."],
      };
    }

    const resumeNormMap = new Map<string, string>();
    resumeSkills.forEach((s) => resumeNormMap.set(this.normalize(s), s));

    const matched: string[] = [];
    const missing: string[] = [];

    jobSkills.forEach((skill) => {
      const norm = this.normalize(skill);
      if (resumeNormMap.has(norm)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchRatio = matched.length / jobSkills.length;
    let score = Math.round(matchRatio * 100);
    score = Math.min(Math.max(score, 25), 98);

    const recommendations: string[] = [];
    if (missing.length > 0) {
      recommendations.push(
        `Consider incorporating high-signal keywords: ${missing.slice(0, 3).join(", ")}.`
      );
    } else {
      recommendations.push("Outstanding skill alignment! Tailor your project accomplishments to this specific role.");
    }

    return {
      score,
      matchedSkills: matched,
      missingSkills: missing,
      recommendations,
    };
  },

  generateTailoredPitch(job: { title?: string; company?: string }, resume: ResumeVersion): string {
    const name = resume.personalInfo?.name || "Candidate";
    const title = job.title || "Software Engineer";
    const company = job.company || "your team";

    return `Dear ${company} Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${title} position at ${company}. With a track record of architecting scalable applications and delivering customer-obsessed features, I am confident in my ability to immediately contribute to your engineering objectives.\n\nThroughout my career, I have focused on high-craft engineering, reliable system architecture, and shipping robust code that moves core business metrics. I admire ${company}'s commitment to quality and would love the opportunity to bring my background to your upcoming initiatives.\n\nThank you for your consideration, and I look forward to speaking soon.\n\nWarm regards,\n${name}`;
  },
};

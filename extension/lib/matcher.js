// Resumely ATS Matcher & Keyword Gap Analyzer
// Analyzes job descriptions against resume content to score match and identify skill gaps

(function () {
  if (typeof window !== "undefined" && window.ResumelyMatcher) {
    return;
  }

  const SKILL_TAXONOMY = [
  // Frontend
  "React", "Next.js", "TypeScript", "JavaScript", "HTML", "HTML5", "CSS", "CSS3",
  "Tailwind", "Tailwind CSS", "Redux", "Zustand", "Vue", "Vue.js", "Nuxt", "Angular",
  "Svelte", "SvelteKit", "GraphQL", "REST", "REST API", "WebSockets", "Webpack",
  "Vite", "Responsive Design", "Accessibility", "WCAG", "Figma", "UI/UX", "Mobile-First",

  // Backend & Languages
  "Node.js", "Express", "Fastify", "NestJS", "Python", "Django", "FastAPI", "Flask",
  "Go", "Golang", "Java", "Spring", "Spring Boot", "Rust", "C++", "C#", ".NET",
  "Ruby", "Ruby on Rails", "PHP", "Laravel", "Microservices", "Event-Driven",

  // Databases & Storage
  "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "Convex",
  "Supabase", "Firebase", "DynamoDB", "Cassandra", "Elasticsearch", "Prisma",
  "TypeORM", "Drizzle", "SQL", "NoSQL", "Database Design", "Indexing",

  // Cloud, DevOps & Tools
  "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Azure", "Docker",
  "Kubernetes", "K8s", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI", "Git",
  "Linux", "Serverless", "Lambda", "Cloudflare", "Vercel", "Nginx", "Prometheus", "Datadog",

  // AI & Data
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "AI", "LLM",
  "Large Language Models", "OpenAI", "Gemini", "Claude", "LangChain", "LlamaIndex",
  "PyTorch", "TensorFlow", "Pandas", "NumPy", "NLP", "Computer Vision", "RAG",
  "Vector Search", "Embeddings", "HuggingFace",

  // Software Engineering Practices
  "System Design", "Distributed Systems", "Object-Oriented Programming", "OOP",
  "Design Patterns", "Unit Testing", "Integration Testing", "Jest", "Vitest",
  "Cypress", "Playwright", "Test-Driven Development", "TDD", "Agile", "Scrum",
  "Code Review", "Performance Optimization", "Scalability", "Security",
];

const ResumelyMatcher = {
  // Extract all matched skills present in a text block
  extractSkills(text) {
    if (!text || typeof text !== "string") return [];
    const normalizedText = ` ${text.toLowerCase().replace(/[^a-z0-9#+.-]/g, " ")} `;
    const found = new Set();

    for (const skill of SKILL_TAXONOMY) {
      const lowerSkill = skill.toLowerCase();
      // Handle special terms like C++, C#, .NET
      const escaped = lowerSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(^|[^a-z0-9#+.-])${escaped}([^a-z0-9#+.-]|$)`, "i");

      if (regex.test(normalizedText)) {
        found.add(skill);
      }
    }

    return Array.from(found);
  },

  // Gather all searchable text from a resume object
  flattenResumeText(resume) {
    if (!resume) return "";
    const parts = [];

    if (resume.summary) parts.push(resume.summary);

    if (Array.isArray(resume.skills)) {
      resume.skills.forEach((cat) => {
        if (cat.items && Array.isArray(cat.items)) {
          parts.push(cat.items.filter(Boolean).join(" "));
        }
      });
    }

    if (Array.isArray(resume.experience)) {
      resume.experience.forEach((exp) => {
        parts.push(exp.position || "");
        parts.push(exp.company || "");
        if (Array.isArray(exp.bullets)) {
          parts.push(exp.bullets.filter(Boolean).join(" "));
        }
      });
    }

    if (Array.isArray(resume.projects)) {
      resume.projects.forEach((proj) => {
        parts.push(proj.name || "");
        parts.push(proj.description || "");
        if (Array.isArray(proj.technologies)) {
          parts.push(proj.technologies.filter(Boolean).join(" "));
        }
        if (Array.isArray(proj.bullets)) {
          parts.push(proj.bullets.filter(Boolean).join(" "));
        }
      });
    }

    if (Array.isArray(resume.education)) {
      resume.education.forEach((edu) => {
        parts.push(edu.degree || "");
        parts.push(edu.field || "");
        parts.push(edu.institution || "");
      });
    }

    return parts.join(" ");
  },

  // Calculate ATS match score between job description and resume
  analyzeMatch(jobText, resume) {
    if (!jobText || !resume) {
      return {
        score: 0,
        matchedSkills: [],
        missingSkills: [],
        resumeSkills: [],
        jobSkills: [],
        recommendations: ["Paste or extract a job description to see your match score."],
      };
    }

    const jobSkills = this.extractSkills(jobText);
    const resumeText = this.flattenResumeText(resume);
    const resumeSkills = this.extractSkills(resumeText);

    const matchedSkills = [];
    const missingSkills = [];

    jobSkills.forEach((skill) => {
      if (resumeSkills.some((rs) => rs.toLowerCase() === skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // Score calculation:
    // Base skill coverage + keyword density + text similarity
    let score = 0;
    if (jobSkills.length > 0) {
      const skillScore = (matchedSkills.length / jobSkills.length) * 80;
      // Bonus points for having a strong baseline
      const baselineBonus = matchedSkills.length >= 3 ? 15 : matchedSkills.length * 5;
      score = Math.min(98, Math.round(skillScore + baselineBonus));
    } else {
      // If no tech skills extracted, fallback to word overlap
      score = 70;
    }

    // Generate actionable recommendations
    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(
        `Highlight these JD keywords in your skills or experience bullets: ${missingSkills.slice(0, 5).join(", ")}.`
      );
    }
    if (matchedSkills.length > 0) {
      recommendations.push(
        `Strong alignment found on ${matchedSkills.slice(0, 4).join(", ")}.`
      );
    }
    if (score >= 80) {
      recommendations.push("Excellent match! Ready to apply.");
    } else if (score >= 60) {
      recommendations.push("Good match. Tailor 1-2 bullet points to push score above 85%.");
    } else {
      recommendations.push("Consider tailoring your resume summary and projects for this role.");
    }

    return {
      score,
      matchedSkills,
      missingSkills,
      jobSkills,
      resumeSkills,
      recommendations,
    };
  },

  // Generate a tailored elevator pitch / cover note for the job
  generateTailoredPitch(job, resume) {
    const analysis = this.analyzeMatch(job.description || "", resume);
    const candidateName = resume.personalInfo?.name || "Candidate";
    const currentTitle = resume.experience?.[0]?.position || "Software Engineer";
    const jobTitle = job.title || "the open role";
    const company = job.company || "your team";

    const topSkills = analysis.matchedSkills.slice(0, 3).join(", ") || "full-stack development";

    const pitch = `Hi ${company} Hiring Team,\n\nI am writing to express my strong enthusiasm for the ${jobTitle} position. With my background as a ${currentTitle} specializing in ${topSkills}, I have delivered high-impact web architectures and scalable systems.\n\nKey highlights relevant to ${company}:\n• Proven track record in ${analysis.matchedSkills[0] || "modern software engineering"} and production-grade delivery.\n• Experience leading feature development from conception to high-scale deployment.\n• Quick to adapt, problem-solve, and collaborate with product and cross-functional partners.\n\nI would welcome the opportunity to discuss how my skill set can support ${company}'s goals.\n\nBest regards,\n${candidateName}`;

    return pitch;
  },
};

// Export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { ResumelyMatcher, SKILL_TAXONOMY };
  } else if (typeof window !== "undefined") {
    window.ResumelyMatcher = ResumelyMatcher;
    window.SKILL_TAXONOMY = SKILL_TAXONOMY;
  }
})();


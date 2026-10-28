// Resumely Extension Storage & State Management
// Handles chrome.storage.local with automatic fallback and preloaded demo data

const DEFAULT_PROFILE = {
  id: "demo_profile_1",
  name: "Alex Morgan",
  title: "Senior Full Stack Engineer",
  personalInfo: {
    name: "Alex Morgan",
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 349-8210",
    location: "San Francisco, CA",
    city: "San Francisco",
    state: "CA",
    country: "United States",
    postalCode: "94107",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexmorgan",
    website: "https://alexmorgan.dev",
    workAuthorization: "Authorized to work in US without sponsorship",
    sponsorshipRequired: "No",
  },
  summary:
    "Senior Full Stack Software Engineer with 6+ years of experience designing and deploying scalable web applications using Next.js, React, TypeScript, Node.js, and cloud platforms. Proven track record leading frontend architecture, optimizing Web Vitals, and mentoring engineering teams.",
  experience: [
    {
      id: "exp_1",
      company: "Stripe",
      position: "Senior Full Stack Engineer",
      location: "San Francisco, CA (Hybrid)",
      startDate: "2022-03",
      endDate: null,
      current: true,
      bullets: [
        "Architected and deployed high-throughput checkout micro-frontends serving 15M+ daily requests with 99.99% uptime.",
        "Spearheaded migration to Next.js App Router and React Server Components, reducing First Contentful Paint by 42%.",
        "Designed real-time telemetry dashboard using Convex, WebSockets, and TypeScript, improving incident resolution time by 30%.",
        "Mentored 5 junior and mid-level engineers through code reviews, system design sessions, and technical workshops.",
      ],
    },
    {
      id: "exp_2",
      company: "Datadog",
      position: "Software Engineer",
      location: "New York, NY",
      startDate: "2019-08",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Engineered real-time APM log analytics interfaces in React, Redux, and Go handling 50TB+ daily streaming events.",
        "Refactored data visualization pipeline using WebGL and Canvas, boosting frame rate from 24fps to 60fps on large datasets.",
        "Collaborated with cross-functional product and UX teams to build accessible, WCAG 2.1 AA compliant design systems.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.85",
    },
  ],
  skills: [
    {
      category: "Frontend",
      items: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "Redux",
        "GraphQL",
      ],
    },
    {
      category: "Backend & Systems",
      items: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "Convex",
        "Redis",
        "REST APIs",
        "Python",
        "Go",
      ],
    },
    {
      category: "Cloud & DevOps",
      items: [
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "GitHub Actions",
        "Terraform",
        "Vercel",
      ],
    },
    {
      category: "Practices & Methodologies",
      items: [
        "System Design",
        "Unit Testing (Jest, Vitest)",
        "Agile / Scrum",
        "Microservices",
        "Web Performance Optimization",
      ],
    },
  ],
  projects: [
    {
      id: "proj_1",
      name: "Resumely AI Builder",
      description:
        "AI-powered dynamic resume builder tailored to job descriptions using Next.js and Convex.",
      technologies: ["Next.js", "Convex", "TypeScript", "Tailwind CSS", "Gemini AI"],
      link: "https://github.com/alexmorgan/resumely",
      bullets: [
        "Built automated ATS keyword matcher and live resume preview editor with PDF export.",
        "Integrated vector embeddings for semantic similarity scoring against JD requirements.",
      ],
    },
  ],
};

const DEFAULT_SETTINGS = {
  appUrl: "http://localhost:3000",
  userEmail: "",
  userId: "",
  useDemoMode: false, // will auto-fallback to demo if not connected
  autoDetectJobs: true,
  showFloatingWidget: true,
  widgetActivationMode: "job_sites_only", // "job_sites_only" (default) | "all_sites" | "disabled"
  whitelistedDomains: [], // domains where widget is forced ON
  blacklistedDomains: [], // domains where widget is forced OFF
  autoFillHighlights: true,
  defaultStage: "saved", // "saved" | "applied" | "interviewing"
  lastSyncTime: null,
};

const ResumelyStorage = {
  // Generic chrome.storage.local wrapper with fallback
  async get(keys) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => resolve(result || {}));
      });
    } else {
      // LocalStorage fallback for tests
      const result = {};
      const keyList = Array.isArray(keys) ? keys : typeof keys === "string" ? [keys] : Object.keys(keys || {});
      keyList.forEach((k) => {
        try {
          const val = localStorage.getItem(`resumely_${k}`);
          if (val !== null) result[k] = JSON.parse(val);
          else if (keys && typeof keys === "object" && keys[k] !== undefined) result[k] = keys[k];
        } catch (e) {
          result[k] = null;
        }
      });
      return result;
    }
  },

  async set(items) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set(items, () => resolve(true));
      });
    } else {
      Object.entries(items).forEach(([k, v]) => {
        try {
          localStorage.setItem(`resumely_${k}`, JSON.stringify(v));
        } catch (e) {}
      });
      return true;
    }
  },

  async getSettings() {
    const data = await this.get(["settings"]);
    return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
  },

  async saveSettings(settings) {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    await this.set({ settings: updated });
    return updated;
  },

  async toggleDomainBlacklist(domain) {
    if (!domain) return false;
    const settings = await this.getSettings();
    const list = new Set(settings.blacklistedDomains || []);
    let isBlocked = false;
    if (list.has(domain)) {
      list.delete(domain);
      isBlocked = false;
    } else {
      list.add(domain);
      isBlocked = true;
    }
    await this.saveSettings({ blacklistedDomains: Array.from(list) });
    return isBlocked;
  },

  async toggleDomainWhitelist(domain) {
    if (!domain) return false;
    const settings = await this.getSettings();
    const list = new Set(settings.whitelistedDomains || []);
    let isAllowed = false;
    if (list.has(domain)) {
      list.delete(domain);
      isAllowed = false;
    } else {
      list.add(domain);
      isAllowed = true;
    }
    await this.saveSettings({ whitelistedDomains: Array.from(list) });
    return isAllowed;
  },

  async getAuthenticatedUser() {
    const data = await this.get(["authenticatedUser"]);
    return data.authenticatedUser || null;
  },

  async saveAuthenticatedUser(user) {
    await this.set({ authenticatedUser: user });
    if (user && user.email) {
      await this.saveSettings({ userEmail: user.email, userId: user.id || user._id, useDemoMode: false });
    }
    return user;
  },

  async clearAuthenticatedUser() {
    await this.set({ authenticatedUser: null, resumes: [] });
    await this.saveSettings({ userEmail: "", userId: "", useDemoMode: true });
    return true;
  },

  async getActiveResume() {
    const resumes = await this.getResumes();
    const data = await this.get(["activeResumeId"]);
    if (data.activeResumeId) {
      const found = resumes.find((r) => (r._id || r.id) === data.activeResumeId);
      if (found) return found;
    }
    // Default to first resume (or master)
    return resumes[0] || null;
  },

  async setActiveResumeId(resumeId) {
    await this.set({ activeResumeId: resumeId });
    return resumeId;
  },

  async getActiveProfile() {
    const authUser = await this.getAuthenticatedUser();
    const activeResume = await this.getActiveResume();

    if (activeResume && activeResume.personalInfo) {
      return {
        ...activeResume,
        personalInfo: {
          ...activeResume.personalInfo,
          email: activeResume.personalInfo.email || authUser?.email || "",
          name: activeResume.personalInfo.name || authUser?.name || "Candidate",
        },
      };
    }

    const data = await this.get(["profile", "settings"]);
    const settings = data.settings || {};

    if (!settings.useDemoMode && data.profile && data.profile.personalInfo) {
      return data.profile;
    }
    return DEFAULT_PROFILE;
  },

  async saveActiveProfile(profile) {
    await this.set({ profile });
    return profile;
  },

  async getResumes() {
    const data = await this.get(["resumes", "profile", "settings"]);
    const settings = data.settings || {};

    if (Array.isArray(data.resumes) && data.resumes.length > 0) {
      return data.resumes;
    }

    if (settings.useDemoMode === false && data.profile) {
      return [data.profile];
    }

    // Fallback to active/demo profile as the master resume
    const profile = data.profile || DEFAULT_PROFILE;
    return [
      {
        _id: "demo_master",
        name: "Master Resume (Alex Morgan)",
        isMasterResume: true,
        personalInfo: profile.personalInfo,
        summary: profile.summary,
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        projects: profile.projects,
        updatedAt: Date.now(),
      },
    ];
  },

  async saveResumes(resumes) {
    await this.set({ resumes });
    return resumes;
  },

  async getSavedJobs() {
    const data = await this.get(["savedJobs"]);
    return Array.isArray(data.savedJobs) ? data.savedJobs : [];
  },

  async addSavedJobLocally(job) {
    const jobs = await this.getSavedJobs();
    const existingIndex = jobs.findIndex(
      (j) => (j.jobUrl && j.jobUrl === job.jobUrl) || (j.title === job.title && j.company === job.company)
    );

    const record = {
      ...job,
      id: job.id || `job_${Date.now()}`,
      savedAt: job.savedAt || Date.now(),
      syncedWithServer: !!job.syncedWithServer,
      stage: job.stage || "saved",
    };

    if (existingIndex >= 0) {
      jobs[existingIndex] = { ...jobs[existingIndex], ...record };
    } else {
      jobs.unshift(record);
    }

    const trimmed = jobs.slice(0, 150);
    await this.set({ savedJobs: trimmed });
    return record;
  },

  async updateSavedJobStage(jobId, stage) {
    const jobs = await this.getSavedJobs();
    const target = jobs.find((j) => j.id === jobId || j.applicationId === jobId);
    if (target) {
      target.stage = stage;
      target.updatedAt = Date.now();
      await this.set({ savedJobs: jobs });
      return target;
    }
    return null;
  },

  async deleteSavedJob(jobId) {
    const jobs = await this.getSavedJobs();
    const filtered = jobs.filter((j) => j.id !== jobId && j.applicationId !== jobId);
    await this.set({ savedJobs: filtered });
    return true;
  },
};

// Export for ES modules and standard script inclusion
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ResumelyStorage, DEFAULT_PROFILE, DEFAULT_SETTINGS };
} else if (typeof window !== "undefined") {
  window.ResumelyStorage = ResumelyStorage;
  window.DEFAULT_PROFILE = DEFAULT_PROFILE;
  window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
}


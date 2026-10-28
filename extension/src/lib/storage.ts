// Typesafe Chrome Storage Bridge for Resumely Extension

export interface UserProfile {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  picture?: string;
  credits?: number;
  plan?: string;
}

export interface ResumeVersion {
  _id?: string;
  id?: string;
  name?: string;
  isMasterResume?: boolean;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    title?: string;
  };
  summary?: string;
  skills?: string[] | { technical?: string[]; soft?: string[] } | any;
  experience?: Array<{
    title?: string;
    position?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
  }>;
  targetRole?: string;
  targetCompany?: string;
}

export interface SavedJobRecord {
  id: string;
  applicationId?: string;
  company: string;
  title: string;
  stage: "saved" | "applied" | "interviewing" | "offered" | "rejected";
  jobUrl?: string;
  location?: string;
  salary?: string;
  description?: string;
  notes?: string;
  score?: number | string | null;
  savedAt: number;
  syncedWithServer: boolean;
  tags?: string[];
}

export interface ExtensionSettings {
  appUrl: string;
  userEmail: string;
  showFloatingWidget: boolean;
  widgetActivationMode: "job_sites_only" | "all_sites" | "disabled";
  whitelistedDomains: string[];
  blacklistedDomains: string[];
  enableAutofill: boolean;
}

export const DEFAULT_DEMO_RESUME: ResumeVersion = {
  _id: "demo_master",
  id: "demo_master",
  name: "Master Resume (Full Stack)",
  isMasterResume: true,
  personalInfo: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 349-8210",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    website: "alexmorgan.dev",
    title: "Senior Full Stack Engineer",
  },
  summary:
    "Senior Full Stack Engineer with 6+ years building scalable, high-performance web products with React, Next.js, TypeScript, Node.js, and cloud platforms.",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "GraphQL",
    "REST APIs",
    "WebSockets",
    "Docker",
    "PostgreSQL",
    "Jest",
    "Vitest",
    "Git",
    "CI/CD",
  ],
  experience: [
    {
      position: "Senior Frontend Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      highlights: [
        "Architected Next.js dashboard workflows improving page load speeds by 42%.",
        "Led team of 6 engineers standardizing React 19 Server Components.",
      ],
    },
  ],
};

const DEFAULT_SETTINGS: ExtensionSettings = {
  appUrl: "http://localhost:3000",
  userEmail: "",
  showFloatingWidget: false,
  widgetActivationMode: "disabled",
  whitelistedDomains: [],
  blacklistedDomains: [],
  enableAutofill: true,
};

export const ResumelyStorage = {
  async getSettings(): Promise<ExtensionSettings> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["settings"]);
      return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
    }
    const raw = localStorage.getItem("resumely_settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  },

  async saveSettings(patch: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...patch };
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ settings: updated });
    } else {
      localStorage.setItem("resumely_settings", JSON.stringify(updated));
    }
    return updated;
  },

  async getAuthenticatedUser(): Promise<UserProfile | null> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["authenticatedUser"]);
      return data.authenticatedUser || null;
    }
    const raw = localStorage.getItem("resumely_auth_user");
    return raw ? JSON.parse(raw) : null;
  },

  async saveAuthenticatedUser(user: UserProfile | null): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ authenticatedUser: user });
    } else {
      if (user) {
        localStorage.setItem("resumely_auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("resumely_auth_user");
      }
    }
  },

  async getResumes(): Promise<ResumeVersion[]> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["resumes"]);
      if (Array.isArray(data.resumes) && data.resumes.length > 0) {
        return data.resumes;
      }
    }
    const raw = localStorage.getItem("resumely_resumes");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [DEFAULT_DEMO_RESUME];
  },

  async saveResumes(resumes: ResumeVersion[]): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ resumes });
    } else {
      localStorage.setItem("resumely_resumes", JSON.stringify(resumes));
    }
  },

  async getActiveResumeId(): Promise<string> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["activeResumeId"]);
      if (data.activeResumeId) return String(data.activeResumeId);
    }
    return localStorage.getItem("resumely_active_resume_id") || "demo_master";
  },

  async setActiveResumeId(id: string): Promise<void> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ activeResumeId: id });
    } else {
      localStorage.setItem("resumely_active_resume_id", id);
    }
  },

  async getSavedJobs(): Promise<SavedJobRecord[]> {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["savedJobs"]);
      return Array.isArray(data.savedJobs) ? data.savedJobs : [];
    }
    const raw = localStorage.getItem("resumely_saved_jobs");
    return raw ? JSON.parse(raw) : [];
  },

  async addSavedJob(job: Partial<SavedJobRecord>): Promise<SavedJobRecord> {
    const list = await this.getSavedJobs();
    const record: SavedJobRecord = {
      id: job.id || `local_${Date.now()}`,
      applicationId: job.applicationId,
      company: job.company || "Company",
      title: job.title || "Job Title",
      stage: job.stage || "saved",
      jobUrl: job.jobUrl || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
      notes: job.notes || "",
      score: job.score || null,
      savedAt: Date.now(),
      syncedWithServer: Boolean(job.syncedWithServer),
      tags: job.tags || ["Extension"],
    };

    const updated = [record, ...list.filter((j) => j.id !== record.id && j.applicationId !== record.applicationId)];
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ savedJobs: updated });
    } else {
      localStorage.setItem("resumely_saved_jobs", JSON.stringify(updated));
    }
    return record;
  },

  async deleteSavedJob(id: string): Promise<void> {
    const list = await this.getSavedJobs();
    const filtered = list.filter((j) => j.id !== id && j.applicationId !== id);
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      await chrome.storage.local.set({ savedJobs: filtered });
    } else {
      localStorage.setItem("resumely_saved_jobs", JSON.stringify(filtered));
    }
  },

  async toggleDomainBlacklist(domain: string): Promise<boolean> {
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
};


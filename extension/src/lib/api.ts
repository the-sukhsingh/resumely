// Typesafe API Bridge to Next.js & Convex Backend for Resumely Extension

export interface SyncResponse {
  authenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    credits: number;
    plan: string;
  };
  masterResume?: any;
  resumeVersions?: any[];
  error?: string;
}

export const ResumelyAPI = {
  async checkActiveSession(baseUrl = "http://localhost:3000"): Promise<SyncResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/api/extension/session`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  async loginWithEmail(baseUrl = "http://localhost:3000", email: string): Promise<SyncResponse> {
    const url = `${baseUrl.replace(/\/$/, "")}/api/extension/session?email=${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },

  async saveJob(baseUrl = "http://localhost:3000", payload: any): Promise<{ success: boolean; applicationId?: string; error?: string }> {
    const url = `${baseUrl.replace(/\/$/, "")}/api/extension/jobs`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async pingServer(baseUrl = "http://localhost:3000"): Promise<{ online: boolean }> {
    try {
      const url = `${baseUrl.replace(/\/$/, "")}/api/extension/session`;
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) });
      return { online: res.status < 500 };
    } catch {
      return { online: false };
    }
  },
};


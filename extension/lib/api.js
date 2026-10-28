// Resumely Client API Bridge
// Communicates with Resumely web app (Next.js & Convex backend)

const ResumelyAPI = {
  async fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  },

  cleanUrl(baseUrl) {
    if (!baseUrl) return "http://localhost:3000";
    return baseUrl.replace(/\/+$/, "");
  },

  async pingServer(baseUrl) {
    const root = this.cleanUrl(baseUrl);
    try {
      const res = await this.fetchWithTimeout(`${root}/api/extension/sync`, { method: "GET" }, 4000);
      if (res.ok) {
        const data = await res.json();
        return { online: true, data };
      }
      return { online: false, error: `HTTP ${res.status}` };
    } catch (e) {
      return { online: false, error: e.message || "Network unreachable" };
    }
  },

  async syncUserData(baseUrl, { email, userId }) {
    const root = this.cleanUrl(baseUrl);
    const query = new URLSearchParams();
    if (email) query.set("email", email);
    if (userId) query.set("userId", userId);

    try {
      const url = `${root}/api/extension/sync?${query.toString()}`;
      const res = await this.fetchWithTimeout(url, { method: "GET" });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async fetchResumes(baseUrl, { email, userId }) {
    const root = this.cleanUrl(baseUrl);
    const query = new URLSearchParams();
    if (email) query.set("email", email);
    if (userId) query.set("userId", userId);

    try {
      const url = `${root}/api/extension/resumes?${query.toString()}`;
      const res = await this.fetchWithTimeout(url, { method: "GET" });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async saveJob(baseUrl, jobPayload) {
    const root = this.cleanUrl(baseUrl);
    try {
      const url = `${root}/api/extension/jobs`;
      const res = await this.fetchWithTimeout(url, {
        method: "POST",
        body: JSON.stringify(jobPayload),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ResumelyAPI };
} else if (typeof window !== "undefined") {
  window.ResumelyAPI = ResumelyAPI;
}


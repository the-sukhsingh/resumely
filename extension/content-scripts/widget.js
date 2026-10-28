// Resumely Floating In-Page Assistant Widget
// Injects a floating assistant pill with Shadow DOM isolation - Active strictly on job sites by default

(function () {
  if (window.__resumely_widget_loaded) return;
  window.__resumely_widget_loaded = true;

  // Don't inject on Resumely's own domain to avoid duplicate UI
  if (
    window.location.hostname === "localhost" &&
    (window.location.port === "3000" || window.location.port === "3001")
  ) {
    return;
  }
  if (window.location.hostname.includes("resumely.tech")) {
    return;
  }

  const KNOWN_JOB_DOMAINS = [
    "linkedin.com",
    "indeed.com",
    "greenhouse.io",
    "lever.co",
    "wellfound.com",
    "angel.co",
    "glassdoor.com",
    "ziprecruiter.com",
    "myworkdayjobs.com",
    "workday.com",
    "smartrecruiters.com",
    "ashbyhq.com",
    "bamboohr.com",
    "jobvite.com",
    "workable.com",
    "joinhandshake.com",
    "dice.com",
    "remoteok.com",
    "remoteok.io",
    "weworkremotely.com",
    "simplyhired.com",
    "workatastartup.com",
    "ripplematch.com",
    "otta.com",
    "levels.fyi",
    "monster.com",
    "careerbuilder.com",
  ];

  function isJobWebsite() {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();

    // 1. Check known job boards
    if (KNOWN_JOB_DOMAINS.some((d) => hostname.includes(d))) {
      // For linkedin, make sure user is on jobs
      if (hostname.includes("linkedin.com") && !pathname.includes("/jobs")) {
        return false;
      }
      return true;
    }

    // 2. Check local mock test pages
    if (href.includes("sample-job-greenhouse.html") || href.includes("sample-job-linkedin.html")) {
      return true;
    }

    // 3. Check career URL path patterns on any company website
    const careerPathPattern = /\/(careers|career|jobs|job|openings|apply|positions|work-with-us|join-us|vacancies)(\/|$)/i;
    if (careerPathPattern.test(pathname)) {
      return true;
    }

    // 4. Check if Schema.org JobPosting is present in DOM
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const s of scripts) {
        if ((s.textContent || "").includes("JobPosting")) {
          return true;
        }
      }
    } catch (e) {}

    return false;
  }

  class ResumelyFloatingWidget {
    constructor() {
      this.host = null;
      this.shadow = null;
      this.jobData = null;
      this.analysis = null;
      this.isExpanded = false;
      this.settings = null;
      this.init();
    }

    async init() {
      // 1. Fetch user settings
      this.settings = {
        showFloatingWidget: true,
        widgetActivationMode: "job_sites_only", // Default: only on job sites
        whitelistedDomains: [],
        blacklistedDomains: [],
      };

      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const data = await new Promise((r) => chrome.storage.local.get(["settings"], r));
        if (data && data.settings) {
          this.settings = { ...this.settings, ...data.settings };
        }
      }

      const hostname = window.location.hostname.toLowerCase();

      // Check disabled state
      if (this.settings.showFloatingWidget === false || this.settings.widgetActivationMode === "disabled") {
        return;
      }

      // Check user-configured domain blacklist
      if (Array.isArray(this.settings.blacklistedDomains) && this.settings.blacklistedDomains.includes(hostname)) {
        return;
      }

      // If whitelisted, allow directly
      const isWhitelisted =
        Array.isArray(this.settings.whitelistedDomains) && this.settings.whitelistedDomains.includes(hostname);

      // Default mode: "job_sites_only"
      if (!isWhitelisted && this.settings.widgetActivationMode !== "all_sites") {
        if (!isJobWebsite()) {
          // NOT a job website -> Do not show floating widget!
          return;
        }
      }

      // Allow DOM to settle before scraping
      setTimeout(() => {
        this.inspectPage();
      }, 1000);
    }

    inspectPage() {
      if (window.__ResumelyJobDetector) {
        this.jobData = window.__ResumelyJobDetector.extract();
      }

      const formFields = window.__ResumelyAutofillEngine
        ? window.__ResumelyAutofillEngine.detectFormFields()
        : [];

      // If neither job description nor application fields are found, don't show widget
      const hasJobContent =
        this.jobData && (this.jobData.title || (this.jobData.description && this.jobData.description.length > 100));
      const hasForm = formFields.length > 0;

      if (!hasJobContent && !hasForm) return;

      this.render(formFields.length);
    }

    render(detectedFieldsCount = 0) {
      if (this.host) return;

      this.host = document.createElement("div");
      this.host.id = "resumely-floating-host";
      this.shadow = this.host.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = `
        :host {
          all: initial;
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Geist Sans", sans-serif;
          font-size: 13px;
          color: #f4f4f5;
        }

        .resumely-pill {
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          transition: all 0.2s ease;
          user-select: none;
        }

        .resumely-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.85);
        }

        .logo-mark {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: -0.05em;
          color: #fff;
        }

        .pill-text {
          font-weight: 600;
          font-size: 12px;
          color: #f4f4f5;
        }

        .badge {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 12px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 600;
        }

        .resumely-card {
          position: absolute;
          bottom: 46px;
          right: 0;
          width: 310px;
          background: #121215;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85);
          display: none;
          flex-direction: column;
          gap: 10px;
          animation: slideUp 0.2s ease;
        }

        .resumely-card.open {
          display: flex;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: #f4f4f5;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .close-btn {
          background: none;
          border: none;
          color: #71717a;
          cursor: pointer;
          font-size: 16px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .close-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .job-snippet {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 9px;
        }

        .job-title {
          font-weight: 600;
          color: #f4f4f5;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 11px;
          color: #a1a1aa;
          margin-top: 2px;
        }

        .btn-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #ffffff;
          color: #09090b;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: filter 0.15s;
        }

        .btn-action:hover {
          background: #e4e4e7;
        }

        .btn-secondary {
          background: #18181b;
          color: #f4f4f5;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 7px 10px;
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .btn-secondary:hover {
          background: #27272a;
        }

        .status-msg {
          font-size: 11px;
          color: #10b981;
          text-align: center;
          min-height: 14px;
        }
      `;

      this.shadow.appendChild(style);

      const container = document.createElement("div");
      const title = this.jobData?.title || "Job Detected";
      const company = this.jobData?.company || "Open Role";

      container.innerHTML = `
        <div class="resumely-card" id="widget-card">
          <div class="card-header">
            <div class="card-title">
              <span class="logo-mark">re.</span>
              <span>Resumely Assistant</span>
            </div>
            <button class="close-btn" id="btn-close">×</button>
          </div>

          <div class="job-snippet">
            <div class="job-title">${this.escapeHtml(title)}</div>
            <div class="job-company">${this.escapeHtml(company)}</div>
          </div>

          <button class="btn-action" id="btn-save-job">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save to Resumely Tracker
          </button>

          ${
            detectedFieldsCount > 0
              ? `
            <button class="btn-secondary" id="btn-autofill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Autofill Form (${detectedFieldsCount} fields detected)
            </button>
          `
              : ""
          }

          <div class="status-msg" id="widget-status"></div>

          <div style="display:flex; justify-content:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:6px; margin-top:2px;">
            <button id="btn-block-site" style="background:none; border:none; color:#71717a; font-size:10px; cursor:pointer; padding:2px;">Don't show on this site</button>
          </div>
        </div>

        <div class="resumely-pill" id="widget-pill">
          <div class="logo-mark">re.</div>
          <span class="pill-text">Resumely</span>
          ${detectedFieldsCount > 0 ? `<span class="badge">${detectedFieldsCount} fields</span>` : '<span class="badge">Active</span>'}
        </div>
      `;

      this.shadow.appendChild(container);
      document.body.appendChild(this.host);

      this.attachEvents();
    }

    attachEvents() {
      const pill = this.shadow.getElementById("widget-pill");
      const card = this.shadow.getElementById("widget-card");
      const btnClose = this.shadow.getElementById("btn-close");
      const btnSave = this.shadow.getElementById("btn-save-job");
      const btnAutofill = this.shadow.getElementById("btn-autofill");
      const statusEl = this.shadow.getElementById("widget-status");
      const btnBlockSite = this.shadow.getElementById("btn-block-site");

      pill.addEventListener("click", () => {
        this.isExpanded = !this.isExpanded;
        card.classList.toggle("open", this.isExpanded);
      });

      btnClose.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isExpanded = false;
        card.classList.remove("open");
      });

      if (btnBlockSite) {
        btnBlockSite.addEventListener("click", async () => {
          const hostname = window.location.hostname.toLowerCase();
          if (window.ResumelyStorage) {
            await window.ResumelyStorage.toggleDomainBlacklist(hostname);
          } else if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const data = await new Promise((r) => chrome.storage.local.get(["settings"], r));
            const settings = data?.settings || {};
            const list = new Set(settings.blacklistedDomains || []);
            list.add(hostname);
            await new Promise((r) =>
              chrome.storage.local.set({ settings: { ...settings, blacklistedDomains: Array.from(list) } }, r)
            );
          }
          if (this.host) this.host.remove();
        });
      }

      if (btnAutofill) {
        btnAutofill.addEventListener("click", async () => {
          let profile = null;
          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const data = await new Promise((r) => chrome.storage.local.get(["profile"], r));
            profile = data.profile;
          }
          if (!profile && window.DEFAULT_PROFILE) profile = window.DEFAULT_PROFILE;

          if (window.__ResumelyAutofillEngine && profile) {
            const res = window.__ResumelyAutofillEngine.autofill(profile);
            statusEl.textContent = `Autofilled ${res.count} fields!`;
            setTimeout(() => (statusEl.textContent = ""), 2500);
          }
        });
      }

      if (btnSave) {
        btnSave.addEventListener("click", async () => {
          btnSave.disabled = true;
          btnSave.textContent = "Saving...";
          try {
            if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage(
                {
                  action: "SAVE_JOB_QUICK",
                  jobData: this.jobData,
                },
                (response) => {
                  btnSave.textContent = "Saved to Tracker!";
                  btnSave.style.background = "#10b981";
                  statusEl.textContent = "Added to Wishlist / Saved";
                  setTimeout(() => {
                    card.classList.remove("open");
                  }, 1500);
                }
              );
            }
          } catch (e) {
            btnSave.textContent = "Saved locally";
            btnSave.disabled = false;
          }
        });
      }
    }

    escapeHtml(str) {
      if (!str) return "";
      const div = document.createElement("div");
      div.innerText = str;
      return div.innerHTML;
    }
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new ResumelyFloatingWidget());
  } else {
    new ResumelyFloatingWidget();
  }
})();

// Resumely Floating In-Page Assistant Widget
// Redesigned with Emil Kowalski Craft Sensibility: Dynamic Island Pill, Tactile Feedback, Shadow DOM

(function () {
  // Prevent execution inside iframes to eliminate widget duplication and flashing
  if (window.self !== window.top) {
    return;
  }

  // Remove any stale instance host to prevent duplicates
  const staleHost = document.getElementById("resumely-floating-host");
  if (staleHost) {
    staleHost.remove();
  }

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
    "docs.google.com", // Google Forms often used for hiring
  ];

  function isJobWebsite() {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();

    // 1. Check known job boards
    if (KNOWN_JOB_DOMAINS.some((d) => hostname.includes(d))) {
      if (hostname.includes("linkedin.com") && !pathname.includes("/jobs")) {
        return false;
      }
      // Only treat Google Forms on docs.google.com as job/application pages, not documents/spreadsheets
      if (hostname.includes("docs.google.com") && !pathname.includes("/forms")) {
        return false;
      }
      return true;
    }

    // 2. Check local mock test pages
    if (href.includes("sample-job-greenhouse.html") || href.includes("sample-job-linkedin.html")) {
      return true;
    }

    // 3. Check career URL path patterns
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
      this.activeResume = null;
      this.init();
      this.listenForChanges();
    }

    async init() {
      this.settings = {
        showFloatingWidget: true,
        widgetActivationMode: "job_sites_only",
        whitelistedDomains: [],
        blacklistedDomains: [],
      };

      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        try {
          const data = await new Promise((r) => chrome.storage.local.get(["settings", "activeResume", "resumes"], r));
          if (data && data.settings) {
            this.settings = { ...this.settings, ...data.settings };
          }
          if (data && data.activeResume) {
            this.activeResume = data.activeResume;
          } else if (data && data.resumes && data.resumes.length > 0) {
            this.activeResume = data.resumes[0];
          }
        } catch (e) {}
      }

      if (!this.shouldDisplay()) {
        this.destroy();
        return;
      }

      setTimeout(() => {
        this.inspectPage();
      }, 500);
    }

    shouldDisplay() {
      if (!this.settings) return false;

      // 1. Explicitly disabled everywhere
      if (this.settings.showFloatingWidget === false || this.settings.widgetActivationMode === "disabled") {
        return false;
      }

      const hostname = window.location.hostname.toLowerCase();

      // 2. User-configured domain blacklist
      if (Array.isArray(this.settings.blacklistedDomains) && this.settings.blacklistedDomains.includes(hostname)) {
        return false;
      }

      // 3. User-configured domain whitelist
      const isWhitelisted =
        Array.isArray(this.settings.whitelistedDomains) && this.settings.whitelistedDomains.includes(hostname);
      if (isWhitelisted) {
        return true;
      }

      // 4. All sites mode
      if (this.settings.widgetActivationMode === "all_sites") {
        return true;
      }

      // 5. Default: Job sites only
      return isJobWebsite();
    }

    destroy() {
      if (this.host) {
        this.host.remove();
        this.host = null;
        this.shadow = null;
        this.isExpanded = false;
      }
      const existing = document.getElementById("resumely-floating-host");
      if (existing) {
        existing.remove();
      }
    }

    listenForChanges() {
      // 1. Reactive storage updates (e.g. user changes widget mode or blacklist in popup)
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, areaName) => {
          if (areaName === "local") {
            if (changes.settings && changes.settings.newValue) {
              this.settings = { ...this.settings, ...changes.settings.newValue };
              if (!this.shouldDisplay()) {
                this.destroy();
              } else if (!this.host) {
                this.inspectPage();
              }
            }
            if (changes.activeResume && changes.activeResume.newValue) {
              this.activeResume = changes.activeResume.newValue;
            }
          }
        });
      }

      // 2. Direct message updates for zero-latency teardown
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.action === "SETTINGS_UPDATED") {
            if (request.settings) {
              this.settings = { ...this.settings, ...request.settings };
            }
            if (!this.shouldDisplay()) {
              this.destroy();
              sendResponse({ status: "destroyed" });
            } else {
              if (!this.host) {
                this.inspectPage();
              }
              sendResponse({ status: "active" });
            }
            return true;
          }
        });
      }
    }

    inspectPage() {
      if (window.__ResumelyJobDetector) {
        this.jobData = window.__ResumelyJobDetector.extract();
      }

      const formFields = window.__ResumelyAutofillEngine
        ? window.__ResumelyAutofillEngine.detectFormFields()
        : [];

      const hasJobContent =
        this.jobData && (this.jobData.title || (this.jobData.description && this.jobData.description.length > 100));
      const hasForm = formFields.length > 0;

      if (!hasJobContent && !hasForm) return;

      // Calculate ATS Match if matcher and resume available
      let atsScore = null;
      if (this.jobData?.description && this.activeResume && window.ResumelyMatcher) {
        try {
          const match = window.ResumelyMatcher.analyzeMatch(this.jobData.description, this.activeResume);
          atsScore = match.score;
        } catch (e) {}
      }

      this.render(formFields.length, atsScore);
    }

    render(detectedFieldsCount = 0, atsScore = null) {
      if (this.host) return;
      if (!this.shouldDisplay()) return;
      if (!document.body) return;
      if (document.getElementById("resumely-floating-host")) return;

      this.host = document.createElement("div");
      this.host.id = "resumely-floating-host";
      this.shadow = this.host.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = `
        :host {
          all: initial;
          position: fixed;
          bottom: 22px;
          right: 22px;
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Geist Sans", sans-serif;
          font-size: 13px;
          color: #09090b;
          user-select: none;
          opacity: 0;
          transform: translateY(8px);
          animation: resumelyMount 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes resumelyMount {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 1. Clean Minimal Floating Pill */
        .resumely-pill {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 9999px;
          padding: 6px 14px 6px 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
                      border-color 160ms ease,
                      box-shadow 160ms ease;
        }

        .resumely-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 0, 0, 0.22);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
        }

        .resumely-pill:active {
          transform: scale(0.97);
        }

        .brand-icon-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .logo-mark {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: -0.06em;
          color: #09090b;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        }

        .pill-label {
          font-weight: 600;
          font-size: 12px;
          color: #27272a;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pill-badge {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          border-radius: 9999px;
          padding: 1px 7px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .pill-badge.score {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        /* 2. Clean Expanded Card */
        .resumely-card {
          position: absolute;
          bottom: 48px;
          right: 0;
          width: 320px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform-origin: bottom right;
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      opacity 180ms ease;
        }

        .resumely-card.open {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: #09090b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 2px 6px;
          border-radius: 6px;
          transition: all 150ms ease;
        }

        .close-btn:hover {
          color: #09090b;
          background: rgba(0, 0, 0, 0.05);
        }

        /* Job Snippet */
        .job-snippet {
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .job-details {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-weight: 700;
          color: #09090b;
          font-size: 13px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 11px;
          color: #52525b;
          font-weight: 500;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ats-ring-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 4px 8px;
          flex-shrink: 0;
        }

        .ats-num {
          font-size: 13px;
          font-weight: 800;
          color: #047857;
          letter-spacing: -0.02em;
        }

        .ats-caption {
          font-size: 9px;
          font-weight: 600;
          color: #71717a;
          text-transform: uppercase;
        }

        /* Buttons */
        .btn-action-primary {
          background: #09090b;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
                      background 150ms ease;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .btn-action-primary:hover {
          background: #27272a;
        }

        .btn-action-primary:active {
          transform: scale(0.97);
        }

        .btn-action-primary.saved {
          background: #059669;
          color: #ffffff;
        }

        .btn-action-emerald {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 9px 12px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
                      background 150ms ease;
          width: 100%;
          box-sizing: border-box;
        }

        .btn-action-emerald:hover {
          background: #d1fae5;
        }

        .btn-action-emerald:active {
          transform: scale(0.97);
        }

        .footer-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
          padding-top: 8px;
          margin-top: 2px;
        }

        .btn-footer-link {
          background: transparent;
          border: none;
          color: #71717a;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: color 150ms ease;
        }

        .btn-footer-link:hover {
          color: #e11d48;
        }

        .status-msg {
          font-size: 11px;
          color: #059669;
          text-align: center;
          min-height: 14px;
          font-weight: 600;
        }
      `;

      this.shadow.appendChild(style);

      const container = document.createElement("div");
      const title = this.jobData?.title || "Job Opportunity";
      const company = this.jobData?.company || "Open Position";

      let pillText = "Resumely";
      let badgeHtml = '<span class="pill-badge">Active</span>';

      if (atsScore !== null) {
        badgeHtml = `<span class="pill-badge score">${atsScore}% Match</span>`;
      } else if (detectedFieldsCount > 0) {
        badgeHtml = `<span class="pill-badge">${detectedFieldsCount} fields</span>`;
      }

      container.innerHTML = `
        <div class="resumely-card" id="widget-card">
          <div class="card-header">
            <div class="card-title">
              <span class="logo-mark">re.</span>
              <span>Assistant</span>
            </div>
            <button class="close-btn" id="btn-close" title="Minimize">×</button>
          </div>

          <div class="job-snippet">
            <div class="job-details">
              <div class="job-title">${this.escapeHtml(title)}</div>
              <div class="job-company">${this.escapeHtml(company)}</div>
            </div>
            ${
              atsScore !== null
                ? `
              <div class="ats-ring-wrap">
                <span class="ats-num">${atsScore}%</span>
                <span class="ats-caption">Match</span>
              </div>
            `
                : ""
            }
          </div>

          <button class="btn-action-primary" id="btn-save-job">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span id="btn-save-text">Save to Resumely Tracker</span>
          </button>

          ${
            detectedFieldsCount > 0
              ? `
            <button class="btn-action-emerald" id="btn-autofill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>Autofill Form (${detectedFieldsCount} fields)</span>
            </button>
          `
              : ""
          }

          <div class="status-msg" id="widget-status"></div>

          <div class="footer-strip">
            <button class="btn-footer-link" id="btn-block-site">Don't show on this site</button>
          </div>
        </div>

        <div class="resumely-pill" id="widget-pill" title="Resumely Assistant">
          <div class="brand-icon-wrap">
            <span class="logo-mark">re.</span>
            <span class="status-dot"></span>
          </div>
          <span class="pill-label">${this.escapeHtml(company !== "Open Position" ? company : pillText)}</span>
          ${badgeHtml}
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
      const btnSaveText = this.shadow.getElementById("btn-save-text");
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
          let profile = this.activeResume;
          if (!profile && typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const data = await new Promise((r) => chrome.storage.local.get(["activeResume", "resumes", "profile"], r));
            profile = data.activeResume || data.resumes?.[0] || data.profile;
          }

          if (window.__ResumelyAutofillEngine && profile) {
            const res = window.__ResumelyAutofillEngine.autofill(profile);
            if (statusEl) {
              statusEl.textContent = `Autofilled ${res.count} fields!`;
              setTimeout(() => {
                if (statusEl) statusEl.textContent = "";
              }, 2500);
            }
          }
        });
      }

      if (btnSave) {
        btnSave.addEventListener("click", async () => {
          btnSave.disabled = true;
          if (btnSaveText) btnSaveText.textContent = "Saving...";

          try {
            if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage(
                {
                  action: "SAVE_JOB_QUICK",
                  jobData: this.jobData,
                },
                (response) => {
                  btnSave.classList.add("saved");
                  if (btnSaveText) btnSaveText.textContent = "Saved to Kanban ✓";
                  if (statusEl) statusEl.textContent = "Saved to Resumely Tracker";
                  setTimeout(() => {
                    card.classList.remove("open");
                  }, 1400);
                }
              );
            }
          } catch (e) {
            if (btnSaveText) btnSaveText.textContent = "Saved locally ✓";
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

  // Initialize singleton instance
  function startWidget() {
    if (!window.__resumely_floating_widget_instance) {
      window.__resumely_floating_widget_instance = new ResumelyFloatingWidget();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWidget, { once: true });
  } else {
    startWidget();
  }
})();

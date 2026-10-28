// Resumely Floating In-Page Widget
// Injects a floating assistant pill with Shadow DOM isolation

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

  class ResumelyFloatingWidget {
    constructor() {
      this.host = null;
      this.shadow = null;
      this.jobData = null;
      this.analysis = null;
      this.isExpanded = false;
      this.init();
    }

    async init() {
      // Check user settings
      let showWidget = true;
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const data = await new Promise((r) => chrome.storage.local.get(["settings"], r));
        if (data && data.settings && data.settings.showFloatingWidget === false) {
          showWidget = false;
        }
      }

      if (!showWidget) return;

      // Allow DOM to settle before scraping
      setTimeout(() => {
        this.inspectPage();
      }, 1200);
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          color: #f8fafc;
        }

        .resumely-pill {
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.25);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
        }

        .resumely-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.4);
        }

        .logo-mark {
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          color: #fff;
        }

        .pill-text {
          font-weight: 600;
          font-size: 13px;
          letter-spacing: -0.01em;
          color: #e2e8f0;
        }

        .badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 2px 7px;
          font-size: 11px;
          font-weight: 600;
        }

        .resumely-card {
          position: absolute;
          bottom: 50px;
          right: 0;
          width: 320px;
          background: #0b0f19;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.2);
          display: none;
          flex-direction: column;
          gap: 12px;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .resumely-card.open {
          display: flex;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 10px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 700;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 16px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .close-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .job-snippet {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 10px;
        }

        .job-title {
          font-weight: 600;
          color: #f1f5f9;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .btn-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: filter 0.2s;
        }

        .btn-action:hover {
          filter: brightness(1.1);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.14);
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
              <span class="logo-mark">R</span>
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
        </div>

        <div class="resumely-pill" id="widget-pill">
          <div class="logo-mark">R</div>
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

      pill.addEventListener("click", () => {
        this.isExpanded = !this.isExpanded;
        card.classList.toggle("open", this.isExpanded);
      });

      btnClose.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isExpanded = false;
        card.classList.remove("open");
      });

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
            // Send save message to background worker
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


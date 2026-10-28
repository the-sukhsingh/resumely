// Resumely Intelligent Application Autofill Engine
// Fills job application forms seamlessly and triggers framework events

(function () {
  if (window.__resumely_autofill_loaded) return;
  window.__resumely_autofill_loaded = true;

  const AutofillEngine = {
    // Mapping rules with regex patterns for various field names and labels
    FIELD_RULES: [
      {
        key: "firstName",
        patterns: [/\bfirst[\s_-]?name\b/i, /\bgiven[\s_-]?name\b/i, /\bfname\b/i],
        getValue: (p) => p.personalInfo?.firstName || p.personalInfo?.name?.split(" ")[0] || "",
      },
      {
        key: "lastName",
        patterns: [/\blast[\s_-]?name\b/i, /\bfamily[\s_-]?name\b/i, /\bsurname\b/i, /\blname\b/i],
        getValue: (p) => p.personalInfo?.lastName || p.personalInfo?.name?.split(" ").slice(1).join(" ") || "",
      },
      {
        key: "fullName",
        patterns: [/\bfull[\s_-]?name\b/i, /^name$/i, /\bcandidate[\s_-]?name\b/i, /\byour[\s_-]?name\b/i],
        getValue: (p) => p.personalInfo?.name || "",
      },
      {
        key: "email",
        patterns: [/\be-?mail\b/i, /\be_mail\b/i],
        getValue: (p) => p.personalInfo?.email || "",
      },
      {
        key: "phone",
        patterns: [/\bphone\b/i, /\bmobile\b/i, /\btelephone\b/i, /\bcell\b/i],
        getValue: (p) => p.personalInfo?.phone || "",
      },
      {
        key: "linkedin",
        patterns: [/\blinked[\s_-]?in\b/i],
        getValue: (p) => p.personalInfo?.linkedin || "",
      },
      {
        key: "github",
        patterns: [/\bgithub\b/i, /\bgit\b/i],
        getValue: (p) => p.personalInfo?.github || "",
      },
      {
        key: "website",
        patterns: [/\bwebsite\b/i, /\bportfolio\b/i, /\bpersonal[\s_-]?site\b/i, /\burl\b/i, /\bblog\b/i],
        getValue: (p) => p.personalInfo?.website || "",
      },
      {
        key: "city",
        patterns: [/\bcity\b/i],
        getValue: (p) => p.personalInfo?.city || p.personalInfo?.location?.split(",")[0]?.trim() || "",
      },
      {
        key: "state",
        patterns: [/\bstate\b/i, /\bprovince\b/i, /\bregion\b/i],
        getValue: (p) => p.personalInfo?.state || "",
      },
      {
        key: "postalCode",
        patterns: [/\bzip\b/i, /\bpostal[\s_-]?code\b/i],
        getValue: (p) => p.personalInfo?.postalCode || "",
      },
      {
        key: "location",
        patterns: [/\blocation\b/i, /\baddress\b/i],
        getValue: (p) => p.personalInfo?.location || "",
      },
      {
        key: "company",
        patterns: [/\bcurrent[\s_-]?company\b/i, /\bemployer\b/i, /\bcurrent[\s_-]?employer\b/i],
        getValue: (p) => p.experience?.[0]?.company || "",
      },
      {
        key: "title",
        patterns: [/\bcurrent[\s_-]?title\b/i, /\bjob[\s_-]?title\b/i, /\bheadline\b/i, /\brole\b/i],
        getValue: (p) => p.experience?.[0]?.position || p.title || "",
      },
      {
        key: "summary",
        patterns: [/\bsummary\b/i, /\bcover[\s_-]?letter\b/i, /\badditional[\s_-]?info\b/i, /\babout[\s_-]?yourself\b/i, /\bnotes?\b/i],
        getValue: (p) => p.summary || "",
      },
    ],

    // Inspect an input element to see which field it maps to
    matchElementToField(el) {
      if (!el || el.disabled || el.readOnly) return null;
      if (["hidden", "submit", "button", "reset", "file"].includes(el.type)) return null;

      // Extract all identifying textual signals for this element
      const signals = [
        el.name || "",
        el.id || "",
        el.getAttribute("placeholder") || "",
        el.getAttribute("aria-label") || "",
        el.getAttribute("autocomplete") || "",
        el.getAttribute("data-field") || "",
      ];

      // Also inspect associated <label> text
      if (el.id) {
        const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (label) signals.push(label.innerText || "");
      }
      const parentLabel = el.closest("label");
      if (parentLabel) signals.push(parentLabel.innerText || "");

      // Join all text signals
      const contextText = signals.join(" ").toLowerCase();

      for (const rule of this.FIELD_RULES) {
        for (const pattern of rule.patterns) {
          if (pattern.test(contextText)) {
            return rule;
          }
        }
      }

      return null;
    },

    // Scan the page and return all autofillable elements
    detectFormFields() {
      const inputs = Array.from(document.querySelectorAll("input, textarea, select"));
      const matchable = [];

      for (const el of inputs) {
        const rule = this.matchElementToField(el);
        if (rule) {
          matchable.push({
            element: el,
            rule,
            key: rule.key,
          });
        }
      }

      return matchable;
    },

    // Fill an element and trigger native input events
    fillInput(el, value) {
      if (!value) return false;

      // For standard input and textarea
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.focus();
        // Support React synthetic event wrappers by calling native setter
        const proto = el.tagName === "INPUT" ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;

        if (setter) {
          setter.call(el, value);
        } else {
          el.value = value;
        }

        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));

        this.highlightElement(el);
        return true;
      }

      // For select elements
      if (el.tagName === "SELECT") {
        const options = Array.from(el.options);
        const match = options.find(
          (opt) =>
            opt.value.toLowerCase() === value.toLowerCase() ||
            opt.text.toLowerCase().includes(value.toLowerCase())
        );
        if (match) {
          el.value = match.value;
          el.dispatchEvent(new Event("change", { bubbles: true }));
          this.highlightElement(el);
          return true;
        }
      }

      return false;
    },

    // Visual feedback highlight
    highlightElement(el) {
      const prevTransition = el.style.transition;
      const prevBorder = el.style.border;
      const prevBoxShadow = el.style.boxShadow;

      el.style.transition = "all 0.3s ease";
      el.style.borderColor = "#10b981";
      el.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.25)";

      setTimeout(() => {
        el.style.borderColor = prevBorder;
        el.style.boxShadow = prevBoxShadow;
        el.style.transition = prevTransition;
      }, 2500);
    },

    // Show temporary in-page notification toast
    showToast(message, isSuccess = true) {
      const existing = document.getElementById("resumely-autofill-toast");
      if (existing) existing.remove();

      const toast = document.createElement("div");
      toast.id = "resumely-autofill-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999999;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid ${isSuccess ? "#10b981" : "#ef4444"};
        border-radius: 10px;
        padding: 12px 18px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: resumelyFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSuccess ? "#10b981" : "#ef4444"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${isSuccess ? '<path d="M20 6L9 17l-5-5"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
        </svg>
        <span>${message}</span>
      `;

      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 350);
      }, 3000);
    },

    // Main execute autofill
    autofill(profileData) {
      if (!profileData) {
        this.showToast("No Resumely profile data available to autofill", false);
        return { success: false, count: 0 };
      }

      const detected = this.detectFormFields();
      let filledCount = 0;

      // Group fields: if firstName and lastName both filled, don't overwrite fullName
      const filledKeys = new Set();

      for (const item of detected) {
        // Skip fullName if separate first/last name were already identified on the page
        if (item.key === "fullName" && (filledKeys.has("firstName") || filledKeys.has("lastName"))) {
          continue;
        }

        const value = item.rule.getValue(profileData);
        if (value) {
          const ok = this.fillInput(item.element, value);
          if (ok) {
            filledCount++;
            filledKeys.add(item.key);
          }
        }
      }

      if (filledCount > 0) {
        this.showToast(`✨ Resumely autofilled ${filledCount} field${filledCount > 1 ? "s" : ""}!`, true);
      } else {
        this.showToast("No compatible application fields detected on this page", false);
      }

      return { success: true, count: filledCount };
    },
  };

  // Expose
  window.__ResumelyAutofillEngine = AutofillEngine;

  // Listen for messages
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "AUTOFILL_FORM") {
        const result = AutofillEngine.autofill(request.profileData);
        sendResponse(result);
        return true;
      }
      if (request.action === "DETECT_FORM_FIELDS") {
        const detected = AutofillEngine.detectFormFields();
        sendResponse({
          success: true,
          count: detected.length,
          fields: detected.map((d) => d.key),
        });
        return true;
      }
    });
  }
})();


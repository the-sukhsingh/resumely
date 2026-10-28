// Resumely Intelligent Application Autofill Engine
// Fills Greenhouse, Lever, Workday, Google Forms, Ashby, and custom portals
// Automatically triggers when website text/content changes (e.g. multi-step wizards)

(function () {
  // Prevent execution inside iframes to avoid duplicate triggers and toast flashing
  if (window.self !== window.top) {
    return;
  }

  if (window.__resumely_autofill_loaded) return;
  window.__resumely_autofill_loaded = true;

  const AutofillEngine = {
    cachedProfile: null,
    observerActive: false,
    mutationDebounceTimer: null,

    // Comprehensive field matching rules with extensive regex patterns
    FIELD_RULES: [
      {
        key: "firstName",
        patterns: [
          /\bfirst[\s_-]?name\b/i,
          /\bgiven[\s_-]?name\b/i,
          /\bfname\b/i,
          /\bforename\b/i,
          /\bprénom\b/i,
        ],
        getValue: (p) => p.personalInfo?.firstName || p.personalInfo?.name?.split(" ")[0] || "",
      },
      {
        key: "lastName",
        patterns: [
          /\blast[\s_-]?name\b/i,
          /\bfamily[\s_-]?name\b/i,
          /\bsurname\b/i,
          /\blname\b/i,
          /\bnom\b/i,
        ],
        getValue: (p) => p.personalInfo?.lastName || p.personalInfo?.name?.split(" ").slice(1).join(" ") || "",
      },
      {
        key: "fullName",
        patterns: [
          /\bfull[\s_-]?name\b/i,
          /^name$/i,
          /\bcandidate[\s_-]?name\b/i,
          /\byour[\s_-]?name\b/i,
          /\bapplicant[\s_-]?name\b/i,
          /\benter your name\b/i,
          /\bwhat is your name\b/i,
        ],
        getValue: (p) => p.personalInfo?.name || "",
      },
      {
        key: "email",
        patterns: [
          /\be-?mail\b/i,
          /\be_mail\b/i,
          /\bemail[\s_-]?address\b/i,
          /\byour[\s_-]?email\b/i,
          /\bcontact[\s_-]?email\b/i,
        ],
        getValue: (p) => p.personalInfo?.email || "",
      },
      {
        key: "phone",
        patterns: [
          /\bphone\b/i,
          /\bmobile\b/i,
          /\btelephone\b/i,
          /\bcell\b/i,
          /\bcontact[\s_-]?number\b/i,
          /\bphone[\s_-]?number\b/i,
        ],
        getValue: (p) => p.personalInfo?.phone || "",
      },
      {
        key: "linkedin",
        patterns: [
          /\blinked[\s_-]?in\b/i,
          /\blinkedin[\s_-]?url\b/i,
          /\blinkedin[\s_-]?profile\b/i,
        ],
        getValue: (p) => p.personalInfo?.linkedin || "",
      },
      {
        key: "github",
        patterns: [
          /\bgithub\b/i,
          /\bgithub[\s_-]?url\b/i,
          /\bgithub[\s_-]?profile\b/i,
          /\bgit\b/i,
        ],
        getValue: (p) => p.personalInfo?.github || "",
      },
      {
        key: "website",
        patterns: [
          /\bwebsite\b/i,
          /\bportfolio\b/i,
          /\bpersonal[\s_-]?site\b/i,
          /\bportfolio[\s_-]?url\b/i,
          /\bpersonal[\s_-]?website\b/i,
          /\bblog\b/i,
        ],
        getValue: (p) => p.personalInfo?.website || "",
      },
      {
        key: "city",
        patterns: [
          /\bcity\b/i,
          /\btown\b/i,
          /\bmunicipality\b/i,
        ],
        getValue: (p) => p.personalInfo?.city || p.personalInfo?.location?.split(",")[0]?.trim() || "",
      },
      {
        key: "state",
        patterns: [
          /\bstate\b/i,
          /\bprovince\b/i,
          /\bregion\b/i,
        ],
        getValue: (p) => p.personalInfo?.state || "",
      },
      {
        key: "postalCode",
        patterns: [
          /\bzip\b/i,
          /\bpostal[\s_-]?code\b/i,
          /\bzip[\s_-]?code\b/i,
        ],
        getValue: (p) => p.personalInfo?.postalCode || "",
      },
      {
        key: "location",
        patterns: [
          /\blocation\b/i,
          /\baddress\b/i,
          /\bcurrent[\s_-]?location\b/i,
          /\bwhere are you located\b/i,
          /\bwhere are you based\b/i,
          /\bresidence\b/i,
        ],
        getValue: (p) => p.personalInfo?.location || "",
      },
      {
        key: "company",
        patterns: [
          /\bcurrent[\s_-]?company\b/i,
          /\bcurrent[\s_-]?employer\b/i,
          /\bemployer\b/i,
          /\bcompany[\s_-]?name\b/i,
          /\bmost[\s_-]?recent[\s_-]?company\b/i,
          /\bwhere do you currently work\b/i,
        ],
        getValue: (p) => p.experience?.[0]?.company || "",
      },
      {
        key: "title",
        patterns: [
          /\bcurrent[\s_-]?title\b/i,
          /\bjob[\s_-]?title\b/i,
          /\bcurrent[\s_-]?role\b/i,
          /\bcurrent[\s_-]?position\b/i,
          /\bheadline\b/i,
          /\bdesignation\b/i,
        ],
        getValue: (p) => p.experience?.[0]?.position || p.title || "",
      },
      {
        key: "summary",
        patterns: [
          /\bsummary\b/i,
          /\bcover[\s_-]?letter\b/i,
          /\badditional[\s_-]?info\b/i,
          /\babout[\s_-]?yourself\b/i,
          /\bintroduce[\s_-]?yourself\b/i,
          /\bwhy[\s_-]?should[\s_-]?we[\s_-]?hire[\s_-]?you\b/i,
          /\bnotes?\b/i,
        ],
        getValue: (p) => p.summary || "",
      },
    ],

    // Inspect an element with Google Forms and standard DOM resolution
    matchElementToField(el) {
      if (!el || el.disabled || el.readOnly) return null;
      if (["hidden", "submit", "button", "reset", "file"].includes(el.type)) return null;

      const signals = [
        el.name || "",
        el.id || "",
        el.getAttribute("placeholder") || "",
        el.getAttribute("aria-label") || "",
        el.getAttribute("autocomplete") || "",
        el.getAttribute("data-field") || "",
        el.getAttribute("title") || "",
      ];

      // 1. Resolve aria-labelledby (Crucial for Google Forms & modern accessible UI)
      const labelledBy = el.getAttribute("aria-labelledby");
      if (labelledBy) {
        const idList = labelledBy.split(/\s+/);
        for (const id of idList) {
          if (!id) continue;
          const labelEl = document.getElementById(id);
          if (labelEl) {
            signals.push(labelEl.innerText || labelEl.textContent || "");
          }
        }
      }

      // 2. Resolve aria-describedby
      const describedBy = el.getAttribute("aria-describedby");
      if (describedBy) {
        const idList = describedBy.split(/\s+/);
        for (const id of idList) {
          if (!id) continue;
          const descEl = document.getElementById(id);
          if (descEl) {
            signals.push(descEl.innerText || descEl.textContent || "");
          }
        }
      }

      // 3. Resolve standard <label for="id">
      if (el.id) {
        try {
          const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          if (label) signals.push(label.innerText || label.textContent || "");
        } catch (e) {}
      }

      // 4. Resolve closest wrapping <label>
      const parentLabel = el.closest("label");
      if (parentLabel) signals.push(parentLabel.innerText || parentLabel.textContent || "");

      // 5. GOOGLE FORMS SPECIFIC RESOLUTION
      // Google Forms wraps questions inside [role="listitem"], .Qr7Oae, or .geS5n
      // The question heading is inside span.M7eMe, div[role="heading"], or .HoDaId
      const googleFormQuestion = el.closest(
        '.Qr7Oae, [role="listitem"], .geS5n, div[jsmodel], .freebirdFormviewerViewNumberedItemContainer'
      );
      if (googleFormQuestion) {
        const heading = googleFormQuestion.querySelector(
          '.M7eMe, [role="heading"], .HoDaId, .RVEQvd, div[dir="auto"], span[dir="auto"]'
        );
        if (heading) {
          signals.push(heading.innerText || heading.textContent || "");
        }
      }

      // 6. Generic Form Container Question Heading (Workday, Greenhouse, Ashby, Lever)
      const questionBlock = el.closest(
        'fieldset, .form-group, .field, [data-field], tr, td, .application-question, .job-question'
      );
      if (questionBlock && questionBlock !== googleFormQuestion) {
        const legend = questionBlock.querySelector("legend, h2, h3, h4, .label, .field-label, [class*='label']");
        if (legend) {
          signals.push(legend.innerText || legend.textContent || "");
        }
      }

      // Aggregate text signals
      const contextText = signals.join(" ").toLowerCase();

      // Test against rules
      for (const rule of this.FIELD_RULES) {
        for (const pattern of rule.patterns) {
          if (pattern.test(contextText)) {
            return rule;
          }
        }
      }

      return null;
    },

    // Scan page for fillable elements
    detectFormFields() {
      // Find all standard inputs + Google Forms specific classes (.whsOnd, .KHxj8b)
      const selector = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select';
      const inputs = Array.from(document.querySelectorAll(selector));
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

    // Fill an element with deep framework event bubbling (React, Vue, Google Forms Closure Library)
    fillInput(el, value) {
      if (!value) return false;

      // Handle standard inputs and textareas (including Google Forms .whsOnd and .KHxj8b)
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.focus();

        // 1. First attempt: use document.execCommand('insertText')
        // In Chromium/Google Forms, execCommand generates trusted keystroke InputEvents
        // that Google Closure Library requires to clear "This is a required question" errors
        // and float the input label.
        let execSuccess = false;
        try {
          el.select();
          execSuccess = document.execCommand("insertText", false, value);
        } catch (e) {
          execSuccess = false;
        }

        // 2. Fallback / reinforcement: native prototype setter
        if (!execSuccess || el.value !== value) {
          const proto = el.tagName === "INPUT" ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
          if (setter) {
            setter.call(el, value);
          } else {
            el.value = value;
          }
        }

        // 3. Dispatch full event sequence to notify React, Vue, Google Closure, and Angular
        try {
          el.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
          el.dispatchEvent(new InputEvent("beforeinput", { bubbles: true, cancelable: true, composed: true, data: value, inputType: "insertText" }));
          el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true, data: value, inputType: "insertText" }));
          el.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
        } catch (e) {
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // 4. Google Forms specific DOM repair:
        // Clear any "This is a required question" error banner on the question container
        const parentQuestion = el.closest('.Qr7Oae, [role="listitem"], .geS5n, .rFrNMe, div[jsmodel]');
        if (parentQuestion) {
          // Remove Google Forms error classes (.m2, .has-error)
          parentQuestion.classList.remove("m2", "has-error");

          const textWrapper = el.closest('.rFrNMe, .u3bW4e, .m2, .CDELRd');
          if (textWrapper) {
            textWrapper.classList.remove("m2");
            textWrapper.classList.add("is-filled", "has-value");
          }

          // Hide the red "This is a required question" message element
          const errorAlerts = parentQuestion.querySelectorAll('[role="alert"], .RVEQvd');
          errorAlerts.forEach((alertEl) => {
            if (alertEl.textContent && alertEl.textContent.includes("required")) {
              alertEl.style.display = "none";
            }
          });

          el.setAttribute("aria-invalid", "false");
        }

        // Mark element as filled by Resumely
        el.setAttribute("data-resumely-filled", "true");

        this.highlightElement(el);
        return true;
      }

      // Handle select elements
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
          el.setAttribute("data-resumely-filled", "true");
          this.highlightElement(el);
          return true;
        }
      }

      return false;
    },

    // Visual feedback highlight with subtle emerald pulse
    highlightElement(el) {
      const prevTransition = el.style.transition;
      const prevBorder = el.style.borderColor;
      const prevBoxShadow = el.style.boxShadow;

      el.style.transition = "border-color 200ms ease, box-shadow 200ms ease";
      el.style.borderColor = "#10b981";
      el.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.25)";

      setTimeout(() => {
        el.style.borderColor = prevBorder;
        el.style.boxShadow = prevBoxShadow;
        el.style.transition = prevTransition;
      }, 2500);
    },

    // Webpage UI is kept clean with 0 injected floating toasts; popup surfaces all user notifications
    showToast(message, isSuccess = true) {
      const existing = document.getElementById("resumely-autofill-toast");
      if (existing) existing.remove();
    },

    // Main autofill execution
    autofill(profileData, silent = false) {
      if (!profileData) {
        if (!silent) this.showToast("No active Resumely profile to autofill", false);
        return { success: false, count: 0 };
      }

      // Cache profile for auto-triggers
      this.cachedProfile = profileData;

      const detected = this.detectFormFields();
      let filledCount = 0;
      const filledKeys = new Set();

      for (const item of detected) {
        // Skip if already filled and has non-empty value
        if (item.element.getAttribute("data-resumely-filled") === "true" && item.element.value) {
          continue;
        }

        // Skip fullName if firstName and lastName were both filled
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
        if (!silent) {
          this.showToast(`✨ Resumely filled ${filledCount} field${filledCount > 1 ? "s" : ""}!`, true);
        }
      } else if (!silent) {
        this.showToast("No unfilled application fields found on this page", false);
      }

      return { success: true, count: filledCount };
    },
  };

  // Expose engine globally on window
  window.__ResumelyAutofillEngine = AutofillEngine;

  // Listen for extension messages (Manual trigger only - no automatic background filling)
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "AUTOFILL_FORM") {
        if (request.profileData) {
          AutofillEngine.cachedProfile = request.profileData;
        }
        // Popup and floating widget handle their own user feedback UI; suppress redundant in-page toast unless explicitly requested
        const isSilent = request.silent !== false;
        const result = AutofillEngine.autofill(request.profileData || AutofillEngine.cachedProfile, isSilent);
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

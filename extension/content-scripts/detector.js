// Resumely In-Page Job Detector
// Extracts structured job posting information across major job boards and generic career sites

(function () {
  // Never execute inside iframes to prevent multiple listeners and extraction overhead
  if (window.self !== window.top) {
    return;
  }

  if (window.__resumely_detector_loaded) return;
  window.__resumely_detector_loaded = true;

  const JobDetector = {
    // 1. JSON-LD Schema.org detection (used by Google Jobs, Greenhouse, Lever, Workday, etc.)
    extractFromJsonLd() {
      try {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          const content = script.textContent || "";
          if (!/jobposting/i.test(content)) continue;

          let json = JSON.parse(content);
          let item = null;

          if (Array.isArray(json)) {
            item = json.find((i) => /jobposting/i.test(JSON.stringify(i?.["@type"] || ""))) || json[0];
          } else if (json && json["@graph"] && Array.isArray(json["@graph"])) {
            item = json["@graph"].find((i) => /jobposting/i.test(JSON.stringify(i?.["@type"] || ""))) || json["@graph"][0];
          } else if (json && (/jobposting/i.test(JSON.stringify(json["@type"] || "")) || json.title || json.jobTitle)) {
            item = json;
          }

          if (item && (item.title || item.jobTitle || item.name)) {
            let company = "";
            if (typeof item.hiringOrganization === "string") company = item.hiringOrganization;
            else if (item.hiringOrganization && item.hiringOrganization.name) company = item.hiringOrganization.name;

            let location = "";
            if (item.jobLocation) {
              const addr = item.jobLocation.address;
              if (typeof addr === "string") location = addr;
              else if (addr) {
                location = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(", ");
              }
            }

            let salary = "";
            if (item.baseSalary) {
              const val = item.baseSalary.value;
              if (val) {
                if (typeof val === "object") {
                  salary = `${val.minValue || ""} - ${val.maxValue || ""} ${val.unitText || ""}`.trim();
                } else {
                  salary = String(val);
                }
              }
            }

            let description = item.description || "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = description;
            const cleanDescription = (tempDiv.textContent || tempDiv.innerText || description).trim();

            return {
              title: item.title || item.jobTitle || item.name || "",
              company,
              location,
              salary,
              description: cleanDescription,
              source: "Schema.org (JSON-LD)",
            };
          }
        }
      } catch (e) {
        // Fall through to DOM scrapers
      }
      return null;
    },

    // 2. LinkedIn Job Scraper
    extractLinkedIn() {
      const isLinkedIn = window.location.hostname.includes("linkedin.com") || window.location.href.includes("linkedin");
      if (!isLinkedIn) return null;

      const title =
        document.querySelector(
          ".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1.t-24, .top-card-layout__title, .jobs-search__job-details--container h2, h1"
        )?.innerText?.trim() || "";

      const company =
        document.querySelector(
          ".job-details-jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name, .topcard__org-name-link, .top-card-layout__first-subline a, a[href*='/company/']"
        )?.innerText?.trim() || "";

      const location =
        document.querySelector(
          ".job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .topcard__flavor--bullet, .top-card-layout__first-subline .topcard__flavor:nth-child(2)"
        )?.innerText?.trim() || "";

      const descEl =
        document.querySelector(
          "#job-details, .jobs-description__content, .jobs-box__html-content, .jobs-description-content__text, .show-more-less-html__markup, .description__text, .jobs-description"
        );
      const description = descEl ? (descEl.innerText || descEl.textContent || "").trim() : "";

      const salary =
        document.querySelector(".job-details-jobs-unified-top-card__job-insight:has(svg), .compensation__salary")?.innerText?.trim() || "";

      if (title || description) {
        return {
          title,
          company,
          location,
          salary,
          description,
          source: "LinkedIn",
        };
      }
      return null;
    },

    // 3. Indeed Job Scraper
    extractIndeed() {
      const isIndeed = window.location.hostname.includes("indeed.com") || window.location.href.includes("indeed");
      if (!isIndeed) return null;

      const title =
        document.querySelector(".jobsearch-JobInfoHeader-title, [data-testid='jobsearch-JobInfoHeader-title'], h1")?.innerText?.trim() || "";

      const company =
        document.querySelector("[data-testid='inlineHeader-companyName'], .jobsearch-CompanyInfoContainer a, [data-company-name='true']")?.innerText?.trim() || "";

      const location =
        document.querySelector("[data-testid='inlineHeader-companyLocation'], .jobsearch-JobInfoHeader-companyLocation")?.innerText?.trim() || "";

      const salary =
        document.querySelector("#salaryInfoAndJobType, [data-testid='attribute_snippets_section']")?.innerText?.trim() || "";

      const descEl = document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText");
      const description = descEl ? (descEl.innerText || "").trim() : "";

      if (title || description) {
        return {
          title,
          company,
          location,
          salary,
          description,
          source: "Indeed",
        };
      }
      return null;
    },

    // 4. Greenhouse Scraper
    extractGreenhouse() {
      const isGreenhouse =
        window.location.hostname.includes("greenhouse.io") ||
        window.location.href.includes("greenhouse") ||
        document.querySelector("#grnhse_app, .greenhouse-job, .app-title");
      if (!isGreenhouse) return null;

      const title =
        document.querySelector(".app-title, h1.title, #header h1, h1")?.innerText?.trim() || "";
      const company =
        document.querySelector(".company-name, #header .company, .sub-title")?.innerText?.replace(/^at\s+/i, "")?.trim() || "";
      const location =
        document.querySelector(".location, .body--metadata")?.innerText?.trim() || "";
      const descEl = document.querySelector("#content, .content, #main");
      const description = descEl ? (descEl.innerText || "").trim() : "";

      if (title || description) {
        return {
          title,
          company,
          location,
          salary: "",
          description,
          source: "Greenhouse",
        };
      }
      return null;
    },

    // 5. Lever Scraper
    extractLever() {
      const isLever =
        window.location.hostname.includes("lever.co") ||
        window.location.href.includes("lever") ||
        document.querySelector(".posting-headline");
      if (!isLever) return null;

      const title = document.querySelector(".posting-headline h2, h2, h1")?.innerText?.trim() || "";
      const company = document.querySelector(".main-header-logo img")?.getAttribute("alt") || "";
      const location = document.querySelector(".posting-categories .location")?.innerText?.trim() || "";
      const descEl = document.querySelector(".section-wrapper, .posting-page");
      const description = descEl ? (descEl.innerText || "").trim() : "";

      if (title || description) {
        return {
          title,
          company,
          location,
          salary: "",
          description,
          source: "Lever",
        };
      }
      return null;
    },

    // 6. Generic Heuristic Scraper (Ashby, Workday, Wellfound, Monster, Direct Careers Pages)
    extractGeneric() {
      // 1. Look for Job Title
      const titleSelectors = [
        '[class*="job-title"]',
        '[class*="jobTitle"]',
        '[class*="position-title"]',
        '[data-testid*="job-title"]',
        '[data-automation-id="jobTitle"]',
        '[data-automation-id="jobPostingHeader"]',
        'h1',
        'h2.title'
      ];
      let title = "";
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const t = el.innerText.trim();
          if (t.length > 2 && t.length < 120) {
            title = t;
            break;
          }
        }
      }
      if (!title) {
        title = document.title.split(/[-–|•]/)[0].trim();
      }

      // 2. Look for Company
      let company = "";
      const companySelectors = [
        '[class*="company-name"]',
        '[class*="companyName"]',
        '[data-automation-id="companyName"]',
        '[class*="employer"]',
        '[class*="organization"]',
        'meta[property="og:site_name"]'
      ];
      for (const sel of companySelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const val = el.getAttribute("content") || el.innerText || "";
          if (val.trim()) {
            company = val.trim();
            break;
          }
        }
      }
      if (!company && document.title.includes("-")) {
        const parts = document.title.split("-");
        if (parts.length > 1) company = parts[parts.length - 1].trim();
      }
      if (!company) {
        company = window.location.hostname.replace(/^www\./, "").split(".")[0];
        if (company) company = company.charAt(0).toUpperCase() + company.slice(1);
      }

      // 3. Look for Description Container
      const descSelectors = [
        '#job-details',
        '#jobDescriptionText',
        '[data-automation-id="jobPostingDescription"]',
        '[class*="JobPosting_description"]',
        '[class*="job-description"]',
        '[class*="jobDescription"]',
        '[id*="job-description"]',
        '[id*="jobDescription"]',
        '[class*="posting-requirements"]',
        '[class*="job-detail"]',
        '[class*="description"]',
        'article',
        'main',
        '#content',
        '.content'
      ];

      let description = "";
      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const text = (el.innerText || el.textContent || "").trim();
          if (text.length > 120) {
            description = text;
            break;
          }
        }
      }

      // 4. Fallback: Aggregate paragraphs and list items if no single container is found
      if (!description || description.length < 120) {
        const nodes = Array.from(document.querySelectorAll("p, li"))
          .map((n) => n.innerText.trim())
          .filter((t) => t.length > 30);
        if (nodes.length >= 2) {
          description = nodes.join("\n");
        }
      }

      // Verify that this is genuinely a job opening
      const isLikelyJobPage =
        description.length > 100 ||
        /\/(jobs|job|careers|career|positions|openings)(\/|$)/i.test(window.location.pathname) ||
        /\b(engineer|developer|manager|designer|specialist|analyst|intern|lead|associate|officer|director|coordinator|consultant|technician)\b/i.test(title);

      if (!isLikelyJobPage && description.length < 50) {
        return null;
      }

      return {
        title: title || document.title,
        company: company || "Company",
        location: "",
        salary: "",
        description: description || "",
        source: "Job Posting",
      };
    },

    // Main extract method
    extract() {
      const url = window.location.href;
      const data =
        this.extractFromJsonLd() ||
        this.extractLinkedIn() ||
        this.extractIndeed() ||
        this.extractGreenhouse() ||
        this.extractLever() ||
        this.extractGeneric();

      if (!data) {
        return null;
      }

      return {
        ...data,
        jobUrl: url,
        extractedAt: Date.now(),
      };
    },
  };

  // Expose to window
  window.__ResumelyJobDetector = JobDetector;

  // Listen for extraction requests from popup or background service worker
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "EXTRACT_JOB_DETAILS") {
        try {
          const jobData = JobDetector.extract();
          sendResponse({ success: true, data: jobData });
        } catch (err) {
          sendResponse({ success: false, error: err.message });
        }
        return true;
      }
    });
  }
})();


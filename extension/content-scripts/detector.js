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
          if (!content.includes("JobPosting")) continue;

          let json = JSON.parse(content);
          if (Array.isArray(json)) {
            json = json.find((item) => item["@type"] === "JobPosting") || json[0];
          } else if (json["@graph"]) {
            json = json["@graph"].find((item) => item["@type"] === "JobPosting") || json;
          }

          if (json && (json["@type"] === "JobPosting" || json.title || json.jobTitle)) {
            let company = "";
            if (typeof json.hiringOrganization === "string") company = json.hiringOrganization;
            else if (json.hiringOrganization && json.hiringOrganization.name) company = json.hiringOrganization.name;

            let location = "";
            if (json.jobLocation) {
              const addr = json.jobLocation.address;
              if (typeof addr === "string") location = addr;
              else if (addr) {
                location = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(", ");
              }
            }

            let salary = "";
            if (json.baseSalary) {
              const val = json.baseSalary.value;
              if (val) {
                if (typeof val === "object") {
                  salary = `${val.minValue || ""} - ${val.maxValue || ""} ${val.unitText || ""}`.trim();
                } else {
                  salary = String(val);
                }
              }
            }

            let description = json.description || "";
            // Strip HTML tags for clean text
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = description;
            const cleanDescription = (tempDiv.textContent || tempDiv.innerText || description).trim();

            return {
              title: json.title || json.jobTitle || "",
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
      if (!window.location.hostname.includes("linkedin.com")) return null;

      const title =
        document.querySelector(".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1.t-24, .top-card-layout__title")?.innerText?.trim() || "";

      const company =
        document.querySelector(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .topcard__org-name-link, .top-card-layout__first-subline a")?.innerText?.trim() || "";

      const location =
        document.querySelector(".job-details-jobs-unified-top-card__bullet, .jobs-unified-top-card__bullet, .topcard__flavor--bullet, .top-card-layout__first-subline .topcard__flavor:nth-child(2)")?.innerText?.trim() || "";

      const descEl =
        document.querySelector("#job-details, .jobs-description-content__text, .show-more-less-html__markup, .description__text");
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
      if (!window.location.hostname.includes("indeed.com")) return null;

      const title =
        document.querySelector(".jobsearch-JobInfoHeader-title, [data-testid='jobsearch-JobInfoHeader-title']")?.innerText?.trim() ||
        document.querySelector("h1")?.innerText?.trim() || "";

      const company =
        document.querySelector("[data-testid='inlineHeader-companyName'], .jobsearch-CompanyInfoContainer a")?.innerText?.trim() || "";

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
      if (!window.location.hostname.includes("greenhouse.io")) return null;

      const title =
        document.querySelector(".app-title, h1.title, #header h1")?.innerText?.trim() || "";
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
      if (!window.location.hostname.includes("lever.co")) return null;

      const title = document.querySelector(".posting-headline h2, h2")?.innerText?.trim() || "";
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

    // 6. Generic Heuristic Scraper
    extractGeneric() {
      // Look for H1 heading
      const h1 = document.querySelector("h1");
      const title = h1 ? h1.innerText.trim() : document.title.split(/[-–|]/)[0].trim();

      // Look for company from meta tags or title
      let company = "";
      const metaSiteName = document.querySelector('meta[property="og:site_name"]');
      if (metaSiteName) company = metaSiteName.getAttribute("content") || "";
      if (!company && document.title.includes("-")) {
        const parts = document.title.split("-");
        if (parts.length > 1) company = parts[parts.length - 1].trim();
      }

      // Look for description containers
      const candidates = [
        document.querySelector('[class*="job-description"]'),
        document.querySelector('[id*="job-description"]'),
        document.querySelector('[class*="description"]'),
        document.querySelector("article"),
        document.querySelector("main"),
      ].filter(Boolean);

      let description = "";
      for (const el of candidates) {
        const text = (el.innerText || el.textContent || "").trim();
        if (text.length > 250) {
          description = text;
          break;
        }
      }

      // If still empty, scan body paragraphs
      if (!description) {
        const paragraphs = Array.from(document.querySelectorAll("p"))
          .map((p) => p.innerText.trim())
          .filter((t) => t.length > 40);
        if (paragraphs.length >= 3) {
          description = paragraphs.join("\n\n");
        }
      }

      return {
        title: title || document.title,
        company: company || window.location.hostname.replace(/^www\./, "").split(".")[0],
        location: "",
        salary: "",
        description: description || "",
        source: "Web Page",
      };
    },

    // Main extract method
    extract() {
      const url = window.location.href;
      let data =
        this.extractFromJsonLd() ||
        this.extractLinkedIn() ||
        this.extractIndeed() ||
        this.extractGreenhouse() ||
        this.extractLever() ||
        this.extractGeneric();

      if (!data) {
        data = {
          title: document.title,
          company: window.location.hostname,
          location: "",
          salary: "",
          description: "",
          source: "Unknown",
        };
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


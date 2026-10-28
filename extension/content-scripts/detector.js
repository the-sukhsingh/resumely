// Resumely In-Page Job Detector
// Robustly extracts structured job posting information across LinkedIn, Indeed, Greenhouse,
// Lever, Ashby, Workday, Google Jobs, and custom company career portals.

(function () {
  // Never execute inside iframes to prevent multiple listeners and extraction overhead
  if (window.self !== window.top) {
    return;
  }

  // Safe text extractor helper
  function safeText(el) {
    if (!el) return "";
    return (el.innerText || el.textContent || "").trim();
  }

  const JobDetector = {
    // 1. JSON-LD Schema.org detection (used by Google Jobs, Greenhouse, Lever, Workday, etc.)
    extractFromJsonLd() {
      try {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
          try {
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
              let cleanDescription = safeText(tempDiv);

              // If description from JSON-LD was minimal or empty, fallback to page body
              if (cleanDescription.length < 80) {
                const bodyDesc = this.extractDescriptionFromDom();
                if (bodyDesc.length > cleanDescription.length) {
                  cleanDescription = bodyDesc;
                }
              }

              return {
                title: item.title || item.jobTitle || item.name || "",
                company,
                location,
                salary,
                description: cleanDescription,
                source: "Schema.org (JSON-LD)",
              };
            }
          } catch (err) {
            // If one script has JSON parse issues, continue to the next
            continue;
          }
        }
      } catch (e) {
        // Fall through to DOM scrapers
      }
      return null;
    },

    // 2. LinkedIn Job Scraper
    extractLinkedIn() {
      const isLinkedIn =
        window.location.hostname.includes("linkedin.com") ||
        window.location.href.includes("linkedin");
      if (!isLinkedIn) return null;

      const titleSelectors = [
        ".job-details-jobs-unified-top-card__job-title",
        ".jobs-unified-top-card__job-title",
        ".jobs-details__main-content h1",
        ".jobs-search__job-details--container h1",
        ".jobs-search__job-details--container h2",
        "h1.t-24",
        ".top-card-layout__title",
        "h1",
      ];
      let title = "";
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text && text.length > 2 && !/^(jobs|notifications|messaging|my network|home|feed)$/i.test(text)) {
          title = text;
          break;
        }
      }

      const companySelectors = [
        ".job-details-jobs-unified-top-card__company-name a",
        ".job-details-jobs-unified-top-card__company-name",
        ".jobs-unified-top-card__company-name a",
        ".jobs-unified-top-card__company-name",
        ".topcard__org-name-link",
        ".top-card-layout__first-subline a",
        "a[href*='/company/']",
      ];
      let company = "";
      for (const sel of companySelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text) {
          company = text;
          break;
        }
      }

      const locationSelectors = [
        ".job-details-jobs-unified-top-card__bullet",
        ".jobs-unified-top-card__bullet",
        ".topcard__flavor--bullet",
        ".top-card-layout__first-subline .topcard__flavor:nth-child(2)",
      ];
      let location = "";
      for (const sel of locationSelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text) {
          location = text;
          break;
        }
      }

      const descSelectors = [
        "#job-details",
        ".jobs-description__content",
        ".jobs-box__html-content",
        ".jobs-description-content__text",
        ".show-more-less-html__markup",
        ".description__text",
        ".jobs-description",
      ];
      let description = "";
      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text.length > 50) {
          description = text;
          break;
        }
      }

      const salaryEl = document.querySelector(
        ".job-details-jobs-unified-top-card__job-insight, .compensation__salary"
      );
      const salary = safeText(salaryEl);

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
      const isIndeed =
        window.location.hostname.includes("indeed.com") ||
        window.location.href.includes("indeed");
      if (!isIndeed) return null;

      const titleSelectors = [
        ".jobsearch-JobInfoHeader-title",
        "[data-testid='jobsearch-JobInfoHeader-title']",
        "h1.jobsearch-JobInfoHeader-title",
        "h1",
      ];
      let title = "";
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text && text.length > 2) {
          title = text;
          break;
        }
      }

      const company = safeText(
        document.querySelector(
          "[data-testid='inlineHeader-companyName'], .jobsearch-CompanyInfoContainer a, [data-company-name='true']"
        )
      );

      const location = safeText(
        document.querySelector(
          "[data-testid='inlineHeader-companyLocation'], .jobsearch-JobInfoHeader-companyLocation"
        )
      );

      const salary = safeText(
        document.querySelector("#salaryInfoAndJobType, [data-testid='attribute_snippets_section']")
      );

      const descEl = document.querySelector("#jobDescriptionText, .jobsearch-jobDescriptionText");
      const description = safeText(descEl);

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
        document.querySelector("#grnhse_app, .greenhouse-job, form#application_form");
      if (!isGreenhouse) return null;

      const title = safeText(
        document.querySelector(".app-title, h1.title, #header h1, h1")
      );
      const company = safeText(
        document.querySelector(".company-name, #header .company, .sub-title")
      ).replace(/^at\s+/i, "");
      const location = safeText(
        document.querySelector(".location, .body--metadata")
      );
      const descEl = document.querySelector("#content, .content, #main");
      const description = safeText(descEl);

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
        document.querySelector(".posting-headline, form#application-form");
      if (!isLever) return null;

      const title = safeText(document.querySelector(".posting-headline h2, h2, h1"));
      const company = document.querySelector(".main-header-logo img")?.getAttribute("alt") || "";
      const location = safeText(document.querySelector(".posting-categories .location"));
      const descEl = document.querySelector(".section-wrapper, .posting-page");
      const description = safeText(descEl);

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

    // 6. Ashby Scraper
    extractAshby() {
      const isAshby =
        window.location.hostname.includes("ashbyhq.com") ||
        window.location.href.includes("ashby") ||
        document.querySelector('[class*="ashby-job-posting"], [data-testid*="ashby"]');
      if (!isAshby) return null;

      const title = safeText(
        document.querySelector('[class*="ashby-job-posting-heading"], [data-testid="job-title"], h1, h2')
      );
      const company = safeText(
        document.querySelector('[class*="ashby-job-posting-company"], [data-testid="company-name"], nav a, header h2')
      );
      const location = safeText(
        document.querySelector('[class*="ashby-job-posting-location"], [data-testid="job-location"]')
      );
      const descEl = document.querySelector(
        '[class*="ashby-job-posting-description"], [data-testid="job-description"], main'
      );
      const description = safeText(descEl);

      if (title || description) {
        return {
          title,
          company,
          location,
          salary: "",
          description,
          source: "Ashby",
        };
      }
      return null;
    },

    // 7. Workday Scraper
    extractWorkday() {
      const isWorkday =
        window.location.hostname.includes("myworkdayjobs.com") ||
        window.location.href.includes("workday") ||
        document.querySelector('[data-automation-id="jobPostingHeader"]');
      if (!isWorkday) return null;

      const title = safeText(
        document.querySelector('[data-automation-id="jobPostingHeader"], h2[data-automation-id="jobPostingHeader"], h1')
      );
      const company =
        document.querySelector('[data-automation-id="companyName"], header img')?.getAttribute("alt") ||
        window.location.hostname.split(".")[0];
      const location = safeText(
        document.querySelector('[data-automation-id="locations"], [data-automation-id="jobPostingLocation"]')
      );
      const descEl = document.querySelector('[data-automation-id="jobPostingDescription"]');
      const description = safeText(descEl);

      if (title || description) {
        return {
          title,
          company,
          location,
          salary: "",
          description,
          source: "Workday",
        };
      }
      return null;
    },

    // Helper: Extract description from DOM container
    extractDescriptionFromDom() {
      const descSelectors = [
        "#job-details",
        "#jobDescriptionText",
        '[data-automation-id="jobPostingDescription"]',
        '[class*="ashby-job-posting-description"]',
        '[data-testid="job-description"]',
        '[data-testid*="job-details"]',
        '[data-qa*="job-description"]',
        '[class*="JobPosting_description"]',
        '[class*="job-description"]',
        '[class*="jobDescription"]',
        '[id*="job-description"]',
        '[id*="jobDescription"]',
        "#job-content",
        ".job-details",
        ".job-overview",
        ".job-post",
        ".posting-content",
        ".careers-description",
        ".role-details",
        ".vacancy-description",
        ".opening-details",
        '[class*="posting-requirements"]',
        '[class*="job-detail"]',
        '[class*="description"]',
        "article",
        "main",
        "#content",
        ".content",
        "#main",
      ];

      for (const sel of descSelectors) {
        const el = document.querySelector(sel);
        const text = safeText(el);
        if (text.length > 80) {
          return text;
        }
      }

      // Fallback: Aggregate paragraphs and list items
      const nodes = Array.from(
        document.querySelectorAll("main p, main li, article p, article li, #content p, #content li, p, li")
      )
        .map((n) => safeText(n))
        .filter((t) => t.length > 25);

      if (nodes.length >= 2) {
        return nodes.slice(0, 50).join("\n");
      }

      return "";
    },

    // 8. Generic Heuristic Scraper (Company Careers Pages, Internal Job Boards)
    extractGeneric() {
      // 1. Look for Job Title
      const titleSelectors = [
        '[class*="job-title"]',
        '[class*="jobTitle"]',
        '[class*="position-title"]',
        '[data-testid*="job-title"]',
        '[data-automation-id="jobTitle"]',
        '[data-automation-id="jobPostingHeader"]',
        "h1",
        "h2.title",
      ];
      let title = "";
      for (const sel of titleSelectors) {
        const els = Array.from(document.querySelectorAll(sel));
        for (const el of els) {
          const t = safeText(el);
          if (
            t.length >= 3 &&
            t.length <= 120 &&
            !/^(home|careers|jobs|about|contact|sign in|login|menu|navigation)$/i.test(t)
          ) {
            title = t;
            break;
          }
        }
        if (title) break;
      }
      if (!title) {
        // Fallback: parse from document.title (e.g., "Senior Software Engineer - Stripe Careers")
        const cleanDocTitle = document.title.split(/[-–|•]/)[0].trim();
        if (cleanDocTitle.length >= 3 && cleanDocTitle.length <= 120) {
          title = cleanDocTitle;
        }
      }

      // 2. Look for Company
      let company = "";
      const companySelectors = [
        '[class*="company-name"]',
        '[class*="companyName"]',
        '[data-automation-id="companyName"]',
        '[class*="employer"]',
        '[class*="organization"]',
        'meta[property="og:site_name"]',
      ];
      for (const sel of companySelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const val = el.getAttribute("content") || safeText(el);
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

      // 3. Extract Description
      const description = this.extractDescriptionFromDom();

      // 4. Verify that this page is genuinely a job opening
      const isJobTitleLikely =
        /\b(engineer|developer|designer|manager|lead|specialist|analyst|intern|architect|consultant|director|scientist|officer|administrator|coordinator|associate|technician|writer|marketer|sales|executive|head)\b/i.test(
          title
        );
      const isJobPathLikely =
        /\/(jobs|job|careers|career|positions|openings|roles|apply)(\/|$)/i.test(
          window.location.pathname + window.location.search
        );
      const hasJobKeywords =
        /\b(responsibilities|requirements|qualifications|about the role|about the job|what you'll do|skills|experience)\b/i.test(
          description
        );

      if (!isJobTitleLikely && !isJobPathLikely && !hasJobKeywords && description.length < 150) {
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
        this.extractAshby() ||
        this.extractWorkday() ||
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

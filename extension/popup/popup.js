// Resumely Popup Controller - Real Data & Authentication Engine
// Integrates live Convex user sessions, multiple tailored resumes, local storage & form autofill

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let authenticatedUser = null;
  let activeResume = null;
  let availableResumes = [];
  let currentJob = null;
  let settings = null;
  let currentStage = "saved";
  let savedJobsList = [];

  // DOM Elements
  const headerCredits = document.getElementById("header-credits");
  const creditsCount = document.getElementById("credits-count");
  const userAvatarImg = document.getElementById("user-avatar-img");
  const userAvatarFallback = document.getElementById("user-avatar-fallback");
  const authStatusDot = document.getElementById("auth-status-dot");
  const authBanner = document.getElementById("auth-banner");
  const btnOpenResumelyLogin = document.getElementById("btn-open-resumely-login");
  const quickEmailInput = document.getElementById("quick-email-input");
  const btnQuickEmailConnect = document.getElementById("btn-quick-email-connect");
  const selectResume = document.getElementById("select-resume");
  const savedJobsCounter = document.getElementById("saved-jobs-counter");
  const toastEl = document.getElementById("popup-toast");

  // Tab 1 Elements
  const jobSourceEl = document.getElementById("job-source");
  const jobTitleEl = document.getElementById("job-title");
  const jobCompanyEl = document.getElementById("job-company");
  const jobLocationEl = document.getElementById("job-location");
  const btnRefreshJob = document.getElementById("btn-refresh-job");
  const matchScoreVal = document.getElementById("match-score-val");
  const scoreRing = document.getElementById("score-ring");
  const scoreRatingLabel = document.getElementById("score-rating-label");
  const scoreDescEl = document.getElementById("score-desc");
  const matchedChipsContainer = document.getElementById("matched-chips");
  const missingChipsContainer = document.getElementById("missing-chips");
  const matchedCountEl = document.getElementById("matched-count");
  const missingCountEl = document.getElementById("missing-count");
  const stagePills = document.querySelectorAll(".stage-pill");
  const jobNotesInput = document.getElementById("job-notes");
  const btnSaveJob = document.getElementById("btn-save-job");
  const saveBtnText = document.getElementById("save-btn-text");
  const linkOpenTracker = document.getElementById("link-open-tracker");
  const linkTailorInApp = document.getElementById("link-tailor-in-app");

  // Tab 2 Elements
  const btnTriggerAutofill = document.getElementById("btn-trigger-autofill");
  const autofillStatusText = document.getElementById("autofill-status-text");
  const qcName = document.getElementById("qc-name");
  const qcEmail = document.getElementById("qc-email");
  const qcPhone = document.getElementById("qc-phone");
  const qcLocation = document.getElementById("qc-location");
  const qcLinkedin = document.getElementById("qc-linkedin");
  const qcGithub = document.getElementById("qc-github");
  const qcWebsite = document.getElementById("qc-website");
  const qcSummaryText = document.getElementById("qc-summary-text");
  const btnCopySummary = document.getElementById("btn-copy-summary");

  // Tab 3 Elements (Saved Jobs)
  const savedJobsContainer = document.getElementById("saved-jobs-container");
  const searchSavedJobs = document.getElementById("search-saved-jobs");
  const linkHeaderTracker = document.getElementById("link-header-tracker");

  // Tab 4 Elements (Pitch)
  const pitchText = document.getElementById("pitch-text");
  const btnGeneratePitch = document.getElementById("btn-generate-pitch");
  const btnCopyPitch = document.getElementById("btn-copy-pitch");

  // Tab 5 Elements (Settings)
  const accName = document.getElementById("acc-name");
  const accEmail = document.getElementById("acc-email");
  const btnDisconnectAccount = document.getElementById("btn-disconnect-account");
  const settingAppUrl = document.getElementById("setting-app-url");
  const settingUserEmail = document.getElementById("setting-user-email");
  const btnTestConnection = document.getElementById("btn-test-connection");
  const selectWidgetMode = document.getElementById("select-widget-mode");
  const currentTabDomain = document.getElementById("current-tab-domain");
  const btnToggleCurrentDomain = document.getElementById("btn-toggle-current-domain");
  const btnResetDemo = document.getElementById("btn-reset-demo");
  let activeTabHostname = "";

  // Navigation Switcher
  const navTabs = document.querySelectorAll(".nav-tab-pill");
  const tabPanes = document.querySelectorAll(".tab-pane");

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function copyToClipboard(text, label = "Item") {
    if (!text || text === "--") return;
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label}!`);
    });
  }

  // 1. Tab Switching
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navTabs.forEach((t) => t.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");

      if (targetId === "tab-saved-jobs") {
        renderSavedJobs();
      }
    });
  });

  // 2. Authentication & Session Initialization
  async function initAuthAndData() {
    settings = await ResumelyStorage.getSettings();
    authenticatedUser = await ResumelyStorage.getAuthenticatedUser();

    // Check live server session automatically
    try {
      const liveSession = await ResumelyAPI.checkActiveSession(settings.appUrl);
      if (liveSession && liveSession.authenticated && liveSession.user) {
        authenticatedUser = liveSession.user;
        await ResumelyStorage.saveAuthenticatedUser(liveSession.user);

        const realResumes = [];
        if (liveSession.masterResume) {
          realResumes.push({ ...liveSession.masterResume, isMasterResume: true });
        }
        if (Array.isArray(liveSession.resumeVersions)) {
          liveSession.resumeVersions.forEach((v) => {
            if (!liveSession.masterResume || v._id !== liveSession.masterResume._id) {
              realResumes.push(v);
            }
          });
        }
        if (realResumes.length > 0) {
          await ResumelyStorage.saveResumes(realResumes);
        }
      }
    } catch (e) {
      // offline or not responding
    }

    // Update Auth UI
    updateAuthHeaderUI();

    // Load Resumes
    availableResumes = await ResumelyStorage.getResumes();
    activeResume = await ResumelyStorage.getActiveResume();
    if (!activeResume && availableResumes.length > 0) {
      activeResume = availableResumes[0];
    }

    populateResumeSelector();
    populateCheatSheet();

    // Load Saved Jobs
    savedJobsList = await ResumelyStorage.getSavedJobs();
    updateSavedJobsCounter();

    // Set deep links
    const root = settings.appUrl || "http://localhost:3000";
    if (linkOpenTracker) linkOpenTracker.href = `${root}/tracker`;
    if (linkHeaderTracker) linkHeaderTracker.href = `${root}/tracker`;

    // Populate Settings UI
    if (settingAppUrl) settingAppUrl.value = settings.appUrl;
    if (settingUserEmail) settingUserEmail.value = authenticatedUser?.email || settings.userEmail || "";
    if (selectWidgetMode) {
      selectWidgetMode.value = settings.widgetActivationMode || "job_sites_only";
    }

    // Inspect active tab domain
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.url.startsWith("http")) {
          activeTabHostname = new URL(tab.url).hostname.toLowerCase();
          updateDomainControlUI();
        } else if (tab && tab.url) {
          activeTabHostname = "Local File / Special Page";
          if (currentTabDomain) currentTabDomain.textContent = activeTabHostname;
          if (btnToggleCurrentDomain) btnToggleCurrentDomain.style.display = "none";
        }
      } catch (e) {}
    }
  }

  function updateDomainControlUI() {
    if (!currentTabDomain) return;
    if (!activeTabHostname || activeTabHostname.startsWith("Local")) {
      currentTabDomain.textContent = activeTabHostname || "No domain";
      if (btnToggleCurrentDomain) btnToggleCurrentDomain.style.display = "none";
      return;
    }

    currentTabDomain.textContent = activeTabHostname;
    const isBlocked = Array.isArray(settings?.blacklistedDomains) && settings.blacklistedDomains.includes(activeTabHostname);

    if (btnToggleCurrentDomain) {
      btnToggleCurrentDomain.style.display = "inline-block";
      btnToggleCurrentDomain.textContent = isBlocked ? "Allow on this site" : "Block on this site";
      btnToggleCurrentDomain.className = isBlocked ? "btn-micro" : "btn-micro danger";
    }
  }

  function updateAuthHeaderUI() {
    if (authenticatedUser && authenticatedUser.email) {
      if (authBanner) authBanner.style.display = "none";
      if (authStatusDot) {
        authStatusDot.className = "status-indicator-dot";
        authStatusDot.title = "Connected to Resumely";
      }

      // Show user avatar
      if (authenticatedUser.picture && userAvatarImg) {
        userAvatarImg.src = authenticatedUser.picture;
        userAvatarImg.style.display = "block";
        if (userAvatarFallback) userAvatarFallback.style.display = "none";
      } else if (userAvatarFallback) {
        userAvatarFallback.textContent = (authenticatedUser.name || "U")[0].toUpperCase();
        userAvatarFallback.style.display = "block";
        if (userAvatarImg) userAvatarImg.style.display = "none";
      }

      // Show Credits
      const credits = authenticatedUser.credits !== undefined ? authenticatedUser.credits : 25;
      if (creditsCount) creditsCount.textContent = `${credits}`;
      if (headerCredits) headerCredits.title = `You have ${credits} Resumely credits available`;

      // Settings card
      if (accName) accName.textContent = authenticatedUser.name || "Resumely User";
      if (accEmail) accEmail.textContent = `${authenticatedUser.email} • ${credits} Credits`;
      if (btnDisconnectAccount) btnDisconnectAccount.style.display = "block";
    } else {
      if (authBanner) authBanner.style.display = "block";
      if (authStatusDot) {
        authStatusDot.className = "status-indicator-dot offline";
        authStatusDot.title = "Using Demo Profile";
      }
      if (creditsCount) creditsCount.textContent = "Demo";
      if (userAvatarFallback) {
        userAvatarFallback.textContent = "A";
        userAvatarFallback.style.display = "block";
      }
      if (userAvatarImg) userAvatarImg.style.display = "none";

      if (accName) accName.textContent = "Demo Mode (Alex Morgan)";
      if (accEmail) accEmail.textContent = "Not connected to live Resumely";
      if (btnDisconnectAccount) btnDisconnectAccount.style.display = "none";
    }
  }

  function populateResumeSelector() {
    if (!selectResume) return;
    selectResume.innerHTML = "";

    if (!availableResumes || availableResumes.length === 0) {
      const opt = document.createElement("option");
      opt.value = "none";
      opt.textContent = "No resumes available";
      selectResume.appendChild(opt);
      return;
    }

    availableResumes.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r._id || r.id;
      const isMaster = r.isMasterResume ? " [Master]" : "";
      opt.textContent = `${r.name || "Resume"}${isMaster}`;
      if (activeResume && (activeResume._id === r._id || activeResume.id === r.id)) {
        opt.selected = true;
      }
      selectResume.appendChild(opt);
    });
  }

  function populateCheatSheet() {
    const p = activeResume?.personalInfo || {};
    if (qcName) qcName.textContent = p.name || authenticatedUser?.name || "Alex Morgan";
    if (qcEmail) qcEmail.textContent = p.email || authenticatedUser?.email || "alex.morgan@example.com";
    if (qcPhone) qcPhone.textContent = p.phone || "+1 (555) 349-8210";
    if (qcLocation) qcLocation.textContent = p.location || "San Francisco, CA";
    if (qcLinkedin) qcLinkedin.textContent = (p.linkedin || "").replace(/^https?:\/\//, "") || "linkedin.com/in/alexmorgan-dev";
    if (qcGithub) qcGithub.textContent = (p.github || "").replace(/^https?:\/\//, "") || "github.com/alexmorgan";
    if (qcWebsite) qcWebsite.textContent = (p.website || "").replace(/^https?:\/\//, "") || "alexmorgan.dev";
    if (qcSummaryText) qcSummaryText.textContent = activeResume?.summary || "Senior software engineer with track record building scalable web products.";
  }

  // 3. Connect via Resumely Web or Email
  btnOpenResumelyLogin?.addEventListener("click", () => {
    const root = settings.appUrl || "http://localhost:3000";
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: `${root}/auth` });
    } else {
      window.open(`${root}/auth`, "_blank");
    }
  });

  btnQuickEmailConnect?.addEventListener("click", async () => {
    const email = quickEmailInput?.value?.trim();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email");
      return;
    }

    btnQuickEmailConnect.disabled = true;
    btnQuickEmailConnect.textContent = "Connecting...";

    try {
      const res = await ResumelyAPI.loginWithEmail(settings.appUrl, email);
      if (res && res.authenticated && res.user) {
        authenticatedUser = res.user;
        await ResumelyStorage.saveAuthenticatedUser(res.user);

        const realResumes = [];
        if (res.masterResume) {
          realResumes.push({ ...res.masterResume, isMasterResume: true });
        }
        if (Array.isArray(res.resumeVersions)) {
          res.resumeVersions.forEach((v) => {
            if (!res.masterResume || v._id !== res.masterResume._id) {
              realResumes.push(v);
            }
          });
        }
        await ResumelyStorage.saveResumes(realResumes);
        availableResumes = realResumes;
        activeResume = realResumes[0] || null;

        updateAuthHeaderUI();
        populateResumeSelector();
        populateCheatSheet();
        if (currentJob) analyzeAndDisplayMatch();

        showToast(`Connected as ${res.user.name || email}!`);
      } else {
        showToast(res.error || "No account found with this email in Resumely");
      }
    } catch (e) {
      showToast("Could not connect to Resumely server");
    } finally {
      btnQuickEmailConnect.disabled = false;
      btnQuickEmailConnect.textContent = "Connect";
    }
  });

  btnDisconnectAccount?.addEventListener("click", async () => {
    await ResumelyStorage.clearAuthenticatedUser();
    authenticatedUser = null;
    availableResumes = await ResumelyStorage.getResumes();
    activeResume = availableResumes[0] || null;
    updateAuthHeaderUI();
    populateResumeSelector();
    populateCheatSheet();
    if (currentJob) analyzeAndDisplayMatch();
    showToast("Signed out. Switched to demo profile.");
  });

  // Switch Active Resume Version
  selectResume?.addEventListener("change", async () => {
    const selectedId = selectResume.value;
    const found = availableResumes.find((r) => (r._id || r.id) === selectedId);
    if (found) {
      activeResume = found;
      await ResumelyStorage.setActiveResumeId(selectedId);
      populateCheatSheet();
      if (currentJob) analyzeAndDisplayMatch();
      showToast(`Active: ${found.name || "Resume"}`);
    }
  });

  // 4. Job Extraction from Current Active Tab
  async function extractJob() {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
      setMockJob();
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        setMockJob();
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_JOB_DETAILS" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.data) {
          setMockJob(tab.title, tab.url);
        } else {
          currentJob = response.data;
          displayJobDetails();
          analyzeAndDisplayMatch();
        }
      });
    } catch (e) {
      setMockJob();
    }
  }

  function setMockJob(title = "Staff Frontend Engineer", url = "https://linear.app/careers/staff-frontend") {
    currentJob = {
      title: title.includes(" - ") ? title.split(" - ")[0] : "Staff Frontend Engineer",
      company: "Linear",
      location: "San Francisco, CA (or Remote)",
      salary: "$180,000 - $240,000",
      source: "Career Portal",
      jobUrl: url,
      description: `
        Linear is looking for a Staff Frontend Engineer proficient in React, Next.js, TypeScript, Tailwind CSS, GraphQL, and WebSockets to scale our client web architecture.
        Requirements:
        • 6+ years of production experience in React, TypeScript, and modern JavaScript.
        • Deep familiarity with Next.js App Router, React Server Components, and client performance profiling.
        • Hands-on experience with GraphQL, REST APIs, and real-time WebSockets.
        • Knowledge of cloud deployment pipelines, Docker, CI/CD, and GitHub Actions.
        • Strong grasp of System Design, Unit Testing (Jest, Vitest), and web security best practices.
      `,
    };
    displayJobDetails();
    analyzeAndDisplayMatch();
  }

  function displayJobDetails() {
    if (!currentJob) return;
    if (jobTitleEl) jobTitleEl.textContent = currentJob.title || "Job Opening";
    if (jobCompanyEl) jobCompanyEl.textContent = currentJob.company || "Company";
    if (jobLocationEl) jobLocationEl.textContent = currentJob.location || "Remote / Onsite";
    if (jobSourceEl) jobSourceEl.textContent = currentJob.source || "Detected";

    // Set tailor link in web app
    const root = settings?.appUrl || "http://localhost:3000";
    if (linkTailorInApp) {
      const q = new URLSearchParams({
        title: currentJob.title || "",
        company: currentJob.company || "",
      });
      linkTailorInApp.href = `${root}/resume/create?${q.toString()}`;
    }
  }

  // 5. ATS Match Scoring with Real Resume
  function analyzeAndDisplayMatch() {
    if (!currentJob || !activeResume) return;

    const analysis = ResumelyMatcher.analyzeMatch(currentJob.description, activeResume);
    const score = analysis.score;

    if (matchScoreVal) matchScoreVal.textContent = score;

    if (scoreRing) {
      const circumference = 226.2; // 2 * PI * 36
      const offset = circumference - (score / 100) * circumference;
      scoreRing.style.strokeDashoffset = offset;

      if (score >= 80) scoreRing.style.stroke = "var(--emerald)";
      else if (score >= 60) scoreRing.style.stroke = "var(--amber)";
      else scoreRing.style.stroke = "var(--rose)";
    }

    if (scoreRatingLabel) {
      if (score >= 85) {
        scoreRatingLabel.textContent = "🎯 Strong ATS Fit";
        scoreRatingLabel.style.color = "var(--emerald)";
      } else if (score >= 65) {
        scoreRatingLabel.textContent = "⚡ Solid Alignment";
        scoreRatingLabel.style.color = "var(--amber)";
      } else {
        scoreRatingLabel.textContent = "⚠️ Tailoring Recommended";
        scoreRatingLabel.style.color = "var(--rose)";
      }
    }

    if (scoreDescEl && analysis.recommendations?.[0]) {
      scoreDescEl.textContent = analysis.recommendations[0];
    }

    // Matched chips
    if (matchedChipsContainer) {
      matchedChipsContainer.innerHTML = "";
      if (analysis.matchedSkills.length > 0) {
        analysis.matchedSkills.forEach((s) => {
          const chip = document.createElement("span");
          chip.className = "skill-chip matched";
          chip.textContent = s;
          matchedChipsContainer.appendChild(chip);
        });
        if (matchedCountEl) matchedCountEl.textContent = analysis.matchedSkills.length;
      } else {
        matchedChipsContainer.innerHTML = '<span class="chip-muted">No exact skill matches</span>';
        if (matchedCountEl) matchedCountEl.textContent = "0";
      }
    }

    // Missing chips
    if (missingChipsContainer) {
      missingChipsContainer.innerHTML = "";
      if (analysis.missingSkills.length > 0) {
        analysis.missingSkills.forEach((s) => {
          const chip = document.createElement("span");
          chip.className = "skill-chip missing";
          chip.textContent = s;
          missingChipsContainer.appendChild(chip);
        });
        if (missingCountEl) missingCountEl.textContent = analysis.missingSkills.length;
      } else {
        missingChipsContainer.innerHTML = '<span class="chip-muted">No critical missing keywords!</span>';
        if (missingCountEl) missingCountEl.textContent = "0";
      }
    }

    // Pre-generate elevator pitch
    generatePitch();
  }

  btnRefreshJob?.addEventListener("click", () => {
    extractJob();
    showToast("Re-scanned active page!");
  });

  // 6. Save Job to Resumely Tracker (Real Data)
  stagePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      stagePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentStage = pill.getAttribute("data-stage") || "saved";
    });
  });

  btnSaveJob?.addEventListener("click", async () => {
    if (!currentJob) return;

    btnSaveJob.disabled = true;
    if (saveBtnText) saveBtnText.textContent = "Saving to Resumely...";

    const payload = {
      userId: authenticatedUser?.id || authenticatedUser?._id || undefined,
      email: authenticatedUser?.email || undefined,
      company: currentJob.company || "Company",
      title: currentJob.title || "Job Title",
      stage: currentStage,
      jobUrl: currentJob.jobUrl || "",
      location: currentJob.location || "",
      salary: currentJob.salary || "",
      description: currentJob.description || "",
      notes: jobNotesInput?.value || "",
      resumeVersionId: activeResume?._id !== "demo_master" ? activeResume?._id : undefined,
      tags: ["Extension", currentJob.source || "Web"],
    };

    let serverSaved = false;
    let appId = null;

    try {
      const res = await ResumelyAPI.saveJob(settings.appUrl, payload);
      if (res && res.success) {
        serverSaved = true;
        appId = res.applicationId;
      }
    } catch (e) {
      // offline fallback
    }

    // Persist locally on user-side
    const savedRecord = await ResumelyStorage.addSavedJobLocally({
      ...payload,
      applicationId: appId,
      syncedWithServer: serverSaved,
      score: matchScoreVal?.textContent || null,
    });

    savedJobsList = await ResumelyStorage.getSavedJobs();
    updateSavedJobsCounter();

    btnSaveJob.classList.add("saved-state");
    if (saveBtnText) {
      saveBtnText.textContent = serverSaved ? "✓ Saved to Convex Tracker!" : "✓ Saved Locally!";
    }
    showToast(serverSaved ? "Saved to Resumely Kanban!" : "Saved in Extension History!");

    setTimeout(() => {
      btnSaveJob.disabled = false;
      btnSaveJob.classList.remove("saved-state");
      if (saveBtnText) saveBtnText.textContent = "Save to Resumely Tracker";
    }, 2500);
  });

  // 7. Saved Jobs Drawer / View (Real User-Side Storage)
  function updateSavedJobsCounter() {
    if (savedJobsCounter) {
      savedJobsCounter.textContent = savedJobsList.length;
    }
  }

  function renderSavedJobs(filterQuery = "") {
    if (!savedJobsContainer) return;
    savedJobsContainer.innerHTML = "";

    const query = filterQuery.toLowerCase().trim();
    const filtered = savedJobsList.filter(
      (j) =>
        !query ||
        j.title?.toLowerCase().includes(query) ||
        j.company?.toLowerCase().includes(query) ||
        j.stage?.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      savedJobsContainer.innerHTML = `<div class="empty-state">${
        query ? "No applications match your filter." : "No saved jobs yet. Clip one from the Match tab!"
      }</div>`;
      return;
    }

    filtered.forEach((job) => {
      const card = document.createElement("div");
      card.className = "job-item-card";

      const timeAgo = formatTimeAgo(job.savedAt || Date.now());
      const root = settings.appUrl || "http://localhost:3000";

      card.innerHTML = `
        <div class="job-item-top">
          <div>
            <div class="job-item-title">${escapeHtml(job.title)}</div>
            <div class="job-item-company">${escapeHtml(job.company)}</div>
          </div>
          <span class="job-item-stage-pill ${job.stage || "saved"}">${job.stage || "saved"}</span>
        </div>
        <div class="job-item-meta">
          <span>${timeAgo}</span>
          <div class="job-item-actions">
            ${job.jobUrl ? `<a href="${job.jobUrl}" target="_blank" class="job-action-link">Open Posting ↗</a>` : ""}
            <a href="${root}/tracker" target="_blank" class="job-action-link">Kanban ↗</a>
            <button class="job-btn-delete" data-id="${job.id || job.applicationId}" title="Delete"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
        </div>
      `;

      card.querySelector(".job-btn-delete")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await ResumelyStorage.deleteSavedJob(job.id || job.applicationId);
        savedJobsList = await ResumelyStorage.getSavedJobs();
        updateSavedJobsCounter();
        renderSavedJobs(searchSavedJobs?.value || "");
        showToast("Removed from tracker");
      });

      savedJobsContainer.appendChild(card);
    });
  }

  searchSavedJobs?.addEventListener("input", () => {
    renderSavedJobs(searchSavedJobs.value);
  });

  function formatTimeAgo(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.innerText = str;
    return div.innerHTML;
  }

  // 8. Form Autofill
  btnTriggerAutofill?.addEventListener("click", async () => {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
      showToast("Autofill simulated in test environment");
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    const profileData = activeResume || { personalInfo: {} };

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "AUTOFILL_FORM",
        profileData,
      },
      (res) => {
        if (chrome.runtime.lastError || !res) {
          showToast("Open an application form to autofill");
        } else if (res.count > 0) {
          showToast(`Autofilled ${res.count} fields!`);
          if (autofillStatusText) {
            autofillStatusText.textContent = `Successfully autofilled ${res.count} application fields!`;
          }
        } else {
          showToast("No compatible form inputs found on page");
        }
      }
    );
  });

  // 9. Quick Copy Clicks
  document.querySelectorAll(".copy-item-row").forEach((row) => {
    row.addEventListener("click", () => {
      const fieldKey = row.getAttribute("data-copy");
      const valEl = row.querySelector(".copy-value");
      copyToClipboard(valEl?.textContent?.trim(), fieldKey || "Text");
    });
  });

  btnCopySummary?.addEventListener("click", () => {
    copyToClipboard(qcSummaryText?.textContent?.trim(), "Summary Statement");
  });

  // 10. AI Pitch Generator
  function generatePitch() {
    if (!pitchText || !currentJob || !activeResume) return;
    const pitch = ResumelyMatcher.generateTailoredPitch(currentJob, activeResume);
    pitchText.value = pitch;
  }

  btnGeneratePitch?.addEventListener("click", () => {
    generatePitch();
    showToast("Regenerated pitch!");
  });

  btnCopyPitch?.addEventListener("click", () => {
    if (pitchText && pitchText.value) {
      copyToClipboard(pitchText.value, "Elevator Pitch");
    }
  });

  // 11. Settings Actions
  btnTestConnection?.addEventListener("click", async () => {
    const appUrl = settingAppUrl?.value?.trim() || "http://localhost:3000";
    const email = settingUserEmail?.value?.trim() || "";

    showToast("Connecting to Resumely...");

    await ResumelyStorage.saveSettings({ appUrl, userEmail: email });
    settings = await ResumelyStorage.getSettings();

    if (email) {
      const res = await ResumelyAPI.loginWithEmail(appUrl, email);
      if (res && res.authenticated && res.user) {
        await ResumelyStorage.saveAuthenticatedUser(res.user);
        authenticatedUser = res.user;

        const realResumes = [];
        if (res.masterResume) realResumes.push({ ...res.masterResume, isMasterResume: true });
        if (Array.isArray(res.resumeVersions)) {
          res.resumeVersions.forEach((v) => {
            if (!res.masterResume || v._id !== res.masterResume._id) realResumes.push(v);
          });
        }
        await ResumelyStorage.saveResumes(realResumes);
        availableResumes = realResumes;
        activeResume = realResumes[0] || null;

        updateAuthHeaderUI();
        populateResumeSelector();
        populateCheatSheet();
        if (currentJob) analyzeAndDisplayMatch();

        showToast(`Synced! Found ${realResumes.length} resumes.`);
        return;
      }
    }

    const ping = await ResumelyAPI.pingServer(appUrl);
    if (ping.online) {
      showToast("Connected to Resumely API!");
    } else {
      showToast("Server unreachable at " + appUrl);
    }
  });

  selectWidgetMode?.addEventListener("change", async () => {
    const val = selectWidgetMode.value;
    const updated = await ResumelyStorage.saveSettings({
      widgetActivationMode: val,
      showFloatingWidget: val !== "disabled",
    });
    settings = updated;
    const label =
      val === "job_sites_only"
        ? "Active only on Job Boards & Career Sites"
        : val === "all_sites"
        ? "Active on All Websites with job content"
        : "Floating widget disabled";
    showToast(label);
  });

  btnToggleCurrentDomain?.addEventListener("click", async () => {
    if (!activeTabHostname || activeTabHostname.startsWith("Local")) return;
    const isBlocked = await ResumelyStorage.toggleDomainBlacklist(activeTabHostname);
    settings = await ResumelyStorage.getSettings();
    updateDomainControlUI();
    showToast(isBlocked ? `Excluded on ${activeTabHostname}` : `Allowed on ${activeTabHostname}`);
  });

  btnResetDemo?.addEventListener("click", async () => {
    await ResumelyStorage.clearAuthenticatedUser();
    authenticatedUser = null;
    availableResumes = await ResumelyStorage.getResumes();
    activeResume = availableResumes[0] || null;
    updateAuthHeaderUI();
    populateResumeSelector();
    populateCheatSheet();
    if (currentJob) analyzeAndDisplayMatch();
    showToast("Switched to Alex Morgan demo profile.");
  });

  // Boot
  await initAuthAndData();
  await extractJob();
});

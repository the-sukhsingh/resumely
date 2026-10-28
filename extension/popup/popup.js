// Resumely Popup Controller - High Craft, Minimal, Real Data Engine
// Aligned to Resumely Web App (Convex Backend + Local Storage + ATS Matcher + Form Autofill)

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let authenticatedUser = null;
  let activeResume = null;
  let availableResumes = [];
  let currentJob = null;
  let settings = null;
  let currentStage = "saved";
  let savedJobsList = [];
  let activeTabHostname = "";

  // 1. Navigation & Header Elements
  const btnBrandHome = document.getElementById("btn-brand-home");
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabViews = document.querySelectorAll(".tab-view");
  const trackerCounter = document.getElementById("tracker-counter");
  const headerCredits = document.getElementById("header-credits");
  const creditsCount = document.getElementById("credits-count");
  const btnUserMenu = document.getElementById("btn-user-menu");
  const userAvatarImg = document.getElementById("user-avatar-img");
  const userAvatarFallback = document.getElementById("user-avatar-fallback");
  const authStatusDot = document.getElementById("auth-status-dot");
  const toastEl = document.getElementById("popup-toast");

  // Auth Banner Elements
  const authBanner = document.getElementById("auth-banner");
  const btnOpenResumelyLogin = document.getElementById("btn-open-resumely-login");
  const quickEmailInput = document.getElementById("quick-email-input");
  const btnQuickEmailConnect = document.getElementById("btn-quick-email-connect");

  // Active Resume Selector
  const selectResume = document.getElementById("select-resume");

  // Tab 1: Match & Save Elements
  const jobSourceEl = document.getElementById("job-source");
  const jobSalaryEl = document.getElementById("job-salary");
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
  const stageSegBtns = document.querySelectorAll(".stage-seg");
  const jobNotesInput = document.getElementById("job-notes");
  const btnSaveJob = document.getElementById("btn-save-job");
  const saveBtnText = document.getElementById("save-btn-text");
  const linkOpenTracker = document.getElementById("link-open-tracker");
  const linkTailorInApp = document.getElementById("link-tailor-in-app");
  const btnOpenPitchModal = document.getElementById("btn-open-pitch-modal");

  // Tab 2: Autofill & Cheat Sheet Elements
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

  // Tab 3: Tracker Elements
  const linkHeaderTracker = document.getElementById("link-header-tracker");
  const searchSavedJobs = document.getElementById("search-saved-jobs");
  const savedJobsContainer = document.getElementById("saved-jobs-container");

  // Slide-over Drawer Elements
  const drawerOverlay = document.getElementById("drawer-overlay");
  const settingsDrawer = document.getElementById("settings-drawer");
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  const drawerAvatarImg = document.getElementById("drawer-avatar-img");
  const drawerAvatarFallback = document.getElementById("drawer-avatar-fallback");
  const accName = document.getElementById("acc-name");
  const accEmail = document.getElementById("acc-email");
  const btnDisconnectAccount = document.getElementById("btn-disconnect-account");
  const selectWidgetMode = document.getElementById("select-widget-mode");
  const currentTabDomain = document.getElementById("current-tab-domain");
  const btnToggleCurrentDomain = document.getElementById("btn-toggle-current-domain");
  const settingAppUrl = document.getElementById("setting-app-url");
  const settingUserEmail = document.getElementById("setting-user-email");
  const btnTestConnection = document.getElementById("btn-test-connection");
  const btnResetDemo = document.getElementById("btn-reset-demo");

  // Pitch Modal Elements
  const pitchModal = document.getElementById("pitch-modal");
  const btnClosePitch = document.getElementById("btn-close-pitch");
  const pitchText = document.getElementById("pitch-text");
  const btnGeneratePitch = document.getElementById("btn-generate-pitch");
  const btnCopyPitch = document.getElementById("btn-copy-pitch");

  // Helpers
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

  function openDrawer() {
    drawerOverlay?.classList.add("open");
    settingsDrawer?.classList.add("open");
  }

  function closeDrawer() {
    drawerOverlay?.classList.remove("open");
    settingsDrawer?.classList.remove("open");
  }

  btnUserMenu?.addEventListener("click", openDrawer);
  btnCloseDrawer?.addEventListener("click", closeDrawer);
  drawerOverlay?.addEventListener("click", closeDrawer);

  btnOpenPitchModal?.addEventListener("click", (e) => {
    e.preventDefault();
    if (pitchModal) {
      pitchModal.style.display = "flex";
      generatePitch();
    }
  });

  btnClosePitch?.addEventListener("click", () => {
    if (pitchModal) pitchModal.style.display = "none";
  });

  // 2. Tab Switching
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navTabs.forEach((t) => t.classList.remove("active"));
      tabViews.forEach((v) => v.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add("active");

      if (targetId === "tab-tracker") {
        renderSavedJobs();
      }
    });
  });

  btnBrandHome?.addEventListener("click", (e) => {
    e.preventDefault();
    const root = settings?.appUrl || "http://localhost:3000";
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: root });
    } else {
      window.open(root, "_blank");
    }
  });

  // 3. Authentication & Data Initialization
  async function initAuthAndData() {
    settings = await ResumelyStorage.getSettings();
    authenticatedUser = await ResumelyStorage.getAuthenticatedUser();

    // Verify session with Resumely server
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
      // offline or server not ready
    }

    updateAuthHeaderUI();

    // Resumes
    availableResumes = await ResumelyStorage.getResumes();
    activeResume = await ResumelyStorage.getActiveResume();
    if (!activeResume && availableResumes.length > 0) {
      activeResume = availableResumes[0];
    }

    populateResumeSelector();
    populateCheatSheet();

    // Saved Jobs
    savedJobsList = await ResumelyStorage.getSavedJobs();
    updateSavedJobsCounter();

    // Deep Links
    const root = settings.appUrl || "http://localhost:3000";
    if (linkOpenTracker) linkOpenTracker.href = `${root}/tracker`;
    if (linkHeaderTracker) linkHeaderTracker.href = `${root}/tracker`;

    // Preferences in Drawer
    if (settingAppUrl) settingAppUrl.value = settings.appUrl;
    if (settingUserEmail) settingUserEmail.value = authenticatedUser?.email || settings.userEmail || "";
    if (selectWidgetMode) {
      selectWidgetMode.value = settings.widgetActivationMode || "job_sites_only";
    }

    // Inspect active browser tab domain
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.url.startsWith("http")) {
          activeTabHostname = new URL(tab.url).hostname.toLowerCase();
          updateDomainControlUI();
        } else if (tab && tab.url) {
          activeTabHostname = "Browser Special Page";
          if (currentTabDomain) currentTabDomain.textContent = activeTabHostname;
          if (btnToggleCurrentDomain) btnToggleCurrentDomain.style.display = "none";
        }
      } catch (e) {}
    }
  }

  function updateDomainControlUI() {
    if (!currentTabDomain) return;
    if (!activeTabHostname || activeTabHostname.startsWith("Browser")) {
      currentTabDomain.textContent = activeTabHostname || "No domain";
      if (btnToggleCurrentDomain) btnToggleCurrentDomain.style.display = "none";
      return;
    }

    currentTabDomain.textContent = activeTabHostname;
    const isBlocked = Array.isArray(settings?.blacklistedDomains) && settings.blacklistedDomains.includes(activeTabHostname);

    if (btnToggleCurrentDomain) {
      btnToggleCurrentDomain.style.display = "inline-block";
      btnToggleCurrentDomain.textContent = isBlocked ? "Allow on this site" : "Block on this site";
      btnToggleCurrentDomain.style.color = isBlocked ? "var(--text-primary)" : "#f87171";
    }
  }

  function updateAuthHeaderUI() {
    if (authenticatedUser && authenticatedUser.email) {
      if (authBanner) authBanner.style.display = "none";
      if (authStatusDot) {
        authStatusDot.className = "status-dot";
        authStatusDot.title = "Connected to Resumely";
      }

      const initial = (authenticatedUser.name || authenticatedUser.email || "R")[0].toUpperCase();

      // Top navbar avatar
      if (authenticatedUser.picture && userAvatarImg) {
        userAvatarImg.src = authenticatedUser.picture;
        userAvatarImg.style.display = "block";
        if (userAvatarFallback) userAvatarFallback.style.display = "none";
      } else if (userAvatarFallback) {
        userAvatarFallback.textContent = initial;
        userAvatarFallback.style.display = "block";
        if (userAvatarImg) userAvatarImg.style.display = "none";
      }

      // Drawer avatar
      if (authenticatedUser.picture && drawerAvatarImg) {
        drawerAvatarImg.src = authenticatedUser.picture;
        drawerAvatarImg.style.display = "block";
        if (drawerAvatarFallback) drawerAvatarFallback.style.display = "none";
      } else if (drawerAvatarFallback) {
        drawerAvatarFallback.textContent = initial;
        drawerAvatarFallback.style.display = "block";
        if (drawerAvatarImg) drawerAvatarImg.style.display = "none";
      }

      // Credits badge
      const credits = authenticatedUser.credits !== undefined ? authenticatedUser.credits : 100;
      if (creditsCount) creditsCount.textContent = `${credits}`;
      if (headerCredits) headerCredits.title = `${credits} Resumely credits available`;

      // Drawer account info
      if (accName) accName.textContent = authenticatedUser.name || "Resumely User";
      if (accEmail) accEmail.textContent = `${authenticatedUser.email}`;
      if (btnDisconnectAccount) btnDisconnectAccount.style.display = "block";
    } else {
      if (authBanner) authBanner.style.display = "block";
      if (authStatusDot) {
        authStatusDot.className = "status-dot offline";
        authStatusDot.title = "Demo Mode (Offline)";
      }
      if (creditsCount) creditsCount.textContent = "Demo";
      if (userAvatarFallback) {
        userAvatarFallback.textContent = "D";
        userAvatarFallback.style.display = "block";
      }
      if (userAvatarImg) userAvatarImg.style.display = "none";

      if (drawerAvatarFallback) {
        drawerAvatarFallback.textContent = "D";
        drawerAvatarFallback.style.display = "block";
      }
      if (drawerAvatarImg) drawerAvatarImg.style.display = "none";

      if (accName) accName.textContent = "Demo Candidate (Alex Morgan)";
      if (accEmail) accEmail.textContent = "Sign in to sync your live account";
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
    if (qcLinkedin) qcLinkedin.textContent = (p.linkedin || "").replace(/^https?:\/\//, "") || "linkedin.com/in/alexmorgan";
    if (qcGithub) qcGithub.textContent = (p.github || "").replace(/^https?:\/\//, "") || "github.com/alexmorgan";
    if (qcWebsite) qcWebsite.textContent = (p.website || "").replace(/^https?:\/\//, "") || "alexmorgan.dev";
    if (qcSummaryText) qcSummaryText.textContent = activeResume?.summary || "Full-stack engineer specialized in React, Next.js, TypeScript, and high-performance cloud architectures.";
  }

  // 4. Connect Web / Email Handlers
  btnOpenResumelyLogin?.addEventListener("click", () => {
    const root = settings?.appUrl || "http://localhost:3000";
    if (chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: `${root}/auth` });
    } else {
      window.open(`${root}/auth`, "_blank");
    }
  });

  btnQuickEmailConnect?.addEventListener("click", async () => {
    const email = quickEmailInput?.value?.trim();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address");
      return;
    }

    btnQuickEmailConnect.disabled = true;
    btnQuickEmailConnect.textContent = "...";

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
        showToast(res.error || "No account found with this email");
      }
    } catch (e) {
      showToast("Unable to reach Resumely server");
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
    closeDrawer();
    showToast("Signed out. Switched to demo profile.");
  });

  selectResume?.addEventListener("change", async () => {
    const selectedId = selectResume.value;
    const found = availableResumes.find((r) => (r._id || r.id) === selectedId);
    if (found) {
      activeResume = found;
      await ResumelyStorage.setActiveResumeId(selectedId);
      populateCheatSheet();
      if (currentJob) analyzeAndDisplayMatch();
      showToast(`Selected: ${found.name || "Resume"}`);
    }
  });

  // 5. Job Extraction from Current Tab
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

  function setMockJob(title = "Senior Frontend Engineer", url = "https://linear.app/careers/senior-frontend") {
    currentJob = {
      title: title && title.includes(" - ") ? title.split(" - ")[0] : "Senior Frontend Engineer",
      company: "Linear",
      location: "San Francisco, CA (or Remote)",
      salary: "$170,000 - $220,000",
      source: "Career Portal",
      jobUrl: url || "https://linear.app/careers",
      description: `
        Linear is building the next-generation issue tracking and product planning tool.
        We are looking for a Senior Frontend Engineer proficient in React, Next.js, TypeScript, Tailwind CSS, GraphQL, and real-time state synchronization.
        Requirements:
        • 5+ years building high-craft web applications with React and TypeScript.
        • Strong expertise in Next.js App Router, performance profiling, and accessible component architecture.
        • Experience with GraphQL APIs, WebSockets, and optimistic client-side UI updates.
        • Deep empathy for user experience, animation polish, and tactile interactions.
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

    if (jobSalaryEl) {
      if (currentJob.salary) {
        jobSalaryEl.textContent = currentJob.salary;
        jobSalaryEl.style.display = "inline-block";
      } else {
        jobSalaryEl.style.display = "none";
      }
    }

    const root = settings?.appUrl || "http://localhost:3000";
    if (linkTailorInApp) {
      const q = new URLSearchParams({
        title: currentJob.title || "",
        company: currentJob.company || "",
      });
      linkTailorInApp.href = `${root}/resume/create?${q.toString()}`;
    }
  }

  // 6. ATS Match Scoring
  function analyzeAndDisplayMatch() {
    if (!currentJob || !activeResume) return;

    const analysis = ResumelyMatcher.analyzeMatch(currentJob.description, activeResume);
    const score = analysis.score;

    if (matchScoreVal) matchScoreVal.textContent = score;

    if (scoreRing) {
      const circumference = 176; // 2 * PI * 28
      const offset = circumference - (score / 100) * circumference;
      scoreRing.style.strokeDashoffset = offset;

      if (score >= 80) scoreRing.style.stroke = "var(--accent-emerald)";
      else if (score >= 60) scoreRing.style.stroke = "var(--accent-amber)";
      else scoreRing.style.stroke = "var(--accent-rose)";
    }

    if (scoreRatingLabel) {
      scoreRatingLabel.className = "match-badge";
      if (score >= 80) {
        scoreRatingLabel.textContent = "🎯 Strong Match";
        scoreRatingLabel.classList.add("great");
      } else if (score >= 60) {
        scoreRatingLabel.textContent = "⚡ Good Match";
        scoreRatingLabel.classList.add("good");
      } else {
        scoreRatingLabel.textContent = "⚠️ Tailoring Recommended";
        scoreRatingLabel.classList.add("fair");
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
          chip.className = "chip matched";
          chip.textContent = s;
          matchedChipsContainer.appendChild(chip);
        });
        if (matchedCountEl) matchedCountEl.textContent = analysis.matchedSkills.length;
      } else {
        matchedChipsContainer.innerHTML = '<span class="chip-empty">No exact matches</span>';
        if (matchedCountEl) matchedCountEl.textContent = "0";
      }
    }

    // Missing chips
    if (missingChipsContainer) {
      missingChipsContainer.innerHTML = "";
      if (analysis.missingSkills.length > 0) {
        analysis.missingSkills.forEach((s) => {
          const chip = document.createElement("span");
          chip.className = "chip missing";
          chip.textContent = s;
          missingChipsContainer.appendChild(chip);
        });
        if (missingCountEl) missingCountEl.textContent = analysis.missingSkills.length;
      } else {
        missingChipsContainer.innerHTML = '<span class="chip-empty">No critical missing keywords</span>';
        if (missingCountEl) missingCountEl.textContent = "0";
      }
    }
  }

  btnRefreshJob?.addEventListener("click", () => {
    extractJob();
    showToast("Re-scanned active page!");
  });

  // 7. Stage Selection & Saving Job
  stageSegBtns.forEach((seg) => {
    seg.addEventListener("click", () => {
      stageSegBtns.forEach((s) => s.classList.remove("active"));
      seg.classList.add("active");
      currentStage = seg.getAttribute("data-stage") || "saved";
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

    await ResumelyStorage.addSavedJobLocally({
      ...payload,
      applicationId: appId,
      syncedWithServer: serverSaved,
      score: matchScoreVal?.textContent || null,
    });

    savedJobsList = await ResumelyStorage.getSavedJobs();
    updateSavedJobsCounter();

    btnSaveJob.classList.add("saved");
    if (saveBtnText) {
      saveBtnText.textContent = serverSaved ? "✓ Saved to Convex Kanban!" : "✓ Saved to Extension!";
    }
    showToast(serverSaved ? "Saved to Resumely Kanban!" : "Saved in Extension Tracker!");

    setTimeout(() => {
      btnSaveJob.disabled = false;
      btnSaveJob.classList.remove("saved");
      if (saveBtnText) saveBtnText.textContent = "Save to Job Tracker";
    }, 2400);
  });

  // 8. Saved Jobs Tracker (Tab 3)
  function updateSavedJobsCounter() {
    if (trackerCounter) {
      trackerCounter.textContent = savedJobsList.length;
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
      savedJobsContainer.innerHTML = `<div class="empty-placeholder">${
        query ? "No applications match your search." : "No saved jobs yet. Clip one from the Match tab!"
      }</div>`;
      return;
    }

    filtered.forEach((job) => {
      const item = document.createElement("div");
      item.className = "tracker-item";

      const timeAgo = formatTimeAgo(job.savedAt || Date.now());

      item.innerHTML = `
        <div class="tracker-item-left">
          <div class="tracker-item-title">${escapeHtml(job.title)}</div>
          <div class="tracker-item-company">${escapeHtml(job.company)} • ${timeAgo}</div>
        </div>
        <span class="tracker-item-badge ${job.stage || "saved"}">${job.stage || "saved"}</span>
        <button class="tracker-item-del" data-id="${job.id || job.applicationId}" title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;

      item.querySelector(".tracker-item-left")?.addEventListener("click", () => {
        if (job.jobUrl && chrome.tabs && chrome.tabs.create) {
          chrome.tabs.create({ url: job.jobUrl });
        } else if (job.jobUrl) {
          window.open(job.jobUrl, "_blank");
        }
      });

      item.querySelector(".tracker-item-del")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await ResumelyStorage.deleteSavedJob(job.id || job.applicationId);
        savedJobsList = await ResumelyStorage.getSavedJobs();
        updateSavedJobsCounter();
        renderSavedJobs(searchSavedJobs?.value || "");
        showToast("Removed from tracker");
      });

      savedJobsContainer.appendChild(item);
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

  // 9. Form Autofill (Tab 2)
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
            autofillStatusText.textContent = `Successfully filled ${res.count} inputs!`;
          }
        } else {
          showToast("No compatible form fields found on this page");
        }
      }
    );
  });

  // Quick Copy Click Handling
  document.querySelectorAll(".cheat-row").forEach((row) => {
    row.addEventListener("click", () => {
      const fieldKey = row.getAttribute("data-copy");
      const valEl = row.querySelector(".cheat-val");
      copyToClipboard(valEl?.textContent?.trim(), fieldKey || "Text");
    });
  });

  btnCopySummary?.addEventListener("click", () => {
    copyToClipboard(qcSummaryText?.textContent?.trim(), "Summary Statement");
  });

  // 10. AI Pitch Modal
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

  // 11. Preferences & Drawer Settings
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

        showToast(`Connected! Synced ${realResumes.length} resumes.`);
        return;
      }
    }

    const ping = await ResumelyAPI.pingServer(appUrl);
    if (ping.online) {
      showToast("Server connected successfully!");
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
        ? "Active on All Sites with job content"
        : "Floating widget disabled";
    showToast(label);
  });

  btnToggleCurrentDomain?.addEventListener("click", async () => {
    if (!activeTabHostname || activeTabHostname.startsWith("Browser")) return;
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
    closeDrawer();
    showToast("Switched to Alex Morgan demo profile.");
  });

  // Initialize
  await initAuthAndData();
  await extractJob();
});

// Resumely Popup Controller
// Interacts with active tab, runs ATS matcher, handles form autofill & backend sync

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let currentJob = null;
  let activeProfile = null;
  let activeResume = null;
  let availableResumes = [];
  let settings = null;
  let currentStage = "saved";

  // Elements
  const tabs = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const connectionPill = document.getElementById("connection-pill");
  const connectionLabel = document.getElementById("connection-label");
  const toastEl = document.getElementById("popup-toast");

  // Tab 1 Elements
  const jobTitleEl = document.getElementById("job-title");
  const jobCompanyEl = document.getElementById("job-company");
  const jobLocationEl = document.getElementById("job-location");
  const jobSourceEl = document.getElementById("job-source");
  const btnRefreshJob = document.getElementById("btn-refresh-job");
  const matchScoreVal = document.getElementById("match-score-val");
  const scoreRing = document.getElementById("score-ring");
  const scoreRatingLabel = document.getElementById("score-rating-label");
  const scoreDescEl = document.getElementById("score-desc");
  const matchedChipsContainer = document.getElementById("matched-chips");
  const missingChipsContainer = document.getElementById("missing-chips");
  const matchedCountEl = document.getElementById("matched-count");
  const missingCountEl = document.getElementById("missing-count");
  const stageBtns = document.querySelectorAll(".stage-btn");
  const selectResume = document.getElementById("select-resume");
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

  // Tab 3 Elements
  const pitchText = document.getElementById("pitch-text");
  const btnGeneratePitch = document.getElementById("btn-generate-pitch");
  const btnCopyPitch = document.getElementById("btn-copy-pitch");

  // Tab 4 Elements
  const settingAppUrl = document.getElementById("setting-app-url");
  const settingUserEmail = document.getElementById("setting-user-email");
  const settingUserId = document.getElementById("setting-user-id");
  const btnTestConnection = document.getElementById("btn-test-connection");
  const toggleFloatingWidget = document.getElementById("toggle-floating-widget");
  const toggleDemoMode = document.getElementById("toggle-demo-mode");
  const btnResetDemo = document.getElementById("btn-reset-demo");
  const connTitle = document.getElementById("conn-title");
  const connDesc = document.getElementById("conn-desc");
  const connIcon = document.getElementById("conn-icon");

  // Show Toast
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }

  // Copy text helper
  function copyText(str, label = "Item") {
    if (!str) return;
    navigator.clipboard.writeText(str).then(() => {
      showToast(`Copied ${label}!`);
    });
  }

  // 1. Tab Navigation
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add("active");
    });
  });

  document.getElementById("btn-settings-toggle")?.addEventListener("click", () => {
    const settingsTabBtn = document.querySelector('[data-tab="tab-settings"]');
    if (settingsTabBtn) settingsTabBtn.click();
  });

  // 2. Initialize Settings & Profile
  async function initStorage() {
    settings = await ResumelyStorage.getSettings();
    activeProfile = await ResumelyStorage.getActiveProfile();
    availableResumes = await ResumelyStorage.getResumes();
    activeResume = availableResumes[0] || activeProfile;

    // Populate Settings UI
    if (settingAppUrl) settingAppUrl.value = settings.appUrl || "http://localhost:3000";
    if (settingUserEmail) settingUserEmail.value = settings.userEmail || "";
    if (settingUserId) settingUserId.value = settings.userId || "";
    if (toggleFloatingWidget) toggleFloatingWidget.checked = settings.showFloatingWidget !== false;
    if (toggleDemoMode) toggleDemoMode.checked = !!settings.useDemoMode;

    // Populate Resume Select dropdown
    populateResumeDropdown();

    // Populate Quick Copy Fields
    populateQuickCopyFields();

    // Test connection in background
    checkServerConnection();
  }

  function populateResumeDropdown() {
    if (!selectResume) return;
    selectResume.innerHTML = "";
    availableResumes.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r._id || r.id;
      opt.textContent = `${r.name || "Resume"} ${r.isMasterResume ? "(Master)" : ""}`;
      selectResume.appendChild(opt);
    });
  }

  function populateQuickCopyFields() {
    const p = activeProfile?.personalInfo || {};
    if (qcName) qcName.textContent = p.name || "Alex Morgan";
    if (qcEmail) qcEmail.textContent = p.email || "alex.morgan@example.com";
    if (qcPhone) qcPhone.textContent = p.phone || "+1 (555) 349-8210";
    if (qcLocation) qcLocation.textContent = p.location || "San Francisco, CA";
    if (qcLinkedin) qcLinkedin.textContent = (p.linkedin || "").replace(/^https?:\/\//, "");
    if (qcGithub) qcGithub.textContent = (p.github || "").replace(/^https?:\/\//, "");
    if (qcWebsite) qcWebsite.textContent = (p.website || "").replace(/^https?:\/\//, "");
    if (qcSummaryText) qcSummaryText.textContent = activeProfile?.summary || "";
  }

  // 3. Test Connection with Resumely
  async function checkServerConnection() {
    const url = settings?.appUrl || "http://localhost:3000";
    try {
      const res = await ResumelyAPI.pingServer(url);
      if (res.online) {
        connectionPill?.classList.remove("offline");
        if (connectionLabel) connectionLabel.textContent = "Live App";
        if (connTitle) connTitle.textContent = "Connected to Resumely";
        if (connDesc) connDesc.textContent = `Server responding at ${url}`;
        if (connIcon) connIcon.textContent = "🟢";

        // Try syncing resumes if email/userId set
        if (settings.userEmail || settings.userId) {
          syncBackendResumes();
        }
      } else {
        setOfflineStatus();
      }
    } catch (e) {
      setOfflineStatus();
    }
  }

  function setOfflineStatus() {
    connectionPill?.classList.add("offline");
    if (connectionLabel) connectionLabel.textContent = "Demo Mode";
    if (connTitle) connTitle.textContent = "Using Demo Profile";
    if (connDesc) connDesc.textContent = "Resumely local server not detected. All features fully functional in standalone mode.";
    if (connIcon) connIcon.textContent = "🔵";
  }

  async function syncBackendResumes() {
    try {
      const data = await ResumelyAPI.syncUserData(settings.appUrl, {
        email: settings.userEmail,
        userId: settings.userId,
      });

      if (data && data.success && data.masterResume) {
        const liveList = [data.masterResume, ...(data.resumeVersions || [])];
        availableResumes = liveList;
        activeResume = data.masterResume;
        await ResumelyStorage.saveResumes(liveList);
        await ResumelyStorage.saveActiveProfile(data.masterResume);
        activeProfile = data.masterResume;
        populateResumeDropdown();
        populateQuickCopyFields();
        if (currentJob) analyzeAndDisplayMatch();
      }
    } catch (e) {
      console.warn("Backend sync failed:", e);
    }
  }

  // 4. Extract Job From Active Browser Tab
  async function extractJobFromActiveTab() {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
      // Testing environment fallback
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
          // If content script was not ready or page has no job, fallback gracefully
          setMockJob(tab.title, tab.url);
        } else {
          currentJob = response.data;
          displayJobDetails();
          analyzeAndDisplayMatch();
        }
      });
    } catch (err) {
      setMockJob();
    }
  }

  function setMockJob(title = "Senior Full Stack Engineer", url = "https://boards.greenhouse.io/stripe/jobs/4820194") {
    currentJob = {
      title: title.includes(" - ") ? title.split(" - ")[0] : "Senior Full Stack Engineer",
      company: "Stripe",
      location: "San Francisco, CA / Remote",
      salary: "$165,000 - $210,000",
      source: "Job Board",
      jobUrl: url,
      description: `
        About the Role:
        We are looking for a Senior Full Stack Software Engineer to build the next generation of our global payments platform.
        You will work with Next.js, React, TypeScript, Node.js, and PostgreSQL to deliver high-performance microservices and intuitive user interfaces.

        Requirements:
        • 5+ years of software engineering experience with React, TypeScript, and Node.js.
        • Strong proficiency with Next.js App Router, modern CSS (Tailwind CSS), and state management.
        • Experience designing REST APIs and distributed backend systems with PostgreSQL or Redis.
        • Familiarity with Docker, Kubernetes, CI/CD pipelines, and AWS cloud infrastructure.
        • Passion for Web Performance Optimization, accessibility (WCAG), and clean system design.
      `,
    };
    displayJobDetails();
    analyzeAndDisplayMatch();
  }

  function displayJobDetails() {
    if (!currentJob) return;
    if (jobTitleEl) jobTitleEl.textContent = currentJob.title || "Job Detected";
    if (jobCompanyEl) jobCompanyEl.textContent = currentJob.company || "Company";
    if (jobLocationEl) jobLocationEl.textContent = currentJob.location || "Remote / Onsite";
    if (jobSourceEl) jobSourceEl.textContent = currentJob.source || "Detected";

    // Set tracker deep link
    const root = settings?.appUrl || "http://localhost:3000";
    if (linkOpenTracker) linkOpenTracker.href = `${root}/tracker`;
    if (linkTailorInApp) {
      const q = new URLSearchParams({
        title: currentJob.title || "",
        company: currentJob.company || "",
      });
      linkTailorInApp.href = `${root}/resume/create?${q.toString()}`;
    }
  }

  // 5. Match Analysis & Score Ring
  function analyzeAndDisplayMatch() {
    if (!currentJob || !activeResume) return;

    const analysis = ResumelyMatcher.analyzeMatch(currentJob.description, activeResume);

    // Update Score Circle
    const score = analysis.score;
    if (matchScoreVal) matchScoreVal.textContent = score;

    if (scoreRing) {
      const circumference = 213.6; // 2 * PI * 34
      const offset = circumference - (score / 100) * circumference;
      scoreRing.style.strokeDashoffset = offset;

      if (score >= 80) scoreRing.style.stroke = "var(--emerald)";
      else if (score >= 60) scoreRing.style.stroke = "var(--amber)";
      else scoreRing.style.stroke = "var(--rose)";
    }

    // Rating Label
    if (scoreRatingLabel) {
      if (score >= 85) {
        scoreRatingLabel.textContent = "🎯 Strong ATS Match";
        scoreRatingLabel.style.color = "var(--emerald)";
      } else if (score >= 65) {
        scoreRatingLabel.textContent = "⚡ Solid Fit";
        scoreRatingLabel.style.color = "var(--amber)";
      } else {
        scoreRatingLabel.textContent = "⚠️ Tailoring Recommended";
        scoreRatingLabel.style.color = "var(--rose)";
      }
    }

    if (scoreDescEl && analysis.recommendations?.[0]) {
      scoreDescEl.textContent = analysis.recommendations[0];
    }

    // Render Matched Chips
    if (matchedChipsContainer) {
      matchedChipsContainer.innerHTML = "";
      if (analysis.matchedSkills.length > 0) {
        analysis.matchedSkills.forEach((skill) => {
          const chip = document.createElement("span");
          chip.className = "skill-chip matched";
          chip.textContent = skill;
          matchedChipsContainer.appendChild(chip);
        });
        if (matchedCountEl) matchedCountEl.textContent = analysis.matchedSkills.length;
      } else {
        matchedChipsContainer.innerHTML = '<span class="chip-placeholder">No exact keywords found</span>';
        if (matchedCountEl) matchedCountEl.textContent = "0";
      }
    }

    // Render Missing Chips
    if (missingChipsContainer) {
      missingChipsContainer.innerHTML = "";
      if (analysis.missingSkills.length > 0) {
        analysis.missingSkills.forEach((skill) => {
          const chip = document.createElement("span");
          chip.className = "skill-chip missing";
          chip.textContent = skill;
          missingChipsContainer.appendChild(chip);
        });
        if (missingCountEl) missingCountEl.textContent = analysis.missingSkills.length;
      } else {
        missingChipsContainer.innerHTML = '<span class="chip-placeholder">No critical gaps!</span>';
        if (missingCountEl) missingCountEl.textContent = "0";
      }
    }

    // Pre-generate elevator pitch
    generatePitch(analysis);
  }

  // 6. Save Job to Tracker
  stageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      stageBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentStage = btn.getAttribute("data-stage") || "saved";
    });
  });

  btnSaveJob?.addEventListener("click", async () => {
    if (!currentJob) return;

    btnSaveJob.disabled = true;
    if (saveBtnText) saveBtnText.textContent = "Saving to Tracker...";

    const payload = {
      userId: settings.userId || undefined,
      email: settings.userEmail || activeProfile?.personalInfo?.email || undefined,
      company: currentJob.company || "Unknown Company",
      title: currentJob.title || "Job Title",
      stage: currentStage,
      jobUrl: currentJob.jobUrl || "",
      location: currentJob.location || "",
      salary: currentJob.salary || "",
      description: currentJob.description || "",
      notes: jobNotesInput?.value || "",
      resumeVersionId: selectResume?.value !== "demo_master" ? selectResume?.value : undefined,
      tags: ["Extension", currentJob.source || "Web"],
    };

    let serverSaved = false;
    try {
      const res = await ResumelyAPI.saveJob(settings.appUrl, payload);
      if (res && res.success) {
        serverSaved = true;
      }
    } catch (e) {
      // offline fallback
    }

    // Always persist in local storage
    await ResumelyStorage.addSavedJobLocally({
      ...payload,
      syncedWithServer: serverSaved,
    });

    btnSaveJob.classList.add("saved-state");
    if (saveBtnText) {
      saveBtnText.textContent = serverSaved ? "✓ Saved to Live Tracker!" : "✓ Saved Locally!";
    }
    showToast(serverSaved ? "Saved to Resumely Tracker!" : "Saved in Extension History!");

    setTimeout(() => {
      btnSaveJob.disabled = false;
      btnSaveJob.classList.remove("saved-state");
      if (saveBtnText) saveBtnText.textContent = "Save to Resumely Tracker";
    }, 3000);
  });

  btnRefreshJob?.addEventListener("click", () => {
    extractJobFromActiveTab();
    showToast("Scanned active tab!");
  });

  // 7. Form Autofill Trigger
  btnTriggerAutofill?.addEventListener("click", async () => {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
      showToast("Autofill simulated in test runner");
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "AUTOFILL_FORM",
        profileData: activeProfile,
      },
      (res) => {
        if (chrome.runtime.lastError || !res) {
          showToast("Open an application form to autofill");
        } else if (res.count > 0) {
          showToast(`Autofilled ${res.count} fields!`);
          if (autofillStatusText) autofillStatusText.textContent = `Autofilled ${res.count} application fields!`;
        } else {
          showToast("No compatible form inputs detected");
        }
      }
    );
  });

  // 8. Quick Copy Row Clicks
  document.querySelectorAll(".copy-row").forEach((row) => {
    row.addEventListener("click", () => {
      const fieldKey = row.getAttribute("data-copy");
      const valEl = row.querySelector(".copy-val");
      const text = valEl ? valEl.textContent.trim() : "";
      copyText(text, fieldKey || "Text");
    });
  });

  btnCopySummary?.addEventListener("click", () => {
    copyText(activeProfile?.summary || "", "Professional Summary");
  });

  // 9. AI Pitch Generator
  function generatePitch(analysis) {
    if (!pitchText || !currentJob || !activeResume) return;
    const pitch = ResumelyMatcher.generateTailoredPitch(currentJob, activeResume);
    pitchText.value = pitch;
  }

  btnGeneratePitch?.addEventListener("click", () => {
    generatePitch();
    showToast("Regenerated tailored pitch!");
  });

  btnCopyPitch?.addEventListener("click", () => {
    if (pitchText && pitchText.value) {
      copyText(pitchText.value, "Elevator Pitch");
    }
  });

  // 10. Settings Event Listeners
  btnTestConnection?.addEventListener("click", async () => {
    const updated = await ResumelyStorage.saveSettings({
      appUrl: settingAppUrl?.value || "http://localhost:3000",
      userEmail: settingUserEmail?.value || "",
      userId: settingUserId?.value || "",
      showFloatingWidget: toggleFloatingWidget?.checked !== false,
      useDemoMode: !!toggleDemoMode?.checked,
    });
    settings = updated;
    showToast("Settings saved. Testing connection...");
    await checkServerConnection();
  });

  toggleFloatingWidget?.addEventListener("change", async () => {
    await ResumelyStorage.saveSettings({ showFloatingWidget: toggleFloatingWidget.checked });
    showToast(toggleFloatingWidget.checked ? "Floating widget enabled" : "Floating widget hidden");
  });

  toggleDemoMode?.addEventListener("change", async () => {
    await ResumelyStorage.saveSettings({ useDemoMode: toggleDemoMode.checked });
    showToast(toggleDemoMode.checked ? "Demo profile mode active" : "Live profile sync active");
    await initStorage();
    analyzeAndDisplayMatch();
  });

  btnResetDemo?.addEventListener("click", async () => {
    await ResumelyStorage.saveActiveProfile(DEFAULT_PROFILE);
    await ResumelyStorage.saveSettings({ useDemoMode: true });
    if (toggleDemoMode) toggleDemoMode.checked = true;
    showToast("Reset to Alex Morgan demo profile!");
    await initStorage();
    analyzeAndDisplayMatch();
  });

  // Resume selector change
  selectResume?.addEventListener("change", () => {
    const selectedId = selectResume.value;
    const found = availableResumes.find((r) => (r._id || r.id) === selectedId);
    if (found) {
      activeResume = found;
      analyzeAndDisplayMatch();
      showToast(`Switched active resume to ${found.name || "Resume"}`);
    }
  });

  // Boot
  await initStorage();
  await extractJobFromActiveTab();
});


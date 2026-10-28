// Resumely Background Service Worker (Manifest V3)
// Handles context menus, message routing, storage initialization, and server sync

importScripts("../lib/storage.js", "../lib/matcher.js", "../lib/api.js");

// 1. Extension Installation & Setup
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[Resumely] Installed / Updated:", details.reason);

  // Initialize default settings and demo profile if not set
  const data = await ResumelyStorage.get(["settings", "profile"]);
  if (!data.settings) {
    await ResumelyStorage.saveSettings(DEFAULT_SETTINGS);
  }
  if (!data.profile) {
    await ResumelyStorage.saveActiveProfile(DEFAULT_PROFILE);
  }

  // Create Context Menus
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "resumely_save_job",
      title: "Save Job to Resumely Tracker",
      contexts: ["page", "selection"],
    });

    chrome.contextMenus.create({
      id: "resumely_autofill",
      title: "Autofill Application with Resumely",
      contexts: ["editable", "page"],
    });

    chrome.contextMenus.create({
      id: "resumely_match_selection",
      title: "Calculate ATS Match for selected text",
      contexts: ["selection"],
    });
  });
});

// 2. Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return;

  if (info.menuItemId === "resumely_autofill") {
    const profile = await ResumelyStorage.getActiveProfile();
    chrome.tabs.sendMessage(tab.id, {
      action: "AUTOFILL_FORM",
      profileData: profile,
    });
  } else if (info.menuItemId === "resumely_save_job") {
    chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_JOB_DETAILS" }, async (response) => {
      if (response && response.data) {
        await saveJobInternal(response.data);
      }
    });
  }
});

// 3. Central Job Saver (Syncs with server or falls back to local storage)
async function saveJobInternal(jobData) {
  const settings = await ResumelyStorage.getSettings();
  const profile = await ResumelyStorage.getActiveProfile();

  // Try saving to live Resumely web app if online
  let savedOnServer = false;
  let serverResponse = null;

  try {
    const payload = {
      userId: settings.userId || undefined,
      email: settings.userEmail || profile.personalInfo?.email || undefined,
      company: jobData.company || "Unknown Company",
      title: jobData.title || "Job Title",
      stage: settings.defaultStage || "saved",
      jobUrl: jobData.jobUrl || "",
      location: jobData.location || "",
      salary: jobData.salary || "",
      description: jobData.description || "",
      tags: ["Extension", jobData.source || "Web"],
    };

    const res = await ResumelyAPI.saveJob(settings.appUrl, payload);
    if (res && res.success) {
      savedOnServer = true;
      serverResponse = res;
    }
  } catch (e) {
    console.warn("[Resumely] Could not save to live server, falling back to local storage:", e);
  }

  // Always persist locally in history
  const savedRecord = await ResumelyStorage.addSavedJobLocally({
    ...jobData,
    syncedWithServer: savedOnServer,
    applicationId: serverResponse?.applicationId || null,
  });

  return { success: true, savedRecord, savedOnServer };
}

// 4. Message Router
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SYNC_AUTHENTICATED_USER") {
    (async () => {
      try {
        const fullData = request.payload;
        if (fullData && fullData.user) {
          await ResumelyStorage.saveAuthenticatedUser(fullData.user);

          const realResumes = [];
          if (fullData.masterResume) {
            realResumes.push({ ...fullData.masterResume, isMasterResume: true });
          }
          if (Array.isArray(fullData.resumeVersions)) {
            fullData.resumeVersions.forEach((v) => {
              if (!fullData.masterResume || v._id !== fullData.masterResume._id) {
                realResumes.push(v);
              }
            });
          }

          if (realResumes.length > 0) {
            await ResumelyStorage.saveResumes(realResumes);
          }

          // Update badge with credit balance or checkmark
          const credits = fullData.user.credits !== undefined ? String(fullData.user.credits) : "✓";
          chrome.action.setBadgeText({ text: credits });
          chrome.action.setBadgeBackgroundColor({ color: "#10b981" });

          sendResponse({ success: true, user: fullData.user, resumeCount: realResumes.length });
        } else {
          sendResponse({ success: false, error: "Invalid payload" });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // async response
  }

  if (request.action === "SAVE_JOB_QUICK") {
    saveJobInternal(request.jobData)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === "PING_BACKGROUND") {
    sendResponse({ status: "ok", timestamp: Date.now() });
    return false;
  }
});


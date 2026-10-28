import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  ChevronDown,
  Zap,
  Target,
  Wand2,
  Kanban,
  RefreshCw,
  Bookmark,
  Check,
  Search,
  Trash2,
  X,
  Copy,
  ExternalLink,
  Shield,
  Server,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  ResumelyStorage,
  UserProfile,
  ResumeVersion,
  SavedJobRecord,
  ExtensionSettings,
  DEFAULT_DEMO_RESUME,
} from "../lib/storage";
import { ResumelyMatcher, MatchAnalysis } from "../lib/matcher";
import { ResumelyAPI } from "../lib/api";

export function PopupApp() {
  // State
  const [activeTab, setActiveTab] = useState<"match" | "autofill" | "tracker">("match");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resumes, setResumes] = useState<ResumeVersion[]>([DEFAULT_DEMO_RESUME]);
  const [activeResumeId, setActiveResumeId] = useState<string>("demo_master");
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [pitchContent, setPitchContent] = useState("");
  const [activeDomain, setActiveDomain] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Resume Dropdown State
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active Job State (Null when not viewing a job posting - no dummy JD shown)
  const [job, setJob] = useState<{
    title: string;
    company: string;
    location: string;
    salary?: string;
    source?: string;
    jobUrl?: string;
    description: string;
  } | null>(null);
  const [isDetectingJob, setIsDetectingJob] = useState(true);

  const [selectedStage, setSelectedStage] = useState<"saved" | "applied" | "interviewing">("saved");
  const [jobNotes, setJobNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [autofillStatus, setAutofillStatus] = useState<string | null>(null);

  // Computed Active Resume
  const activeResume = useMemo(() => {
    return resumes.find((r) => (r._id || r.id) === activeResumeId) || resumes[0] || DEFAULT_DEMO_RESUME;
  }, [resumes, activeResumeId]);

  // Computed ATS Match (Computed strictly when a real job description is present)
  const analysis: MatchAnalysis | null = useMemo(() => {
    if (!job || !job.description) return null;
    return ResumelyMatcher.analyzeMatch(job.description, activeResume);
  }, [job, activeResume]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }

  function copyText(text: string, label = "Item") {
    if (!text || text === "--") return;
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}!`);
  }

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      const s = await ResumelyStorage.getSettings();
      setSettings(s);

      const u = await ResumelyStorage.getAuthenticatedUser();
      setUser(u);

      // Verify live session if available
      try {
        const live = await ResumelyAPI.checkActiveSession(s.appUrl);
        if (live.authenticated && live.user) {
          setUser(live.user);
          await ResumelyStorage.saveAuthenticatedUser(live.user);

          const fetchedResumes: ResumeVersion[] = [];
          if (live.masterResume) fetchedResumes.push({ ...live.masterResume, isMasterResume: true });
          if (Array.isArray(live.resumeVersions)) {
            live.resumeVersions.forEach((v) => {
              if (!live.masterResume || v._id !== live.masterResume._id) {
                fetchedResumes.push(v);
              }
            });
          }
          if (fetchedResumes.length > 0) {
            setResumes(fetchedResumes);
            await ResumelyStorage.saveResumes(fetchedResumes);
          }
        }
      } catch {}

      const localResumes = await ResumelyStorage.getResumes();
      if (localResumes.length > 0) setResumes(localResumes);

      const activeId = await ResumelyStorage.getActiveResumeId();
      setActiveResumeId(activeId);

      const jobs = await ResumelyStorage.getSavedJobs();
      setSavedJobs(jobs);

      // Inspect active tab
      if (typeof chrome !== "undefined" && chrome.tabs?.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          if (tab?.url && (tab.url.startsWith("http") || tab.url.startsWith("file"))) {
            try {
              const host = new URL(tab.url).hostname.toLowerCase();
              setActiveDomain(host || "Local Page");
            } catch {}
          }
          if (tab?.id) {
            fetchJobFromTab(tab.id);
          } else {
            setIsDetectingJob(false);
          }
        });
      } else {
        setIsDetectingJob(false);
      }
    }

    loadData();
  }, []);

  // Fetch job details with dynamic content script injection fallback
  function fetchJobFromTab(tabId: number, canRetry = true) {
    setIsDetectingJob(true);
    chrome.tabs.sendMessage(tabId, { action: "EXTRACT_JOB_DETAILS" }, (response) => {
      if (chrome.runtime?.lastError || !response) {
        if (canRetry && typeof chrome !== "undefined" && chrome.scripting?.executeScript) {
          // Tab was open before extension reload: inject content scripts dynamically and retry
          chrome.scripting
            .executeScript({
              target: { tabId },
              files: [
                "lib/storage.js",
                "lib/matcher.js",
                "content-scripts/detector.js",
                "content-scripts/autofill.js",
              ],
            })
            .then(() => {
              setTimeout(() => fetchJobFromTab(tabId, false), 150);
            })
            .catch(() => {
              setIsDetectingJob(false);
              setJob(null);
            });
        } else {
          setIsDetectingJob(false);
          setJob(null);
        }
        return;
      }

      setIsDetectingJob(false);
      if (response.data && (response.data.title || response.data.description)) {
        setJob(response.data);
      } else {
        setJob(null);
      }
    });
  }

  // Handle Click-Away for Custom Resume Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResumeDropdownOpen(false);
      }
    }
    if (resumeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [resumeDropdownOpen]);

  // Re-scan active tab
  function handleScanActiveTab() {
    showToast("Scanning page for job details...");
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          fetchJobFromTab(tab.id, true);
        } else {
          setIsDetectingJob(false);
        }
      });
    } else {
      setIsDetectingJob(false);
    }
  }

  // Update pitch content when job or resume changes
  useEffect(() => {
    if (job) {
      setPitchContent(ResumelyMatcher.generateTailoredPitch(job, activeResume));
    } else {
      setPitchContent("");
    }
  }, [job, activeResume]);

  // Save Job Handler
  async function handleSaveJob() {
    if (!job) return;
    setIsSaving(true);
    const root = settings?.appUrl || "http://localhost:3000";

    const payload = {
      userId: user?.id || user?._id || undefined,
      email: user?.email || undefined,
      company: job.company || "Company",
      title: job.title || "Job Title",
      stage: selectedStage,
      jobUrl: job.jobUrl || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
      notes: jobNotes,
      resumeVersionId: activeResume._id !== "demo_master" ? activeResume._id : undefined,
      tags: ["Extension", job.source || "Web"],
    };

    let serverSaved = false;
    let appId: string | undefined = undefined;

    try {
      const res = await ResumelyAPI.saveJob(root, payload);
      if (res?.success) {
        serverSaved = true;
        appId = res.applicationId;
      }
    } catch {}

    await ResumelyStorage.addSavedJob({
      ...payload,
      applicationId: appId,
      syncedWithServer: serverSaved,
      score: analysis?.score ?? null,
    });

    const updated = await ResumelyStorage.getSavedJobs();
    setSavedJobs(updated);
    setIsSaving(false);
    setIsSavedSuccess(true);
    showToast(serverSaved ? "Saved to Resumely Kanban!" : "Saved to Extension Tracker!");

    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 2400);
  }

  // Explicit Manual Form Autofill Trigger
  async function handleTriggerAutofill() {
    if (typeof chrome === "undefined" || !chrome.tabs?.query) {
      showToast("Autofill simulated in development");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      chrome.tabs.sendMessage(
        tab.id,
        { action: "AUTOFILL_FORM", profileData: activeResume },
        (res) => {
          if (chrome.runtime?.lastError || !res) {
            showToast("Open an application form to autofill");
          } else if (res.count > 0) {
            showToast(`Autofilled ${res.count} fields!`);
            setAutofillStatus(`Successfully filled ${res.count} application inputs!`);
          } else {
            showToast("No unfilled application fields found");
          }
        }
      );
    });
  }

  // Delete Saved Job
  async function handleDeleteJob(id: string) {
    await ResumelyStorage.deleteSavedJob(id);
    const updated = await ResumelyStorage.getSavedJobs();
    setSavedJobs(updated);
    showToast("Removed from tracker");
  }

  const filteredJobs = savedJobs.filter(
    (j) =>
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contact = activeResume.personalInfo || {};

  return (
    <div className="flex flex-col min-h-[550px] max-h-[585px] w-[380px] bg-zinc-50 text-zinc-900 font-sans relative antialiased select-none">
      {/* 1. Header Navbar (Light Theme, Matches Resumely Web App) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200/80 bg-white/95 backdrop-blur-md px-3.5 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <a
            href={settings?.appUrl || "http://localhost:3000"}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[20px] font-bold tracking-tight text-zinc-950 hover:opacity-80 transition-opacity"
            title="Resumely Web App"
          >
            re.
          </a>

          {/* Custom Resume Version Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setResumeDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 hover:border-zinc-300 px-2.5 py-1 text-[11px] text-zinc-800 transition-all cursor-pointer shadow-2xs max-w-[170px]"
              title="Select Active Resume Version"
            >
              <FileText className="size-3 text-zinc-500 shrink-0" />
              <span className="truncate font-medium text-zinc-900 text-[11px]">
                {activeResume.name || "Resume"}
              </span>
              <ChevronDown
                className={`size-2.5 text-zinc-400 shrink-0 transition-transform duration-150 ${
                  resumeDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Floating Dropdown Menu (Crafted Light Theme Popover) */}
            {resumeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-100 mb-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Resume Versions
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 rounded-full px-1.5 py-0.2">
                    {resumes.length}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                  {resumes.map((r) => {
                    const id = r._id || r.id || "demo_master";
                    const isSelected = id === activeResumeId;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveResumeId(id);
                          ResumelyStorage.setActiveResumeId(id);
                          showToast(`Selected: ${r.name || "Resume"}`);
                          setResumeDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-zinc-100/90 text-zinc-950 font-semibold"
                            : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText
                            className={`size-3.5 shrink-0 ${
                              isSelected ? "text-zinc-950" : "text-zinc-400"
                            }`}
                          />
                          <div className="truncate text-[11px] leading-tight">
                            <span>{r.name || "Resume"}</span>
                            {r.isMasterResume && (
                              <span className="ml-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700">
                                Master
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check className="size-3.5 text-zinc-950 shrink-0 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Credits Badge (Matches Website Credits Badge) */}
          <div
            className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 shadow-2xs"
            title="Available Resumely AI Credits"
          >
            <Zap className="size-2.5 fill-amber-500 text-amber-500" />
            <span>{user?.credits !== undefined ? user.credits : 196}</span>
          </div>

          {/* User Avatar Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex size-7 cursor-pointer items-center justify-center rounded-full border border-zinc-200/80 bg-zinc-100 text-[11px] font-semibold text-zinc-700 shadow-2xs hover:border-zinc-400 active:scale-95 transition-all"
            title="Account & Preferences"
          >
            {user?.picture ? (
              <img src={user.picture} alt="User" className="size-full rounded-full object-cover" />
            ) : (
              <span>{(user?.name || user?.email || "R")[0].toUpperCase()}</span>
            )}
            <span
              className={`absolute bottom-0 right-0 size-2 rounded-full ring-2 ring-white ${
                user ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>
        </div>
      </header>

      {/* 2. Segmented Pill Switcher (Matches AnimatedSwitcher from Website) */}
      <div className="bg-zinc-50 px-3.5 pt-2 pb-1">
        <nav className="flex rounded-xl border border-zinc-200/80 bg-zinc-200/50 p-1 gap-1">
          <button
            onClick={() => setActiveTab("match")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-all active:scale-97 cursor-pointer ${
              activeTab === "match"
                ? "bg-white text-zinc-950 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Target className="size-3 text-zinc-600" />
            <span>Match</span>
          </button>

          <button
            onClick={() => setActiveTab("autofill")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-all active:scale-97 cursor-pointer ${
              activeTab === "autofill"
                ? "bg-white text-zinc-950 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Wand2 className="size-3 text-zinc-600" />
            <span>Autofill</span>
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-all active:scale-97 cursor-pointer ${
              activeTab === "tracker"
                ? "bg-white text-zinc-950 shadow-xs font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Kanban className="size-3 text-zinc-600" />
            <span>Tracker</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${
                activeTab === "tracker" ? "bg-zinc-200 text-zinc-800" : "bg-zinc-200/70 text-zinc-500"
              }`}
            >
              {savedJobs.length}
            </span>
          </button>
        </nav>
      </div>

      {/* 3. Main Views */}
      <main className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col gap-2.5">
        {/* TAB 1: MATCH */}
        {activeTab === "match" && (
          <>
            {isDetectingJob ? (
              /* Scanning State */
              <section className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-xs">
                <div className="size-10 flex items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 border border-zinc-200/70">
                  <RefreshCw className="size-4.5 animate-spin text-zinc-600" />
                </div>
                <div className="max-w-[260px]">
                  <h3 className="text-[13px] font-bold text-zinc-900">Scanning Page...</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Checking {activeDomain || "active tab"} for job posting details & requirements.
                  </p>
                </div>
              </section>
            ) : !job ? (
              /* Empty State (Zero Dummy JD shown) */
              <section className="flex flex-col items-center justify-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-white p-6 text-center shadow-xs">
                <div className="size-11 flex items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 border border-zinc-200/70">
                  <Target className="size-5 text-zinc-500" />
                </div>
                <div className="max-w-[270px]">
                  <h2 className="text-[14px] font-bold text-zinc-900 tracking-tight">No Job Posting Detected</h2>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Open a job post on LinkedIn, Indeed, Greenhouse, Lever, or a career site to calculate live ATS match score, keyword gaps, and tailored pitch.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full max-w-[260px]">
                  <button
                    onClick={handleScanActiveTab}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 py-2 text-[11px] font-semibold text-zinc-800 transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="size-3 text-zinc-500" />
                    <span>Re-scan Tab</span>
                  </button>
                  <a
                    href={`${settings?.appUrl || "http://localhost:3000"}/tracker`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 py-2 text-[11px] font-semibold text-white transition-all cursor-pointer shadow-xs"
                  >
                    <Kanban className="size-3 text-white" />
                    <span>Open Tracker</span>
                  </a>
                </div>
              </section>
            ) : (
              /* Detected Job Header Card */
              <>
                <section className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                          {job.source || "Detected"}
                        </span>
                        {job.salary && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <h1 className="text-[15px] font-bold tracking-tight text-zinc-950 truncate mb-0.5">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate">
                        <span className="font-semibold text-zinc-800">{job.company}</span>
                        {job.location && (
                          <>
                            <span className="text-zinc-400">•</span>
                            <span>{job.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleScanActiveTab}
                      className="size-7 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-92 transition-all shrink-0 cursor-pointer shadow-2xs"
                      title="Re-scan page"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                  </div>

                  {/* ATS Fit Radial Gauge */}
                  {analysis && (
                    <div className="flex items-center gap-3.5 rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-3">
                      <div className="relative size-16 shrink-0">
                        <svg className="size-full -rotate-90" viewBox="0 0 68 68">
                          <circle cx="34" cy="34" r="28" strokeWidth="4.5" className="fill-none stroke-zinc-200" />
                          <circle
                            cx="34"
                            cy="34"
                            r="28"
                            strokeWidth="4.5"
                            strokeDasharray={176}
                            strokeDashoffset={176 - (analysis.score / 100) * 176}
                            strokeLinecap="round"
                            className={`fill-none transition-all duration-700 ease-out ${
                              analysis.score >= 80
                                ? "stroke-emerald-600"
                                : analysis.score >= 60
                                ? "stroke-amber-500"
                                : "stroke-rose-500"
                            }`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[18px] font-bold text-zinc-950 tracking-tight">{analysis.score}</span>
                          <span className="text-[10px] text-zinc-500 font-medium mt-1">%</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-1 ${
                            analysis.score >= 80
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300/60"
                              : analysis.score >= 60
                              ? "bg-amber-100 text-amber-800 border border-amber-300/60"
                              : "bg-rose-100 text-rose-800 border border-rose-300/60"
                          }`}
                        >
                          {analysis.score >= 80
                            ? "🎯 Strong ATS Fit"
                            : analysis.score >= 60
                            ? "⚡ Solid Match"
                            : "⚠️ Tailoring Recommended"}
                        </span>
                        <p className="text-[11px] text-zinc-600 leading-snug line-clamp-2">
                          {analysis.recommendations[0] ||
                            "Comparing extracted requirements against your active resume skills."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Skills Chips Breakdown */}
                  {analysis && (
                    <div className="flex flex-col gap-2 pt-0.5 text-[11px]">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-zinc-700 font-medium">Matched Skills</span>
                          <span className="bg-emerald-100 text-emerald-800 rounded-full px-1.5 text-[9px] font-semibold">
                            {analysis.matchedSkills.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                          {analysis.matchedSkills.length > 0 ? (
                            analysis.matchedSkills.map((s) => (
                              <span
                                key={s}
                                className="rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 italic text-[10px]">No exact matches found</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-zinc-700 font-medium">Missing Keywords</span>
                          <span className="bg-rose-100 text-rose-800 rounded-full px-1.5 text-[9px] font-semibold">
                            {analysis.missingSkills.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                          {analysis.missingSkills.length > 0 ? (
                            analysis.missingSkills.map((s) => (
                              <span
                                key={s}
                                className="rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-800"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400 italic text-[10px]">None detected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Action Card: Save to Kanban */}
                <section className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs">
                  <div className="flex rounded-xl border border-zinc-200 bg-zinc-100 p-0.5 gap-0.5">
                    {(["saved", "applied", "interviewing"] as const).map((stage) => (
                      <button
                        key={stage}
                        onClick={() => setSelectedStage(stage)}
                        className={`flex-1 rounded-lg py-1.5 text-[11px] font-medium capitalize transition-all active:scale-97 cursor-pointer ${
                          selectedStage === stage
                            ? stage === "saved"
                              ? "bg-white text-blue-700 shadow-2xs font-semibold"
                              : stage === "applied"
                              ? "bg-white text-amber-700 shadow-2xs font-semibold"
                              : "bg-white text-purple-700 shadow-2xs font-semibold"
                            : "text-zinc-500 hover:text-zinc-900"
                        }`}
                      >
                        {stage === "saved" ? "Wishlist" : stage}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={jobNotes}
                    onChange={(e) => setJobNotes(e.target.value)}
                    placeholder="Add optional note (e.g. Referral by Alex)"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-[12px] text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-400 transition-colors"
                  />

                  {/* Tactile Pure Black Button (Resumely Website Style) */}
                  <button
                    onClick={handleSaveJob}
                    disabled={isSaving}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-semibold cursor-pointer active:scale-97 transition-all shadow-xs ${
                      isSavedSuccess ? "bg-emerald-600 text-white" : "bg-zinc-950 text-white hover:bg-zinc-800"
                    }`}
                  >
                    {isSavedSuccess ? (
                      <>
                        <Check className="size-4 stroke-[3]" />
                        <span>Saved to Job Tracker!</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="size-4 fill-current" />
                        <span>{isSaving ? "Saving..." : "Save to Job Tracker"}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-0.5">
                    <a
                      href={`${settings?.appUrl || "http://localhost:3000"}/tracker`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-zinc-900 font-medium transition-colors"
                    >
                      Open Kanban ↗
                    </a>
                    <span>•</span>
                    <a
                      href={`${settings?.appUrl || "http://localhost:3000"}/resume/create?title=${encodeURIComponent(
                        job.title
                      )}&company=${encodeURIComponent(job.company)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-zinc-900 font-medium transition-colors"
                    >
                      Tailor with AI ↗
                    </a>
                    <span>•</span>
                    <button
                      onClick={() => setPitchModalOpen(true)}
                      className="hover:text-zinc-900 font-medium transition-colors cursor-pointer"
                    >
                      Elevator Pitch
                    </button>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {/* TAB 2: AUTOFILL */}
        {activeTab === "autofill" && (
          <>
            <section className="flex flex-col gap-2 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-blue-50/50 p-3.5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-[13px] font-bold text-zinc-900 tracking-tight">Form Autofill</h2>
                  <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                    {autofillStatus || "Fills Greenhouse, Lever, Workday & Google Forms on command."}
                  </p>
                </div>
                <button
                  onClick={handleTriggerAutofill}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-[11px] font-semibold text-white active:scale-97 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <Wand2 className="size-3.5" />
                  <span>Autofill Page</span>
                </button>
              </div>
            </section>

            {/* Quick Copy Cheat Sheet */}
            <section className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs">
              <div className="flex items-baseline justify-between mb-0.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Quick Copy</h3>
                <span className="text-[10px] text-zinc-400">Click row to copy</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  { label: "Name", val: contact.name || "Candidate", key: "Name" },
                  { label: "Email", val: contact.email || "--", key: "Email" },
                  { label: "Phone", val: contact.phone || "--", key: "Phone" },
                  { label: "Location", val: contact.location || "--", key: "Location" },
                  { label: "LinkedIn", val: contact.linkedin || "--", key: "LinkedIn" },
                  { label: "GitHub", val: contact.github || "--", key: "GitHub" },
                  { label: "Portfolio", val: contact.website || "--", key: "Portfolio" },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={() => copyText(item.val, item.key)}
                    className="group flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 text-[11px] hover:bg-zinc-100 hover:border-zinc-300 active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="w-16 shrink-0 font-medium text-zinc-500">{item.label}</span>
                    <span className="flex-1 truncate pr-2 font-medium text-zinc-800">{item.val}</span>
                    <Copy className="size-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Summary Snippet */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-3 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Professional Summary
                  </span>
                  <button
                    onClick={() => copyText(activeResume.summary || "", "Summary")}
                    className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  >
                    <Copy className="size-2.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-700 leading-relaxed max-h-18 overflow-y-auto font-normal">
                  {activeResume.summary || "No professional summary loaded."}
                </p>
              </div>
            </section>
          </>
        )}

        {/* TAB 3: TRACKER */}
        {activeTab === "tracker" && (
          <section className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[13px] font-bold text-zinc-900 tracking-tight">Saved Applications</h2>
                <p className="text-[11px] text-zinc-500">Synced with your Resumely Convex Kanban.</p>
              </div>
              <a
                href={`${settings?.appUrl || "http://localhost:3000"}/tracker`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 transition-all shadow-2xs"
              >
                <span>Kanban</span>
                <ExternalLink className="size-2.5" />
              </a>
            </div>

            <div className="relative my-0.5">
              <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved applications..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 pl-8 pr-3 py-2 text-[12px] text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-2.5 hover:bg-zinc-100/80 hover:border-zinc-300 transition-all"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => j.jobUrl && window.open(j.jobUrl, "_blank")}
                    >
                      <div className="text-[12px] font-semibold text-zinc-900 truncate">{j.title}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{j.company}</div>
                    </div>

                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ml-2 ${
                        j.stage === "applied"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : j.stage === "interviewing"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {j.stage}
                    </span>

                    <button
                      onClick={() => handleDeleteJob(j.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0 ml-1"
                      title="Remove"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[11px] text-zinc-400">
                  {searchQuery ? "No jobs match your search filter." : "No saved jobs yet. Clip one from the Match tab!"}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 4. Slide-over Settings Drawer (CLEAN, MINIMAL & LIGHT THEME) */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[310px] bg-white border-l border-zinc-200 flex flex-col shadow-2xl transition-transform duration-250 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-900 tracking-tight">Settings & Preferences</h3>
          <button
            onClick={() => setDrawerOpen(false)}
            className="size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {/* User Account Card */}
          <div className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full border border-zinc-200 bg-white flex items-center justify-center font-bold text-zinc-800 text-[12px] overflow-hidden shrink-0 shadow-2xs">
                {user?.picture ? (
                  <img src={user.picture} alt="Avatar" className="size-full object-cover" />
                ) : (
                  <span>{(user?.name || user?.email || "R")[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-zinc-900 truncate">
                  {user?.name || "Demo Profile (Alex Morgan)"}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  {user?.email || "Not connected to live Resumely"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200/70 pt-2 mt-0.5">
              <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                <Zap className="size-3 fill-amber-500 text-amber-500" />
                <span>{user?.credits !== undefined ? user.credits : 196} credits</span>
              </div>

              {user ? (
                <button
                  onClick={async () => {
                    await ResumelyStorage.saveAuthenticatedUser(null);
                    setUser(null);
                    setDrawerOpen(false);
                    showToast("Signed out. Switched to demo profile.");
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3" />
                  <span>Sign out</span>
                </button>
              ) : (
                <a
                  href={`${settings?.appUrl || "http://localhost:3000"}/auth`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in ↗
                </a>
              )}
            </div>
          </div>

          {/* Active Website Context */}
          {activeDomain && (
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 shadow-2xs">
              <div>
                <div className="text-[10px] text-zinc-400 font-medium">Active Website</div>
                <div className="text-[12px] font-semibold text-zinc-900 truncate max-w-[200px]">{activeDomain}</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                Ready
              </span>
            </div>
          )}

          {/* Backend Connection */}
          <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5">
            <div className="flex items-center gap-1.5">
              <Server className="size-3.5 text-zinc-600" />
              <span className="text-[11px] font-semibold text-zinc-800">
                Resumely Server
              </span>
            </div>
            <input
              type="text"
              value={settings?.appUrl || "http://localhost:3000"}
              onChange={(e) => setSettings((s) => (s ? { ...s, appUrl: e.target.value } : null))}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[11px] text-zinc-800 outline-none shadow-2xs"
            />
            <button
              onClick={async () => {
                showToast("Testing connection...");
                const ping = await ResumelyAPI.pingServer(settings?.appUrl || "http://localhost:3000");
                showToast(ping.online ? "Server connected successfully!" : "Server unreachable");
              }}
              className="w-full rounded-xl bg-zinc-900 py-2 text-[11px] font-semibold text-white hover:bg-zinc-800 active:scale-97 transition-all cursor-pointer shadow-xs"
            >
              Sync with Resumely
            </button>
          </div>
        </div>
      </aside>

      {/* 5. Elevator Pitch Modal */}
      {pitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-purple-600" />
                <h3 className="text-[13px] font-bold text-zinc-900">Tailored Elevator Pitch</h3>
              </div>
              <button
                onClick={() => setPitchModalOpen(false)}
                className="size-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <textarea
              value={pitchContent}
              onChange={(e) => setPitchContent(e.target.value)}
              rows={9}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 text-[11px] text-zinc-800 leading-relaxed outline-none focus:bg-white focus:border-zinc-400 resize-none shadow-2xs"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setPitchContent(ResumelyMatcher.generateTailoredPitch(job || {}, activeResume));
                  showToast("Regenerated pitch!");
                }}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer shadow-2xs"
              >
                Regenerate
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pitchContent);
                  showToast("Copied Elevator Pitch!");
                  setPitchModalOpen(false);
                }}
                className="rounded-xl bg-zinc-950 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-800 cursor-pointer shadow-xs"
              >
                Copy Pitch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-950 text-white px-3.5 py-1.5 text-[11px] font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

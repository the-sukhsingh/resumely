import React, { useState, useEffect, useMemo } from "react";
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

  // Active Job State
  const [job, setJob] = useState<{
    title: string;
    company: string;
    location: string;
    salary?: string;
    source?: string;
    jobUrl?: string;
    description: string;
  }>({
    title: "Senior Frontend Engineer",
    company: "Linear",
    location: "San Francisco, CA (or Remote)",
    salary: "$170,000 - $220,000",
    source: "Career Portal",
    jobUrl: "https://linear.app/careers",
    description: `
      Linear is looking for a Senior Frontend Engineer proficient in React, Next.js, TypeScript, Tailwind CSS, GraphQL, and real-time state synchronization.
      Requirements:
      • 5+ years building high-craft web applications with React and TypeScript.
      • Strong expertise in Next.js App Router, performance profiling, and accessible component architecture.
      • Experience with GraphQL APIs, WebSockets, and optimistic client-side UI updates.
      • Deep empathy for user experience, animation polish, and tactile interactions.
    `,
  });

  const [selectedStage, setSelectedStage] = useState<"saved" | "applied" | "interviewing">("saved");
  const [jobNotes, setJobNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [autofillStatus, setAutofillStatus] = useState<string | null>(null);

  // Computed Active Resume
  const activeResume = useMemo(() => {
    return resumes.find((r) => (r._id || r.id) === activeResumeId) || resumes[0] || DEFAULT_DEMO_RESUME;
  }, [resumes, activeResumeId]);

  // Computed ATS Match
  const analysis: MatchAnalysis = useMemo(() => {
    return ResumelyMatcher.analyzeMatch(job.description, activeResume);
  }, [job.description, activeResume]);

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
          if (tab?.url && tab.url.startsWith("http")) {
            try {
              const host = new URL(tab.url).hostname.toLowerCase();
              setActiveDomain(host);
            } catch {}
          }
          if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_JOB_DETAILS" }, (response) => {
              if (response?.data?.title || response?.data?.description) {
                setJob(response.data);
              }
            });
          }
        });
      }
    }

    loadData();
  }, []);

  // Update pitch content when job or resume changes
  useEffect(() => {
    setPitchContent(ResumelyMatcher.generateTailoredPitch(job, activeResume));
  }, [job, activeResume]);

  // Save Job Handler
  async function handleSaveJob() {
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
      score: analysis.score,
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

  // Toggle Domain Block
  async function handleToggleDomain() {
    if (!activeDomain) return;
    const isBlocked = await ResumelyStorage.toggleDomainBlacklist(activeDomain);
    const updatedSettings = await ResumelyStorage.getSettings();
    setSettings(updatedSettings);
    showToast(isBlocked ? `Excluded on ${activeDomain}` : `Allowed on ${activeDomain}`);
  }

  const isCurrentDomainBlocked = Boolean(
    activeDomain && settings?.blacklistedDomains?.includes(activeDomain)
  );

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

          {/* Active Resume Selector Chip */}
          <div
            className="relative flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100/80 hover:bg-zinc-200/60 hover:border-zinc-300 px-2.5 py-1 text-[11px] text-zinc-700 transition-all max-w-[165px]"
            title="Active Resume Version"
          >
            <FileText className="size-3 text-zinc-500 shrink-0" />
            <select
              value={activeResumeId}
              onChange={(e) => {
                const id = e.target.value;
                setActiveResumeId(id);
                ResumelyStorage.setActiveResumeId(id);
                const found = resumes.find((r) => (r._id || r.id) === id);
                if (found) showToast(`Selected: ${found.name || "Resume"}`);
              }}
              className="w-full cursor-pointer appearance-none bg-transparent pr-3 text-[11px] font-medium text-zinc-800 outline-none truncate"
            >
              {resumes.map((r) => (
                <option key={r._id || r.id} value={r._id || r.id} className="bg-white text-zinc-900">
                  {r.name || "Resume"} {r.isMasterResume ? "[Master]" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 size-2.5 text-zinc-400" />
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
            {/* Job Header Card */}
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
                    <span className="text-zinc-400">•</span>
                    <span>{job.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast("Re-scanning active page...");
                    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
                      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]?.id) {
                          chrome.tabs.sendMessage(tabs[0].id, { action: "EXTRACT_JOB_DETAILS" }, (res) => {
                            if (res?.data) setJob(res.data);
                          });
                        }
                      });
                    }
                  }}
                  className="size-7 flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:scale-92 transition-all shrink-0 cursor-pointer shadow-2xs"
                  title="Re-scan page"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>

              {/* ATS Fit Radial Gauge */}
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
                    {analysis.score >= 80 ? "🎯 Strong ATS Fit" : analysis.score >= 60 ? "⚡ Solid Match" : "⚠️ Tailoring Recommended"}
                  </span>
                  <p className="text-[11px] text-zinc-600 leading-snug line-clamp-2">
                    {analysis.recommendations[0] || "Comparing extracted requirements against your active resume skills."}
                  </p>
                </div>
              </div>

              {/* Skills Chips Breakdown */}
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
                        <span key={s} className="rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
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
                        <span key={s} className="rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-800">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400 italic text-[10px]">None detected</span>
                    )}
                  </div>
                </div>
              </div>
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
                  isSavedSuccess
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-950 text-white hover:bg-zinc-800"
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

          {/* Floating Assistant Widget Mode */}
          <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5">
            <div className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-zinc-600" />
              <span className="text-[11px] font-semibold text-zinc-800">
                Floating Assistant Pill
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-snug">
              Choose where the quick-save pill appears while browsing.
            </p>

            <select
              value={settings?.widgetActivationMode || "job_sites_only"}
              onChange={async (e) => {
                const mode = e.target.value as any;
                const updated = await ResumelyStorage.saveSettings({
                  widgetActivationMode: mode,
                  showFloatingWidget: mode !== "disabled",
                });
                setSettings(updated);
                showToast(
                  mode === "job_sites_only"
                    ? "Active only on Job Boards & Career Sites"
                    : mode === "all_sites"
                    ? "Active on All Sites with job content"
                    : "Floating widget disabled"
                );
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[11px] font-medium text-zinc-800 outline-none cursor-pointer shadow-2xs"
            >
              <option value="job_sites_only">🎯 Only on Job Boards & Career Sites (Default)</option>
              <option value="all_sites">🌐 On All Websites</option>
              <option value="disabled">🚫 Disabled Everywhere (Popup only)</option>
            </select>

            {/* Current Site Control */}
            {activeDomain && (
              <div className="flex items-center justify-between border-t border-zinc-200/70 pt-2 mt-1">
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Active Website:</div>
                  <div className="text-[11px] font-semibold text-zinc-900 truncate max-w-[130px]">{activeDomain}</div>
                </div>
                <button
                  onClick={handleToggleDomain}
                  className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer shadow-2xs ${
                    isCurrentDomainBlocked
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  {isCurrentDomainBlocked ? "Allow on this site" : "Block on this site"}
                </button>
              </div>
            )}
          </div>

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
                  setPitchContent(ResumelyMatcher.generateTailoredPitch(job, activeResume));
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

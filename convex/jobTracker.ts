import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { generateObject } from "ai";
import { defaultModel } from "./ai";
import { z } from "zod";

// ─── Stage Types ─────────────────────────────────────────────────────────────
const stageValidator = v.union(
  v.literal("saved"),        // "Add for later" / Wishlist
  v.literal("applied"),      // Applied
  v.literal("interviewing"), // In interview rounds
  v.literal("offered"),      // Offer received
  v.literal("rejected"),     // Rejected
  v.literal("archived")      // Archived / Withdrawn
);

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getJobApplications = query({
  args: {
    userId: v.id("users"),
    stage: v.optional(stageValidator),
  },
  handler: async (ctx, args) => {
    let applicationsQuery;
    if (args.stage) {
      applicationsQuery = ctx.db
        .query("jobApplications")
        .withIndex("by_user_and_stage", (q) =>
          q.eq("userId", args.userId).eq("stage", args.stage!)
        );
    } else {
      applicationsQuery = ctx.db
        .query("jobApplications")
        .withIndex("by_user", (q) => q.eq("userId", args.userId));
    }

    const applications = await applicationsQuery.order("desc").collect();

    // Enrich applications with linked resume and job description details
    const enriched = await Promise.all(
      applications.map(async (app) => {
        let resumeVersion: {
          _id: Id<"resumeVersions">;
          name: string;
          matchScore?: number | null;
          updatedAt: number;
        } | null = null;

        if (app.resumeVersionId) {
          const res = await ctx.db.get(app.resumeVersionId);
          if (res) {
            resumeVersion = {
              _id: res._id,
              name: res.name,
              matchScore: res.matchScore,
              updatedAt: res.updatedAt || res._creationTime,
            };
          }
        }

        let jobDescription: {
          _id: Id<"jobDescriptions">;
          extractedSkills: string[];
          requirements: string[];
        } | null = null;

        if (app.jobDescriptionId) {
          const jd = await ctx.db.get(app.jobDescriptionId);
          if (jd) {
            jobDescription = {
              _id: jd._id,
              extractedSkills: jd.extractedSkills ?? [],
              requirements: jd.requirements ?? [],
            };
          }
        }

        return {
          ...app,
          resumeVersion,
          jobDescription,
        };
      })
    );

    return enriched;
  },
});

export const getJobApplicationById = query({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) return null;

    let resumeVersion: Doc<"resumeVersions"> | null = null;
    if (app.resumeVersionId) {
      resumeVersion = await ctx.db.get(app.resumeVersionId);
    }

    let jobDescription: Doc<"jobDescriptions"> | null = null;
    if (app.jobDescriptionId) {
      jobDescription = await ctx.db.get(app.jobDescriptionId);
    }

    return {
      ...app,
      resumeVersion,
      jobDescription,
    };
  },
});

export const getJobApplicationByResumeVersion = query({
  args: { resumeVersionId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobApplications")
      .withIndex("by_resume_version", (q) =>
        q.eq("resumeVersionId", args.resumeVersionId)
      )
      .first();
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createJobApplication = mutation({
  args: {
    userId: v.id("users"),
    company: v.string(),
    title: v.string(),
    stage: stageValidator,
    jobUrl: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    salary: v.optional(v.union(v.string(), v.null())),
    appliedAt: v.optional(v.union(v.number(), v.null())),
    deadline: v.optional(v.union(v.number(), v.null())),
    notes: v.optional(v.union(v.string(), v.null())),
    jobDescriptionId: v.optional(v.union(v.id("jobDescriptions"), v.null())),
    resumeVersionId: v.optional(v.union(v.id("resumeVersions"), v.null())),
    tags: v.optional(v.array(v.string())),
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.optional(v.union(v.string(), v.null())),
          email: v.optional(v.union(v.string(), v.null())),
          phone: v.optional(v.union(v.string(), v.null())),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const appliedAt =
      args.appliedAt !== undefined
        ? args.appliedAt
        : args.stage === "applied"
        ? now
        : null;

    return await ctx.db.insert("jobApplications", {
      ...args,
      appliedAt,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateJobApplicationStage = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    stage: stageValidator,
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Job application not found");

    const patch: {
      stage: "saved" | "applied" | "interviewing" | "offered" | "rejected" | "archived";
      appliedAt?: number | null;
      updatedAt: number;
    } = {
      stage: args.stage,
      updatedAt: Date.now(),
    };

    // If moving to applied and no appliedAt date was recorded, record it now
    if (args.stage === "applied" && !app.appliedAt) {
      patch.appliedAt = Date.now();
    }

    await ctx.db.patch(args.applicationId, patch);
    return args.applicationId;
  },
});

export const updateJobApplication = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    company: v.optional(v.string()),
    title: v.optional(v.string()),
    stage: v.optional(stageValidator),
    jobUrl: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    salary: v.optional(v.union(v.string(), v.null())),
    appliedAt: v.optional(v.union(v.number(), v.null())),
    deadline: v.optional(v.union(v.number(), v.null())),
    notes: v.optional(v.union(v.string(), v.null())),
    jobDescriptionId: v.optional(v.union(v.id("jobDescriptions"), v.null())),
    resumeVersionId: v.optional(v.union(v.id("resumeVersions"), v.null())),
    tags: v.optional(v.array(v.string())),
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.optional(v.union(v.string(), v.null())),
          email: v.optional(v.union(v.string(), v.null())),
          phone: v.optional(v.union(v.string(), v.null())),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { applicationId, ...fields } = args;
    const app = await ctx.db.get(applicationId);
    if (!app) throw new Error("Job application not found");

    const patch: Record<string, unknown> = {
      ...fields,
      updatedAt: Date.now(),
    };

    if (fields.stage === "applied" && !app.appliedAt && fields.appliedAt === undefined) {
      patch.appliedAt = Date.now();
    }

    await ctx.db.patch(applicationId, patch);
    return applicationId;
  },
});

export const linkResumeToJob = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    resumeVersionId: v.id("resumeVersions"),
    jobDescriptionId: v.optional(v.id("jobDescriptions")),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Job application not found");

    const patch: {
      resumeVersionId: Id<"resumeVersions">;
      jobDescriptionId?: Id<"jobDescriptions">;
      updatedAt: number;
    } = {
      resumeVersionId: args.resumeVersionId,
      updatedAt: Date.now(),
    };

    if (args.jobDescriptionId) {
      patch.jobDescriptionId = args.jobDescriptionId;
    }

    await ctx.db.patch(args.applicationId, patch);
    return args.applicationId;
  },
});

export const deleteJobApplication = mutation({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.applicationId);
    return true;
  },
});

// ─── URL Scraping & Extraction Helpers ────────────────────────────────────────

function cleanHtmlToText(html: string): { title?: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : undefined;

  const metaDescMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) ||
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : "";

  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ");

  cleaned = cleaned.replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, "\n");
  cleaned = cleaned.replace(/<br\s*[\/]?>/gi, "\n");
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  const lines = cleaned
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const combined = [title, metaDescription, lines.join("\n")].filter(Boolean).join("\n\n");
  return { title, text: combined.slice(0, 16000) };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export const extractJobFromUrl = action({
  args: {
    userId: v.id("users"),
    url: v.string(),
    stage: stageValidator,
    autoTailor: v.optional(v.boolean()),
    masterResumeId: v.optional(v.id("resumeVersions")),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    jobApplicationId: Id<"jobApplications">;
    jobDescriptionId: Id<"jobDescriptions">;
    resumeVersionId?: Id<"resumeVersions">;
    company: string;
    title: string;
    location?: string;
    salary?: string;
  }> => {
    let cleanText = "";
    let pageTitle: string | undefined = undefined;

    // Validate URL syntax
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(args.url.trim());
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error("Invalid protocol");
      }
    } catch {
      throw new Error(
        `The provided link "${args.url}" is not a valid URL. Please provide a valid web address starting with https://`
      );
    }

    // Check obviously non-job domains (entertainment, streaming, social media)
    const hostname = parsedUrl.hostname.toLowerCase();
    const wrongDomains = [
      "youtube.com", "youtu.be", "tiktok.com", "instagram.com", "facebook.com",
      "twitter.com", "x.com", "spotify.com", "netflix.com", "twitch.tv",
      "pinterest.com", "reddit.com"
    ];
    if (wrongDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
      throw new Error(
        `The provided link (${hostname}) is a media or social network site, not a job vacancy listing. Please provide a direct link to an active job posting (e.g., Greenhouse, Lever, LinkedIn job, or company careers page).`
      );
    }

    try {
      const response = await fetch(args.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job page: HTTP ${response.status}`);
      }

      const html = await response.text();
      const parsed = cleanHtmlToText(html);
      cleanText = parsed.text;
      pageTitle = parsed.title;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      throw new Error(`Could not access job link: ${errorMsg}. Please paste job description manually.`);
    }

    if (cleanText.length < 50) {
      throw new Error(
        "Could not extract readable job content from this URL. The page may require login, JavaScript rendering, or is not a job listing. Please paste the job description manually."
      );
    }

    // Parse and validate the extracted content using Gemini AI
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isJobPosting: z
          .boolean()
          .describe(
            "True ONLY if this webpage represents an authentic job vacancy, employment opening, or role description. False if it is a general website, homepage, article, video, search result list, code repository, shopping item, or login wall."
          ),
        rejectionReason: z
          .string()
          .optional()
          .describe(
            "If isJobPosting is false, explain politely why this page is not a valid job posting (e.g., 'This link points to a company homepage rather than a specific job vacancy. Please link directly to an open role.')."
          ),
        company: z.string().optional().describe("Company name hiring for this role"),
        title: z.string().optional().describe("Exact or clean job title (e.g. Senior Frontend Engineer)"),
        location: z.string().optional().describe("Job location, e.g. San Francisco, CA (Remote) or Hybrid"),
        salary: z.string().optional().describe("Salary or compensation range if mentioned, otherwise empty string"),
        description: z.string().optional().describe("Cleaned, formatted job description in Markdown"),
        requirements: z.array(z.string()).optional().default([]).describe("List of requirements/qualifications"),
        responsibilities: z.array(z.string()).optional().default([]).describe("List of core responsibilities"),
        extractedSkills: z.array(z.string()).optional().default([]).describe("Technical & functional skills required"),
        extractedKeywords: z.array(z.string()).optional().default([]).describe("Important ATS keywords"),
      }),
      prompt: `Analyze this webpage content for Resumely.
First, determine whether this page represents an authentic job vacancy or role posting.
If it is NOT a job vacancy (such as a generic homepage, article, video, social profile, search listing, or login screen), set isJobPosting to false and provide a rejectionReason.
If it IS an authentic job vacancy, set isJobPosting to true and extract the job application details accurately.

URL: ${args.url}
Page Title: ${pageTitle ?? "Unknown"}

Content:
${cleanText}`,
    });

    if (!object.isJobPosting) {
      throw new Error(
        object.rejectionReason ||
          "The provided link does not lead to an active job posting. Please provide a direct link to an employment vacancy or paste the job description manually."
      );
    }

    const company = object.company?.trim() || "Company";
    const title = object.title?.trim() || pageTitle || "Role";

    // 1. Create job description row
    const jobDescriptionId: Id<"jobDescriptions"> = await ctx.runMutation(
      api.jobDescriptions.createJobDescription,
      {
        userId: args.userId,
        description: object.description || cleanText,
        requirements: object.requirements ?? [],
        responsibilities: object.responsibilities ?? [],
        extractedSkills: object.extractedSkills ?? [],
        extractedKeywords: object.extractedKeywords ?? [],
      }
    );

    // 2. Create job application row
    const jobApplicationId: Id<"jobApplications"> = await ctx.runMutation(
      api.jobTracker.createJobApplication,
      {
        userId: args.userId,
        company,
        title,
        stage: args.stage,
        jobUrl: args.url,
        location: object.location?.trim() || undefined,
        salary: object.salary?.trim() || undefined,
        jobDescriptionId,
        tags: (object.extractedSkills ?? []).slice(0, 5),
      }
    );

    // 3. If autoTailor requested and master resume is available, tailor immediately!
    let resumeVersionId: Id<"resumeVersions"> | undefined = undefined;
    if (args.autoTailor && args.masterResumeId) {
      try {
        const tailored: { versionId: Id<"resumeVersions">; resume: Doc<"resumeVersions"> | null } = await ctx.runAction(
          api.resumeVersions.createResumeVersion,
          {
            masterResumeId: args.masterResumeId,
            jobDescriptionId,
            versionName: `${company} - ${title}`,
          }
        );
        resumeVersionId = tailored.versionId;
        await ctx.runMutation(api.jobTracker.linkResumeToJob, {
          applicationId: jobApplicationId,
          resumeVersionId,
          jobDescriptionId,
        });
      } catch (tailorErr) {
        console.error("Auto-tailoring during link creation failed:", tailorErr);
      }
    }

    return {
      jobApplicationId,
      jobDescriptionId,
      resumeVersionId,
      company,
      title,
      location: object.location,
      salary: object.salary,
    };
  },
});

export const extractJobFromText = action({
  args: {
    userId: v.id("users"),
    text: v.string(),
    stage: stageValidator,
    jobUrl: v.optional(v.string()),
    autoTailor: v.optional(v.boolean()),
    masterResumeId: v.optional(v.id("resumeVersions")),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    jobApplicationId: Id<"jobApplications">;
    jobDescriptionId: Id<"jobDescriptions">;
    resumeVersionId?: Id<"resumeVersions">;
    company: string;
    title: string;
    location?: string;
    salary?: string;
  }> => {
    const rawText = args.text.trim();
    if (rawText.length < 40) {
      throw new Error(
        "Job description is too short to analyze. Please paste the full job description detailing role responsibilities or requirements."
      );
    }

    // Parse and validate the pasted content using Gemini AI
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isValidJobDescription: z
          .boolean()
          .describe(
            "True ONLY if this text represents an authentic job posting, role specification, or employment vacancy. False if it is unrelated content, casual conversation, code, recipe, resume, or gibberish."
          ),
        rejectionReason: z
          .string()
          .optional()
          .describe(
            "If isValidJobDescription is false, a polite explanation of why this text cannot be tracked as a job description."
          ),
        company: z.string().optional().describe("Company name hiring for this role, or 'Company' if not mentioned"),
        title: z.string().optional().describe("Exact or clean job title (e.g. Senior Frontend Engineer)"),
        location: z.string().optional().describe("Job location, e.g. San Francisco, CA (Remote) or Hybrid"),
        salary: z.string().optional().describe("Salary or compensation range if mentioned, otherwise empty string"),
        description: z.string().optional().describe("Cleaned, formatted job description in Markdown"),
        requirements: z.array(z.string()).optional().default([]).describe("List of requirements/qualifications"),
        responsibilities: z.array(z.string()).optional().default([]).describe("List of core responsibilities"),
        extractedSkills: z.array(z.string()).optional().default([]).describe("Technical & functional skills required"),
        extractedKeywords: z.array(z.string()).optional().default([]).describe("Important ATS keywords"),
      }),
      prompt: `Analyze this text for Resumely.
First, determine whether it is an authentic job vacancy or role description.
If it is NOT a job description (such as random chat, a personal note, recipe, code, resume, or unrelated article), set isValidJobDescription to false and provide a rejectionReason.
If it IS an authentic job description, set isValidJobDescription to true and extract structured job application details accurately:

Raw Job Description:
${rawText.slice(0, 16000)}`,
    });

    if (!object.isValidJobDescription) {
      throw new Error(
        object.rejectionReason ||
          "The provided text does not appear to be a valid job description. Please paste an authentic job listing detailing the role, requirements, or responsibilities."
      );
    }

    const company = object.company?.trim() || "Company";
    const title = object.title?.trim() || "Role";

    // 1. Create job description row
    const jobDescriptionId: Id<"jobDescriptions"> = await ctx.runMutation(
      api.jobDescriptions.createJobDescription,
      {
        userId: args.userId,
        description: object.description || rawText,
        requirements: object.requirements ?? [],
        responsibilities: object.responsibilities ?? [],
        extractedSkills: object.extractedSkills ?? [],
        extractedKeywords: object.extractedKeywords ?? [],
      }
    );

    // 2. Create job application row
    const jobApplicationId: Id<"jobApplications"> = await ctx.runMutation(
      api.jobTracker.createJobApplication,
      {
        userId: args.userId,
        company,
        title,
        stage: args.stage,
        jobUrl: args.jobUrl?.trim() || undefined,
        location: object.location?.trim() || undefined,
        salary: object.salary?.trim() || undefined,
        jobDescriptionId,
        tags: (object.extractedSkills ?? []).slice(0, 5),
      }
    );

    // 3. If autoTailor requested and master resume is available, tailor immediately!
    let resumeVersionId: Id<"resumeVersions"> | undefined = undefined;
    if (args.autoTailor && args.masterResumeId) {
      try {
        const tailored: { versionId: Id<"resumeVersions">; resume: Doc<"resumeVersions"> | null } = await ctx.runAction(
          api.resumeVersions.createResumeVersion,
          {
            masterResumeId: args.masterResumeId,
            jobDescriptionId,
            versionName: `${company} - ${title}`,
          }
        );
        resumeVersionId = tailored.versionId;
        await ctx.runMutation(api.jobTracker.linkResumeToJob, {
          applicationId: jobApplicationId,
          resumeVersionId,
          jobDescriptionId,
        });
      } catch (tailorErr) {
        console.error("Auto-tailoring during paste creation failed:", tailorErr);
      }
    }

    return {
      jobApplicationId,
      jobDescriptionId,
      resumeVersionId,
      company,
      title,
      location: object.location,
      salary: object.salary,
    };
  },
});

export const tailorResumeForJob = action({
  args: {
    applicationId: v.id("jobApplications"),
    masterResumeId: v.id("resumeVersions"),
  },
  handler: async (ctx, args): Promise<{ versionId: Id<"resumeVersions"> }> => {
    const app: Doc<"jobApplications"> | null = await ctx.runQuery(
      api.jobTracker.getJobApplicationById,
      { applicationId: args.applicationId }
    );
    if (!app) throw new Error("Job application not found");

    let jobDescriptionId = app.jobDescriptionId;

    // If application has no JD attached yet, create one from company and title or notes
    if (!jobDescriptionId) {
      const jdText = `Job Title: ${app.title}\nCompany: ${app.company}\nLocation: ${app.location || "Not specified"}\nNotes: ${app.notes || ""}`;
      const { object } = await generateObject({
        model: defaultModel,
        schema: z.object({
          requirements: z.array(z.string()),
          responsibilities: z.array(z.string()),
          extractedSkills: z.array(z.string()),
          extractedKeywords: z.array(z.string()),
        }),
        prompt: `Create a standard set of requirements, responsibilities, extractedSkills, and extractedKeywords for this job role:\n${jdText}`,
      });

      jobDescriptionId = await ctx.runMutation(
        api.jobDescriptions.createJobDescription,
        {
          userId: app.userId,
          description: jdText,
          requirements: object.requirements,
          responsibilities: object.responsibilities,
          extractedSkills: object.extractedSkills,
          extractedKeywords: object.extractedKeywords,
        }
      );
    }

    // Now generate the tailored resume version
    const versionName = `${app.company} - ${app.title}`;
    const tailored: { versionId: Id<"resumeVersions">; resume: Doc<"resumeVersions"> | null } = await ctx.runAction(
      api.resumeVersions.createResumeVersion,
      {
        masterResumeId: args.masterResumeId,
        jobDescriptionId,
        versionName,
      }
    );

    // Link newly created resume version to job application
    await ctx.runMutation(api.jobTracker.linkResumeToJob, {
      applicationId: args.applicationId,
      resumeVersionId: tailored.versionId,
      jobDescriptionId,
    });

    return { versionId: tailored.versionId };
  },
});

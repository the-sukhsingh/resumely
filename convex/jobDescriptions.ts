import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { generateObject } from "ai";
import { defaultModel } from "./ai";
import { z } from "zod";

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createJobDescription = mutation({
  args: {
    userId: v.id("users"),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    extractedSkills: v.array(v.string()),
    extractedKeywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobDescriptions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getJobDescriptionById = query({
  args: { jobDescriptionId: v.id("jobDescriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobDescriptionId);
  },
});

export const getJobDescriptionsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobDescriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const parseJobDescription = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.jdText?.trim() || "";
    if (trimmed.length < 40) {
      throw new Error(
        "Job description text is too short. Please provide a complete job posting with role details or requirements."
      );
    }

    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isValidJobDescription: z
          .boolean()
          .describe(
            "True ONLY if this text represents an authentic job posting, employment opportunity, or role specification. False if it is random text, casual message, recipe, code snippet, article, or resume."
          ),
        rejectionReason: z
          .string()
          .optional()
          .describe(
            "If isValidJobDescription is false, provide a polite explanation of why this text cannot be processed as a job description."
          ),
        title: z.string().optional().default("Role"),
        company: z.string().optional().default("Company"),
        skills: z.array(z.string()).optional().default([]),
        responsibilities: z.array(z.string()).optional().default([]),
        keywords: z.array(z.string()).optional().default([]),
      }),
      prompt: `Analyze this text for Resumely. Determine whether it represents an authentic job posting or employment description.
If it is NOT a job description (such as random chat, a personal message, recipe, code snippet, or resume), set isValidJobDescription to false and provide a rejectionReason.
If it IS a job description, extract title, company, skills, responsibilities, keywords:\n\n${trimmed}`,
    });

    if (!object.isValidJobDescription) {
      throw new Error(
        object.rejectionReason ||
          "The provided text does not appear to be a valid job description. Please provide a genuine job posting detailing role responsibilities or requirements."
      );
    }

    const { isValidJobDescription: _, rejectionReason: __, ...result } = object;
    return result;
  },
});

export const extractKeywords = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.jdText?.trim() || "";
    if (trimmed.length < 40) {
      return [];
    }

    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isValidJobDescription: z.boolean().describe("Whether this text is an authentic job posting"),
        keywords: z.array(z.string()).optional().default([]),
      }),
      prompt: `Extract the most important technical keywords and ATS terms from this job description. If the text is NOT a job posting, mark isValidJobDescription as false:\n\n${trimmed}`,
    });

    if (!object.isValidJobDescription) {
      return [];
    }
    return object.keywords || [];
  },
});

export const analyzeJobRequirements = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.jdText?.trim() || "";
    if (trimmed.length < 40) {
      throw new Error("Job description is too short to analyze requirements.");
    }

    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isValidJobDescription: z.boolean().describe("Whether this text is an authentic job posting"),
        rejectionReason: z.string().optional(),
        requiredSkills: z.array(z.string()).optional().default([]),
        preferredSkills: z.array(z.string()).optional().default([]),
        responsibilities: z.array(z.string()).optional().default([]),
        qualifications: z.array(z.string()).optional().default([]),
      }),
      prompt: `Analyze this text for Resumely. Determine whether it is an authentic job description.
If it is NOT a job description, set isValidJobDescription to false.
Otherwise, categorize into requiredSkills, preferredSkills, responsibilities, qualifications:\n\n${trimmed}`,
    });

    if (!object.isValidJobDescription) {
      throw new Error(
        object.rejectionReason ||
          "The provided text does not appear to be a valid job description. Please provide a real job posting."
      );
    }

    const { isValidJobDescription: _, rejectionReason: __, ...result } = object;
    return result;
  },
});

export const createJDAndVersion = action({
  args: {
    userId: v.id("users"),
    masterResumeId: v.id("resumeVersions"),
    jdText: v.string(),
  },
  handler: async (ctx, args): Promise<{ jobDescriptionId: Id<"jobDescriptions">; versionId: Id<"resumeVersions"> }> => {
    const trimmedJd = args.jdText?.trim() || "";
    if (trimmedJd.length < 40) {
      throw new Error(
        "The job description is too short to analyze. Please paste a more complete job description (at least a couple of sentences detailing the role or requirements)."
      );
    }

    const requiredCredits = 10;
    const currentCredits: number = await ctx.runQuery(internal.users.getCreditBalance, {
      userId: args.userId,
    });
    if (currentCredits < requiredCredits) {
      throw new Error("Insufficient credits");
    }

    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        isValidJobDescription: z
          .boolean()
          .describe(
            "True ONLY if this text represents an authentic job posting, role specification, employment vacancy, or job description. False if it is unrelated content, casual conversation, code, recipe, article, resume, or nonsense."
          ),
        rejectionReason: z
          .string()
          .optional()
          .describe(
            "If isValidJobDescription is false, a polite, clear explanation of why this text cannot be processed as a job description."
          ),
        company: z.string().optional().describe("Company name hiring for this role, or 'Company' if not found"),
        title: z.string().optional().describe("Job title"),
        requirements: z.array(z.string()).optional().default([]).describe("List of job requirements"),
        responsibilities: z.array(z.string()).optional().default([]).describe("List of job responsibilities"),
        extractedSkills: z.array(z.string()).optional().default([]).describe("Technical skills required"),
        extractedKeywords: z.array(z.string()).optional().default([]).describe("Important keywords from the JD"),
      }),
      prompt: `You are an expert job description validator and parser for Resumely.
First, determine whether this text represents a genuine job posting, employment opportunity, or role description.
If it is NOT a job description (such as random chat, a personal note, code snippet, recipe, resume, or unrelated article), set isValidJobDescription to false and explain why in rejectionReason.
If it IS an authentic job description, set isValidJobDescription to true and extract the required fields:\n\n${trimmedJd}`,
    });

    if (!object.isValidJobDescription) {
      throw new Error(
        object.rejectionReason ||
          "The provided text does not appear to be a valid job description. Please paste an authentic job listing detailing the role, requirements, or responsibilities."
      );
    }

    const company = object.company?.trim() || "Company";
    const title = object.title?.trim() || "Target Role";
    const { isValidJobDescription: _, rejectionReason: __, ...jdFields } = object;

    const jobDescriptionId: Id<"jobDescriptions"> = await ctx.runMutation(api.jobDescriptions.createJobDescription, {
      userId: args.userId,
      description: trimmedJd,
      requirements: jdFields.requirements ?? [],
      responsibilities: jdFields.responsibilities ?? [],
      extractedSkills: jdFields.extractedSkills ?? [],
      extractedKeywords: jdFields.extractedKeywords ?? [],
    });

    const versionName = company && company !== "Company" ? `${company} - ${title}` : title;

    const { versionId } = await ctx.runAction(api.resumeVersions.createResumeVersion, {
      masterResumeId: args.masterResumeId,
      jobDescriptionId,
      versionName,
    });

    // Auto-create entry in Job Tracker
    try {
      await ctx.runMutation(api.jobTracker.createJobApplication, {
        userId: args.userId,
        company,
        title,
        stage: "applied",
        jobDescriptionId,
        resumeVersionId: versionId,
      });
    } catch (trackErr) {
      console.error("Auto-tracking job application failed:", trackErr);
    }

    return { jobDescriptionId, versionId };
  },
});



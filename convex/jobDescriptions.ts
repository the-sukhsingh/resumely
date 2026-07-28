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
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        title: z.string(),
        company: z.string(),
        skills: z.array(z.string()),
        responsibilities: z.array(z.string()),
        keywords: z.array(z.string()),
      }),
      prompt: `Parse this job description and extract title, company, skills, responsibilities, keywords:\n\n${args.jdText}`,
    });
    return object;
  },
});

export const extractKeywords = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        keywords: z.array(z.string()),
      }),
      prompt: `Extract the most important keywords and technical terms from this job description:\n\n${args.jdText}`,
    });
    return object.keywords || [];
  },
});

export const analyzeJobRequirements = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        requiredSkills: z.array(z.string()),
        preferredSkills: z.array(z.string()),
        responsibilities: z.array(z.string()),
        qualifications: z.array(z.string()),
      }),
      prompt: `Analyze this job description and categorize into requiredSkills, preferredSkills, responsibilities, qualifications:\n\n${args.jdText}`,
    });
    return object;
  },
});

export const createJDAndVersion = action({
  args: {
    userId: v.id("users"),
    masterResumeId: v.id("resumeVersions"),
    jdText: v.string(),
  },
  handler: async (ctx, args): Promise<{ jobDescriptionId: Id<"jobDescriptions">; versionId: Id<"resumeVersions"> }> => {
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
        title: z.string().describe("Job title"),
        requirements: z.array(z.string()).describe("List of job requirements"),
        responsibilities: z.array(z.string()).describe("List of job responsibilities"),
        extractedSkills: z.array(z.string()).describe("Technical skills required"),
        extractedKeywords: z.array(z.string()).describe("Important keywords from the JD"),
      }),
      prompt: `You are a job description parser. Analyze the job description and extract the required fields:\n\n${args.jdText}`,
    });

    const { title, ...jdFields } = object;

    const jobDescriptionId: Id<"jobDescriptions"> = await ctx.runMutation(api.jobDescriptions.createJobDescription, {
      userId: args.userId,
      description: args.jdText,
      ...jdFields,
    });

    const { versionId } = await ctx.runAction(api.resumeVersions.createResumeVersion, {
      masterResumeId: args.masterResumeId,
      jobDescriptionId,
      versionName: title ?? "New Version",
    });

    return { jobDescriptionId, versionId };
  },
});


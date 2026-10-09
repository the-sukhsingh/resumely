import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { generateObject } from "ai";
import { defaultModel } from "./ai";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const resumeContentSchema = {
  personalInfo: v.object({
    name: v.string(),
    email: v.optional(v.union(v.string(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    linkedin: v.optional(v.union(v.string(), v.null())),
    github: v.optional(v.union(v.string(), v.null())),
    website: v.optional(v.union(v.string(), v.null())),
  }),
  summary: v.optional(v.union(v.string(), v.null())),
  experience: v.array(
    v.object({
      id: v.string(),
      company: v.string(),
      position: v.string(),
      location: v.optional(v.union(v.string(), v.null())),
      startDate: v.string(),
      endDate: v.optional(v.union(v.string(), v.null())),
      current: v.boolean(),
      bullets: v.array(v.union(v.string(), v.null())),
    })
  ),
  education: v.array(
    v.object({
      id: v.string(),
      institution: v.string(),
      degree: v.string(),
      field: v.optional(v.union(v.string(), v.null())),
      location: v.optional(v.union(v.string(), v.null())),
      startDate: v.optional(v.union(v.string(), v.null())),
      endDate: v.optional(v.union(v.string(), v.null())),
      gpa: v.optional(v.union(v.string(), v.null())),
    })
  ),
  skills: v.array(
    v.object({
      category: v.string(),
      items: v.array(v.union(v.string(), v.null())),
    })
  ),
  projects: v.array(
    v.object({
      id: v.string(),
      name: v.string(),
      description: v.string(),
      technologies: v.array(v.union(v.string(), v.null())),
      link: v.optional(v.union(v.string(), v.null())),
      bullets: v.array(v.union(v.string(), v.null())),
    })
  ),
  certifications: v.optional(
    v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        issuer: v.string(),
        date: v.optional(v.union(v.string(), v.null())),
        link: v.optional(v.union(v.string(), v.null())),
      })
    )
  ),
  achievements: v.optional(
    v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
      })
    )
  ),
  coverLetter: v.optional(v.union(v.string(), v.null())),
};

const resumeSettingsSchema = {
  template: v.string(),
  font: v.string(),
  color: v.string(),
  sections: v.object({
    personalInfo: v.boolean(),
    summary: v.boolean(),
    experience: v.boolean(),
    education: v.boolean(),
    skills: v.boolean(),
    projects: v.boolean(),
    achievements: v.boolean(),
    certifications: v.boolean(),
  }),
  order: v.array(v.string()),
  layout: v.union(v.literal("one-column"), v.literal("two-column")),
  pageSize: v.union(v.literal("A4"), v.literal("Letter")),
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createMasterResume = mutation({
  args: {
    userId: v.id("users"),
    ...resumeContentSchema,
  },
  handler: async (ctx, args) => {
    const { userId, ...content } = args;

    const existing = await ctx.db
      .query("resumeVersions")
      .withIndex("by_user_master", (q) => q.eq("userId", userId).eq("isMasterResume", true))
      .first();

    if (existing) throw new Error("Master resume already exists for this user");

    return await ctx.db.insert("resumeVersions", {
      userId,
      isMasterResume: true,
      name: "Master Resume",
      ...content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateMasterResume = mutation({
  args: {
    resumeId: v.id("resumeVersions"),
    ...resumeContentSchema,
  },
  handler: async (ctx, args) => {
    const { resumeId, ...updates } = args;
    await ctx.db.patch(resumeId, { ...updates, updatedAt: Date.now() });
    return resumeId;
  },
});

export const updateMasterResumeSection = mutation({
  args: {
    resumeId: v.id("resumeVersions"),
    section: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) throw new Error("Resume not found");

    await ctx.db.patch(args.resumeId, {
      [args.section]: args.data,
      updatedAt: Date.now(),
    });
    return args.resumeId;
  },
});

export const updateMasterResumeSettings = mutation({
  args: {
    resumeId: v.id("resumeVersions"),
    settings: v.object(resumeSettingsSchema),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resumeId, { settings: args.settings, updatedAt: Date.now() });
    return args.resumeId;
  },
});

export const deleteMasterResume = mutation({
  args: { resumeId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("resumeVersions")
      .withIndex("by_master_resume", (q) => q.eq("masterResumeId", args.resumeId))
      .collect();

    for (const version of versions) {
      const chats = await ctx.db
        .query("chatHistory")
        .withIndex("by_version", (q) => q.eq("resumeVersionId", version._id))
        .collect();
      for (const chat of chats) await ctx.db.delete(chat._id);
      await ctx.db.delete(version._id);
    }

    await ctx.db.delete(args.resumeId);
    return { success: true };
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getMasterResumeByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumeVersions")
      .withIndex("by_user_master", (q) => q.eq("userId", args.userId).eq("isMasterResume", true))
      .first();
  },
});

export const getMasterResumeById = query({
  args: { resumeId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.resumeId);
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getResume = action({
  args: { resumeId: v.id("resumeVersions") },
  handler: async (ctx, args): Promise<Doc<"resumeVersions"> | null> => {
    return await ctx.runQuery(api.masterResumes.getMasterResumeById, { resumeId: args.resumeId });
  },
});

export const updateSection = action({
  args: {
    resumeId: v.id("resumeVersions"),
    section: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    await ctx.runMutation(api.masterResumes.updateMasterResumeSection, {
      resumeId: args.resumeId,
      section: args.section,
      data: args.data,
    });
    return { success: true };
  },
});

export const rewriteBullets = action({
  args: {
    resumeId: v.id("resumeVersions"),
    sectionType: v.union(v.literal("experience"), v.literal("projects")),
    itemId: v.string(),
    bullets: v.array(v.string()),
    jobContext: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ improvedBullets: string[] }> => {
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        improvedBullets: z.array(z.string()),
      }),
      prompt: `Rewrite the following bullet points to be more impactful, quantifiable, and ATS-friendly. Use strong action verbs and highlight achievements.\n\n${args.jobContext ? `Job Context: ${args.jobContext}\n\n` : ""}Original Bullets:\n${args.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}`,
    });

    const improvedBullets = object.improvedBullets;

    const resume = await ctx.runQuery(api.masterResumes.getMasterResumeById, { resumeId: args.resumeId });
    if (!resume) throw new Error("Resume not found");

    const section = args.sectionType === "experience" ? resume.experience : resume.projects;
    const itemIndex = section.findIndex((item: { id: string }) => item.id === args.itemId);
    if (itemIndex === -1) throw new Error("Item not found");

    section[itemIndex].bullets = improvedBullets;

    await ctx.runMutation(api.masterResumes.updateMasterResumeSection, {
      resumeId: args.resumeId,
      section: args.sectionType,
      data: section,
    });

    return { improvedBullets };
  },
});

const resumeParserSchema = z.object({
  isValidResume: z
    .boolean()
    .describe(
      "Set to TRUE if the text represents a genuine candidate resume, CV, or professional career profile. Set to FALSE if the text is an unrelated document (e.g., utility bill, invoice, receipt, cooking recipe, legal agreement, scientific paper, book, essay, or casual message)."
    ),
  rejectionReason: z
    .string()
    .optional()
    .describe(
      "If isValidResume is false, provide a polite and clear explanation of why this document cannot be parsed as a resume (e.g., 'The uploaded file appears to be an invoice or financial statement rather than a resume. Please upload a document detailing your professional work experience, education, and skills.')."
    ),
  personalInfo: z.object({
    name: z.string().default(""),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
  }),
  summary: z.string().optional().nullable(),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      location: z.string().optional().nullable(),
      startDate: z.string(),
      endDate: z.string().optional().nullable(),
      bullets: z.array(z.string()),
    })
  ).optional().default([]),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
      startDate: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      gpa: z.string().optional().nullable(),
    })
  ).optional().default([]),
  skills: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ).optional().default([]),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      link: z.string().optional().nullable(),
      bullets: z.array(z.string()),
    })
  ).optional().default([]),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
      date: z.string().optional().nullable(),
      link: z.string().optional().nullable(),
    })
  ).optional().default([]),
  achievements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ).optional().default([]),
});

export const parseResumeText = action({
  args: {
    text: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<unknown> => {
    if (!args.text || args.text.trim().length < 40) {
      throw new Error(
        "The uploaded document does not contain enough text to be recognized as a resume. Please upload a clear PDF resume."
      );
    }

    const { object: parsedResume } = await generateObject({
      model: defaultModel,
      schema: resumeParserSchema,
      prompt: `You are an expert resume parser and document validator for Resumely.
First, determine whether this text represents a genuine candidate resume, CV, or professional career profile.
If it is NOT a resume (such as an invoice, receipt, legal contract, tax document, scientific paper, recipe, or random text), set isValidResume to false and provide a polite, specific rejectionReason explaining why.
If it IS a resume, set isValidResume to true and extract the structured information accurately from the resume text:

${args.text}`,
    });

    if (!parsedResume.isValidResume) {
      throw new Error(
        parsedResume.rejectionReason ||
          "The uploaded file does not appear to be a valid resume or CV. Please upload a document detailing your professional work experience, education, and skills."
      );
    }

    const hasExperience = parsedResume.experience && parsedResume.experience.length > 0;
    const hasEducation = parsedResume.education && parsedResume.education.length > 0;
    const hasSkills = parsedResume.skills && parsedResume.skills.length > 0;
    const candidateName = parsedResume.personalInfo?.name?.trim();

    if (!candidateName && !hasExperience && !hasEducation && !hasSkills) {
      throw new Error(
        "Could not detect standard resume sections (name, work experience, education, or skills) in this file. Please upload a standard PDF resume."
      );
    }

    if (!parsedResume.certifications) parsedResume.certifications = [];
    if (!parsedResume.achievements) parsedResume.achievements = [];

    // ensure boolean for 'current' since schema expects it but tool might miss it
    const experienceWithCurrent = parsedResume.experience
      ? parsedResume.experience.map((exp: any) => ({
          ...exp,
          current: exp.endDate === null || String(exp.endDate).toLowerCase().includes("present"),
        }))
      : [];

    const { isValidResume: _valid, rejectionReason: _reason, ...cleanResume } = parsedResume;

    await ctx.runMutation(api.masterResumes.createMasterResume, {
      userId: args.userId,
      ...cleanResume,
      experience: experienceWithCurrent,
    });

    return cleanResume;
  },
});


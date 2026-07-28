import { v } from "convex/values";
import { mutation, query, action, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { getImproveResumePromptNudge } from "../src/lib/prompts";
import { generateObject, generateText, tool, isStepCount } from "ai";
import { defaultModel } from "./ai";
import { z } from "zod";

async function geminiJSON(prompt: string) {
  const { text } = await generateText({
    model: defaultModel,
    prompt,
  });
  const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
}

// ─── Resume content schema (shared by mutations) ──────────────────────────────

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

// ─── Settings Schema ──────────────────────────────────────────────────────────

const resumeSettingsSchema = {
  font: v.string(),
  layout: v.union(v.literal("one-column"), v.literal("two-column")),
};

// ─── Internal Mutations ───────────────────────────────────────────────────────

/** Called only from the createResumeVersion action. */
export const insertVersion = internalMutation({
  args: {
    userId: v.id("users"),
    masterResumeId: v.id("resumeVersions"),
    jobDescriptionId: v.id("jobDescriptions"),
    name: v.string(),
    // Optional AI-generated content overrides
    summary: v.optional(v.union(v.string(), v.null())),
    experience: v.optional(v.any()),
    skills: v.optional(v.any()),
    projects: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const masterResume = await ctx.db.get(args.masterResumeId);
    if (!masterResume) throw new Error("Master resume not found");

    const jobDescription = await ctx.db.get(args.jobDescriptionId);
    if (!jobDescription) throw new Error("Job description not found");

    return await ctx.db.insert("resumeVersions", {
      userId: args.userId,
      isMasterResume: false,
      masterResumeId: args.masterResumeId,
      jobDescriptionId: args.jobDescriptionId,
      name: args.name,
      personalInfo: masterResume.personalInfo,
      summary: args.summary ?? masterResume.summary,
      experience: args.experience ?? masterResume.experience,
      education: masterResume.education,
      skills: args.skills ?? masterResume.skills,
      projects: args.projects ?? masterResume.projects,
      certifications: masterResume.certifications,
      achievements: masterResume.achievements,
      coverLetter: masterResume.coverLetter,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/** Applies multiple section patches in one transaction. Called by syncFromMaster. */
export const updateMultipleSections = internalMutation({
  args: {
    versionId: v.id("resumeVersions"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.versionId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

// ─── Public Mutations ─────────────────────────────────────────────────────────

export const updateResumeVersion = mutation({
  args: {
    versionId: v.id("resumeVersions"),
    _id: v.optional(v.id("resumeVersions")),
    name: v.optional(v.string()),
    ...resumeContentSchema,
    matchScore: v.optional(v.number()),
    _creationTime: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    userId: v.optional(v.id("users")),
    isMasterResume: v.optional(v.boolean()),
    masterResumeId: v.optional(v.id("resumeVersions")),
    jobDescriptionId: v.optional(v.id("jobDescriptions")),
    settings: v.optional(v.object(resumeSettingsSchema)),
  },
  handler: async (ctx, args) => {
    const {
      versionId,
      _id,
      _creationTime,
      createdAt,
      updatedAt,
      userId,
      isMasterResume,
      masterResumeId,
      jobDescriptionId,
      settings,
      matchScore,
      ...updates
    } = args;
    await ctx.db.patch(versionId, { ...updates, settings, updatedAt: Date.now() });
    return versionId;
  },
});

export const updateResumeVersionSection = mutation({
  args: {
    versionId: v.id("resumeVersions"),
    section: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const version = await ctx.db.get(args.versionId);
    if (!version) throw new Error("Resume version not found");

    await ctx.db.patch(args.versionId, {
      [args.section]: args.data,
      updatedAt: Date.now(),
    });
    return args.versionId;
  },
});

export const updateResumeVersionSettings = mutation({
  args: {
    versionId: v.id("resumeVersions"),
    settings: v.object(resumeSettingsSchema),
  },
  handler: async (ctx, args) => {
    const { versionId, settings } = args;
    await ctx.db.patch(versionId, { settings, updatedAt: Date.now() });
    return versionId;
  },
});

export const updateMatchScore = mutation({
  args: {
    versionId: v.id("resumeVersions"),
    matchScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.versionId, {
      matchScore: args.matchScore,
      updatedAt: Date.now(),
    });
    return args.versionId;
  },
});

export const deleteResumeVersion = mutation({
  args: { versionId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("chatHistory")
      .withIndex("by_version", (q) => q.eq("resumeVersionId", args.versionId))
      .collect();

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    await ctx.db.delete(args.versionId);
    return { success: true };
  },
});

export const createNewResume = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    ...resumeContentSchema,
    settings: v.optional(v.object(resumeSettingsSchema)),
  },
  handler: async (ctx, args) => {
    const { userId, name, settings, ...content } = args;

    // Check if the user already has a master resume
    const existingMaster = await ctx.db
      .query("resumeVersions")
      .withIndex("by_user_master", (q) => q.eq("userId", userId).eq("isMasterResume", true))
      .first();

    const isMasterResume = !existingMaster;

    const resumeId = await ctx.db.insert("resumeVersions", {
      userId,
      isMasterResume,
      name,
      ...content,
      settings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return resumeId;
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getResumeVersionsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumeVersions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getResumeVersionById = query({
  args: { versionId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.versionId);
  },
});

export const getResumeVersionsByMasterResume = query({
  args: { masterResumeId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumeVersions")
      .withIndex("by_master_resume", (q) => q.eq("masterResumeId", args.masterResumeId))
      .order("desc")
      .collect();
  },
});

export const getResumeVersionWithDetails = query({
  args: { versionId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    const version = await ctx.db.get(args.versionId);
    if (!version) return null;

    const jobDescription = version.jobDescriptionId ? await ctx.db.get(version.jobDescriptionId) : null;
    const masterResume = version.masterResumeId ? await ctx.db.get(version.masterResumeId) : null;

    return { ...version, jobDescription, masterResume };
  },
});

// ─── Version Management Actions ───────────────────────────────────────────────

export const createResumeVersion = action({
  args: {
    masterResumeId: v.id("resumeVersions"),
    jobDescriptionId: v.id("jobDescriptions"),
    versionName: v.string(),
  },
  handler: async (ctx, args): Promise<{ versionId: Id<"resumeVersions">; resume: Doc<"resumeVersions"> | null }> => {
    const masterResume: Doc<"resumeVersions"> | null = await ctx.runQuery(
      api.masterResumes.getMasterResumeById,
      { resumeId: args.masterResumeId }
    );
    if (!masterResume) throw new Error("Master resume not found");

    const jobDescription = await ctx.runQuery(api.jobDescriptions.getJobDescriptionById, {
      jobDescriptionId: args.jobDescriptionId,
    });
    if (!jobDescription) throw new Error("Job description not found");


    const jdText = `Title: ${jobDescription.description.slice(0, 200)}\nRequired Skills: ${jobDescription.extractedSkills.join(", ")}\nRequirements: ${jobDescription.requirements.join(" | ")}\nResponsibilities: ${jobDescription.responsibilities.join(" | ")}`;
    const jobKeywords = jobDescription.extractedKeywords.join(", ");
    const originalResume = JSON.stringify({ summary: masterResume.summary, experience: masterResume.experience, skills: masterResume.skills, projects: masterResume.projects }, null, 2);

    const aiContent = await geminiJSON(
      getImproveResumePromptNudge(jdText, jobKeywords, originalResume, "English")
    );

    const versionId: Id<"resumeVersions"> = await ctx.runMutation(internal.resumeVersions.insertVersion, {
      userId: masterResume.userId,
      masterResumeId: args.masterResumeId,
      jobDescriptionId: args.jobDescriptionId,
      name: args.versionName,
      summary: aiContent.summary,
      experience: aiContent.experience,
      skills: aiContent.skills,
      projects: aiContent.projects,
    });

    const resume: Doc<"resumeVersions"> | null = await ctx.runQuery(
      api.resumeVersions.getResumeVersionById,
      { versionId }
    );

    await ctx.runMutation(internal.users.deductCredits, {
      userId: masterResume.userId,
      amount: 10,
      reason: "Tailored resume generation",
    });

    return { versionId, resume };
  },
});

export const listResumeVersions = action({
  args: { masterResumeId: v.id("resumeVersions") },
  handler: async (ctx, args): Promise<Doc<"resumeVersions">[]> => {
    return await ctx.runQuery(api.resumeVersions.getResumeVersionsByMasterResume, {
      masterResumeId: args.masterResumeId,
    });
  },
});

export const duplicateVersion = action({
  args: { versionId: v.id("resumeVersions"), newName: v.string() },
  handler: async (ctx, args): Promise<Id<"resumeVersions">> => {
    const version: Doc<"resumeVersions"> | null = await ctx.runQuery(
      api.resumeVersions.getResumeVersionById,
      { versionId: args.versionId }
    );
    if (!version) throw new Error("Version not found");
    if (!version.masterResumeId || !version.jobDescriptionId) throw new Error("Cannot duplicate master resume");

    return await ctx.runMutation(internal.resumeVersions.insertVersion, {
      userId: version.userId,
      masterResumeId: version.masterResumeId,
      jobDescriptionId: version.jobDescriptionId,
      name: args.newName,
    });
  },
});

export const deleteVersion = action({
  args: { versionId: v.id("resumeVersions") },
  handler: async (ctx, args): Promise<void> => {
    await ctx.runMutation(api.resumeVersions.deleteResumeVersion, { versionId: args.versionId });
  },
});

export const syncFromMaster = action({
  args: { versionId: v.id("resumeVersions"), sections: v.array(v.string()) },
  handler: async (ctx, args): Promise<Doc<"resumeVersions"> | null> => {
    const version = await ctx.runQuery(api.resumeVersions.getResumeVersionById, { versionId: args.versionId });
    if (!version) throw new Error("Version not found");
    if (!version.masterResumeId) throw new Error("Version has no linked master resume");

    const masterResume = await ctx.runQuery(api.masterResumes.getMasterResumeById, { resumeId: version.masterResumeId });
    if (!masterResume) throw new Error("Master resume not found");

    const updates: any = {};
    args.sections.forEach((section) => {
      if (masterResume[section as keyof typeof masterResume]) {
        updates[section] = masterResume[section as keyof typeof masterResume];
      }
    });

    await ctx.runMutation(internal.resumeVersions.updateMultipleSections, { versionId: args.versionId, updates });

    return await ctx.runQuery(api.resumeVersions.getResumeVersionById, { versionId: args.versionId });
  },
});

// ─── Matching & ATS Actions ───────────────────────────────────────────────────

export const calculateMatchScore = action({
  args: { resume: v.any(), jobDescription: v.any() },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        overallScore: z.number().min(0).max(100),
        skillsMatch: z.number().min(0).max(100),
        experienceMatch: z.number().min(0).max(100),
        keywordMatch: z.number().min(0).max(100),
        suggestions: z.array(z.string()),
      }),
      prompt: `Compare this resume with the job description and calculate the match score, skills match, experience match, keyword match, and provide suggestions.\n\nResume: ${JSON.stringify(args.resume)}\nJob Description: ${JSON.stringify(args.jobDescription)}`,
    });
    return object;
  },
});

export const atsChecker = action({
  args: { resume: v.any() },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      model: defaultModel,
      schema: z.object({
        score: z.number().min(0).max(100),
        issues: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      prompt: `Check this resume for ATS compatibility:\n\nResume: ${JSON.stringify(args.resume)}`,
    });
    return object;
  },
});

// ─── AI Chat Action ───────────────────────────────────────────────────────────

function buildSystemPrompt(resume: Doc<"resumeVersions">, jd: Doc<"jobDescriptions"> | null, focusSection?: string) {
  const jdSection = jd
    ? `JOB DESCRIPTION:
Required Skills: ${jd.extractedSkills.join(", ")}
Keywords: ${jd.extractedKeywords.join(", ")}
Requirements: ${jd.requirements.join(" | ")}
Responsibilities: ${jd.responsibilities.join(" | ")}`
    : "JOB DESCRIPTION: Not provided";

  // Prune resume data to only the focused section if specified
  let resumeData = {
    name: resume.name,
    personalInfo: resume.personalInfo,
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    projects: resume.projects,
    certifications: resume.certifications,
    achievements: resume.achievements,
    settings: resume.settings,
    matchScore: resume.matchScore,
    coverLetter: resume.coverLetter,
  };

  if (focusSection && focusSection !== "all") {
    const key = focusSection as keyof typeof resumeData;
    if (resumeData[key] !== undefined) {
      resumeData = {
        name: resume.name,
        personalInfo: resume.personalInfo,
        [focusSection]: resumeData[key],
      } as any;
    }
  }

  const focusInstruction = focusSection && focusSection !== "all"
    ? `\nFOCUS DIRECTION: The user is specifically focusing on the "${focusSection}" section. You must focus your suggestions, updates, and edits ONLY on this section. Do not modify or reference other sections unless absolutely necessary or explicitly asked by the user.`
    : "";

  return `You are an expert resume coach and editor. You help users optimize their resume for a specific job.${focusInstruction}

CURRENT RESUME VERSION: "${resume.name}"
CANDIDATE: ${resume.personalInfo.name}

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${jdSection}

INSTRUCTIONS:
- Use tools to make actual edits to the resume when the user asks for improvements
- You can update any resume section, settings, or name using the available tools
- Always explain what changes you made and why
- Focus on matching the JD requirements
- Use strong action verbs and quantify impact where possible
- Keep ATS compatibility in mind
- Only ask clarifying questions if absolutely necessary, otherwise make your best guess and iterate based on user feedback.

IMPORTANT:
When calling functions, you MUST generate a pure JSON object. 
DO NOT use namespaces like 'default_api' or 'UpdateSkillsSkills'. 
DO NOT format the call as Python code. 
Example of a GOOD call: {"skills": [{"category": "Frontend", "items": ["React"]}]}
Example of a BAD call: default_api.update_skills(skills=[default_api.UpdateSkillsSkills(...)])`;
}

export const chat = action({
  args: {
    versionId: v.id("resumeVersions"),
    message: v.string(),
    focusSection: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ reply: string; toolsUsed: string[] }> => {
    const versionWithDetails = await ctx.runQuery(api.resumeVersions.getResumeVersionWithDetails, { versionId: args.versionId });
    if (!versionWithDetails) throw new Error("Resume version not found");

    const { jobDescription, masterResume: _master, ...resume } = versionWithDetails;
    const snapshot = {
      name: resume.name,
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      settings: resume.settings,
      coverLetter: resume.coverLetter,
      matchScore: resume.matchScore,
    };
    const requiresCoverLetter = args.message.toLowerCase().includes("cover letter");
    const requiredCredits = requiresCoverLetter ? 6 : 1;
    const currentCredits: number = await ctx.runQuery(internal.users.getCreditBalance, {
      userId: resume.userId,
    });
    if (currentCredits < requiredCredits) {
      throw new Error("Insufficient credits");
    }

    const history = await ctx.runQuery(api.chatHistory.getChatHistoryByVersion, {
      resumeVersionId: args.versionId,
      limit: 10,
    });
    const pastMessages = [...history].reverse().map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

    await ctx.runMutation(api.chatHistory.createChatMessage, {
      userId: resume.userId,
      resumeVersionId: args.versionId,
      role: "user",
      content: args.message,
      focusSection: args.focusSection,
    });

    const systemPrompt = buildSystemPrompt(resume as Doc<"resumeVersions">, jobDescription, args.focusSection);
    const messages = [...pastMessages, { role: "user" as const, content: args.message }];

    const tools: any = {
      update_personal_info: tool({
        description: "Update the personal info section. Use this when the user provides contact details or links.",
        parameters: z.object({
          personalInfo: z.object({
            name: z.string(),
            email: z.string().optional().nullable(),
            phone: z.string().optional().nullable(),
            location: z.string().optional().nullable(),
            linkedin: z.string().optional().nullable(),
            github: z.string().optional().nullable(),
            website: z.string().optional().nullable(),
          }),
        }),
        execute: async ({ personalInfo }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "personalInfo",
            data: personalInfo,
          });
          return { success: true };
        },
      } as any),

      update_summary: tool({
        description: "Rewrite or update the resume summary/objective section",
        parameters: z.object({
          summary: z.string().describe("The new summary text"),
        }),
        execute: async ({ summary }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "summary",
            data: summary,
          });
          return { success: true };
        },
      } as any),

      update_experience: tool({
        description: "Replace the full experience section. Ensure every entry has a unique id string.",
        parameters: z.object({
          experience: z.array(
            z.object({
              id: z.string().describe("A unique identifier for this entry (e.g., 'exp1')"),
              company: z.string(),
              position: z.string(),
              location: z.string(),
              startDate: z.string(),
              endDate: z.string(),
              current: z.boolean(),
              bullets: z.array(z.string()),
            })
          ),
        }),
        execute: async ({ experience }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "experience",
            data: experience,
          });
          return { success: true };
        },
      } as any),

      update_education: tool({
        description: "Replace the full education section",
        parameters: z.object({
          education: z.array(
            z.object({
              id: z.string(),
              institution: z.string(),
              degree: z.string(),
              field: z.string(),
              location: z.string(),
              startDate: z.string(),
              endDate: z.string(),
              gpa: z.string(),
            })
          ),
        }),
        execute: async ({ education }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "education",
            data: education,
          });
          return { success: true };
        },
      } as any),

      update_skills: tool({
        description: "Update the skills section with categories and skill items",
        parameters: z.object({
          skills: z.array(
            z.object({
              category: z.string(),
              items: z.array(z.string()),
            })
          ),
        }),
        execute: async ({ skills }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "skills",
            data: skills,
          });
          return { success: true };
        },
      } as any),

      update_projects: tool({
        description: "Replace the full projects section",
        parameters: z.object({
          projects: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              technologies: z.array(z.string()),
              link: z.string(),
              bullets: z.array(z.string()),
            })
          ),
        }),
        execute: async ({ projects }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "projects",
            data: projects,
          });
          return { success: true };
        },
      } as any),

      update_certifications: tool({
        description: "Replace the full certifications section",
        parameters: z.object({
          certifications: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              issuer: z.string(),
              date: z.string(),
              link: z.string(),
            })
          ),
        }),
        execute: async ({ certifications }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "certifications",
            data: certifications,
          });
          return { success: true };
        },
      } as any),

      update_achievements: tool({
        description: "Replace the full achievements section",
        parameters: z.object({
          achievements: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
            })
          ),
        }),
        execute: async ({ achievements }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "achievements",
            data: achievements,
          });
          return { success: true };
        },
      } as any),

      update_resume_settings: tool({
        description: "Update fonts, colors, and the visibility/order of sections",
        parameters: z.object({
          settings: z.object({
            font: z.string(),
            color: z.string(),
            sections: z.object({
              personalInfo: z.boolean(),
              summary: z.boolean(),
              experience: z.boolean(),
              education: z.boolean(),
              skills: z.boolean(),
              projects: z.boolean(),
              achievements: z.boolean(),
              certifications: z.boolean(),
            }),
            order: z.array(z.string()),
            layout: z.string(),
          }),
        }),
        execute: async ({ settings }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSettings, {
            versionId: args.versionId,
            settings,
          });
          return { success: true };
        },
      } as any),

      update_experience_bullets: tool({
        description: "Update the bullet points for a specific experience entry by its ID",
        parameters: z.object({
          experienceId: z.string(),
          bullets: z.array(z.string()),
        }),
        execute: async ({ experienceId, bullets }: any) => {
          const current = resume.experience.map((exp: any) =>
            exp.id === experienceId ? { ...exp, bullets } : exp
          );
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "experience",
            data: current,
          });
          return { success: true };
        },
      } as any),

      update_project_bullets: tool({
        description: "Update bullet points for a specific project by its ID",
        parameters: z.object({
          projectId: z.string(),
          bullets: z.array(z.string()),
          description: z.string().optional(),
        }),
        execute: async ({ projectId, bullets, description }: any) => {
          const current = resume.projects.map((proj: any) =>
            proj.id === projectId
              ? { ...proj, bullets, ...(description ? { description } : {}) }
              : proj
          );
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "projects",
            data: current,
          });
          return { success: true };
        },
      } as any),

      inject_keywords: tool({
        description: "Inject keywords into the resume's summary or skills section",
        parameters: z.object({
          summary: z.string().optional(),
          skills: z
            .array(
              z.object({
                category: z.string(),
                items: z.array(z.string()),
              })
            )
            .optional(),
        }),
        execute: async ({ summary, skills }: any) => {
          if (summary) {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
              versionId: args.versionId,
              section: "summary",
              data: summary,
            });
          }
          if (skills) {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
              versionId: args.versionId,
              section: "skills",
              data: skills,
            });
          }
          return { success: true };
        },
      } as any),

      ats_check: tool({
        description: "Check for ATS compatibility",
        parameters: z.object({}),
        execute: async () => {
          return await ctx.runAction(api.resumeVersions.atsChecker, { resume });
        },
      } as any),

      get_website_content: tool({
        description: "Fetch and summarize content from a URL. Use this when the user provides a link to pull info from.",
        parameters: z.object({
          url: z.string().describe("The URL to fetch content from"),
        }),
        execute: async ({ url }: any) => {
          const response = await fetch(url);
          const text = await response.text();
          return { summary: text };
        },
      } as any),

      get_job_description_content: tool({
        description: "Retrieve the full job description content",
        parameters: z.object({}),
        execute: async () => {
          if (!resume.jobDescriptionId) throw new Error("No linked job description");
          return await ctx.runQuery(api.jobDescriptions.getJobDescriptionById, {
            jobDescriptionId: resume.jobDescriptionId,
          });
        },
      } as any),

      update_cover_letter: tool({
        description: "Write, update, or clear the cover letter for this resume",
        parameters: z.object({
          coverLetter: z.string().describe("The new cover letter text"),
        }),
        execute: async ({ coverLetter }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "coverLetter",
            data: coverLetter,
          });
          return { success: true };
        },
      } as any),

      update_resume_name: tool({
        description: "Update the name/title of this resume version",
        parameters: z.object({
          name: z.string().describe("The new version name"),
        }),
        execute: async ({ name }: any) => {
          await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, {
            versionId: args.versionId,
            section: "name",
            data: name,
          });
          return { success: true };
        },
      } as any),
    };

    const { text: replyText, toolCalls } = await generateText({
      model: defaultModel,
      system: systemPrompt,
      messages,
      tools,
      stopWhen: isStepCount(5),
    });

    const toolsUsed = toolCalls.map((tc) => tc.toolName);

    const MODIFYING_TOOLS = [
      "update_personal_info",
      "update_summary",
      "update_experience",
      "update_education",
      "update_skills",
      "update_projects",
      "update_certifications",
      "update_achievements",
      "update_resume_settings",
      "update_resume_name",
      "update_experience_bullets",
      "update_project_bullets",
      "inject_keywords",
      "update_cover_letter",
    ];
    const didModify = toolsUsed.some((t) => MODIFYING_TOOLS.includes(t));

    await ctx.runMutation(api.chatHistory.createChatMessage, {
      userId: resume.userId,
      resumeVersionId: args.versionId,
      role: "assistant",
      content: replyText,
      ...(didModify ? { undoSnapshot: snapshot } : {}),
    });

    if (toolsUsed.includes("update_cover_letter")) {
      await ctx.runMutation(internal.users.deductCredits, {
        userId: resume.userId,
        amount: 5,
        reason: "Cover letter generation",
      });
    }

    await ctx.runMutation(internal.users.deductCredits, {
      userId: resume.userId,
      amount: 1,
      reason: "AI chat message",
    });

    return { reply: replyText, toolsUsed };
  },
});

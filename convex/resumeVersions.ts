import { v } from "convex/values";
import { mutation, query, action, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { getImproveResumePromptNudge } from "../src/lib/prompts";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

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

async function geminiJSON(prompt: string) {
  const res = await fetch(
    `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" },
      }),
    }
  );
  const data = await res.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

export const calculateMatchScore = action({
  args: { resume: v.any(), jobDescription: v.any() },
  handler: async (ctx, args) => {
    return await geminiJSON(
      `Compare this resume with the job description and calculate:\n- overall score (0-100)\n- skillsMatch (0-100)\n- experienceMatch (0-100)\n- keywordMatch (0-100)\n- suggestions (array of strings)\n\nResume: ${JSON.stringify(args.resume)}\nJob Description: ${JSON.stringify(args.jobDescription)}\n\nReturn as JSON.`
    );
  },
});


export const atsChecker = action({
  args: { resume: v.any() },
  handler: async (ctx, args) => {
    return await geminiJSON(
      `Check this resume for ATS compatibility:\n- score (0-100)\n- issues (array of strings)\n- recommendations (array of strings)\n\nResume: ${JSON.stringify(args.resume)}\n\nReturn as JSON.`
    );
  },
});


// ─── AI Chat Action ───────────────────────────────────────────────────────────
const CHAT_TOOLS = [
  {
    name: "update_personal_info",
    description: "Update the personal info section. Use this when the user provides contact details or links.",
    parameters: {
      type: "object", // Changed to lowercase
      properties: {
        personalInfo: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            location: { type: "string" },
            linkedin: { type: "string" },
            github: { type: "string" },
            website: { type: "string" },
          },
          required: ["name"],
        },
      },
      required: ["personalInfo"],
    },
  },
  {
    name: "update_summary",
    description: "Rewrite or update the resume summary/objective section",
    parameters: {
      type: "object",
      properties: { summary: { type: "string", description: "The new summary text" } },
      required: ["summary"],
    },
  },
  {
    name: "update_experience",
    description: "Replace the full experience section. Ensure every entry has a unique id string.",
    parameters: {
      type: "object",
      properties: {
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "A unique identifier for this entry (e.g., 'exp1')" },
              company: { type: "string" },
              position: { type: "string" },
              location: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              current: { type: "boolean" },
              bullets: { type: "array", items: { type: "string" } },
            },
            required: ["id", "company", "position", "startDate", "current", "bullets"],
          },
        },
      },
      required: ["experience"],
    },
  },
  {
    name: "update_education",
    description: "Replace the full education section",
    parameters: {
      type: "object",
      properties: {
        education: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              institution: { type: "string" },
              degree: { type: "string" },
              field: { type: "string" },
              location: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              gpa: { type: "string" },
            },
            required: ["id", "institution", "degree"],
          },
        },
      },
      required: ["education"],
    },
  },
  {
    name: "update_skills",
    description: "Update the skills section with categories and skill items",
    parameters: {
      type: "object",
      properties: {
        skills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              items: { type: "array", items: { type: "string" } },
            },
            required: ["category", "items"],
          },
        },
      },
      required: ["skills"],
    },
  },
  {
    name: "update_projects",
    description: "Replace the full projects section",
    parameters: {
      type: "object",
      properties: {
        projects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              technologies: { type: "array", items: { type: "string" } },
              link: { type: "string" },
              bullets: { type: "array", items: { type: "string" } },
            },
            required: ["id", "name", "description", "technologies", "bullets"],
          },
        },
      },
      required: ["projects"],
    },
  },
  {
    name: "update_certifications",
    description: "Replace the full certifications section",
    parameters: {
      type: "object",
      properties: {
        certifications: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              issuer: { type: "string" },
              date: { type: "string" },
              link: { type: "string" },
            },
            required: ["id", "name", "issuer"],
          },
        },
      },
      required: ["certifications"],
    },
  },
  {
    name: "update_achievements",
    description: "Replace the full achievements section",
    parameters: {
      type: "object",
      properties: {
        achievements: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["id", "title", "description"],
          },
        },
      },
      required: ["achievements"],
    },
  },
  {
    name: "update_resume_settings",
    description: "Update fonts, colors, and the visibility/order of sections",
    parameters: {
      type: "object",
      properties: {
        settings: {
          type: "object",
          properties: {
            font: { type: "string" },
            color: { type: "string" },
            sections: {
              type: "object",
              properties: {
                personalInfo: { type: "boolean" },
                summary: { type: "boolean" },
                experience: { type: "boolean" },
                education: { type: "boolean" },
                skills: { type: "boolean" },
                projects: { type: "boolean" },
                achievements: { type: "boolean" },
                certifications: { type: "boolean" },
              },
              required: ["personalInfo", "summary", "experience", "education", "skills", "projects", "achievements", "certifications"],
            },
            order: { type: "array", items: { type: "string" } },
            layout: { type: "string" },
          },
          required: ["font", "color", "sections", "order", "layout"],
        },
      },
      required: ["settings"],
    },
  },
  {
    name: "update_experience_bullets",
    description: "Update the bullet points for a specific experience entry by its ID",
    parameters: {
      type: "object",
      properties: {
        experienceId: { type: "string" },
        bullets: { type: "array", items: { type: "string" } },
      },
      required: ["experienceId", "bullets"],
    },
  },
  {
    name: "update_project_bullets",
    description: "Update bullet points for a specific project by its ID",
    parameters: {
      type: "object",
      properties: {
        projectId: { type: "string" },
        bullets: { type: "array", items: { type: "string" } },
        description: { type: "string" },
      },
      required: ["projectId", "bullets"],
    },
  },
  {
    name: "ats_check",
    description: "Check for ATS compatibility",
    parameters: { type: "object", properties: {} }
  },
  {
    name: "get_website_content",
    description: "Fetch and summarize content from a URL. Use this when the user provides a link to pull info from.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL to fetch content from" },
      },
      required: ["url"],
    },
  },
  {
    name: "get_job_description_content",
    description: "Retrieve the full job description content",
    parameters: { type: "object", properties: {} }
  },
  {
    name: "update_cover_letter",
    description: "Write, update, or clear the cover letter for this resume",
    parameters: {
      type: "object",
      properties: { coverLetter: { type: "string", description: "The new cover letter text" } },
      required: ["coverLetter"],
    },
  }
];

async function callGeminiChat(systemPrompt: string, messages: { role: string; parts: { text: string }[] }[]) {
  const body: any = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: messages,
    tools: [{ function_declarations: CHAT_TOOLS }],
    tool_config: { function_calling_config: { mode: "AUTO" } },
    generationConfig: { temperature: 0.7 },
  };

  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  return res.json();
}

function buildSystemPrompt(resume: Doc<"resumeVersions">, jd: Doc<"jobDescriptions"> | null) {
  const jdSection = jd
    ? `JOB DESCRIPTION:
Required Skills: ${jd.extractedSkills.join(", ")}
Keywords: ${jd.extractedKeywords.join(", ")}
Requirements: ${jd.requirements.join(" | ")}
Responsibilities: ${jd.responsibilities.join(" | ")}`
    : "JOB DESCRIPTION: Not provided";

  return `You are an expert resume coach and editor. You help users optimize their resume for a specific job.

CURRENT RESUME VERSION: "${resume.name}"
CANDIDATE: ${resume.personalInfo.name}

RESUME DATA:
${JSON.stringify({ name: resume.name, personalInfo: resume.personalInfo, summary: resume.summary, experience: resume.experience, education: resume.education, skills: resume.skills, projects: resume.projects, certifications: resume.certifications, achievements: resume.achievements, settings: resume.settings, matchScore: resume.matchScore, coverLetter: resume.coverLetter }, null, 2)}

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
};

export const chat = action({
  args: {
    versionId: v.id("resumeVersions"),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<{ reply: string; toolsUsed: string[] }> => {
    const versionWithDetails = await ctx.runQuery(api.resumeVersions.getResumeVersionWithDetails, { versionId: args.versionId });
    if (!versionWithDetails) throw new Error("Resume version not found");

    const { jobDescription, masterResume: _master, ...resume } = versionWithDetails;

    const history = await ctx.runQuery(api.chatHistory.getChatHistoryByVersion, {
      resumeVersionId: args.versionId,
      limit: 10,
    });
    const pastMessages = [...history].reverse().map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    await ctx.runMutation(api.chatHistory.createChatMessage, {
      userId: resume.userId,
      resumeVersionId: args.versionId,
      role: "user",
      content: args.message,
    });

    const systemPrompt = buildSystemPrompt(resume as Doc<"resumeVersions">, jobDescription);
    const messages = [...pastMessages, { role: "user", parts: [{ text: args.message }] }];

    const geminiResponse = await callGeminiChat(systemPrompt, messages);
    const candidate = geminiResponse.candidates?.[0];
    if (!candidate) throw new Error("No response from AI");

    const toolsUsed: string[] = [];
    let replyText = "";

    const parts = candidate.content?.parts ?? [];
    const toolCallParts = parts.filter((p: any) => p.functionCall);
    const textParts = parts.filter((p: any) => p.text);

    if (toolCallParts.length > 0) {
      const toolResults: any[] = [];

      for (const part of toolCallParts) {
        const { name, args: toolArgs } = part.functionCall;
        toolsUsed.push(name);
        let result: any = { success: true };

        try {
          if (name === "update_personal_info") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "personalInfo", data: toolArgs.personalInfo });
          } else if (name === "update_summary") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "summary", data: toolArgs.summary });
          } else if (name === "update_experience") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "experience", data: toolArgs.experience });
          } else if (name === "update_education") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "education", data: toolArgs.education });
          } else if (name === "update_skills") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "skills", data: toolArgs.skills });
          } else if (name === "update_projects") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "projects", data: toolArgs.projects });
          } else if (name === "update_certifications") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "certifications", data: toolArgs.certifications });
          } else if (name === "update_achievements") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "achievements", data: toolArgs.achievements });
          } else if (name === "update_cover_letter") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "coverLetter", data: toolArgs.coverLetter });
          } else if (name === "update_resume_settings") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSettings, { versionId: args.versionId, settings: toolArgs.settings });
          } else if (name === "update_resume_name") {
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "name", data: toolArgs.name });
          } else if (name === "update_experience_bullets") {
            const current = resume.experience.map((exp: any) =>
              exp.id === toolArgs.experienceId ? { ...exp, bullets: toolArgs.bullets } : exp
            );
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "experience", data: current });
          } else if (name === "update_project_bullets") {
            const current = resume.projects.map((proj: any) =>
              proj.id === toolArgs.projectId
                ? { ...proj, bullets: toolArgs.bullets, ...(toolArgs.description ? { description: toolArgs.description } : {}) }
                : proj
            );
            await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "projects", data: current });
          } else if (name === "inject_keywords") {
            if (toolArgs.summary) await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "summary", data: toolArgs.summary });
            if (toolArgs.skills) await ctx.runMutation(api.resumeVersions.updateResumeVersionSection, { versionId: args.versionId, section: "skills", data: toolArgs.skills });
          }  else if (name === "ats_check") {
            result = await ctx.runAction(api.resumeVersions.atsChecker, { resume });
          } else if (name === "get_website_content") {
            // For security, we should validate/sanitize the URL before fetching, but for this example we'll assume it's safe
            const response = await fetch(toolArgs.url);
            const text = await response.text();
            // Summarize the content to extract key info (this is a placeholder, ideally we'd use an AI model for summarization)
            result = { summary: text };
          } else if (name === "get_job_description_content") {
            if (!resume.jobDescriptionId) throw new Error("No linked job description");
            result = await ctx.runQuery(api.jobDescriptions.getJobDescriptionById, { jobDescriptionId: resume.jobDescriptionId });
          }
        } catch (e: any) {
          result = { success: false, error: e.message };
        }

        toolResults.push({ functionResponse: { name, response: result } });
      }

      const followUpMessages = [
        ...messages,
        { role: "model", parts: toolCallParts },
        { role: "user", parts: toolResults },
      ];

      const followUp = await callGeminiChat(systemPrompt, followUpMessages);
      replyText =
        followUp.candidates?.[0]?.content?.parts
          ?.filter((p: any) => p.text)
          ?.map((p: any) => p.text)
          ?.join("") ?? "Done! I've updated your resume.";
    } else {
      replyText = textParts.map((p: any) => p.text).join("") || "I couldn't process that request.";
    }

    await ctx.runMutation(api.chatHistory.createChatMessage, {
      userId: resume.userId,
      resumeVersionId: args.versionId,
      role: "assistant",
      content: replyText,
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

import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

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
    const prompt = `Rewrite the following bullet points to be more impactful, quantifiable, and ATS-friendly. Use strong action verbs and highlight achievements.\n\n${args.jobContext ? `Job Context: ${args.jobContext}\n\n` : ""}Original Bullets:\n${args.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}\n\nReturn ONLY a JSON array of improved bullets (no markdown, no explanation):\n["bullet 1", "bullet 2", ...]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const improvedBullets = JSON.parse(jsonMatch ? jsonMatch[0] : content);

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

export const parseResumeText = action({
  args: {
    text: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<unknown> => {
    // TODO: Replace hardcoded data with live Gemini parsing once API is stable
    const parsedResume = {
      personalInfo: {
        name: "SUKJIT SINGH",
        email: null,
        phone: "+91 7814261486",
        location: "Punjab, India",
        linkedin: null,
        github: null,
        website: "sukhjitsingh.me",
      },
      summary:
        "Passionate full-stack developer and Computer Science student, focused on building real products using modern web development practices and AI tools.",
      experience: [],
      education: [
        { id: "edu1", institution: "GNDU", degree: "B.Tech", field: "CSE", location: null, startDate: "2023", endDate: "2027", gpa: "8.63" },
        { id: "edu2", institution: "PSEB", degree: "12th", field: "Science", location: null, startDate: "2022", endDate: "2023", gpa: "9.2" },
      ],
      skills: [
        { category: "Technical Skills", items: ["Javascript", "React", "Next.js", "Motion", "TypeScript", "Convex", "ImageKit", "Inngest", "Tailwind", "Node.js", "MongoDB"] },
        { category: "Languages", items: ["English", "Punjabi", "Hindi"] },
        { category: "Awards", items: ["Winner, NFS 1.0", "Runner Up, GDG GNDU BuildFest", "Top 100, HackHazards 2025"] },
      ],
      projects: [
        { id: "proj1", name: "Media", description: "Transform your ideas into engaging, tailored posts for X and LinkedIn, and auto-generate eye-catching thumbnails. Train the AI with your unique style and watch it write exactly like you do.", technologies: ["Next.js", "API", "Gemini"], link: null, bullets: ["Transform your ideas into engaging, tailored posts for X and LinkedIn, and auto-generate eye-catching thumbnails.", "Train the AI with your unique style and watch it write exactly like you do."] },
        { id: "proj2", name: "Resumely", description: "Build résumé that stands out. Edit, preview, and export in one clean flow.", technologies: ["Next.js", "React-PDF"], link: null, bullets: ["Build résumé that stands out. Edit, preview, and export in one clean flow."] },
        { id: "proj3", name: "Plann", description: "Plann uses advanced AI to transform your learning goals into practical, organized plans.", technologies: ["Convex", "Gemini"], link: null, bullets: ["Plann uses advanced AI to transform your learning goals into practical, organized plans.", "Upload documents, chat with your assistant, and track your progress in real-time."] },
        { id: "proj4", name: "HackRadar", description: "Discover hackathons from multiple platforms, all in one place.", technologies: ["Next.js", "Convex"], link: null, bullets: ["Discover hackathons from multiple platforms, all in one place."] },
        { id: "proj5", name: "Doc Crafter", description: "Use Generative AI to create complete, editable project documentation.", technologies: ["Inngest", "AgentKit"], link: null, bullets: ["Use Generative AI to create complete, editable project documentation including chapters, images, and .docx export."] },
      ],
      certifications: [],
    };

    await ctx.runMutation(api.masterResumes.createMasterResume, {
      userId: args.userId,
      ...parsedResume,
    });

    return parsedResume;
  },
});

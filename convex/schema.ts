import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const settingsValidator = v.optional(
  v.object({
    font: v.string(),
    layout: v.union(v.literal("one-column"), v.literal("two-column")),
  })
);

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    picture: v.optional(v.union(v.string(), v.null())),
    credits: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  creditLogs: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  jobDescriptions: defineTable({
    userId: v.id("users"),
    description: v.string(),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    extractedSkills: v.array(v.string()),
    extractedKeywords: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  resumeVersions: defineTable({
    userId: v.id("users"),
    isMasterResume: v.boolean(),
    // Only set for tailored versions (isMasterResume === false)
    masterResumeId: v.optional(v.id("resumeVersions")),
    jobDescriptionId: v.optional(v.id("jobDescriptions")),
    name: v.string(),
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
    matchScore: v.optional(v.union(v.number(), v.null())),
    settings: settingsValidator,
    coverLetter: v.optional(v.union(v.string(), v.null())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_master_resume", ["masterResumeId"])
    .index("by_job_description", ["jobDescriptionId"])
    .index("by_user_master", ["userId", "isMasterResume"]),

  chatHistory: defineTable({
    userId: v.id("users"),
    resumeVersionId: v.optional(v.id("resumeVersions")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
    focusSection: v.optional(v.string()),
    undoSnapshot: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_version", ["resumeVersionId"]),

  feedbacks: defineTable({
    userId: v.id("users"),
    feedback: v.string(),
    time: v.number(),
  }).index("by_user", ["userId"]),
});

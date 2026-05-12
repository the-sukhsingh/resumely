import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

async function callGemini(apiKey: string, prompt: string) {
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" },
    }),
  });
  const data = await response.json();
  console.log("Gemini response:", data);
  if (!data.candidates?.[0]) {
    throw new Error(`Gemini error: ${JSON.stringify(data.error ?? data)}`);
  }
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

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
    return await callGemini(
      process.env.GEMINI_API_KEY!,
      `Parse this job description and extract title, company, skills (array), responsibilities (array), keywords (array). Return as JSON.\n\n${args.jdText}`
    );
  },
});

export const extractKeywords = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    const result = await callGemini(
      process.env.GEMINI_API_KEY!,
      `Extract the most important keywords and technical terms from this job description. Return as JSON with key "keywords" as an array.\n\n${args.jdText}`
    );
    return result.keywords || [];
  },
});

export const analyzeJobRequirements = action({
  args: { jdText: v.string() },
  handler: async (ctx, args) => {
    return await callGemini(
      process.env.GEMINI_API_KEY!,
      `Analyze this job description and categorize into requiredSkills (array), preferredSkills (array), responsibilities (array), qualifications (array). Return as JSON.\n\n${args.jdText}`
    );
  },
});

export const createJDAndVersion = action({
  args: {
    userId: v.id("users"),
    masterResumeId: v.id("resumeVersions"),
    jdText: v.string(),
  },
  handler: async (ctx, args): Promise<{ jobDescriptionId: Id<"jobDescriptions">; versionId: Id<"resumeVersions"> }> => {
    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: "You are a job description parser. Analyze the job description and call the create_job_description tool with the extracted data." }] },
        contents: [{ role: "user", parts: [{ text: args.jdText }] }],
        tools: [{
          function_declarations: [{
            name: "create_job_description",
            description: "Store the parsed job description in the database",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Job title" },
                requirements: { type: "array", items: { type: "string" }, description: "List of job requirements" },
                responsibilities: { type: "array", items: { type: "string" }, description: "List of job responsibilities" },
                extractedSkills: { type: "array", items: { type: "string" }, description: "Technical skills required" },
                extractedKeywords: { type: "array", items: { type: "string" }, description: "Important keywords from the JD" },
              },
              required: ["title", "requirements", "responsibilities", "extractedSkills", "extractedKeywords"],
            },
          }],
        }],
        tool_config: { function_calling_config: { mode: "ANY", allowed_function_names: ["create_job_description"] } },
      }),
    });

    const data = await res.json();
    const toolCall = data.candidates?.[0]?.content?.parts?.find((p: any) => p.functionCall)?.functionCall;
    if (!toolCall) throw new Error("Gemini did not call create_job_description");

    const { title, ...jdFields } = toolCall.args;

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

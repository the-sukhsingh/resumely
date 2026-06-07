import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createChatMessage = mutation({
  args: {
    userId: v.id("users"),
    resumeVersionId: v.optional(v.id("resumeVersions")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    undoSnapshot: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatHistory", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const clearChatHistory = mutation({
  args: { resumeVersionId: v.id("resumeVersions") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatHistory")
      .withIndex("by_version", (q) => q.eq("resumeVersionId", args.resumeVersionId))
      .collect();
    await Promise.all(messages.map((m) => ctx.db.delete(m._id)));
  },
});

export const deleteChatMessage = mutation({
  args: {
    messageId: v.id("chatHistory"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

export const undoMessageEdits = mutation({
  args: {
    messageId: v.id("chatHistory"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    if (message.role !== "assistant") throw new Error("Can only undo assistant edits");
    if (!message.undoSnapshot) throw new Error("No undo snapshot available for this message");
    if (!message.resumeVersionId) throw new Error("No resume version associated with this message");

    const currentResume = await ctx.db.get(message.resumeVersionId);
    if (!currentResume) throw new Error("Resume version not found");

    // Replace the resume version document completely using current metadata but snapshot content
    await ctx.db.replace(message.resumeVersionId, {
      userId: currentResume.userId,
      isMasterResume: currentResume.isMasterResume,
      masterResumeId: currentResume.masterResumeId,
      jobDescriptionId: currentResume.jobDescriptionId,
      createdAt: currentResume.createdAt,
      updatedAt: Date.now(),
      ...message.undoSnapshot,
    });

    // Remove the snapshot to prevent double undo
    await ctx.db.patch(args.messageId, {
      undoSnapshot: undefined,
    });

    return { success: true };
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getChatHistoryByVersion = query({
  args: {
    resumeVersionId: v.id("resumeVersions"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query("chatHistory")
      .withIndex("by_version", (q) => q.eq("resumeVersionId", args.resumeVersionId))
      .order("desc");

    if (args.limit) {
      return await q.take(args.limit);
    }

    return await q.collect();
  },
});

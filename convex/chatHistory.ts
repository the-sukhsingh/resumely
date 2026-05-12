import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createChatMessage = mutation({
  args: {
    userId: v.id("users"),
    resumeVersionId: v.optional(v.id("resumeVersions")),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
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

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFeedback = mutation({
  args: {
    userId: v.id("users"),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedbacks", {
      userId: args.userId,
      feedback: args.feedback,
      time: Date.now(),
    });
  },
});

export const getFeedbacksByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query("feedbacks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.limit) {
      return await q.take(args.limit);
    }
    return await q.collect();
  },
});

export const getAllFeedbacks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const feedbacks = await ctx.db
      .query("feedbacks")
      .order("desc")
      .take(args.limit ?? 100);

    const feedbacksWithUsers = [];
    for (const feedback of feedbacks) {
      const user = await ctx.db.get(feedback.userId);
      feedbacksWithUsers.push({
        ...feedback,
        user: user ? {
          name: user.name,
          email: user.email,
          picture: user.picture,
        } : null,
      });
    }

    return feedbacksWithUsers;
  },
});
import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";

export const getCreditBalance = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    return user.credits ?? 25;
  },
});

export const deductCredits = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const currentCredits = user.credits ?? 25;

    if (currentCredits < args.amount) {
      throw new Error("Insufficient credits");
    }

    await ctx.db.patch(args.userId, {
      credits: currentCredits - args.amount,
    });

    await ctx.db.insert("creditLogs", {
      userId: args.userId,
      amount: -args.amount,
      reason: args.reason,
      status: "success",
      createdAt: Date.now(),
    });
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()), // AuthContext passes imageUrl
    picture: v.optional(v.string()),  // Auth.ts passes picture maybe?
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const pictureToUse = args.picture ?? args.imageUrl;

    if (existing) {
      if (
        (args.name && existing.name !== args.name) ||
        (pictureToUse && existing.picture !== pictureToUse)
      ) {
        await ctx.db.patch(existing._id, {
          name: args.name ?? existing.name,
          picture: pictureToUse ?? existing.picture,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      picture: pictureToUse,
      credits: 25,
      createdAt: Date.now(),
    });
  },
});

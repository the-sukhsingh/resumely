import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
      credits: 50,
      createdAt: Date.now(),
    });
  },
});

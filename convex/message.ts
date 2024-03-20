import { v } from "convex/values"
import { mutation, query } from "./_generated/server"


export const createMessage = mutation({
  args: {
    role: v.string(),
    content: v.optional(v.string()),
    isLoading: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated!")
    }
    const userId = identity.subject

    const message = await ctx.db.insert("message", {
      role: args.role,
      content: args.content,
      isLoading: args.isLoading,
      userId,
    })
    return message
  }
})

export const getMessages = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated!")
    }
    const userId = identity.subject

    const messages = await ctx.db
      .query("message")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect()
    return messages
  }
})


export const getLimitedMessages = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated!")
    }
    const userId = identity.subject

    const messages = await ctx.db
      .query("message")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .take(args.limit)
    return messages
  }
})
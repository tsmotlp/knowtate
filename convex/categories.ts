import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { DEMO_USER_ID } from "../constants"



export const createCategory = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }
    // const userId = identity.subject

    const category = await ctx.db.insert("categories", {
      name: args.name,
      userId: DEMO_USER_ID,
    })
    return category
  }
})

export const getCategories = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }
    // const userId = identity.subject

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", DEMO_USER_ID))
      .order("asc")
      .collect()
    return categories
  }
})

export const deleteCategory = mutation({
  args: {
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }
    // const userId = identity.subject

    const existingCategory = await ctx.db.get(args.categoryId)
    if (!existingCategory) {
      throw new Error("Category not found!")
    }

    if (existingCategory.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    const deletedCategory = await ctx.db.delete(args.categoryId)
    return deletedCategory
  },
})
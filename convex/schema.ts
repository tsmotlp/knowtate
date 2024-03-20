import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const fileTypes = v.union(
  v.literal("pdf"),
  v.literal("notion"),
  v.literal("markdown"),
  v.literal("excalidraw")
)

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    userId: v.string(),
  })
    .index("by_user", ["userId"]),

  files: defineTable({
    title: v.string(),
    url: v.optional(v.string()),
    key: v.optional(v.string()),
    type: fileTypes,
    userId: v.string(),
    categoryId: v.optional(v.id("categories")),
    parentFile: v.optional(v.id("files")),
    // 对于笔记来说：content是笔记的内容, 
    // 对于PDF文档来说，content是annotations
    content: v.optional(v.string()),
    // 对于PDF文档来说，还有与AI对话的消息
    messages: v.optional(v.array(v.id("message"))),
    icon: v.optional(v.string()),
    favorited: v.boolean(),
    isArchived: v.boolean(),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  })
    .index("by_userId", ["userId"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_userId_category", ["userId", "categoryId"])
    .index("by_userId_parent", ["userId", "parentFile"]),

  message: defineTable({
    role: v.string(),
    userId: v.string(),
    content: v.optional(v.string()),
    isLoading: v.optional(v.boolean())
  })
    .index("by_user", ["userId"])
})
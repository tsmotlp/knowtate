import { v } from "convex/values";
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel";
import { fileTypes } from "./schema";
import { DEMO_USER_ID } from "../constants"

export const getAllFiles = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject
    // console.log("userId", userId)

    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", DEMO_USER_ID))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .order("desc")
      .collect()
    return allFiles
  }
})

export const getAllFavoritedFiles = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", DEMO_USER_ID))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .filter((q) => (q.eq(q.field("favorited"), true)))
      .order("desc")
      .collect()
    return allFiles
  }
})

export const getAllPapers = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", DEMO_USER_ID))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .filter((q) => (q.eq(q.field("type"), "pdf")))
      .order("desc")
      .collect()
    return allFiles
  }
})

export const getAllArchivedFiles = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", DEMO_USER_ID))
      .filter((q) => (q.eq(q.field("isArchived"), true)))
      .order("desc")
      .collect()
    return allFiles
  }
})

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files")
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const favorite = await ctx.db.get(args.fileId)

    if (!favorite) {
      throw new Error("File not found!")
    }

    if (favorite.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    if (!favorite.favorited) {
      await ctx.db.patch(args.fileId, {
        favorited: true
      })
    }
  }
})

export const createNote = mutation({
  args: {
    title: v.string(),
    type: fileTypes,
    parentFile: v.optional(v.id("files"))
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const note = await ctx.db.insert("files", {
      title: args.title,
      type: args.type,
      parentFile: args.parentFile,
      userId: DEMO_USER_ID,
      favorited: false,
      isArchived: false,
      isPublished: false,
    })
    return note
  }
})


export const createPaper = mutation({
  args: {
    title: v.string(),
    categoryId: v.id("categories"),
    key: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const paper = await ctx.db.insert("files", {
      title: args.title,
      key: args.key,
      url: args.url,
      type: "pdf",
      userId: DEMO_USER_ID,
      content: "",
      categoryId: args.categoryId,
      favorited: false,
      isArchived: false,
      isPublished: false,
    })
    return paper
  }
})

export const getAllNotes = query({
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allNotes = await ctx.db
      .query("files")
      .withIndex("by_userId", (q) => q.eq("userId", DEMO_USER_ID))
      .filter((q) => (q.neq(q.field("type"), "pdf")))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .order("desc")
      .collect()
    return allNotes
  }
})

export const getAllNotesOfPaper = query({
  args: {
    paperId: v.optional(v.id("files"))
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allNotes = await ctx.db
      .query("files")
      .withIndex("by_userId_parent", (q) =>
        q
          .eq("userId", DEMO_USER_ID)
          .eq("parentFile", args.paperId)
      )
      .filter((q) => (q.neq(q.field("type"), "pdf")))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .order("desc")
      .collect()
    return allNotes
  }
})

export const getSidebarNotes = query({
  args: {
    parentNote: v.optional(v.id("files"))
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const allNotes = await ctx.db
      .query("files")
      .withIndex("by_userId_parent", (q) =>
        q
          .eq("userId", DEMO_USER_ID)
          .eq("parentFile", args.parentNote)
      )
      .filter((q) => (q.neq(q.field("type"), "pdf")))
      .filter((q) => (q.eq(q.field("isArchived"), false)))
      .order("desc")
      .collect()
    return allNotes
  }
})

export const getFileById = query({
  args: {
    fileId: v.id("files")
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const file = await ctx.db.get(args.fileId)

    if (!file) {
      throw new Error("File not found!")
    }

    if (file?.userId != DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    return file
  }
})

// archive related, archived means mark the file as deleted
export const archiveFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    // const userId = identity.subject;

    const existingFile = await ctx.db.get(args.fileId)
    if (!existingFile) {
      throw new Error("File not found!")
    }
    if (existingFile.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    const recursiveArchive = async (fileId: Id<"files">) => {
      const children = await ctx.db
        .query("files")
        .withIndex("by_userId_parent", (q) => (
          q
            .eq("userId", DEMO_USER_ID)
            .eq("parentFile", fileId)
        ))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true
        })

        await recursiveArchive(child._id)
      }
    }

    const archivedFile = await ctx.db.patch(args.fileId, {
      isArchived: true
    })

    recursiveArchive(args.fileId)

    return archivedFile
  }
})

export const removeFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }
    // const userId = identity.subject

    const existingFile = await ctx.db.get(args.fileId)
    if (!existingFile) {
      throw new Error("File not found!")
    }

    if (existingFile.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    const removedFile = await ctx.db.delete(args.fileId)
    return removedFile
  },
})

export const restoreFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()
    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }
    // const userId = identity.subject

    const existingFile = await ctx.db.get(args.fileId)
    if (!existingFile) {
      throw new Error("File not found!")
    }
    if (existingFile.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized!")
    }

    const recursiveRestore = async (fileId: Id<"files">) => {
      const children = await ctx.db
        .query("files")
        .withIndex("by_userId_parent", (q) => (
          q
            .eq("userId", DEMO_USER_ID)
            .eq("parentFile", fileId)
        ))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false
        })
        await recursiveRestore(child._id)
      }
    }
    const options: Partial<Doc<"files">> = {
      isArchived: false
    }
    if (existingFile.parentFile) {
      const parent = await ctx.db.get(existingFile.parentFile)
      if (parent?.isArchived) {
        options.parentFile = undefined
      }
    }

    const file = await ctx.db.patch(args.fileId, options)
    recursiveRestore(args.fileId)
    return file
  }
})

export const updateFile = mutation({
  args: {
    fileId: v.id("files"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    favorited: v.optional(v.boolean()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Unauthenticated");
    // }

    // const userId = identity.subject;

    const { fileId, ...rest } = args;

    const existingFile = await ctx.db.get(args.fileId);

    if (!existingFile) {
      throw new Error("File not found");
    }

    if (existingFile.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized");
    }

    const file = await ctx.db.patch(args.fileId, {
      ...rest
    })
    return file
  }
})

export const uploadPaper = mutation({
  args: {
    title: v.string(),
    key: v.string(),
    url: v.string(),
    categoryId: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity()

    // if (!identity) {
    //   throw new Error("Not authenticated!")
    // }

    // const userId = identity.subject

    const paper = await ctx.db.insert("files", {
      title: args.title,
      key: args.key,
      url: args.url,
      type: "pdf",
      userId: DEMO_USER_ID,
      favorited: false,
      isArchived: false,
    })
    return paper
  }
})

export const getPublishedNote = query({
  args: { noteId: v.id("files") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Not found");
    }

    if (note.isPublished && !note.isArchived) {
      return note;
    }

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const userId = identity.subject;

    if (note.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized");
    }

    return note;
  }
});


export const removeNoteIcon = mutation({
  args: { noteId: v.id("files") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Unauthenticated");
    // }

    // const userId = identity.subject;

    const existingNote = await ctx.db.get(args.noteId);

    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args.noteId, {
      icon: undefined
    });

    return note;
  }
});

export const removeNoteCoverImage = mutation({
  args: { noteId: v.id("files") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Unauthenticated");
    // }

    // const userId = identity.subject;

    const existingNote = await ctx.db.get(args.noteId);

    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== DEMO_USER_ID) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args.noteId, {
      coverImage: undefined,
    });

    return note;
  }
});
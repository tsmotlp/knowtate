import prismadb from "@/lib/prismadb"


export const createNote = async (title: string, type: string, categoryId: string, paperId?: string) => {
  try {
    const note = await prismadb.note.create({
      data: {
        title,
        paperId,
        type,
        categoryId,
        content: "",
        favorited: false,
        archived: false
      }
    })
    return note
  } catch (error) {
    console.log("CREATE NOTE ERROR", error)
  }
}

export const getNotes = async (categoryId?: string) => {
  try {
    const allNotes = await prismadb.note.findMany({
      where: {
        categoryId,
        archived: false
      },
    })
    return allNotes
  } catch (error) {
    console.log("GET NOTES ERROR", error)
  }
}

export const getArchivedNotesWithPaper = async () => {
  try {
    const allNotes = await prismadb.note.findMany({
      where: {
        OR: [
          { categoryId: "notes" },
          { categoryId: "whiteboards" }
        ],
        archived: true
      },
      include: {
        paper: true
      }
    })
    return allNotes
  } catch (error) {
    console.log("GET NOTES ERROR", error)
  }
}

export const getFavoritedNotesWithPaper = async () => {
  try {
    const allNotes = await prismadb.note.findMany({
      where: {
        OR: [
          { categoryId: "notes" },
          { categoryId: "whiteboards" }
        ],
        archived: false,
        favorited: true
      },
      include: {
        paper: true
      }
    })
    return allNotes
  } catch (error) {
    console.log("GET NOTES ERROR", error)
  }
}

export const getNotesofPaper = async (paperId?: string) => {
  try {
    const allNotes = await prismadb.note.findMany({
      where: {
        paperId,
        archived: false
      },
    })
    return allNotes
  } catch (error) {
    console.log("GET NOTES ERROR", error)
  }
}

export const getNotesWithPaper = async (categoryId?: string) => {
  try {
    const allNotes = await prismadb.note.findMany({
      where: {
        categoryId,
        archived: false
      },
      include: {
        paper: true
      }
    })
    return allNotes
  } catch (error) {
    console.log("GET NOTES ERROR", error)
  }
}

export const getNoteById = async (id: string) => {
  try {
    const note = await prismadb.note.findUnique({
      where: {
        id
      }
    })
    return note
  } catch (error) {
    console.log("GET NOTE BY ID ERROR", error)
  }
}

export const getNoteWithPaper = async (id: string) => {
  try {
    const note = await prismadb.note.findUnique({
      where: {
        id
      },
      include: {
        paper: true
      }
    })
    return note
  } catch (error) {
    console.log("GET NOTE BY ID ERROR", error)
  }
}

export const getNoteOfPaper = async (paperId: string) => {
  try {
    const notes = await prismadb.note.findMany({
      where: {
        paperId
      }
    })
    return notes
  } catch (error) {
    console.log("GET NOTE OF PAPER ERROR", error)
  }
}

export const favoriteNote = async (id: string, favorited: boolean) => {
  try {
    const note = await prismadb.note.update({
      where: {
        id
      },
      data: {
        favorited
      }
    })
    return note
  } catch (error) {
    console.log("FAVORITE NOTE ERROR", error)
  }
}

export const archiveNote = async (id: string, archived: boolean) => {
  try {
    const note = await prismadb.note.update({
      where: {
        id
      },
      data: {
        archived
      }
    })
    return note
  } catch (error) {
    console.log("ARCHIVE NOTE ERROR", error)
  }
}

export const renameNote = async (id: string, title: string) => {
  try {
    const note = await prismadb.note.update({
      where: {
        id
      },
      data: {
        title
      }
    })
    return note
  } catch (error) {
    console.log("RENAME Note ERROR", error)
  }
}

export const removeNote = async (id: string) => {
  try {
    const note = await prismadb.note.delete({
      where: {
        id
      }
    })
    return note
  } catch (error) {
    console.log("REMOVE NOTE ERROR", error)
  }
}

export const removeNotesOfPaper = async (paperId: string) => {
  try {
    const notes = await prismadb.note.deleteMany({
      where: {
        paperId
      }
    })
    return notes
  } catch (error) {
    console.log("REMOVE NOTES OF PAPER ERROR", error)
  }
}

export const updateContent = async (id: string, content: string) => {
  try {
    const note = await prismadb.note.update({
      where: {
        id
      },
      data: {
        content
      }
    })
    return note
  } catch (error) {
    console.log("UPDATE CONTENT OF NOTE ERROR", error)
  }
}

export const updateIcon = async (id: string, icon: string) => {
  try {
    const note = await prismadb.note.update({
      where: {
        id
      },
      data: {
        icon
      }
    })
    return note
  } catch (error) {
    console.log("UPDATE ICON OF NOTE ERROR", error)
  }
}
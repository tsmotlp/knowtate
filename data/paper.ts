import prismadb from "@/lib/prismadb"


export const createPaper = async (
  title: string,
  url: string,
  categoryId: string,
  authors?: string,
  publication?: string,
  publicateDate?: string,
) => {
  try {
    const paper = await prismadb.paper.create({
      data: {
        title,
        url,
        categoryId,
        authors,
        publication,
        publicateDate,
        favorited: false,
        archived: false
      }
    })
    return paper
  } catch (error) {
    console.log("CREATE PAPER ERROR", error)
  }
}

export const getPapers = async (categoryId?: string) => {
  try {
    const papers = await prismadb.paper.findMany({
      where: {
        categoryId,
        archived: false
      }
    })
    return papers
  } catch (error) {
    console.log("GET Papers ERROR", error)
  }
}

export const getArchivedPapers = async () => {
  try {
    const papers = await prismadb.paper.findMany({
      where: {
        categoryId: "library",
        archived: true
      }
    })
    return papers
  } catch (error) {
    console.log("GET Papers ERROR", error)
  }
}

export const getFavoritedPapers = async () => {
  try {
    const papers = await prismadb.paper.findMany({
      where: {
        categoryId: "library",
        archived: false,
        favorited: true
      }
    })
    return papers
  } catch (error) {
    console.log("GET Papers ERROR", error)
  }
}

export const getRecentPapers = async () => {
  try {
    const today = new Date();
    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(today.getMonth() - 1);
    const papers = await prismadb.paper.findMany({
      where: {
        archived: false,
        updatedAt: {
          gte: lastMonthDate
        }
      }
    })
    return papers
  } catch (error) {
    console.log("GET RECENT PAPERS ERROR", error)
  }
}

export const getPaperById = async (id: string) => {
  try {
    const paper = await prismadb.paper.findUnique({
      where: {
        id
      }
    })
    return paper
  } catch (error) {
    console.log("GET PAPER ERROR", error)
  }
}

export const getPaperWithNotes = async (id: string) => {
  try {
    const paper = await prismadb.paper.findUnique({
      where: {
        id
      },
      include: {
        notes: true,
      }
    })
    return paper
  } catch (error) {
    console.log("GET PAPER ERROR", error)
  }
}

export const getPaperWithNotesAndMessages = async (id: string) => {
  try {
    const paper = await prismadb.paper.findUnique({
      where: {
        id
      },
      include: {
        notes: true,
        messages: true
      }
    })
    return paper
  } catch (error) {
    console.log("GET PAPER ERROR", error)
  }
}

export const favoritePaper = async (id: string, favorited: boolean) => {
  try {
    const paper = await prismadb.paper.update({
      where: {
        id
      },
      data: {
        favorited
      }
    })
    return paper
  } catch (error) {
    console.log("FAVORITE PAPER ERROR", error)
  }
}

export const archivePaper = async (id: string, archived: boolean) => {
  try {
    const paper = await prismadb.paper.update({
      where: {
        id
      },
      data: {
        archived
      }
    })
    return paper
  } catch (error) {
    console.log("ARCHIVE PAPER ERROR", error)
  }
}

export const renamePaper = async (id: string, title: string) => {
  try {
    const paper = await prismadb.paper.update({
      where: {
        id
      },
      data: {
        title
      }
    })
    return paper
  } catch (error) {
    console.log("RENAME PAPER ERROR", error)
  }
}

export const removePaper = async (id: string) => {
  try {
    const paper = await prismadb.paper.delete({
      where: {
        id
      }
    })
    return paper
  } catch (error) {
    console.log("REMOVE PAPER ERROR", error)
  }
}

export const updateAnnotionOfPaper = async (id: string, annotations: string) => {
  try {
    const paper = await prismadb.paper.update({
      where: {
        id
      },
      data: {
        annotations
      }
    })
    console.log("update annotation", paper)
    return paper
  } catch (error) {
    console.log("UPDATE ANNOTATIONS OF PAPER ERROR", error)
  }
}
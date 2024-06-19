import prismadb from "@/lib/prismadb"


export const createCategory = async (name: string, type: string, parentId: string) => {
  try {
    const category = await prismadb.category.create({
      data: {
        name,
        type,
        parentId,
        favorited: false,
        archived: false
      }
    })
    return category
  } catch (error) {
    console.log("CREATE CATEGORY ERROR", error)
  }
}

export const getCategory = async (id: string) => {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id
      }
    })
    return category
  } catch (error) {
    console.log("GET CATEGORY ERROR", error)
  }
}

export const renameCategory = async (id: string, name: string) => {
  try {
    const category = await prismadb.category.update({
      where: {
        id
      },
      data: {
        name
      }
    })
    return category
  } catch (error) {
    console.log("GET CATEGORY ERROR", error)
  }
}

export const getCategoriesByType = async (type: string) => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        type,
        archived: false
      }
    })
    return categories
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error)
  }
}

export const getCategoriesByParent = async (parentId?: string) => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        parentId: parentId,
        archived: false
      }
    })
    return categories
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error)
  }
}

export const getAllCategories = async () => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        archived: false
      }
    })
    return categories
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error)
  }
}

export const getArchivedCategories = async () => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        OR: [
          { parentId: "library", },
          { parentId: "notes", }
        ],
        archived: true
      }
    })
    return categories
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error)
  }
}

export const getFavoritedCategories = async () => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        OR: [
          { parentId: "library", },
          { parentId: "notes", }
        ],
        archived: false,
        favorited: true
      }
    })
    return categories
  } catch (error) {
    console.log("GET CATEGORIES ERROR", error)
  }
}

export const favoriteCategory = async (id: string, favorited: boolean) => {
  try {
    const recursiveFavorite = async (categoryId: string) => {
      const paperChildren = await prismadb.paper.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const paperChild of paperChildren) {
        await prismadb.paper.update({
          where: {
            id: paperChild.id
          },
          data: {
            favorited: favorited
          }
        })
      }
      const noteChildren = await prismadb.note.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const noteChild of noteChildren) {
        await prismadb.note.update({
          where: {
            id: noteChild.id
          },
          data: {
            favorited: favorited
          }
        })
      }
      const children = await prismadb.category.findMany({
        where: {
          parentId: categoryId
        }
      })
      for (const child of children) {
        await prismadb.category.update({
          where: {
            id: child.id
          },
          data: {
            favorited: favorited
          }
        })
        await recursiveFavorite(child.id)
      }
    }
    const category = await prismadb.category.update({
      where: {
        id
      },
      data: {
        favorited: favorited
      }
    })
    await recursiveFavorite(id)
    return category
  } catch (error) {
    console.log("FAVORITE CATEGORY ERROR", error)
  }
}

export const archiveCategory = async (id: string, archived: boolean) => {
  try {
    const recursiveArchive = async (categoryId: string) => {
      const paperChildren = await prismadb.paper.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const paperChild of paperChildren) {
        await prismadb.paper.update({
          where: {
            id: paperChild.id
          },
          data: {
            archived: true
          }
        })
      }
      const noteChildren = await prismadb.note.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const noteChild of noteChildren) {
        await prismadb.note.update({
          where: {
            id: noteChild.id
          },
          data: {
            archived: true
          }
        })
      }
      const children = await prismadb.category.findMany({
        where: {
          parentId: categoryId
        }
      })
      for (const child of children) {
        await prismadb.category.update({
          where: {
            id: child.id
          },
          data: {
            archived: true
          }
        })
        await recursiveArchive(child.id)
      }
    }
    const archivedCategory = await prismadb.category.update({
      where: {
        id
      },
      data: {
        archived: true
      }
    })
    await recursiveArchive(id)
    return archivedCategory
  } catch (error) {
    console.log("ARCHIVE CATEGORY ERROR", error)
  }
}

export const removeCategory = async (id: string) => {
  try {
    const recursiveRemove = async (categoryId: string) => {
      const paperChildren = await prismadb.paper.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const paperChild of paperChildren) {
        await prismadb.paper.delete({
          where: {
            id: paperChild.id
          },
        })
      }
      const noteChildren = await prismadb.note.findMany({
        where: {
          categoryId: categoryId
        }
      })
      for (const noteChild of noteChildren) {
        await prismadb.note.delete({
          where: {
            id: noteChild.id
          },
        })
      }
      const children = await prismadb.category.findMany({
        where: {
          parentId: categoryId
        }
      })
      for (const child of children) {
        await prismadb.category.delete({
          where: {
            id: child.id
          }
        })
        await recursiveRemove(child.id)
      }
    }
    const removedCategory = await prismadb.category.delete({
      where: {
        id
      },
    })
    await recursiveRemove(id)
    return removedCategory
  } catch (error) {
    console.log("REMOVE CATEGORY ERROR", error)
  }
}
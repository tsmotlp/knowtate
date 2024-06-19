import prismadb from "@/lib/prismadb"


export const createMessage = async (paperId: string, role: string, content: string) => {
  try {
    const message = await prismadb.message.create({
      data: {
        paperId,
        role,
        content
      }
    })
    return message
  } catch (error) {
    console.log("CREATE MESSAGE ERROR", error)
  }
}

export const getMessages = async (paperId: string) => {
  try {
    const messages = await prismadb.message.findMany({
      where: {
        paperId
      },
      orderBy: {
        createdAt: "asc"
      }
    })
    return messages
  } catch (error) {
    console.log("GET MESSAGES ERROR", error)
  }
}

export const getLimitedMessages = async (paperId: string, limit: number) => {
  try {
    const messages = await prismadb.message.findMany({
      where: {
        paperId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    })
    return messages
  } catch (error) {
    console.log("GET LIMITED MESSAGES ERROR", error)
  }
}

export const removeMessagesOfPaper = async (paperId: string) => {
  try {
    const messages = await prismadb.message.deleteMany({
      where: {
        paperId
      }
    })
    return messages
  } catch (error) {
    console.log("REMOVE MESSAGES ERROR", error)
  }
}
import axios from "axios"
import { toast } from "sonner"

export const uploadImage = async (image: File, oldUrl?: string) => {
  const formData = new FormData()
  formData.append("image", image)
  if (oldUrl) {
    formData.append("oldUrl", oldUrl)
  }
  const response = await axios.post("/api/image", formData)
  if (response.status !== 200) {
    toast("", { description: "Failed to upload image!" })
    return;
  } else {
    const url = response.data
    toast("", { description: "Image uploaded!" })
    return url
  }
}

export const deleteImage = async (url: string) => {
  const response = await axios.delete(`/api/image`, {
    data: {
      oldUrl: url,
    }
  })
  if (response.status !== 200) {
    toast("", { description: "Failed to delete image!" })
    return;
  } else {
    const url = response.data
    toast("", { description: "Image deleted!" })
    return url
  }
}

// 文件的上传和删除
export const uploadPaper = async (paper: File, category: string, title: string) => {
  const formData = new FormData()
  formData.append("paper", paper)
  formData.append("category", category)
  formData.append("title", title)
  const response = await axios.post("/api/paper", formData)
  if (response.status !== 200) {
    toast("", { description: "Failed to upload paper!" })
    return;
  } else {
    console.log("paper upload response:", response.data)
    toast("", { description: "Paper uploaded!" })
    return response.data
  }
}


export const deletePaper = async (paperKey: string) => {
  const response = await axios.delete(`/api/paper`, {
    data: {
      paperKey: paperKey,
    }
  })
  if (response.status !== 200) {
    toast("", { description: "Failed to delete paper!" })
    return;
  } else {
    toast("", { description: "Paper deleted!" })
  }
}
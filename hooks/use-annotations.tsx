import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Annotation } from "@/types/annotations"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"


export const useAnnotations = (fileId: Id<"files">) => {
  const paper = useQuery(api.files.getFileById, { fileId })
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const updateAnnotation = useMutation(api.files.updateFile)

  useEffect(() => {
    if (paper?.content) {
      try {
        const initAnnotations: Annotation[] = JSON.parse(paper.content)
        setAnnotations(initAnnotations)
      } catch (error) {
        console.log("Failed to parse annotations", error)
        setAnnotations([])
      }
    }
  }, [paper])

  useEffect(() => {
    if (annotations.length > 0) {
      updateAnnotation({
        fileId,
        content: JSON.stringify(annotations)
      }).catch(error => {
        console.log("Failed to update annotations", error)
      })
    }
  }, [annotations, fileId, updateAnnotation])
  return [annotations, setAnnotations] as const
}
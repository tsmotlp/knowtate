import { updateAnnotionOfPaper } from "@/data/paper"
import { Annotation } from "@/types/types"
import { Paper } from "@prisma/client"
import { useEffect, useState } from "react"


export const useAnnotations = (paper: Paper) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  useEffect(() => {
    if (paper.annotations) {
      try {
        const initAnnotations: Annotation[] = JSON.parse(paper.annotations)
        setAnnotations(initAnnotations)
      } catch (error) {
        console.log("Failed to parse annotations", error)
        setAnnotations([])
      }
    }
  }, [paper])

  useEffect(() => {
    if (annotations.length > 0) {
      updateAnnotionOfPaper(paper.id, JSON.stringify(annotations)).catch(error => {
        console.log("Failed to update annotations", error)
      })
    }
  }, [annotations, paper])
  return [annotations, setAnnotations] as const
}
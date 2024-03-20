import { HighlightArea } from "@react-pdf-viewer/highlight"

export enum AnnotationType {
  Highlight = "Highlight",
  Underline = "Underline"
}

export type Annotation = {
  id: string
  type: AnnotationType
  color: string
  opacity: number
  popoverTop: string
  popoverLeft: string
  areas: HighlightArea[]
}
import { Category, Note, Paper } from "@prisma/client"
import { LucideIcon } from "lucide-react"
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

export type CategoryWithIcon = Category & {
  icon: LucideIcon
}

export type PaperMenuType = {
  info: boolean,
  notes: boolean,
  chat: boolean
}

export type NoteWithPaper = Note & {
  paper: Paper | null
}

export type PaperWithNotes = Paper & {
  notes: Note[],
}

export enum CategoryType {
  Papers = "Paper",
  Markdowns = "Markdowns",
  Whiteboards = "Whiteboards",
  Others = "Others"
}

export enum DashboardItemType {
  Category = "Category",
  Paper = "Paper",
  Markdown = "Markdown",
  Whiteboard = "Whiteboard"
}

export type DashboardItem = {
  id: string,
  label: string,
  type: DashboardItemType,
  favorited: boolean,
  archived: boolean,
  url: string | null,
  authors: string | null,
  publication: string | null,
  publicationDate: string | null,
  paperTile: string | null,
  paperId?: string | null,
  lastEdit: Date,
}
import { getArchivedCategories, getCategoriesByParent, getCategory, getFavoritedCategories } from "@/data/category"
import { getArchivedNotesWithPaper, getFavoritedNotesWithPaper, getNotesWithPaper } from "@/data/note"
import { getArchivedPapers, getFavoritedPapers, getPapers, getRecentPapers } from "@/data/paper"
import { ItemsBrowser } from "../_components/items-browser"
import { DashboardItem, DashboardItemType, NoteWithPaper } from "@/types/types"
import { Category, Paper } from "@prisma/client"
import { RecentBrowser } from "../_components/recent-browser"
import { WebsBrowser } from "../_components/webs-browser"

interface CategoryIdPageProps {
  params: {
    categoryId: string
  }
}

const CategoryIdPage = async ({ params }: CategoryIdPageProps) => {
  const category = await getCategory(params.categoryId)
  let subCategories: Category[] | undefined = []
  let papers: Paper[] | undefined = []
  let notes: NoteWithPaper[] | undefined = []
  if (params.categoryId === "recents") {
    papers = await getRecentPapers()
  } else if (params.categoryId === "trash") {
    subCategories = await getArchivedCategories()
    notes = await getArchivedNotesWithPaper()
    papers = await getArchivedPapers()
  } else if (params.categoryId === "favorites") {
    subCategories = await getFavoritedCategories()
    notes = await getFavoritedNotesWithPaper()
    papers = await getFavoritedPapers()
  } else {
    subCategories = await getCategoriesByParent(params.categoryId)
    notes = await getNotesWithPaper(params.categoryId)
    papers = await getPapers(params.categoryId)
  }

  const items: DashboardItem[] = []
  if (subCategories) {
    subCategories.map((c) => (items.push({
      id: c.id,
      label: c.name,
      type: DashboardItemType.Category,
      archived: c.archived,
      favorited: c.favorited,
      url: null,
      authors: null,
      publication: null,
      publicationDate: null,
      paperTile: null,
      paperId: null,
      lastEdit: c.updatedAt,
    })))
  }

  if (papers) {
    papers.map((p) => (items.push({
      id: p.id,
      label: p.title,
      type: DashboardItemType.Paper,
      archived: p.archived,
      favorited: p.favorited,
      url: p.url,
      authors: p.authors,
      publication: p.publication,
      publicationDate: p.publicateDate,
      paperTile: null,
      paperId: null,
      lastEdit: p.updatedAt,
    })))
  }

  if (notes) {
    notes.map((n) => (items.push({
      id: n.id,
      label: n.title,
      type: n.type as DashboardItemType,
      archived: n.archived,
      favorited: n.favorited,
      url: null,
      authors: null,
      publication: null,
      publicationDate: null,
      paperTile: n.paper ? n.paper.title : null,
      paperId: n.paperId,
      lastEdit: n.updatedAt,
    })))
  }


  return (
    <div className="h-full w-full">
      {params.categoryId === "webs" ? (
        <WebsBrowser url="" />
      ) : params.categoryId === "recents" ? (
        <RecentBrowser
          category={category}
          parentId={params.categoryId}
          initItems={items}
        />
      ) : (
        <ItemsBrowser
          category={category}
          parentId={params.categoryId}
          initItems={items}
        />
      )}
    </div>
  );

}
  

export default CategoryIdPage
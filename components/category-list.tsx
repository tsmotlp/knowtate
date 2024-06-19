"use client"

import { SidebarItem } from "@/components/sidebar-item"
import { CategoryWithIcon } from "@/types/types"
import { Category } from "@prisma/client"
import axios from "axios"
import { Folder } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { defaultCategories } from "./default-categories"


interface CategoryListProps {
  parentId: string
  categories: CategoryWithIcon[]
  level: number
}

export const CategoryList = ({
  parentId,
  categories,
  level,
}: CategoryListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const subCategories = categories.filter((category) => category.parentId === parentId)
  const onExpand = (categoryId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [categoryId]: !prevExpanded[categoryId]
    }));
  };


  if (!subCategories || subCategories.length === 0) {
    return (
      <>
        <SidebarItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <SidebarItem.Skeleton level={level} />
            <SidebarItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      {subCategories && subCategories.length > 0 && subCategories
        .map((category) => (
          <div key={category.id} className="w-full">
            <SidebarItem
              id={category.id}
              label={category.name}
              icon={category.icon}
              active={params.categoryId === category.id || (params.categoryId === undefined && category.id === "library")}
              level={level}
              onClick={() => { router.push(`/dashboard/${category.id}`) }}
              onExpand={() => onExpand(category.id)}
              expanded={expanded[category.id]}
              showExpandIcon={categories.filter((item) => item.parentId === category.id).length > 0}
            />
            {expanded[category.id] && (
              <CategoryList
                parentId={category.id}
                categories={categories}
                level={level + 1}
              />
            )}
          </div>
        ))
      }
    </>
  )

}

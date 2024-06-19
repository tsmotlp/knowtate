"use client"

import { CategoryList } from "./category-list"
import { useEffect, useState } from "react"
import axios from "axios"
import { Category } from "@prisma/client"
import { Folder } from "lucide-react"
import { defaultCategories } from "./default-categories"
import { CategoryWithIcon } from "@/types/types"
import { toast } from "sonner"


export const Sidebar = () => {
  const [categories, setCategories] = useState<CategoryWithIcon[]>(defaultCategories)

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        if (response.status === 200) {
          const categories: Category[] = response.data;
          const updatedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            type: category.type,
            favorited: category.favorited,
            archived: category.archived,
            parentId: category.parentId,
            icon: Folder,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
          }));
          // 将默认类别和从API获取的类别合并
          setCategories([...defaultCategories, ...updatedCategories]);
        } else {
          toast.error('Failed to get categories');
        }
      } catch (error) {
        console.error('GET CATEGORIES ERROR', error);
        toast.error('Failed to get categories');
      }
    };
    // 调用getAllCategories
    getAllCategories();
  }, [])

  return (
    <div className="h-full w-80 border-r flex flex-col gap-y-4 items-start justify-start  p-4">
      <CategoryList
        categories={categories}
        parentId="text"
        level={0}
      />
      {/* <div className="my-2" />
      <CategoryList
        categories={categories}
        parentId="tool"
        level={0}
      /> */}
    </div>
  )
}
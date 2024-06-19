"use client"

import { defaultCategories } from "@/components/default-categories"
import { SearchBar } from "@/components/search-bar"
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types"
import { Category } from "@prisma/client"
import { useEffect, useState } from "react"
import { CategoryCreator } from "./category-creator"
import { PaperUploader } from "./paper-uploader"
import { Separator } from "@/components/ui/separator"
import { NoteCreator } from "./note-creator"
import { RecentItem } from "./recent-item"

interface RecentBrowserProps {
  category: Category | undefined | null,
  parentId: string,
  initItems: DashboardItem[]
}

function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getStartOfYesterday(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

function getStartOfLastWeek(): Date {
  const today = new Date();
  today.setDate(today.getDate() - 7); // 往前推7天
  today.setHours(0, 0, 0, 0);
  return today;
}

function getStartOfLastMonth(): Date {
  const today = new Date();
  today.setDate(today.getDate() - 30); // 往前推30天
  today.setHours(0, 0, 0, 0);
  return today;
}

// 这里的item包含Category, Paper和Note
export const RecentBrowser = ({
  category,
  parentId,
  initItems,
}: RecentBrowserProps) => {
  if (!category) {
    category = defaultCategories.find((c) => c.id === parentId)
  }
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<DashboardItem[]>(initItems)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (id: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [id]: !prevExpanded[id]
    }));
  };

  const startOfToday = getStartOfToday();
  const startOfYesterday = getStartOfYesterday();
  const startOfLastWeek = getStartOfLastWeek();
  const startOfLastMonth = getStartOfLastMonth();
  const today = items.filter(item => item.lastEdit >= startOfToday);
  const yesterday = items.filter(item => item.lastEdit >= startOfYesterday && item.lastEdit < startOfToday)
  const week = items.filter(item => item.lastEdit >= startOfLastWeek && item.lastEdit < startOfYesterday)
  const month = items.filter(item => item.lastEdit >= startOfLastMonth && item.lastEdit < startOfLastWeek)

  useEffect(() => {
    const filterByQuery = (item: DashboardItem) => item.label.toLowerCase().includes(query.toLowerCase());
    setItems(items.filter(filterByQuery));
  }, [query])

  return (
    <>
      {category ? (
        <div className="p-4 h-full w-full">
          <div className="w-full flex items-center justify-between">
            <div className="h-full w-full flex items-center justify-start gap-x-16">
              <div className="h-full font-semibold">
                {category.name}
              </div>
              {category.type === CategoryType.Papers && (
                <div className="h-full flex items-center gap-x-2">
                  <PaperUploader categoryId={parentId} setItems={setItems} />
                  <CategoryCreator type={CategoryType.Papers} parentId={parentId} setItems={setItems} />
                </div>
              )}
              {category.type === CategoryType.Markdowns && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Markdown} categoryId={parentId} setItems={setItems} />
                  <CategoryCreator type={CategoryType.Markdowns} parentId={parentId} setItems={setItems} />
                </div>
              )}
              {category.type === CategoryType.Whiteboards && (
                <div className="h-full flex items-center gap-x-2">
                  <NoteCreator type={DashboardItemType.Whiteboard} categoryId={parentId} setItems={setItems} />
                  <CategoryCreator type={CategoryType.Whiteboards} parentId={parentId} setItems={setItems} />
                </div>
              )}
            </div>
            <div className="h-full">
              <SearchBar
                query={query}
                setQuery={setQuery}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="w-full flex flex-col items-center gap-y-4">
            <RecentItem
              label="今天"
              expanded={expanded["today"]}
              onExpand={() => onExpand("today")}
              items={today}
            />
            <RecentItem
              label="昨天"
              expanded={expanded["yesterday"]}
              onExpand={() => onExpand("yesterday")}
              items={yesterday}
            />
            <RecentItem
              label="过去一周"
              expanded={expanded["week"]}
              onExpand={() => onExpand("week")}
              items={week}
            />
            <RecentItem
              label="本月更早"
              expanded={expanded["month"]}
              onExpand={() => onExpand("month")}
              items={month}
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          出错啦
        </div>
      )}
    </>
  )
}
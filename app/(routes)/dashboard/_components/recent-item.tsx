"use client"

import { DashboardItem } from "@/types/types";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BsFiletypePdf } from "react-icons/bs";

interface RecentItemProps {
  label: string,
  expanded?: boolean
  onExpand: () => void
  items: DashboardItem[]
}

export const RecentItem = ({
  label,
  expanded = true,
  onExpand,
  items
}: RecentItemProps) => {

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;


  return (
    <div className="h-full w-full">
      <div className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center font-medium">
        <div
          role="button"
          className="h-full rounded-sm mx-1"
          onClick={handleExpand}
        >
          <ChevronIcon
            className="h-4 w-4 shrink-0 text-muted-foreground/50"
          />
        </div>
        <span className="truncate">
          {label}
        </span>
      </div>
      {expanded && (
        <div className="flex flex-col px-6 py-4 gap-y-4">
          {items && items.map((item) => (
            <div key={item.id} className="flex w-full justify-between text-sm">
              <Link
                href={`/papers/${item.id}`}
                className="flex items-center hover:underline"
              >
                <BsFiletypePdf className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-muted-foreground">{item.label}</span>
              </Link>
              <div className="text-muted-foreground">
                {format(new Date(item.lastEdit), "MM/dd HH:mm")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
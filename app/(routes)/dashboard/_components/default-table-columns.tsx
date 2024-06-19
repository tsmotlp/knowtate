"use client"

import { Paper } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
// import { FileActions } from "./file-actions";
import Link from "next/link";
import { BsFiletypePdf, BsMarkdown } from "react-icons/bs"
// import { PaperActions } from "./paper-actions";
import { Folder, PenTool } from "lucide-react";
// import { CategoryActions } from "../../../../../components/category/category-actions";
import { DashboardItem, DashboardItemType } from "@/types/types";
import { ItemActions } from "./item-actions";


export const DefaultTableColumns: ColumnDef<DashboardItem>[] = [
  {
    header: "标题",
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.type === DashboardItemType.Category ?
            `/dashboard/${row.original.id}` : `/notes/${row.original.id}`}
          legacyBehavior
        >
          <div className="flex items-center gap-x-2 hover:cursor-pointer">
            {row.original.type === DashboardItemType.Paper && (
              <BsFiletypePdf className="h-4 w-4 text-red-500" />
            )}
            {row.original.type === DashboardItemType.Category && (
              <Folder className="h-4 w-4 text-primary/50 fill-primary/50" />
            )}
            {row.original.type === DashboardItemType.Markdown && (
              <BsMarkdown className="h-4 w-4 text-primary/50 fill-primary/50" />
            )}
            {row.original.type === DashboardItemType.Whiteboard && (
              <PenTool className="h-4 w-4 text-purple-300 " />
            )}
            <span className="truncate text-muted-foreground">{row.original.label}</span>
          </div>
        </Link>
      )
    }
  },
  {
    header: "所属论文",
    cell: ({ row }) => {
      return (
        <>
          {row.original.paperId && (
            <Link
              href={`/papers/${row.original.paperId}`}
              className="h-full w-full flex items-center gap-x-1 hover:underline text-muted-foreground"
            >
              <BsFiletypePdf className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="truncate">{row.original.paperTile}</span>
            </Link>
          )}
        </>
      )
    }
  },
  {
    header: "最后修改",
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer">
          {format(new Date(row.original.lastEdit), "yyyy/MM/dd")}
        </div>
      );
    },
  },
  {
    header: "管理",
    cell: ({ row }) => {
      return (
        <div className="truncate text-muted-foreground hover:cursor-pointer">
          <ItemActions
            item={row.original}
          />
        </div>
      );
    },
  },
]
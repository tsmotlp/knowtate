"use client"

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { FileActions } from "./file-actions";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

export const TableColumns: ColumnDef<Doc<"files">>[] = [
  {
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link
          href={`/papers/${row.original._id}`}
          legacyBehavior
        >
          {row.original.title}
        </Link>
      )
    }
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {format(new Date(row.original._creationTime), "yyyy/MM/dd")}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <FileActions
            file={row.original}
          />
        </div>
      );
    },
  },
]
"use client";

import {
  flexRender,
  getCoreRowModel,
  Table as ReactTable,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DefaultTableColumns } from "./default-table-columns";
import Image from "next/image";
import { CategoryType, DashboardItem, DashboardItemType } from "@/types/types";
import { PaperTableColumns } from "./paper-table-columns";

interface ItemsTableProps {
  type: CategoryType,
  items: DashboardItem[],
}

export const ItemsTable = ({
  type,
  items
}: ItemsTableProps) => {
  let table: ReactTable<DashboardItem>;
  if (type === CategoryType.Papers) {
    table = useReactTable({
      columns: PaperTableColumns,
      data: items,
      getCoreRowModel: getCoreRowModel()
    })
  } else {
    table = useReactTable({
      columns: DefaultTableColumns,
      data: items,
      getCoreRowModel: getCoreRowModel()
    })
  }

  return (
    <>
      {items.length > 0 ? (
        <div className="h-full w-full border-b">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}
                        className="font-semibold text-medium"
                      >
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0 && (
                table.getRowModel().rows
                  .sort(
                    (a, b) => {
                      // 首先比较url，空字符串视为较小
                      if (a.original.type === DashboardItemType.Category && b.original.type !== DashboardItemType.Category) return -1;
                      if (a.original.type !== DashboardItemType.Category && b.original.type === DashboardItemType.Category) return 1;

                      // 如果url相同（都为空或都不为空），则比较updatedAt
                      return new Date(b.original.lastEdit).getTime() - new Date(a.original.lastEdit).getTime();
                    }
                  )
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 pt-60">
          <Image
            src="/men.svg"
            height="300"
            width="300"
            alt="Empty"
            className="dark:hidden"
          />
          <Image
            src="/men-dark.svg"
            height="300"
            width="300"
            alt="Empty"
            className="hidden dark:block"
          />
          <h3 className="font-semibold text-lg">Nothing Found!</h3>
        </div>
      )}
    </>
  )
}
"use client";

import {
  flexRender,
  getCoreRowModel,
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
import { TableColumns } from "./table-columns";
import Link from "next/link";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";

interface FileTableProps {
  label: string,
  files: Doc<"files">[]
}

export const FileTable = ({
  label,
  files
}: FileTableProps) => {
  const table = useReactTable({
    columns: TableColumns,
    data: files,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div>
      {files && files?.length !== 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-bold text-medium">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
              ) : (
                <TableRow>
                  <TableCell colSpan={TableColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-60 flex flex-col items-center gap-2">
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
          <h3 className="mt-2 font-semibold text-xl">No {label} found here</h3>
          {label === "file" && (<p>Please upload a paper or create a note to continue.</p>)}
          {label === "paper" && (<p>Please upload a paper to continue.</p>)}
          {label === "note" && (<p>Please create a note to continue.</p>)}
        </div>
      )}
    </div>
  )
}
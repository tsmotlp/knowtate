"use client"

import * as React from "react"
import { Bookmark, Check, ChevronsUpDown, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function OperationNavbar() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className='flex h-full'>
      <div className='h-full flex flex-col items-center gap-y-2 p-2'>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-muted-foreground'
          )}
          onClick={() => {
          }}
        >
          <LayoutDashboard />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-muted-foreground',
          )}
          onClick={() => {
          }}
        >
          <Bookmark />
        </Button>
      </div>
      {/* {isThumnailOpened && (
        <Thumbnails />
      )}
      {isBookmarkOpened && (
        <Bookmarks />
      )} */}
    </div>
  )
}

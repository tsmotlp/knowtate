"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export const Menu = () => {
  return (
    <div className="flex items-center gap-x-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/docs">
          Docs
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/pricing">
          Pricing
        </Link>
      </Button>
    </div>
  )
}
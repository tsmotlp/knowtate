"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarItemProps {
  label: string,
  icon: LucideIcon,
  href: string,
  isMobile: boolean,
}

export const SidebarItem = ({
  label,
  icon: Icon,
  href,
  isMobile
}: SidebarItemProps) => {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start"
      size="lg"
      asChild
    >
      <Link href={href}>
        <Icon
          className={cn(
            "h-6 w-6",
            !isMobile && "mr-5"
          )}
        />
        <p className={isMobile ? "hidden" : ""}>{label}</p>
      </Link>
    </Button>
  )
}
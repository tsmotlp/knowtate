"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface ToolButtonProps {
  label: string
  icon: LucideIcon
  size?: "icon" | "default" | "sm" | "lg" | "compact" | null | undefined,
  onClick: () => void
  iconClassName: string
  color: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  size = "icon",
  onClick,
  iconClassName,
  color
}: ToolButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={onClick}
          >
            <Icon className={cn(iconClassName, color)} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className={cn("text-xs capitalize", color)}>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
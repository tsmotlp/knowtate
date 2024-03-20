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
  onClick: () => void
  color: string
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  color
}: ToolButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
          >
            <Icon className={cn("h-4 w-4", color)} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className={cn("text-xs capitalize", color)}>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
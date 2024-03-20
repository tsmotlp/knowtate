"use client";

import { ChevronsLeftRight, Files, LayoutDashboard, Library, LogOut, Settings } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/clerk-react";

import {
  Avatar,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hooks/use-settings";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface UserItemProps {
  textColor?: string
}

export const UserItem = ({
  textColor
}: UserItemProps) => {
  const { user } = useUser();
  const router = useRouter()
  const settings = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className={cn(
              "text-start font-medium line-clamp-1",
              textColor && textColor,
            )}>
              {user?.fullName}&apos;s Knowtate
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.fullName}&apos;s Knowtate
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push("/files")}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>All Files</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={settings.onOpen}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </DropdownMenuItem>
          </div>
          <DropdownMenuItem asChild className="cursor-pointer text-muted-foreground">
            <SignOutButton>
              <div><LogOut className="h-4 w-4 mr-1" /> Logout</div>
            </SignOutButton>
          </DropdownMenuItem>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
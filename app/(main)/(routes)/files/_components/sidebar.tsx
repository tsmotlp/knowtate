"use client";

import { Logo } from "@/app/(marketing)/_components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, FilesIcon, HeartIcon, Home, HomeIcon, Loader, NotebookPen, NotebookPenIcon, Settings, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts"
import { SidebarItem } from "./sidebar-item";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/clerk-react";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="flex h-full flex-col">
      <div className="pl-4 pb-14">
        <Logo imageOnly={isMobile ? true : false} />
      </div>
      <div className="flex flex-col gap-y-4 flex-1">
        <SidebarItem
          label="All Files"
          icon={FilesIcon}
          href="/files"
          isMobile={isMobile}
        />
        <SidebarItem
          label="Favorites"
          icon={HeartIcon}
          href="/files/favorites"
          isMobile={isMobile}
        />
        <SidebarItem
          label="Papers"
          icon={FileText}
          href="/files/papers"
          isMobile={isMobile}
        />
        <SidebarItem
          label="Notes"
          icon={NotebookPenIcon}
          href="/files/notes"
          isMobile={isMobile}
        />
        <SidebarItem
          label="Trash"
          icon={Trash2Icon}
          href="/files/trash"
          isMobile={isMobile}
        />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
}
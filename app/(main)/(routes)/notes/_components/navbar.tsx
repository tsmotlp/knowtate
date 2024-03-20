"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

export const Navbar = ({
  isCollapsed,
  onResetWidth
}: NavbarProps) => {
  const params = useParams();

  const note = useQuery(api.files.getPublishedNote, {
    noteId: params.noteId as Id<"files">,
  });

  if (note === undefined) {
    return (
      <nav className="bg-background px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (note === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={note} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={note} />
            <Menu fileId={note._id} />
          </div>
        </div>
      </nav>
      {note.isArchived && (
        <Banner fileId={note._id} />
      )}
    </>
  )
}
"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { NoteCreator } from "../files/_components/note-creator";

const NotesPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const createNote = useMutation(api.files.createNote);

  const onCreate = () => {
    const promise = createNote({ title: "Untitled", type: "notion" })
      .then((noteId) => router.push(`/notes/${noteId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Knowtate
      </h2>
      <NoteCreator handleNoteCreate={onCreate} />
    </div>
  );
}

export default NotesPage;
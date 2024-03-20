"use client"
import { useEffect, useState } from "react";
import { PaperUploader } from "./paper-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridIcon, RowsIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileGrid } from "./file-grid";
import { FileTable } from "./file-table";
import { CategoryActions } from "./category-actions";
import { SearchBar } from "./search-bar";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { NoteCreator } from "./note-creator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FilesBrowserProps {
  label: string,
  isPapers?: boolean,
  isNotes?: boolean,
  categories?: Doc<"categories">[]
  files: Doc<"files">[]
}

export const FilesBrowser = ({
  label,
  isPapers,
  isNotes,
  categories,
  files
}: FilesBrowserProps) => {
  console.log("file browser", files)
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [query, setQuery] = useState("");
  const [categoryFiles, setCategoryFiles] = useState<Doc<"files">[]>(isPapers ? files : [])
  const [showFiles, setShowFiles] = useState<Doc<"files">[]>([])
  const [categoryId, setCategoryId] = useState<string>("All");

  const createNote = useMutation(api.files.createNote);

  const handleCreateNote = (title: string, type: Doc<"files">["type"]) => {
    const promise = createNote({ title: title, type: type })
      .then((noteId) => router.push(`/notes/${noteId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  const getCategoryFiles = () => {
    return categoryId === "All" ? files : files?.filter((file) => (
      file.categoryId === categoryId
    ))
  }

  // When categories change, update both categoryFiles and subsequently showFiles
  useEffect(() => {
    const updatedFiles = getCategoryFiles(); // This function should not have side effects
    setCategoryFiles(updatedFiles);
  }, [categoryId, files]); // Ensure files is a dependency if getCategoryFiles depends on it

  // React to both categoryFiles and query changes to update shown files
  useEffect(() => {
    const filterByQuery = (file: Doc<"files">) => file.title.toLowerCase().includes(query.toLowerCase());
    setShowFiles(categoryFiles.filter(filterByQuery));
  }, [query, categoryFiles]); // Depend on categoryFiles to ensure we filter on the latest files

  return (
    <div className="w-full mx-auto">
      {isMobile ? (
        <div className="border-b pb-8">
          <div className="flex items-center w-full">
            <SearchBar query={query} setQuery={setQuery} />
            <div className="flex gap-x-2">
              {isPapers && (
                <PaperUploader />
              )}
              {isNotes && (
                <NoteCreator handleNoteCreate={handleCreateNote} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-4 border-b pb-8">
          <SearchBar query={query} setQuery={setQuery} />
          <div className="flex items-center gap-x-2">
            {isPapers && (
              <PaperUploader />
            )}
            {isNotes && (
              <NoteCreator handleNoteCreate={handleCreateNote} />
            )}
          </div>
        </div>
      )}

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mt-6">
            <TabsTrigger
              value="grid"
              className="flex gap-2 items-center"
            >
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex gap-2 items-center"
            >
              <RowsIcon />
              Table
            </TabsTrigger>
          </TabsList>
          {isPapers && (
            <div className="flex gap-2 items-center mt-6">
              <Label htmlFor="category-select">
                <CategoryActions />
              </Label>
              <Select
                value={categoryId}
                onValueChange={(newcategoryId) => {
                  setCategoryId(newcategoryId);
                }}
              >
                <SelectTrigger id="type-select" className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"All"} value={"All"}>All</SelectItem>
                  {categories && categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <TabsContent value="grid" className="mt-6">
          <FileGrid label={label} files={showFiles} />
        </TabsContent>
        <TabsContent value="table" className="mt-6">
          <FileTable label={label} files={showFiles} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
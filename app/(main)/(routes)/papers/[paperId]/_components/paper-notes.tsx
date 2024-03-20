"use client"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Loader } from "lucide-react"
import { Toolbar } from "@/components/editors/toolbar"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { NoteCreator } from "../../../files/_components/note-creator"
import { toast } from "sonner"
import '@mdxeditor/editor/style.css';
import dynamic from "next/dynamic"

interface PaperNotesProps {
  paperId: Id<"files">
}


export const PaperNotes = ({
  paperId
}: PaperNotesProps) => {
  const NotionEditor = useMemo(() => dynamic(() => import("@/components/editors/notion-editor"), { ssr: false }), []);
  const ExcalidrawEditor = useMemo(() => dynamic(() => import("@/components/editors/excalidraw-editor"), { ssr: false }), []);
  const MarkdownEditor = useMemo(() => dynamic(() => import("@/components/editors/markdown-editor"), { ssr: false }), []);

  const [currentNote, setCurrentNote] = useState<Doc<"files">>()
  // 状态来跟踪编辑器的内容和最后一次更新的内容
  const [editorContent, setEditorContent] = useState('');
  const [lastSavedContent, setLastSavedContent] = useState('');

  const createNote = useMutation(api.files.createNote);

  const notes = useQuery(api.files.getAllNotesOfPaper, {
    paperId: paperId
  })

  const isLoading = notes === undefined

  const updateNote = useMutation(api.files.updateFile);

  const handleCreateNote = (title: string, type: Doc<"files">["type"]) => {
    const promise = createNote({ parentFile: paperId, title: title, type: type })
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  useEffect(() => {
    // 当 currentNote 改变时，这个 useEffect 将会被调用
    if (currentNote) {
      // 加载当前选中的 note 内容
      setEditorContent(currentNote.content || '');
      // 重置 lastSavedContent 以避免立即触发自动保存
      setLastSavedContent(currentNote.content || '');
    }
  }, [currentNote]);

  // 修改 onChange 方法以保存当前编辑内容而不是立即更新 note
  const onChange = (content: string) => {
    setEditorContent(content);
  };

  // 用于自动保存的逻辑
  const autoSaveContent = async () => {
    if (currentNote && editorContent !== lastSavedContent) {
      // 调用保存函数
      await updateNote({
        fileId: currentNote._id,
        content: editorContent,
      });
      setLastSavedContent(editorContent);
      toast.success("Content saved automatically");
    }
  };

  // 当用户尝试切换 note 时，先保存当前 note
  const handleNoteChange = async (note: Doc<"files">) => {
    // 保存当前编辑的 note
    await autoSaveContent();
    // 然后切换到新的 note
    setCurrentNote(note);
  };


  // 当组件加载完成后，检查 notes 是否存在且长度大于 0，然后设置 currentNote 为第一个元素
  useEffect(() => {
    if (notes && notes.length > 0) {
      setCurrentNote(notes[0])
    }
  }, [notes]) // 依赖数组中包含 notes，这样只要 notes 发生变化，这个 useEffect 就会重新运行

  useEffect(() => {
    // 设置定时器每 10 秒自动保存
    const intervalId = setInterval(autoSaveContent, 10000);

    // 处理组件卸载和页面切换时的保存
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      await autoSaveContent();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 清理定时器和事件监听器
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [editorContent, currentNote, lastSavedContent]);

  return (
    <>
      {isLoading ? (
        <div className="h-full w-full items-center justify-between">
          <Loader className="h-6 w-6" />
        </div>
      ) : (
        <div>
          {notes.length === 0 ? (
            <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center space-y-4">
              <Image
                src="/men.svg"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
              />
              <Image
                src="/men-dark.svg"
                height="300"
                width="300"
                alt="Empty"
                className="hidden dark:block"
              />
              <h2 className="text-lg font-medium">
                There is no note associated to the paper
              </h2>
              <NoteCreator showTitle={true} handleNoteCreate={handleCreateNote} />
            </div>
          ) : (
            <Tabs defaultValue={notes[0]._id} className="w-full h-full p-2">
              <div className="flex items-center justify-between gap-x-1">
                <NoteCreator showTitle={false} handleNoteCreate={handleCreateNote} />
                <TabsList className="flex w-full items-center justify-start mx-auto">
                  {notes && notes.map((note, index) => (
                    <TabsTrigger
                      key={index}
                      onClick={() => handleNoteChange(note)}
                      value={note._id}
                      className="truncate"
                    >
                      <div className="truncate">
                        {note.icon}{note.title}
                      </div>
                    </TabsTrigger >
                  ))}
                </TabsList>
              </div>
              <Separator className="mt-2" />
              {currentNote && (
                <TabsContent
                  value={currentNote._id}
                >
                  {currentNote.type === "notion" && (
                    <div className="mx-auto">
                      <Toolbar showCoverButton={false} initialData={currentNote} />
                      <NotionEditor
                        key={currentNote._id}
                        onChange={onChange}
                        initContent={currentNote.content ? currentNote.content : ""}
                      />
                    </div>
                  )}
                  {currentNote.type === "excalidraw" && (
                    <ExcalidrawEditor
                      key={currentNote._id}
                      className="h-[calc(100vh-7rem)]"
                      initContent={currentNote.content ? currentNote.content : ""}
                      onChange={onChange}
                    />
                  )}
                  {currentNote.type === "markdown" && (
                    <div className="mx-auto">
                      <MarkdownEditor
                        key={currentNote._id}
                        initContent={currentNote.content ? currentNote.content : ""}
                        onChange={onChange}
                      />
                    </div>
                  )}
                </TabsContent>

              )}
            </Tabs>
          )}
        </div >
      )}

    </>

  )
}
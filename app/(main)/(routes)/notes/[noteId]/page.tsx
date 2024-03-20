"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/editors/toolbar";
import { Cover } from "@/components/editors/cover";
import { Skeleton } from "@/components/ui/skeleton";
import '@mdxeditor/editor/style.css';
import { toast } from "sonner";

interface NoteIdPageProps {
  params: {
    noteId: Id<"files">;
  };
};

const NoteIdPage = ({
  params
}: NoteIdPageProps) => {
  const NotionEditor = useMemo(() => dynamic(() => import("@/components/editors/notion-editor"), { ssr: false }), []);
  const ExcalidrawEditor = useMemo(() => dynamic(() => import("@/components/editors/excalidraw-editor"), { ssr: false }), []);
  const MarkdownEditor = useMemo(() => dynamic(() => import("@/components/editors/markdown-editor"), { ssr: false }), []);

  const [editorContent, setEditorContent] = useState('');
  const [lastSavedContent, setLastSavedContent] = useState('');

  const note = useQuery(api.files.getFileById, {
    fileId: params.noteId
  });

  const updateNote = useMutation(api.files.updateFile);

  // 修改 onChange 方法以保存当前编辑内容而不是立即更新 note
  const onChange = (content: string) => {
    setEditorContent(content);
  };

  // 用于自动保存的逻辑
  const autoSaveContent = async () => {
    if (note && editorContent !== lastSavedContent) {
      // 调用保存函数
      await updateNote({
        fileId: note._id,
        content: editorContent,
      });
      setLastSavedContent(editorContent);
      toast.success("Content saved automatically");
    }
  };

  useEffect(() => {
    // 当 currentNote 改变时，这个 useEffect 将会被调用
    if (note) {
      // 加载当前选中的 note 内容
      setEditorContent(note.content || '');
      // 重置 lastSavedContent 以避免立即触发自动保存
      setLastSavedContent(note.content || '');
    }
  }, [note]);

  useEffect(() => {
    // 设置定时器每 10 秒自动保存
    const intervalId = setInterval(autoSaveContent, 3000);

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
  }, [editorContent, note, lastSavedContent]);

  if (note === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (note === null) {
    return <div>Not found</div>
  }

  return (
    <>
      {note.type === "notion" && (
        <div className="pb-40">
          <Cover url={note.coverImage} />
          <div className="mx-auto">
            <Toolbar showCoverButton={true} initialData={note} />
            <NotionEditor
              key={note._id}
              onChange={onChange}
              initContent={note.content ? note.content : ""}
            />
          </div>
        </div>
      )}

      {note.type === "excalidraw" && (
        <ExcalidrawEditor
          key={note._id}
          className="h-[100vh]"
          initContent={note.content ? note.content : ""}
          onChange={onChange}
        />
      )}

      {note.type === "markdown" && (
        <MarkdownEditor
          key={note._id}
          initContent={note.content ? note.content : ""}
          onChange={onChange}
        />
      )}

    </>
  );
}

export default NoteIdPage;
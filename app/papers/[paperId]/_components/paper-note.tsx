"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import '@mdxeditor/editor/style.css';
import dynamic from "next/dynamic"
import axios from "axios"
import { NoteNavbar } from "./note-navbar"
import { Note, Paper } from "@prisma/client";
import { DashboardItemType } from "@/types/types";

interface PaperNoteProps {
  paper?: Paper,
  note: Note,
  showDashboardIcon?: boolean
}

export const PaperNote = ({
  paper,
  note,
  showDashboardIcon = false
}: PaperNoteProps) => {
  const MarkEditor = useMemo(() => dynamic(() => import("@/components/editors/markdown-editor"), { ssr: false }), []);
  const ExcalidrawEditor = useMemo(() => dynamic(() => import("@/components/editors/excalidraw-editor"), { ssr: false }), []);

  // 状态来跟踪编辑器的内容和最后一次更新的内容
  const [editorContent, setEditorContent] = useState(note.content ? note.content : "");
  const [lastSavedContent, setLastSavedContent] = useState(note.content ? note.content : "");

  // 修改 onChange 方法以保存当前编辑内容而不是立即更新 note
  const onChange = (content: string) => {
    setEditorContent(content);
  };

  // 用于自动保存的逻辑
  const autoSaveContent = async () => {
    if (editorContent !== lastSavedContent) {
      const response = await axios.patch(`/api/note/${note.id}`, JSON.stringify({
        content: editorContent
      }))
      if (!response || response.status !== 200) {
        toast.error("自动保存失败！")
      } else {
        setLastSavedContent(editorContent);
        toast.success("已自动保存！");
      }
    }
  };

  const handleSave = async () => {
    if (editorContent !== lastSavedContent) {
      const response = await axios.patch(`/api/note/${note.id}`, JSON.stringify({
        content: editorContent
      }))
      if (!response || response.status !== 200) {
        toast.error("保存失败！")
      } else {
        setLastSavedContent(editorContent);
        toast.success("已保存！");
      }
    }
  }

  const handleDownload = (title: string) => {
    const blob = new Blob([editorContent], { type: 'text/note;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.md`;
    link.click();
  }

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
  }, [editorContent, note, lastSavedContent]);

  return (
    <div className="h-[calc(100vh-6rem)] w-full items-center justify-center">
      <div className="h-12">
        <NoteNavbar
          paper={paper}
          note={note}
          handleSave={handleSave}
          handleDownload={handleDownload}
          showDashboardIcon={showDashboardIcon}
        />
      </div>
      {note.type === DashboardItemType.Markdown && (
        <div className="flex-grow h-[calc(100vh-6rem)] overflow-auto">
          <MarkEditor
            key={note.id}
            initContent={note.content ? note.content : ""}
            onChange={onChange}
          />
        </div>
      )}
      {note.type === DashboardItemType.Whiteboard && (
        <div className="flex-grow overflow-auto">
          <ExcalidrawEditor
            key={note.id}
            className="h-[calc(100vh-9rem)]"
            initContent={editorContent}
            onChange={onChange}
          />
        </div>
      )}
    </div >
  )
}
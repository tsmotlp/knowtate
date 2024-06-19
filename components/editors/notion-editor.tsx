"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock,

} from "@blocknote/core";
import {
  BlockNoteView,
  useCreateBlockNote,
} from "@blocknote/react";

import "@blocknote/react/style.css";
import axios from "axios";
import { toast } from "sonner";

interface EditorProps {
  key: string,
  onChange: (value: string) => void;
  initContent: string;
  editable?: boolean;
};

const NotionEditor = ({
  key,
  onChange,
  initContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (image: File) => {
    const formData = new FormData()
    formData.append("image", image)
    const response = await axios.post("/api/image", formData)
    if (response.status !== 200) {
      toast.error("Failed to upload image!")
      return;
    } else {
      const url = response.data
      toast.success("Image uploaded!")
      return url
    }
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent:
      initContent
        ? JSON.parse(initContent) as PartialBlock[]
        : undefined,
    uploadFile: handleUpload,
  })

  const handleNoteChange = () => {
    onChange(JSON.stringify(editor.document, null, 2))
  }

  return (
    <BlockNoteView
      key={key}
      editor={editor}
      editable={editable}
      onChange={handleNoteChange}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}

export default NotionEditor;
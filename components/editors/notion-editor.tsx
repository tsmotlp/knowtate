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
import { uploadImage } from "@/hooks/minio";
import { useEffect, useState } from "react";

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

  const handleUpload = async (file: File) => {
    const url = await uploadImage(file)
    console.log("image url", url)
    return url
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
    <div>
      <BlockNoteView
        // key={key}
        editor={editor}
        editable={editable}
        onChange={handleNoteChange}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

export default NotionEditor;
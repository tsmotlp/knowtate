import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  type CodeBlockEditorDescriptor,
  MDXEditorMethods,
  CodeMirrorEditor,
} from "@mdxeditor/editor"
import { useEffect, useRef, useState } from 'react'
import { uploadImage } from "@/hooks/minio"

type EditorProps = {
  key: string,
  initContent: string
  onChange: (s: string) => void
}

const FallbackCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: (language, meta) => true,
  priority: 0,
  Editor: CodeMirrorEditor
}

const MarkdownEditor = ({
  key,
  initContent,
  onChange,
}: EditorProps) => {
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleUpload = async (file: File) => {
    const url = await uploadImage(file)
    return url
  }

  return (
    <>
      <MDXEditor
        className="bg-white dark:bg-[#1F1F1F]"
        // key={key}
        ref={editorRef}
        markdown={initContent}
        onChange={onChange}
        placeholder="Type markdown here..."
        plugins={[
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({ imageUploadHandler: handleUpload }),
          tablePlugin(),
          thematicBreakPlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'py',
            codeBlockEditorDescriptors: [FallbackCodeEditorDescriptor],
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              py: 'Python',
              go: 'Golang',
              cpp: 'C++',
              c: 'C',
              java: 'Java',
              js: 'JavaScript',
              css: 'CSS',
              txt: 'text',
              tsx: 'TypeScript'
            }
          }),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          markdownShortcutPlugin(),

        ]}
        contentEditableClassName="prose prose-neutral dark:prose-invert caret-black dark:caret-white dark:text-white"
      />
    </>
  )
}

export default MarkdownEditor
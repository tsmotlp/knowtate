import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
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
  InsertAdmonition,
  BlockTypeSelect,
  Separator,
} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
import axios from "axios"
import { useRef } from 'react'
import { toast } from "sonner"

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

  return (
    <MDXEditor
      className="bg-white flex flex-col flex-1 px-2 mt-2"
      key={key}
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
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex bg-white text-sm items-center justify-center w-full">
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CodeToggle />
              <CreateLink />
              <InsertThematicBreak />
              <Separator />
              <InsertCodeBlock />
              <InsertTable />
              <InsertImage />
              <Separator />
              <InsertAdmonition />
            </div>
          ),
        }),

      ]}
      contentEditableClassName="outline-none max-w-none prose prose-neutral dark:prose-invert caret-black dark:caret-white dark:text-white"
    />
  )
}

export default MarkdownEditor
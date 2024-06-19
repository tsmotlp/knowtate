"use client"
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { Theme } from "@excalidraw/excalidraw/types/element/types";


interface ExcalidrawEditorProps {
  className: string
  initContent: string
  onChange: (s: string) => void
}

const ExcalidrawEditor = ({
  className,
  initContent,
  onChange
}: ExcalidrawEditorProps) => {

  return (
    <div className={className}>
      <Excalidraw
        theme="light"
        initialData={{
          elements: initContent && JSON.parse(initContent),
        }}
        onChange={(excalidrawElements, appState, files) => onChange(JSON.stringify(excalidrawElements))}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: false,
            toggleTheme: false,
            changeViewBackgroundColor: false,
          },
          tools: {
            image: false,
          },
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
      </Excalidraw>
    </div>
  )
}

export default ExcalidrawEditor
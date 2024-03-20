"use client"
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { Theme } from "@excalidraw/excalidraw/types/element/types";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


interface ExcalidrawEditorProps {
  key: string
  className: string
  initContent: string
  onChange: (s: string) => void
}

const ExcalidrawEditor = ({
  key,
  className,
  initContent,
  onChange
}: ExcalidrawEditorProps) => {
  const { theme } = useTheme()

  return (
    <div className={className}>
      <Excalidraw
        // key={key}
        theme={theme as Theme}
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
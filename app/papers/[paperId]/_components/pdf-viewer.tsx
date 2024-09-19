"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Position, SpecialZoomLevel, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

import { highlightPlugin, HighlightArea, RenderHighlightTargetProps, RenderHighlightsProps } from '@react-pdf-viewer/highlight';


import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

import { v4 as uuidv4 } from "uuid"
import { ToolButton } from './tool-button';
import { Bookmark, CopyIcon, HighlighterIcon, LanguagesIcon, LayoutDashboard, LayoutDashboardIcon, Loader, MessageSquare, MessageSquareMore, NotebookPen, Palette, PanelLeft, SpellCheck, SpellCheck2, SquircleIcon, StrikethroughIcon, Trash2, Underline } from 'lucide-react';
import StyleSetter from './style-setter';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAnnotations } from '@/hooks/use-annotations';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paper } from '@prisma/client';
import { Annotation } from '@/types/types';

const TOOLTIP_OFFSET = { left: 0, top: 0 };

interface PDFViewerProps {
  paper: Paper
}

enum AnnotationType {
  Highlight = "Highlight",
  Underline = "Underline"
}

enum OperationType {
  Undefined = "Undefine",
  Notes = "Notes",
  Chat = "Chat"
}

interface AnnotationProps {
  id: string
  type: AnnotationType,
  color: string,
  opacity: number,
  popoverTop: string,
  popoverLeft: string,
  areas: HighlightArea[] // 每一行是一个area
}

export const PDFViewer = ({
  paper,
}: PDFViewerProps) => {
  const [annotations, setAnnotations] = useState<Annotation[]>(
    paper.annotations ? JSON.parse(paper.annotations) : []
  )
  const [translationResult, setTranslationResult] = useState("")
  const [highlightColor, setHighlightColor] = useState("#e52237")
  const [highlightOpacity, setHighlightOpacity] = useState(50)
  const [underlineColor, setUnderlineColor] = useState("#e52237")
  const [underlineOpacity, setUnderlineOpacity] = useState(50)
  const [showStyleSetter, setShowStyleSetter] = useState<string | null>(null)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isSidebarOpened, setSidebarOpend] = useState(false)
  const [isBookmarkOpened, setBookmarkOpend] = useState(false)
  const [isThumnailOpened, setThumnailOpend] = useState(true)
  const styleSetterRef = useRef<HTMLDivElement | null>(null)

  const bookmarkPluginInstance = bookmarkPlugin()
  const toolbarPluginInstance = toolbarPlugin()
  const thumbnailPluginInstance = thumbnailPlugin()

  const { Toolbar } = toolbarPluginInstance
  const { Bookmarks } = bookmarkPluginInstance
  const { Thumbnails } = thumbnailPluginInstance
  const { renderDefaultToolbar } = toolbarPluginInstance

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>
  });

  const handleTranslation = async (selectedText: string) => {
    const promise = axios.post("/api/translate", JSON.stringify({
      text: selectedText
    })).then((resp) => {
      setTranslationResult(resp.data)
    })
    toast.promise(promise, {
      loading: "translating...",
      error: "failed to translate!"
    })

  }

  const updateAnnotations = async () => {
    const promise = axios.patch(`/api/paper/${paper.id}`, {
      annotations: JSON.stringify(annotations)
    })
    toast.promise(promise, {
      error: "Failed to update annotations!",
    })
  }

  useEffect(() => {
    updateAnnotations()
  }, [annotations])

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget: (props: RenderHighlightTargetProps) => (
      <div
        style={{
          position: 'absolute',
          left: `${(props.selectionRegion.left + props.selectionRegion.width / 2)}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height + 1}%`,
          zIndex: 2,
        }}
        className="bg-white rounded-lg border-2 border-neutral-200"
      >
        <ToolButton
          label="Copy"
          icon={CopyIcon}
          size="icon"
          iconClassName='h-4 w-4'
          color="text-neutral-400"
          onClick={() => {
            navigator.clipboard.writeText(props.selectedText)
            toast("", {
              description: "text copied!",
              duration: 3000
            })
          }}
        />
        <ToolButton
          label="Highlight"
          icon={HighlighterIcon}
          size="icon"
          iconClassName='h-4 w-4'
          color="text-neutral-400"
          onClick={() => {
            const newAnnotation: AnnotationProps = {
              id: uuidv4(),
              type: AnnotationType.Highlight,
              color: highlightColor,
              opacity: highlightOpacity / 100,
              popoverTop: `${props.selectionRegion.top + props.selectionRegion.height + 1}%`,
              popoverLeft: `${props.selectionRegion.left + props.selectionRegion.width / 2}%`,
              areas: props.highlightAreas
            }
            if (annotations === null) setAnnotations([])
            setAnnotations(annotations!.concat(newAnnotation))
          }}
        />
        <ToolButton
          label="Underline"
          icon={Underline}
          size="icon"
          iconClassName='h-4 w-4'
          color="text-neutral-400"
          onClick={() => {
            const newAnnotation: AnnotationProps = {
              id: uuidv4(),
              type: AnnotationType.Underline,
              color: underlineColor,
              opacity: underlineOpacity / 100,
              popoverTop: `${props.selectionRegion.top + props.selectionRegion.height + 1}%`,
              popoverLeft: `${(props.selectionRegion.left + props.selectionRegion.width / 2)}%`,
              areas: props.highlightAreas
            }
            if (annotations === null) setAnnotations([])
            setAnnotations(annotations!.concat(newAnnotation))
          }}
        />
        {/* <ToolButton
          label="Squiggly"
          icon={SpellCheck2}
          color="text-neutral-400"
          onClick={() => { }}
        />
        <ToolButton
          label="Strikeout"
          icon={StrikethroughIcon}
          color="text-neutral-400"
          onClick={() => { }}
        /> */}
        <Popover>
          <PopoverTrigger>
            <ToolButton
              label="Translate"
              icon={LanguagesIcon}
              size="icon"
              iconClassName='h-4 w-4'
              color="text-neutral-400"
              onClick={() => {
                handleTranslation(props.selectedText)
              }}
            />
          </PopoverTrigger>
          <PopoverContent>{translationResult}</PopoverContent>
        </Popover>
      </div>
    ),
    renderHighlights: (props: RenderHighlightsProps) => (
      <div>
        {annotations !== null && annotations.length > 0 && annotations.map((annotation) => (
          <React.Fragment key={annotation.id}>
            {annotation.areas
              .filter((area) => area.pageIndex === props.pageIndex)
              .map((area, idx) => (
                <>
                  <div
                    key={idx}
                    className="annotation-element" // 添加类名以便于全局点击检测
                    onClick={() => {
                      setSelectedAnnotationId(annotation.id)
                      console.log("selected annotation:", annotation)
                    }}
                    style={Object.assign(
                      {
                        background: annotation.type === AnnotationType.Highlight ? annotation.color : "",
                        opacity: annotation.opacity,
                        cursor: "pointer",
                        zIndex: 1,
                        borderBottom: annotation.type === AnnotationType.Underline ? `2px solid ${annotation.color}` : "",
                      },
                      props.getCssProperties(area, props.rotation)
                    )}
                  />
                  {selectedAnnotationId && selectedAnnotationId === annotation.id && (
                    <div
                      style={{
                        position: 'absolute',
                        left: annotation.popoverLeft,
                        top: annotation.popoverTop,
                        zIndex: 2,
                      }}
                      className="bg-white rounded-lg border-2 border-neutral-200"
                    >
                      {/* <ToolButton
                    label="Comment"
                    icon={MessageSquare}
                    color="text-neutral-400"
                    onClick={() => { }}
                  /> */}
                      <ToolButton
                        label="Style"
                        icon={Palette}
                        size="icon"
                        iconClassName='h-4 w-4'
                        color="text-neutral-400"
                        onClick={() => { handleClickStyleToolButton(selectedAnnotationId) }}
                      />
                      <ToolButton
                        label="Delete"
                        icon={Trash2}
                        size="icon"
                        iconClassName='h-4 w-4'
                        color="text-neutral-400"
                        onClick={handleDeleteAnnotation}
                      />
                    </div>
                  )}
                  {showStyleSetter && annotation.id === showStyleSetter && (
                    <div
                      ref={styleSetterRef}
                      style={{
                        position: 'absolute',
                        left: annotation.popoverLeft,
                        top: annotation.popoverTop,
                        zIndex: 2,
                      }}
                      className="bg-white rounded-lg border-2 border-neutral-200"
                    >
                      <>
                        {annotation.type === AnnotationType.Highlight && (
                          <StyleSetter
                            initColor={highlightColor}
                            initOpacity={highlightOpacity}
                            handleColorChange={(color: string) => {
                              setHighlightColor(color)
                              setAnnotations(annotations.map(ann =>
                                ann.id === annotation.id ? { ...ann, color: color } : ann
                              ))
                            }}
                            handleOpacityChange={(opacity: number) => {
                              setHighlightOpacity(opacity)
                              setAnnotations(annotations.map(ann =>
                                ann.id === annotation.id ? { ...ann, opacity: opacity / 100 } : ann
                              ))
                            }}
                          />
                        )}
                        {annotation.type === AnnotationType.Underline && (
                          <StyleSetter
                            initColor={underlineColor}
                            initOpacity={underlineOpacity}
                            handleColorChange={(color: string) => {
                              setUnderlineColor(color)
                              setAnnotations(annotations.map(ann =>
                                ann.id === annotation.id ? { ...ann, color: color } : ann
                              ))
                            }}
                            handleOpacityChange={(opacity: number) => {
                              setUnderlineOpacity(opacity)
                              setAnnotations(annotations.map(ann =>
                                ann.id === annotation.id ? { ...ann, opacity: opacity / 100 } : ann
                              ))
                            }}
                          />
                        )}
                      </>
                    </div>
                  )}
                </>
              ))
            }
          </React.Fragment>
        ))
        }
      </div >
    )
  });

  const handleClickStyleToolButton = (annotationId: string) => {
    setShowStyleSetter(annotationId);
  }

  // 在鼠标点击事件中检查是否点击了高亮区域，并提供取消高亮的选项
  const handleDeleteAnnotation = () => {
    if (selectedAnnotationId !== null && annotations !== null) {
      setAnnotations(annotations.filter(annotation => annotation.id !== selectedAnnotationId));
      setSelectedAnnotationId(null); // 重置选中的注释ID
    }
  };


  // 设置点击注释以外区域隐藏Cancel Highlight按钮的逻辑
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // 检查点击的是否为注释元素，这可能需要调整以适应实际结构
      // 假设注释元素有一个特定的类名'annotation-element'
      if (!(e.target as HTMLElement).closest('.annotation-element')) {
        setSelectedAnnotationId(null);
        // setShowStyleSetter(false)
      }
    };

    const handleScroll = () => {
      setSelectedAnnotationId(null);
      // setShowStyleSetter(false)
    };

    // 添加全局事件监听器
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('scroll', handleScroll, true);

    // 清理函数：移除事件监听器
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    // 处理点击事件
    const handleClickOutside = (event: MouseEvent) => {
      if (styleSetterRef.current && !styleSetterRef.current.contains(event.target as Node)) {
        setShowStyleSetter(null);
      }
    };

    // 绑定事件监听器
    document.addEventListener('mousedown', handleClickOutside);

    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
      <div className='flex flex-col h-full'>
        <div className='h-12 flex items-center justify-between border-b gap-x-20'>
          <Tooltip
            position={Position.BottomLeft}
            target={
              <Button
                variant="ghost"
                size="icon"
                className='text-muted-foreground'
                onClick={() => setSidebarOpend((opened) => !opened)}
              >
                <PanelLeft className='h-5 w-5' />
              </Button>
            }
            content={() => 'Toggle the sidebar'}
            offset={TOOLTIP_OFFSET}
          />
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
        </div>
        <div className='h-[calc(100vh-6rem)] flex overflow-auto'>
          <div
            style={{
              overflow: 'auto',
              transition: 'width 400ms ease-in-out',
              width: isSidebarOpened ? '30%' : '0%',
            }}
          >
            <div className='flex h-full'>
              <div className='h-full flex flex-col items-center gap-y-2'>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-muted-foreground',
                    isThumnailOpened && 'bg-accent'
                  )}
                  onClick={() => {
                    setThumnailOpend(true)
                    setBookmarkOpend(false)
                  }}
                >
                  <LayoutDashboard />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-muted-foreground',
                    isBookmarkOpened && 'bg-accent'
                  )}
                  onClick={() => {
                    setThumnailOpend(false)
                    setBookmarkOpend(true)
                  }}
                >
                  <Bookmark />
                </Button>
              </div>
              {isThumnailOpened && (
                <Thumbnails />
              )}
              {isBookmarkOpened && (
                <Bookmarks />
              )}
            </div>
          </div>
          {paper.url ? (
            <div className='flex flex-1'>
              <Viewer
                fileUrl={paper.url}
                defaultScale={SpecialZoomLevel.PageWidth}
                plugins={[bookmarkPluginInstance, thumbnailPluginInstance, toolbarPluginInstance, highlightPluginInstance]}
              />
            </div>
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              File url error!
            </div>
          )}
        </div>
      </div>
    </Worker >
  );
};

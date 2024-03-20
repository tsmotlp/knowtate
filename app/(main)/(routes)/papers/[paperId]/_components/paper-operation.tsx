"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MenuIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { OperationNavbar } from "./operation-navbar";

export const PaperOperation = () => {
  return (
    // <Tabs defaultValue="notes" className="w-full h-full p-2">
    //   <TabsList className="gap-x-2">
    //     <TabsTrigger value="notes">Notes</TabsTrigger>
    //     <TabsTrigger value="Excalidraw">Excalidraw</TabsTrigger>
    //     <TabsTrigger value="qa">Chat</TabsTrigger>
    //   </TabsList>
    //   <Separator className="mt-2" />
    //   <TabsContent value="notes">
    //     {/* <Notes paper={paper} /> */}
    //   </TabsContent>
    //   <TabsContent value="Excalidraw">
    //     {/* <ExcalidrawWhiteBoard paper={paper} /> */}
    //   </TabsContent>
    //   <TabsContent value="qa">
    //     {/* <ChatClient paper={paper} /> */}
    //   </TabsContent>
    // </Tabs>
    <OperationNavbar />

  )
}
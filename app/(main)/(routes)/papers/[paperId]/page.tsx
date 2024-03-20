"use client"
// import { Operation } from "@/components/operation";
import { Id } from "@/convex/_generated/dataModel";
import { PDFViewer } from "./_components/pdf-viewer";
import { PaperOperation } from "./_components/paper-operation";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PaperPageProps {
  params: {
    paperId: Id<"files">;
  };
}

const PaperPage = ({ params }: PaperPageProps) => {
  const { paperId } = params;

  return (
    <div className="w-full h-full">
      <PDFViewer fileId={paperId} />
    </div>
  );
};

export default PaperPage;
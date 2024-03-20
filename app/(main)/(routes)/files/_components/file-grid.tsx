"use client";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import { FileCard } from "./file-card";

interface PaperGridProps {
  label: string,
  files: Doc<"files">[]
}

export const FileGrid = ({
  label,
  files
}: PaperGridProps) => {
  console.log("file grid:", files)
  return (
    <div>
      {files && files.length !== 0 ? (
        <div className="h-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {files
            .sort(
              (a, b) =>
                new Date(b._creationTime).getTime() -
                new Date(a._creationTime).getTime(),
            )
            .map((file, index) => (
              <FileCard key={index} file={file} />
            ))}
        </div>
      ) : (
        <div className="mt-60 flex flex-col items-center gap-2">
          <Image
            src="/men.svg"
            height="300"
            width="300"
            alt="Empty"
            className="dark:hidden"
          />
          <Image
            src="/men-dark.svg"
            height="300"
            width="300"
            alt="Empty"
            className="hidden dark:block"
          />
          <h3 className="mt-2 font-semibold text-xl">No {label} found here</h3>
          {label === "file" && (<p>Please upload a paper or create a note to continue.</p>)}
          {label === "paper" && (<p>Please upload a paper to continue.</p>)}
          {label === "note" && (<p>Please create a note to continue.</p>)}
        </div>
      )}
    </div>
  );
};

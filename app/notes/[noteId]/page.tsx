import { PaperNote } from "@/app/papers/[paperId]/_components/paper-note"
import { getNoteWithPaper } from "@/data/note";

interface NoteIdPageProps {
  params: {
    noteId: string;
  };
}

const NoteIdPage = async ({ params }: NoteIdPageProps) => {
  const note = await getNoteWithPaper(params.noteId)
  return (
    <div>
      {note ? (
        <div className="flex h-full w-full items-center justify-center p-8">
          <PaperNote paper={note.paper ? note.paper : undefined} note={note} showDashboardIcon={true} />
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-red-500">
          出错了
        </div>
      )}
    </div>
  )
}

export default NoteIdPage
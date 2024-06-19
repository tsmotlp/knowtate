import { getPaperWithNotesAndMessages } from "@/data/paper";
import { PaperReader } from "./_components/paper-reader";

interface PaperIdPageProps {
  params: {
    paperId: string;
  };
}

const PaperIdPage = async ({ params }: PaperIdPageProps) => {
  const paper = await getPaperWithNotesAndMessages(params.paperId)
  if (!paper) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        出错了~
      </div>
    )
  }
  return (
    <PaperReader paper={paper} />
  )
}

export default PaperIdPage
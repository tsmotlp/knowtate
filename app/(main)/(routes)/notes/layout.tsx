import { Navigation } from "./_components/navigation"
import { SearchCommand } from "@/components/search-command";

const NoteLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full flex">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default NoteLayout
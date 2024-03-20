import { Sidebar } from "./_components/sidebar"


const FilesLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full w-full mx-auto flex p-8 gap-x-8">
      <Sidebar />
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  )
}

export default FilesLayout
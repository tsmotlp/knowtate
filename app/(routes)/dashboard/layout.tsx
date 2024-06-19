import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"


const DashboardLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="h-full w-full pt-12 flex">
        <Sidebar />
        <main className="h-full w-full overflow-auto">
          {children}
        </main>
      </div>

    </div>
  )
}

export default DashboardLayout
import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { useState } from "react"


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className=" h-[100vh] ">
      <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)}/>
      <div className="flex bg-gray-100 overflow-auto h-[100%]">
        <div className="w-fit">
           {sidebarOpen && (
                    <div className="w-fit"><Sidebar/></div>
                  )}

        </div>
        <div className={`overflow-auto p-4 ${sidebarOpen ? 'w-full' : 'w-full'}`}><Outlet/></div>
      </div>
    </div>
  )
}

export default AdminLayout
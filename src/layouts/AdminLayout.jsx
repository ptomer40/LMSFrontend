import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"


const AdminLayout = () => {
  return (
    <div className=" h-[100vh] ">
      <Navbar/>
      <div className="flex bg-gray-100 overflow-auto h-[100%]">
        <div className="w-fit"><Sidebar/></div>
        <div className="w-full overflow-auto p-4"><Outlet/></div>
      </div>
    </div>
  )
}

export default AdminLayout

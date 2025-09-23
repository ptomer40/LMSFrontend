import { Outlet } from "react-router-dom";
import SidebarStudent from "../components/SidebarStudent";
import { useState } from "react";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <div className=" h-[100vh] ">
          <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
          <div className="flex bg-gray-100 overflow-auto h-[100%]">
             {sidebarOpen && (
                          <div className="w-fit"><SidebarStudent/></div>
              )}
            <div className="w-full overflow-auto p-4"><Outlet/></div>
          </div>
        </div>
  );
}
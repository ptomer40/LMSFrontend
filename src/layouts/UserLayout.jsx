import { Outlet } from "react-router-dom";
import SidebarStudent from "../components/SidebarStudent";
import { Header } from "../components/Header";

export default function UserLayout() {
  return (
    <div className=" h-[100vh] ">
          <Header/>
          <div className="flex bg-gray-100 overflow-auto h-[100%]">
            <div className="w-fit"><SidebarStudent/></div>
            <div className="w-full overflow-auto p-4"><Outlet/></div>
          </div>
        </div>
  );
}

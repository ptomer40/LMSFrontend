import React from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"

export const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()

  const role = localStorage.getItem('role');

 const handleLogout = async () => {
    try {
      const res = await fetch("/logout", { method: "GET", credentials: "same-origin" });
      if (res.status === 200) {
        window.location.href = "/logout";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-[#235a81] shadow-md ">
     <div className="flex items-center gap-4">
        <button onClick={onMenuClick} aria-label="Toggle sidebar" className="p-2 rounded-md text-white hover:bg-[#1e4f6f]">
          <Menu />
        </button>
        <h1 className="text-xl font-semibold text-white ">{role === 'ADMIN' ? 'Admin' : 'User'} Panel</h1>
      </div>
      <div>
          <h2 className="text-xl font-bold text-white">Learning Management System</h2>
        </div>

      <div className="flex items-center space-x-4">
        {/* Profile circle */}
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
          {role === 'ADMIN' ? 'A' : 'U'}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </nav>
  )
}
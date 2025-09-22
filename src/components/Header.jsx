import React from 'react'
import { Menu,LogOut } from 'lucide-react' // Example icon for a mobile menu toggle

export const Header = () => {


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
      <div className="flex items-center justify-center">
        
        
        <h1 className="text-xl font-semibold text-white ">Student Panel</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for user profile, notifications, etc. */}
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
          SD
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
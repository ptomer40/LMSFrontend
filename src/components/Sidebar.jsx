import React, { useState } from 'react';
import {
    LayoutDashboard,
    PlusCircle,
    ListTodo,
    Calendar,
    Users,
    Activity,
    BarChart,
    Ban,
    UserPlus,
    Rocket,
    Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Define your sidebar navigation items with icons
const navItems = [
  { title: "Dashboard", url: "home", icon: LayoutDashboard, privilege: "dashboard" },
  { title: "Add Question", url: "add-question", icon: PlusCircle, privilege: "add-questions" },
  { title: "Manage Questions", url: "manage-questions", icon: ListTodo, privilege: "manage-questions" },
  { title: "Schedule Test", url: "schedule-test", icon: Calendar, privilege: "schedule-tests" },
  { title: "Manage Users", url: "manage-users", icon: Users, privilege: "manage-users" },
  { title: "Live Users", url: "live-users", icon: Activity, privilege: "live-user" },
  { title: "Test Records", url: "test-records", icon: BarChart, privilege: "test-records" },
  { title: "Blocked Users", url: "blocked-users", icon: Ban, privilege: "blocked-user" },
  { title: "Create user", url: "create-user", icon: UserPlus, privilege: "create-user" },
  { title: "Set Assessment Live", url: "set-assessment-live", icon: Rocket, privilege: "set-assessment-live" },
  { title: "Upload Users", url: "upload-users", icon: Upload, privilege: "upload-users" },
];

export function Sidebar({className=''}) {

    const [activeItem, setActiveItem] = useState('Dashboard');

     // Get privileges & admin flag
  const storedPrivileges = JSON.parse(sessionStorage.getItem("privileges") || "[]");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

   const filteredNavItems = navItems.filter((item) => {
    if (isAdmin && storedPrivileges.includes("full-admin")) {
      // full admin → see everything
      return true;
    }
    // subadmin → only items that match privileges
    return storedPrivileges.some(
      (priv) => priv.trim().toLowerCase() === item.privilege?.toLowerCase()
    );
  });

    return (
       <div className={`w-64 h-screen bg-[#235a81] flex flex-col ${className}`}>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {filteredNavItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.url}
                onClick={() => setActiveItem(item.title)}
                className={`p-4 flex items-center gap-3 outline-none
                  hover:bg-white hover:text-[#235a81] transition-colors duration-200
                  ${activeItem === item.title ? "bg-white text-[#235a81]" : "text-slate-200"}
                `}
              >
                {item.icon && <item.icon className="size-4" />}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    );
}

export default Sidebar;
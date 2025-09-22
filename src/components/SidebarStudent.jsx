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
    {
        title: 'Dashboard',
        url: 'dashboard',
        icon: LayoutDashboard,
        
        
    },
    {
        title: 'Assigned Tests',
        url: 'assigned-tests',
        icon: PlusCircle,
    },
    {
        title: 'Expired Tests',
        url: 'expired-tests',
        icon: Ban,
    },
    {
        title: 'Test Results',
        url: 'test-results',
        icon: Activity,
    },

];

export function SidebarStudent() {
    const [activeItem, setActiveItem] = useState('Dashboard');

    return (
        <div className="w-64 h-screen bg-[#235a81] flex flex-col">



            {/* Sidebar Content */}
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.title}>
                            <Link
                                to={item.url}
                                onClick={() => {
                                
                                    setActiveItem(item.title);
                                }}
                                className={`
                                             p-4 flex items-center gap-3 outline-none
                                             hover:bg-white hover:text-[#235a81] transition-colors duration-200
                                            ${activeItem === item.title ? 'bg-white text-[#235a81]' : 'text-slate-200'}
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

export default SidebarStudent;
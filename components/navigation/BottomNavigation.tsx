"use client";

import { Home, Users, Settings } from "lucide-react";

const BottomNavigation = () => {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-around bg-white shadow-md md:hidden">
            <a href="/dashboard" className="flex flex-col items-center p-2 text-gray-700 hover:text-primary">
                <Home className="w-6 h-6" />
                <span className="text-xs">Dashboard</span>
            </a>
            <a href="/visitors" className="flex flex-col items-center p-2 text-gray-700 hover:text-primary">
                <Users className="w-6 h-6" />
                <span className="text-xs">Visitors</span>
            </a>
            <a href="/settings" className="flex flex-col items-center p-2 text-gray-700 hover:text-primary">
                <Settings className="w-6 h-6" />
                <span className="text-xs">Settings</span>
            </a>
        </div>
    );
};

export default BottomNavigation;
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex">
            {/* Hamburger Menu for Mobile */}
            <button
                className="p-2 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform md:relative md:translate-x-0",
                    {
                        "-translate-x-full": !isOpen,
                        "translate-x-0": isOpen,
                    }
                )}
            >
                <nav className="p-4 space-y-4">
                    <a href="/dashboard" className="block p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Dashboard
                    </a>
                    <a href="/visitors" className="block p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Visitors
                    </a>
                    <a href="/employees" className="block p-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Employees
                    </a>
                </nav>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
"use client";

import { MenuIcon, Sparkles } from "lucide-react";
import SidebarContent from "./SidebarContent";
import { useState } from "react";

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="hidden md:block">
                <SidebarContent ismobilelayout={false} />
            </div>
            <div className="md:hidden">
                <div className="flex flex-row items-center">
                    <button
                        className="p-4"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <MenuIcon />
                    </button>
                    <div className="flex-1 flex flex-row items-center justify-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">
                            Nexus Chat
                        </h1>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}
                <div
                    className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <SidebarContent
                        ismobilelayout={true}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                </div>
            </div>
        </>
    );
}

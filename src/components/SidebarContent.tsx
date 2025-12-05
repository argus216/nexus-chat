"use client";

import {
    Compass,
    Hash,
    LogOut,
    Settings,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "./SessionProvider";
import { usePathname } from "next/navigation";

type SidebarContentProps = {
    ismobilelayout?: boolean;
    onClose?: () => void;
};

export default function SidebarContent({
    onClose,
    ismobilelayout,
}: SidebarContentProps) {
    const pathname = usePathname();
    const { session, logout } = useSession();
    const user = session?.user;

    if (ismobilelayout) {
        return (
            <div className="w-full flex flex-col h-full bg-gray-900 text-gray-300">
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-lg text-white tracking-tight">
                            Nexus Chat
                        </h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col gap-6 flex-1 p-4">
                    {/* Assistant Section */}
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider">
                            Assistant
                        </div>
                        <Link
                            href={"#"}
                            className="w-full flex items-center gap-3 px-3 py-3 bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-blue-100 rounded-xl hover:bg-blue-600/20 transition-all group"
                        >
                            <div className="p-1.5 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
                                <Sparkles
                                    size={18}
                                    className="text-blue-400 group-hover:text-blue-300"
                                />
                            </div>
                            <span className="font-medium text-sm">
                                Chat with AI
                            </span>
                            <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2 tracking-wider">
                            Menu
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={"/users"}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Users size={20} />
                                <span className="text-sm font-medium">
                                    Friends
                                </span>
                            </Link>
                            <Link
                                href={"/groups"}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Hash size={20} />
                                <span className="text-sm font-medium">
                                    Groups
                                </span>
                            </Link>
                            <Link
                                href={"/discover"}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Compass size={20} />
                                <span className="text-sm font-medium">
                                    Discover
                                </span>
                            </Link>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-colors">
                                <Settings size={20} />
                                <span className="text-sm font-medium">
                                    Settings
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                                {user?.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                Online
                            </p>
                        </div>
                        <button
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Sign Out"
                            onClick={logout}
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout (Collapsed with hover labels)
    return (
        <div className="w-24 flex flex-col h-full bg-gray-900 text-gray-300 border-r border-gray-800 transition-all duration-300 ease-in-out">
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm shrink-0">
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform cursor-pointer">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col items-center gap-6 flex-1 py-8">
                <SidebarIcon
                    icon={<Sparkles size={24} />}
                    label="AI Chat"
                    href="#"
                    active={pathname === "#"}
                />
                <SidebarIcon
                    icon={<Users size={24} />}
                    label="Friends"
                    href="/users"
                    active={pathname === "/users"}
                />
                <SidebarIcon
                    icon={<Hash size={24} />}
                    label="Groups"
                    href="/groups"
                    active={pathname === "/groups"}
                />
                <SidebarIcon
                    icon={<Compass size={24} />}
                    label="Discover"
                    href="/discover"
                    active={pathname === "/discover"}
                />
                <div className="mt-auto flex flex-col gap-6">
                    <SidebarIcon
                        icon={<Settings size={24} />}
                        label="Settings"
                        href="#" // Or button behavior
                        active={pathname === "#"}
                    />
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:border-gray-500 transition-colors cursor-pointer relative group">
                        <span className="text-sm font-bold text-white">
                            {user?.name.charAt(0)}
                        </span>
                        {/* User Tooltip */}
                        <div className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-gray-700">
                            <p className="font-bold">{user?.name}</p>
                            <p className="text-gray-400 text-[10px]">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10 relative group"
                    >
                        <LogOut size={24} />
                        <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700">
                            Sign Out
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Desktop Icons
function SidebarIcon({
    icon,
    label,
    href,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
            {icon}

            {/* Tooltip Label */}
            <div className="absolute left-16 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 pointer-events-none border border-gray-700 shadow-xl">
                {label}
                {/* Arrow */}
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 transform rotate-45 z-50" />
            </div>
        </Link>
    );
}

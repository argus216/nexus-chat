import Link from "next/link";
import { Avatar } from "./ui/Avatar";
import { Hash } from "lucide-react";

interface SidebarChatsProps {
    name: string;
    status: "online" | "offline";
    link: string;
    isGroup?: boolean;
}

export default function SidebarChats({
    name,
    status,
    link,
    isGroup,
}: SidebarChatsProps) {
    return (
        <Link
            href={link}
            className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-200/50"
        >
            {isGroup ? (
                <Hash size={20} />
            ) : (
                <div className="relative">
                    <Avatar name={name} size="md" />
                    <div
                        className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                            status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                    />
                </div>
            )}
            <div className="text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                    {name}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                    {status}
                </p>
            </div>
        </Link>
    );
}

import Link from "next/link";
import { Avatar } from "./Avatar";
import { Hash } from "lucide-react";

interface SidebarChatsProps {
    name: string;
    link: string;
    isGroup?: boolean;
    phone?: string;
}

export default function SidebarChats({
    name,
    link,
    isGroup,
    phone,
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
                </div>
            )}
            <div className="text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                    {name}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                    {phone}
                </p>
            </div>
        </Link>
    );
}

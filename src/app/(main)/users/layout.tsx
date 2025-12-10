import Link from "next/link";
import UsersSidebar from "./UsersSidebar";
import { UserPlus } from "lucide-react";

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-row">
            <div className="hidden md:flex flex-col w-72 bg-gray-50 border-r border-gray-200 h-full shrink-0">
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 bg-white">
                    <h2 className="font-bold text-gray-800 text-lg">Friends</h2>
                    <Link
                        href="/users/invitations"
                        className="p-3 rounded-lg transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                        <UserPlus size={20} />
                    </Link>
                </div>
                <UsersSidebar />
            </div>
            {children}
        </div>
    );
}

"use client";

import { useSession } from "@/components/SessionProvider";
import SidebarChats from "@/components/SidebarChats";
import { getChatId } from "@/lib/utils";
import { Session } from "@/types/Session";
import { fetchClient } from "@/utils/fetchClient";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersSidebar() {
    const [users, setUsers] = useState<Session["user"][]>([]);
    const { session } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;

        (async () => {
            setLoading(true);
            const response = await fetchClient("/users/friends", {
                showToast: false,
            });
            if (response.success) {
                setUsers(response.data);
            }
            setLoading(false);
        })();
    }, [session]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="p-3">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>
            <div className="p-3 flex flex-col gap-2">
                {users.map((user) => (
                    <SidebarChats
                        key={user._id}
                        name={user.name}
                        phone={user.phone}
                        link={`/users/${getChatId(
                            session?.user._id!,
                            user._id
                        )}/chat`}
                    />
                ))}
            </div>
        </div>
    );
}

"use client";

import { useSession } from "@/components/SessionProvider";
import SidebarChats from "@/components/SidebarChats";
import { pusherClient } from "@/lib/pusher";
import { getChatId } from "@/lib/utils";
import { Session } from "@/types/Session";
import { fetchClient } from "@/utils/fetchClient";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersSidebar() {
    const [users, setUsers] = useState<Session["user"][]>([]);
    const [initialUsers, setInitialUsers] = useState<Session["user"][]>([]);
    const { session } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;

        const pusher = pusherClient.subscribe(
            `user__${session.user._id.toString()}`
        );
        pusher.bind("add_friend", (data: Session["user"]) => {
            setUsers((prev) => [...prev, data]);
        });
        pusher.bind("remove_friend", (data: { _id: string }) => {
            setUsers((prev) => prev.filter((user) => user._id !== data._id));
        });

        return () => {
            pusher.unbind("add_friend");
            pusher.unbind("remove_friend");
            pusherClient.unsubscribe(`user__${session.user._id.toString()}`);
        };
    }, [session]);

    useEffect(() => {
        if (!session) return;

        (async () => {
            setLoading(true);
            const response = await fetchClient("/users/friends", {
                showToast: false,
            });
            if (response.success) {
                setUsers(response.data);
                setInitialUsers(response.data);
            }
            setLoading(false);
        })();
    }, [session]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        if (!search) {
            setUsers(initialUsers);
            return;
        }
        const filteredUsers = initialUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.phone.includes(search)
        );
        setUsers(filteredUsers);
    };

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
                        onChange={handleSearch}
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

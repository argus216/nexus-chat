import { fetchServer } from "@/utils/fetchServer";
import PrivateUsersChat from "./PrivateChat";
import { Session } from "@/types/Session";

export default async function PrivateUsersChatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer<{ friend: Session["user"] }>(
        `/users/chat/${id}`
    );

    if (!res.success) {
        return <div>Something went wrong</div>;
    }
    return (
        <PrivateUsersChat
            chats={{
                otherUser: res.data.friend,
            }}
        />
    );
}

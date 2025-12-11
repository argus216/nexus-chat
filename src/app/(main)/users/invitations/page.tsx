import { Invitation } from "@/types/Invitation";
import Invitations from "./Invitation";
import { fetchServer } from "@/utils/fetchServer";
import { notFound } from "next/navigation";

export default async function UserInvitationPage() {
    const res = await fetchServer("/users/invitations");
    if (!res.success) {
        notFound();
    }
    const invitation: {
        sent: Invitation[];
        received: Invitation[];
    } = res.data;
    return <Invitations invitations={invitation} />;
}

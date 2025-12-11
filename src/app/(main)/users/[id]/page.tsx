import { fetchServer } from "@/utils/fetchServer";
import UsersDetails from "./UsersDetails";
import { Session } from "@/types/Session";

export default async function UsersDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetchServer<{
        user: Session["user"] & { createdAt: string };
    }>(`/users/${id}`);
    if (!res.success) {
        return <div>Something went wrong</div>;
    }
    return <UsersDetails friend={res.data.user} />;
}

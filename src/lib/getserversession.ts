import { Session } from "@/types/Session";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getServerSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) return null;

        const session = jwt.verify(
            token.value,
            process.env.NEXT_PUBLIC_JWT_SECRET!
        ) as Session;

        if (session.expires < Date.now()) return null;
        return session;
    } catch (error) {
        console.log(error);
        return null;
    }
}

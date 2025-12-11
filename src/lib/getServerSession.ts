import { Session } from "@/types/Session";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getServerSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return null;
        }

        const session = jwt.verify(
            token.value,
            process.env.JWT_SECRET!
        ) as Session;
        if (!session?.user || !session?.expires) {
            return null;
        }

        return session;
    } catch (error) {
        console.log("Get Server Session Error: ", error);
        return null;
    }
}

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Session } from "@/types/Session";

export async function getServerSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return null;

        const session = jwt.verify(token, process.env.JWT_SECRET!) as Session;
        return session;
    } catch (error) {
        console.log("Server Session Error: ", error);
        return null;
    }
}

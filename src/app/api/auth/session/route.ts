import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Session } from "@/types/Session";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader
            ?.split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as Session;

        await dbConnect();
        const user = await User.findById(decoded.user._id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Refresh token
        const expires = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days from now

        const newToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                expires,
            },
            JWT_SECRET
        );

        const session: Session = {
            user: {
                _id: user._id.toString(),
                name: user.name || "",
                email: user.email,
                phone: user.phone || "",
            },
            expires,
        };

        const response = NextResponse.json(session);

        response.cookies.set("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60, // 3 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Session error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 500 });
    }
}

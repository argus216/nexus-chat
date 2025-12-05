import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone } = await req.json();

        const cookieHeader = req.headers.get("cookie");
        const tempToken = cookieHeader
            ?.split("; ")
            .find((row) => row.startsWith("temp_token="))
            ?.split("=")[1];

        if (!tempToken) {
            return NextResponse.json(
                { error: "No token in headers" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(tempToken, JWT_SECRET) as {
                userId: string;
                email: string;
                isTemp?: boolean;
            };
        } catch (e) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        if (!phone) {
            return NextResponse.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { phone },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const sessionToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
            JWT_SECRET,
            { expiresIn: "3d" }
        );

        const response = NextResponse.json({
            message: "Profile completed",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

        // Set real token
        response.cookies.set("token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60, // 3 days
            path: "/",
        });

        // Clear temp token
        response.cookies.set("temptoken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Complete profile error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

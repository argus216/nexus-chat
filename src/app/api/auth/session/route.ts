import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Session } from "@/types/Session";
import { apiHandler } from "@/utils/apiHandler";
import { APIResponse } from "@/types/API";

const JWT_SECRET = process.env.JWT_SECRET!;

export const GET = apiHandler(async (req) => {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return {
            success: false,
            error: "Not authenticated",
            status: 401,
        };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as Session;

    await connectDB();
    const user = await User.findById(decoded.user._id);

    if (!user) {
        return {
            success: false,
            error: "User not found",
            status: 404,
        };
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
            name: user.name,
            email: user.email,
            phone: user.phone!,
        },
        expires,
    };

    const response = NextResponse.json({
        success: true,
        data: session,
        message: "Session created successfully",
    } as APIResponse);

    response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        path: "/",
    });

    return response;
});

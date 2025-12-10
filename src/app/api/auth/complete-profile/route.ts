import { NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { apiHandler } from "@/utils/apiHandler";
import { APIResponse } from "@/types/API";

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST = apiHandler(async (req) => {
    await connectDB();
    const { phone } = await req.json();

    if (!phone) {
        return {
            success: false,
            error: "Phone number is required",
            status: 400,
        };
    }

    const tempToken = req.cookies.get("temptoken")?.value;

    if (!tempToken) {
        return {
            success: false,
            error: "No token in headers",
            status: 401,
        };
    }

    let decoded;
    try {
        decoded = jwt.verify(tempToken, JWT_SECRET) as {
            userId: string;
            email: string;
            isTemp?: boolean;
        };
    } catch (e) {
        return {
            success: false,
            error: "Invalid or expired token",
            status: 401,
        };
    }

    const user = await User.findByIdAndUpdate(
        decoded.userId,
        { phone },
        { new: true }
    );

    if (!user) {
        return {
            success: false,
            error: "User not found",
            status: 404,
        };
    }

    const sessionToken = jwt.sign(
        {
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        JWT_SECRET
    );

    const response = NextResponse.json({
        success: true,
        message: "Profile completed",
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        },
    } as APIResponse);

    // Set real token
    response.cookies.set("token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        path: "/",
    });

    // Clear temp token
    response.cookies.delete("temptoken");

    return response;
});

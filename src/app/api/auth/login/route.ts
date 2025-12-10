import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { apiHandler } from "@/utils/apiHandler";
import { APIResponse } from "@/types/API";

const JWT_SECRET = process.env.JWT_SECRET!;

export const POST = apiHandler(async (req) => {
    await connectDB();
    const { phone, email, password } = await req.json();

    if (!(!!phone || !!email) && !password) {
        return {
            success: false,
            error: "Phone or email and password are required",
            status: 400,
        };
    }

    const user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) {
        return {
            success: false,
            error: "Invalid Email or Phone",
            status: 404,
        };
    }

    if (!user.password || user.oauth) {
        return {
            success: false,
            error: "Account created with OAuth",
            status: 401,
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return {
            success: false,
            error: "Invalid Password",
            status: 401,
        };
    }

    const token = jwt.sign(
        {
            user: {
                _id: user._id,
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
        message: "Login successful",
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        },
    } as APIResponse);

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60, // 3 days
        path: "/",
    });

    return response;
});

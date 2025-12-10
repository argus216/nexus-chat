import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APIResponse } from "@/types/API";
import { apiHandler } from "@/utils/apiHandler";

export const POST = apiHandler(async (req) => {
    await connectDB();
    const { email, password, name, phone } = await req.json();

    if (!email || !phone || !name || !password) {
        return {
            success: false,
            error: "All fields are required",
            status: 400,
        };
    }

    const existingUser = await User.findOne({
        $or: [{ phone }, { email }],
    });
    if (existingUser) {
        return {
            success: false,
            error: "User already exists",
            status: 400,
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        name,
        phone,
    });

    const response = NextResponse.json(
        {
            success: true,
            message: "User created successfully",
            data: { userId: user._id },
        } as APIResponse,
        { status: 201 }
    );

    const token = jwt.sign(
        {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            expires: new Date(Date.now() + 60 * 60 * 24 * 3),
        },
        process.env.JWT_SECRET!
    );

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
});

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone, email, password } = await req.json();

        if (!(!!phone || !!email) && !password) {
            return NextResponse.json(
                { error: "Phone or email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ $or: [{ phone }, { email }] });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid Email or Phone" },
                { status: 404 }
            );
        }

        if (!user.password || user.oauth) {
            return NextResponse.json(
                { error: "Account created with OAuth" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid Password" },
                { status: 401 }
            );
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
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60, // 3 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

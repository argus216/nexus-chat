import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password, name, phone } = await req.json();

        if (!email || !phone || !name || !password) {
            return NextResponse.json(
                { error: "Phone or email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({
            $or: [{ phone }, { email }],
        });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
        });

        const response = NextResponse.json(
            { message: "User created successfully", userId: user._id },
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
            process.env.JWT_SECRET || "secret"
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

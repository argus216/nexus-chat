import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found",
                },
                { status: 404 }
            );
        }

        const emailToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );
        const idToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        const verifyLink = `${process.env.APP_URL}/api/auth/reset-password?emailToken=${emailToken}&idToken=${idToken}`;

        await resend.emails.send({
            to: "amritpalsinghgmsm3@gmail.com",
            from: "nexus-chat@resend.dev",
            subject: "Verify your email address",
            html: `<p>Click <a href="${verifyLink}">${verifyLink}</a> to verify your email address</p>`,
        });

        const response = NextResponse.json(
            {
                message:
                    "Link sent to your email, check your inbox and verify.",
            },
            { status: 200 }
        );

        response.cookies.set("idToken", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60, // 3 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

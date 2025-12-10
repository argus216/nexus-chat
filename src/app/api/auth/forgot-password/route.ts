import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { resend } from "@/lib/resend";
import { apiHandler } from "@/utils/apiHandler";
import { APIResponse } from "@/types/API";

export const POST = apiHandler(async (req) => {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
        return {
            success: false,
            error: "Email is required",
            status: 400,
        };
    }

    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            error: "User not found",
            status: 404,
        };
    }

    const emailToken = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );
    const idToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });

    const verifyLink = `${process.env.APP_URL}/api/auth/reset-password?emailToken=${emailToken}`;

    await resend.emails.send({
        to: "amritpalsinghgmsm3@gmail.com",
        from: "nexus-chat@resend.dev",
        subject: "Verify your email address",
        html: `<p>Click <a href="${verifyLink}">${verifyLink}</a> to verify your email address</p>`,
    });

    const response = NextResponse.json(
        {
            success: true,
            message: "Link sent to your email, check your inbox and verify.",
        } as APIResponse,
        { status: 200 }
    );

    response.cookies.set("idToken", idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });

    return response;
});

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextURL } from "next/dist/server/web/next-url";
import { Session } from "@/types/Session";
import { apiHandler } from "@/utils/apiHandler";
import { APIResponse } from "@/types/API";

export const GET = apiHandler(async (req) => {
    await connectDB();
    const url = new NextURL("/reset-password", req.nextUrl);

    const searchParams = req.nextUrl.searchParams;
    const emailToken = searchParams.get("emailToken");
    const idToken = req.cookies.get("idToken")?.value;

    if (!emailToken || !idToken) {
        url.searchParams.set(
            "error",
            "Both Email token and Id token are required"
        );
        return NextResponse.redirect(url) as NextResponse<APIResponse>;
    }

    const decodedEmailToken = jwt.verify(
        emailToken,
        process.env.JWT_SECRET!
    ) as { email: string };

    if (!decodedEmailToken || !decodedEmailToken.email) {
        url.searchParams.set("error", "Invalid email token");
        return NextResponse.redirect(url) as NextResponse<APIResponse>;
    }

    const decodedIdToken = jwt.verify(idToken, process.env.JWT_SECRET!) as {
        id: string;
    };

    if (!decodedIdToken || !decodedIdToken.id) {
        url.searchParams.set("error", "Invalid id token");
        return NextResponse.redirect(url) as NextResponse<APIResponse>;
    }

    const user = await User.findById(decodedIdToken.id);
    if (!user) {
        url.searchParams.set("error", "Invalid id token");
        return NextResponse.redirect(url) as NextResponse<APIResponse>;
    }

    if (user.email !== decodedEmailToken.email) {
        url.searchParams.set("error", "Invalid email token");
        return NextResponse.redirect(url) as NextResponse<APIResponse>;
    }

    const res = NextResponse.redirect(url) as NextResponse<APIResponse>;

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });

    res.cookies.set("resetToken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 60, // 1 hour
        path: "/",
    });

    return res;
});

export const POST = apiHandler(async (req) => {
    await connectDB();
    const { password } = await req.json();

    if (!password) {
        return {
            success: false,
            error: "Password is required",
            status: 400,
        };
    }

    const resetToken = req.cookies.get("resetToken");
    if (!resetToken) {
        return {
            success: false,
            error: "Reset token not found",
            status: 400,
        };
    }

    const decodedResetToken = jwt.verify(
        resetToken.value,
        process.env.JWT_SECRET!
    ) as { id: string };

    if (!decodedResetToken || !decodedResetToken.id) {
        return {
            success: false,
            error: "Invalid reset token",
            status: 400,
        };
    }

    const user = await User.findById(decodedResetToken.id);
    if (!user) {
        return {
            success: false,
            error: "User not found",
            status: 404,
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    const res = NextResponse.json(
        {
            success: true,
            message: "Password reset successfully",
        } as APIResponse,
        { status: 200 }
    );

    const session: Session = {
        user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone!,
        },
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    };

    const token = jwt.sign(session, process.env.JWT_SECRET!);

    res.cookies.delete("resetToken");
    res.cookies.delete("idToken");
    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60 * 1000,
        path: "/",
    });

    return res;
});

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import bcrypt from "bcrypt";
import { NextURL } from "next/dist/server/web/next-url";
import { Session } from "@/types/Session";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const url = new NextURL("/reset-password", req.nextUrl);

        const searchParams = req.nextUrl.searchParams;
        const emailToken = searchParams.get("emailToken");
        const idToken = req.cookies.get("idToken")?.value;

        console.log(idToken, "\n\n");
        console.log(req.cookies);

        if (!emailToken || !idToken) {
            url.searchParams.set(
                "error",
                "Both Email token and Id token are required"
            );
            return NextResponse.redirect(url);
        }

        const decodedEmailToken = jwt.verify(
            emailToken,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { email: string };

        if (!decodedEmailToken || !decodedEmailToken.email) {
            url.searchParams.set("error", "Invalid email token");
            return NextResponse.redirect(url);
        }

        const decodedIdToken = jwt.verify(
            idToken,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { id: string };

        if (!decodedIdToken || !decodedIdToken.id) {
            url.searchParams.set("error", "Invalid id token");
            return NextResponse.redirect(url);
        }

        const user = await User.findById(decodedIdToken.id);
        if (!user) {
            url.searchParams.set("error", "User not found");
            return NextResponse.redirect(url);
        }

        if (user.email !== decodedEmailToken.email) {
            url.searchParams.set("error", "Invalid email token");
            return NextResponse.redirect(url);
        }

        const res = NextResponse.redirect(url);

        const newToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        res.cookies.set("resetToken", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 60 * 60, // 1 hour
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Reset password error:", error);
        const url = new NextURL("/reset-password", req.nextUrl);

        url.searchParams.set("error", "Internal server error");
        return NextResponse.redirect(url);
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        const resetToken = req.cookies.get("resetToken");
        if (!resetToken) {
            return NextResponse.json(
                { error: "Reset token not found" },
                { status: 400 }
            );
        }

        const decodedResetToken = jwt.verify(
            resetToken.value,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { id: string };

        if (!decodedResetToken || !decodedResetToken.id) {
            return NextResponse.json(
                { error: "Invalid reset token" },
                { status: 400 }
            );
        }

        const user = await User.findById(decodedResetToken.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        const res = NextResponse.json(
            { message: "Password reset successfully" },
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

        const token = jwt.sign(
            session,
            process.env.JWT_SECRET || "your-secret-key"
        );

        res.cookies.delete("resetToken");
        res.cookies.delete("idToken");
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";
import { apiHandler } from "@/utils/apiHandler";

export const GET = apiHandler(async (req) => {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
        return NextResponse.redirect(
            `${process.env.APP_URL}/login?error=GoogleAuthFailed`
        );
    }

    if (!code) {
        return NextResponse.redirect(
            `${process.env.APP_URL}/login?error=NoCode`
        );
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
                    grant_type: "authorization_code",
                }),
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Google Token Error:", tokenData);
            return NextResponse.redirect(
                `${process.env.APP_URL}/login?error=TokenExchangeFailed`
            );
        }

        // Get user info
        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            }
        );

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error("Google User Info Error:", userData);
            return NextResponse.redirect(
                `${process.env.APP_URL}/login?error=UserInfoFailed`
            );
        }

        await connectDB();

        let user = await UserModel.findOne({ email: userData.email });

        if (user) {
            if (!user.oauth || user.oauth !== "GOOGLE") {
                return NextResponse.redirect(
                    `${process.env.APP_URL}/login?error=AccountExistsWithPassword`
                );
            }
        } else {
            user = await UserModel.create({
                email: userData.email,
                name: userData.name,

                // phone number not provided by google
                phone: `NOT_PROVIDED_${Date.now()}_${Math.random()
                    .toString(36)
                    .substring(7)}`,
                oauth: "GOOGLE",
            });
        }

        // Check if phone is missing or placeholder
        if (!user.phone || user.phone.startsWith("NOT_PROVIDED_")) {
            // Generate temporary token for profile completion
            const tempToken = jwt.sign(
                { userId: user._id.toString() },
                process.env.JWT_SECRET!,
                { expiresIn: "1h" }
            );

            const response = NextResponse.redirect(
                `${process.env.APP_URL}/complete-profile`
            );

            response.cookies.set("temp_token", tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60, // 1 hour
                path: "/",
            });

            return response;
        }

        // Generate Session Token
        const token = jwt.sign(
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                expires: Date.now() + 60 * 60 * 24 * 3 * 1000,
            },
            process.env.JWT_SECRET!
        );

        const response = NextResponse.redirect(`${process.env.APP_URL}/users`);

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 3, // 3 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Google Auth Error:", error);
        return NextResponse.redirect(
            `${process.env.APP_URL}/login?error=InternalError`
        );
    }
});

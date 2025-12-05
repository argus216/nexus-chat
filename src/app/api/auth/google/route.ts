import { NextResponse } from "next/server";

export function GET() {
    const root = "https://accounts.google.com/o/oauth2/v2/auth";

    const redirectUri = `${process.env.APP_URL}/api/auth/google/callback`;

    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "email profile",
        prompt: "consent",
        access_type: "offline",
    };
    const url = `${root}?${new URLSearchParams(params)}`;

    return NextResponse.redirect(url);
}

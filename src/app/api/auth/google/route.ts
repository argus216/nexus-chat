import { ApiError } from "@/utils/ApiError";
import { apiHandler } from "@/utils/apiHandler";
import { getServerSession } from "@/utils/getServerSession";
import { NextResponse } from "next/server";

export const GET = apiHandler(async (req) => {
    const session = await getServerSession();
    if (session) {
        throw new ApiError("User already logged in", 401);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.APP_URL}/api/auth/google/callback`;
    const scope = "email profile";

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(url);
});

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );
        response.cookies.delete("token");

        return response;
    } catch (error) {
        return Response.json({ error: "Failed to logout" }, { status: 500 });
    }
}

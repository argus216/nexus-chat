import { APIResponse } from "@/types/API";
import { apiHandler } from "@/utils/apiHandler";
import { NextResponse } from "next/server";

export const POST = apiHandler(async () => {
    const response = NextResponse.json(
        {
            success: true,
            message: "Logout successful",
        } as APIResponse,
        { status: 200 }
    );
    response.cookies.delete("token");

    return response;
});

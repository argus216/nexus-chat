import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./ApiError";
import { APIResponse } from "@/types/API";

export function apiHandler<T = any>(
    fn: (
        req: NextRequest,
        params: any
    ) => Promise<NextResponse<APIResponse<T>> | APIResponse<T>>
) {
    return async function (
        req: NextRequest,
        ctx: { params: Promise<any> }
    ): Promise<NextResponse<APIResponse<T>>> {
        try {
            const params = await ctx.params;
            const res = await fn(req, params);
            if (res instanceof NextResponse) {
                return res;
            }
            return NextResponse.json(res, {
                status: !res.success ? res?.status || 500 : 200,
            });
        } catch (error) {
            console.error("API Error:", error);

            if (error instanceof ApiError) {
                return NextResponse.json(
                    { success: false, error: error.message },
                    { status: error.status }
                );
            }

            return NextResponse.json(
                { success: false, error: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}

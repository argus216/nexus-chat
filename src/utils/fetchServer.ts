import { APIResponse } from "@/types/API";
import { headers } from "next/headers";

export async function fetchServer<T = any>(
    url: string,
    options?: RequestInit
): Promise<APIResponse<T>> {
    try {
        const res = await fetch(`${process.env.APP_URL}/api${url}`, {
            ...options,
            headers: await headers(),
        });
        const data = await res.json();

        return data as APIResponse<T>;
    } catch (error) {
        console.log("Fetch Server: ", error);
        return {
            success: false,
            error: "Something went wrong",
            status: 500,
        };
    }
}

import { APIResponse } from "@/types/API";
import toast from "react-hot-toast";

export async function fetchClient<T = any>(
    url: string,
    options?: RequestInit & { showToast?: boolean; data?: any }
): Promise<APIResponse<T>> {
    try {
        const response = await fetch(`/api${url}`, {
            ...options,
            body: options?.body
                ? options.body
                : !options?.method || options?.method === "GET"
                ? null
                : JSON.stringify(options?.data),
        });
        const resData = await response.json();
        if (options?.showToast) {
            if (resData.success) toast.success(resData.message);
            else toast.error(resData.message);
        }
        return resData;
    } catch (error) {
        console.log("Fetch Client Error: ", error);
        if (options?.showToast) toast.error("Something went wrong");

        return {
            success: false,
            error: "Something went wrong",
            status: 500,
        };
    }
}

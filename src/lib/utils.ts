import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getChatId(id1?: string, id2?: string) {
    if (!id1 || !id2) return "";
    return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
}

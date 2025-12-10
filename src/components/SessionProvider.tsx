"use client";

import { Session } from "@/types/Session";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContext = {
    session: Session | null;
    refreshSession: () => Promise<void>;
    logout: () => Promise<void>;
};
const SessionContext = createContext<SessionContext>({
    session: null,
    refreshSession: async () => {},
    logout: async () => {},
});

export const useSession = () => useContext<SessionContext>(SessionContext);

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();

    const refreshSession = async () => {
        const res = await fetchClient("/auth/session", {
            showToast: false,
        });
        if (res.success) {
            setSession(res.data);
        }
    };
    const logout = async () => {
        const res = await fetchClient("/auth/logout", {
            method: "POST",
            showToast: false,
        });
        if (res.success) {
            setSession(null);
            router.replace("/auth/login");
        }
    };

    useEffect(() => {
        refreshSession();
    }, []);
    return (
        <SessionContext.Provider value={{ session, refreshSession, logout }}>
            {children}
        </SessionContext.Provider>
    );
}

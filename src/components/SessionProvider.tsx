"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@/types/Session";
import { axiosClient } from "@/lib/axiosclient";
import { useRouter } from "next/navigation";

interface SessionContextType {
    session: Session | null;
    loading: boolean;
    refreshSession: () => Promise<void>;
    logout: () => Promise<boolean | unknown>;
}

const SessionContext = createContext<SessionContextType>({
    session: null,
    loading: true,
    refreshSession: async () => {},
    logout: async () => {},
});

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSession = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get("/auth/session");
            if (res.data && res.data.user) {
                setSession(res.data);
            } else {
                setSession(null);
            }
        } catch (error) {
            console.error("Failed to fetch session", error);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const res = await axiosClient.post("/auth/logout");
            if (res.status === 200) {
                setSession(null);
                router.push("/login");
                return true;
            }
            return false;
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    return (
        <SessionContext.Provider
            value={{ session, loading, refreshSession: fetchSession, logout }}
        >
            {children}
        </SessionContext.Provider>
    );
}

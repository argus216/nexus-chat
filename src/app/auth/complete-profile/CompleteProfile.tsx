"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/utils/fetchClient";
import { useSession } from "@/components/SessionProvider";
import { Input } from "@/components/ui/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Loader2, PhoneCall } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CompleteProfile() {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { refreshSession } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (error) setError(null);
        if (!phone) {
            setError("Please enter your phone number");
            return;
        }
        if (!phone.match(/^\+\d{1,3}-\d{10}$/)) {
            setError("Invalid phone number");
            return;
        }
        setLoading(true);
        const res = await fetchClient("/auth/complete-profile", {
            method: "POST",
            data: { phone },
        });
        if (res.success) {
            await refreshSession();
            router.push("/");
            return;
        }
        setError(res.error);
        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
                    Complete Profile
                </h2>
                <p className="text-gray-400 text-center mb-6">
                    Please provide your phone number to continue.
                </p>

                {error && (
                    <div className="bg-red-500/20 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            icon={<PhoneCall className="w-5 h-5" />}
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1-1234567890"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant={"primary"}
                        size={"full"}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            "Save & Continue"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

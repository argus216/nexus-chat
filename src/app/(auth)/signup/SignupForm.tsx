"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputWithLabel";
import { axiosClient } from "@/lib/axiosclient";
import {
    ArrowRight,
    ChevronDown,
    Loader2,
    Lock,
    Mail,
    Sparkles,
    User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const COUNTRY_CODES = [
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
];

export default function SignupForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget);

        const email = formdata.get("email")?.toString();
        const password = formdata.get("password")?.toString();
        const name = formdata.get("name")?.toString();
        const phone = formdata.get("phone")?.toString();
        const phone_code = formdata.get("phone_code")?.toString();

        if (!email || !password || !name || !phone || !phone_code) {
            setError("All fields are required");
            return;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Invalid email address");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        if (name.length < 3) {
            setError("Name must be at least 3 characters long");
            return;
        }
        if (phone.length !== 10) {
            setError("Phone number must be 10 characters long");
            return;
        }

        if (error) {
            setError(null);
        }

        setLoading(true);
        try {
            const res = await axiosClient.post("/auth/signup", {
                email,
                password,
                name,
                phone: `${phone_code}-${phone}`,
            });

            if (res.data.error) {
                setError(res.data.error);
                return;
            }

            router.push("/");
        } catch (error: any) {
            setError(error.response.data.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:hidden text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Nexus Chat
                    </h1>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Create an account
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Enter your details to access your account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <Input
                            name="name"
                            label="Name"
                            type="text"
                            placeholder="John Doe"
                            icon={<User className="w-5 h-5" />}
                            autoFocus
                        />
                        <Input
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            icon={<Mail className="w-5 h-5" />}
                        />
                        <Input
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="000-000-0000"
                            inputClassName="pl-[6.5rem]"
                            startAdornment={
                                <div className="flex items-center h-full border-r border-gray-200 bg-gray-50/50 rounded-l-xl px-2">
                                    <select
                                        name="phone_code"
                                        className="bg-transparent text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer pl-1 pr-6 py-1 w-full"
                                    >
                                        {COUNTRY_CODES.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="absolute right-3 text-gray-500 pointer-events-none"
                                    />
                                </div>
                            }
                        />

                        <Input
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Create a strong password"
                            icon={<Lock className="w-5 h-5" />}
                        />

                        <div className="text-xs text-gray-500 leading-relaxed">
                            By creating an account, you agree to our{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                Privacy Policy
                            </a>
                            .
                        </div>

                        <Button
                            type="submit"
                            variant={"primary"}
                            size={"full"}
                            isLoading={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

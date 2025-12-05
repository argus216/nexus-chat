"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputWithLabel";
import { axiosClient } from "@/lib/axiosclient";
import { ArrowRight, Loader2, Lock, Sparkles, UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        console.log(params);
    }, []);

    function handleGoogleLogin() {
        router.push("/api/auth/google");
    }

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;

        if (!emailOrPhone || !password) {
            setError("Please fill all fields");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        let data = {};

        if (
            emailOrPhone.match(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            )
        ) {
            data = { email: emailOrPhone, password };
        } else if (
            emailOrPhone.split("-").length === 2 &&
            emailOrPhone.split("-")[1].length === 10 &&
            emailOrPhone.startsWith("+")
        ) {
            data = { phone: emailOrPhone, password };
        } else {
            setError("Invalid email or phone number");
            return;
        }

        if (error) {
            setError(null);
        }

        setLoading(true);

        try {
            const response = await axiosClient.post("/auth/login", data);
            if (response.status !== 200) {
                setError(response.data.error);
                return;
            }
            router.push("/");
        } catch (error: any) {
            setError(error.response.data.error || "Something went wrong.");
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
                            Welcome back
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
                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Email or Mobile Number"
                            placeholder="Enter email or phone"
                            icon={<UserIcon className="w-5 h-5" />}
                            autoFocus
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                        />
                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Link
                                    href={"/forgot-password"}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-1"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            variant={"primary"}
                            size={"full"}
                            type="submit"
                            isLoading={loading}
                            className="mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <>
                                    Sign In{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="google"
                            size={"full"}
                            onClick={handleGoogleLogin}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <Link
                                href={"/signup"}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

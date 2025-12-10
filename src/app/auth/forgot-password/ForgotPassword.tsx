"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputWithLabel";
import { fetchClient } from "@/utils/fetchClient";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (error || success) {
            setError(null);
            setSuccess(null);
        }

        setLoading(true);

        const res = await fetchClient(
            "/auth/forgot-password",
            {
                email: e.currentTarget.email.value,
            },
            {
                method: "POST",
            }
        );
        if (res.success) {
            setSuccess("Check your email for the reset password link");
            return;
        }
        setError(res.error);
        setLoading(false);
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
                            Forgot password
                        </h2>
                        <p className="text-gray-500 mt-2">
                            We’ll send you instructions to reset it.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-4">
                            Enter the email address associated with your account
                            and we'll send you a link to reset your password.
                        </div>

                        <Input
                            name="email"
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            icon={<Mail className="w-5 h-5" />}
                            autoFocus
                        />

                        <Button
                            type="submit"
                            variant={"primary"}
                            size={"full"}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>

                        <div className="flex items center justify-center">
                            <Link
                                href="/login"
                                className="mx-auto text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

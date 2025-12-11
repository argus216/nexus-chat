"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/Session";
import { Calendar, Mail, Phone, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersDetails({
    friend,
}: {
    friend: Session["user"] & { createdAt: string };
}) {
    const router = useRouter();

    return (
        <div className="h-full w-full flex flex-col bg-white animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Contact Info</h2>
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Profile Hero */}
                <div className="flex flex-col items-center pt-10 pb-8 px-6 bg-gray-50/50">
                    <Avatar name={friend.name} size="2xl" className="mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">
                        {friend.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        {/* <span className="text-gray-500 font-medium capitalize">
                            {friend.phone}
                        </span> */}
                    </div>
                </div>

                {/* Details List */}
                <div className="p-6 space-y-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Mail size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Email
                                </p>
                                <p className="text-gray-900 font-medium">
                                    {friend.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                <Phone size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Phone
                                </p>
                                <p className="text-gray-900 font-medium">
                                    {friend.phone}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                                <Calendar size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                    Joined
                                </p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(friend.createdAt).toDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <Button
                            variant="outline"
                            size={"full"}
                            className="text-red-600 border-red-100 hover:border-red-200 hover:bg-red-50"
                        >
                            <Shield size={16} className="mr-2" /> Block User
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

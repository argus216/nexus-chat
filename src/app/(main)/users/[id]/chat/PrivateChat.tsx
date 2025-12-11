"use client";

import { Avatar } from "@/components/Avatar";
import ChatMessages from "@/components/ChatMessages";
import { useSession } from "@/components/SessionProvider";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/Session";
import { ArrowLeft, FileText, Paperclip, Send, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function PrivateUsersChat({
    chats,
}: {
    chats: {
        otherUser: Session["user"];
    };
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setfile] = useState<File | null>(null);
    const [message, setmessage] = useState<string>("");
    const router = useRouter();
    const { session } = useSession();

    async function handleSend() {
        if (!message.trim() || !file) return;
    }
    return (
        <div className="w-full flex flex-col h-screen">
            <div className="cursor-pointer text-gray-500 w-full flex items-center p-2 border-b border-gray-200/50 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <Link
                    href={`/users/${chats.otherUser._id}`}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-100"
                >
                    <Avatar name={chats.otherUser.name} size="sm" />
                    <div className="flex flex-col">
                        <p className="font-semibold text-sm">
                            {chats.otherUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {chats.otherUser.phone}
                        </p>
                    </div>
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-2 overflow-y-auto p-4">
                {/* Chat messages */}

                {file && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-2">
                        <div className="relative group shrink-0">
                            {file.type.startsWith("image/") ? (
                                <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden relative shadow-sm">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-blue-500 shadow-sm">
                                    <FileText size={24} />
                                </div>
                            )}
                            <button
                                onClick={() => setfile(null)}
                                className="absolute -top-2 -right-2 bg-white text-gray-500 border border-gray-200 rounded-full p-1 hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors z-10"
                            >
                                <X size={12} />
                            </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB • Ready to
                                send
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 p-4 w-full max-w-[600px] mx-auto border-t border-gray-200/50">
                <div>
                    <input
                        type="file"
                        ref={fileRef}
                        onChange={(e) => setfile(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    <Button
                        variant="google"
                        onClick={() => fileRef.current?.click()}
                        className="border-0 text-2xl text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Paperclip />
                    </Button>
                </div>
                <div className="w-full flex items-center gap-2 p-2 border border-gray-200 rounded-xl">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setmessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="Type your message ..."
                        className="w-full p-2 outline-none border-0 text-gray-500 text-sm"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        variant={"google"}
                        className="border-0 text-2xl text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
}

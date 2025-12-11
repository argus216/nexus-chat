import { Message } from "@/types/Message";
import { Avatar } from "./Avatar";
import { Session } from "@/types/Session";
import { Check, Loader2, MessageSquareWarning } from "lucide-react";

export default function ChatMessage({
    message,
    sessionId,
    friend,
}: {
    message: Message;
    sessionId: string;
    friend: Session["user"];
}) {
    const sentByMe = message.sender === sessionId;
    if (sentByMe)
        return (
            <div className={`flex w-full justify-end`}>
                <div className={`flex max-w-[75%] gap-2 items-end`}>
                    <div
                        className={`
                  px-4 py-1.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-blue-600 text-white rounded-tr-none
                `}
                    >
                        {message.data}
                        <div
                            className={`text-[10px] opacity-70 text-blue-100 flex items-center gap-2`}
                        >
                            <p>
                                {new Date(message.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                            <div>
                                {message.status === "sending" && (
                                    <Loader2
                                        size={12}
                                        className="animate-spin"
                                    />
                                )}

                                {message.status === "sent" && (
                                    <Check size={12} />
                                )}
                                {message.status === "failed" && (
                                    <MessageSquareWarning
                                        size={12}
                                        className="text-white"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    return (
        <div className={`flex w-full justify-start`}>
            <div className={`flex max-w-[75%] gap-2 items-start`}>
                <Avatar name={friend.name} size="sm" />
                <div className={`flex flex-col`}>
                    <div
                        className={`px-4 py-1.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-gray-800 border border-gray-100 rounded-tl-none`}
                    >
                        {message.data}
                        <div className={`text-[10px] opacity-70 text-gray-400`}>
                            {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

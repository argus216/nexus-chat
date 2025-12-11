"use client";

import React, { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    Check,
    X,
    Send,
    Loader2,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/InputWithLabel";
import { Invitation } from "@/types/Invitation";
import { Avatar } from "@/components/Avatar";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "@/components/SessionProvider";
import { fetchClient } from "@/utils/fetchClient";

export default function Invitations({
    invitations: invitationProp,
}: {
    invitations: {
        sent: Invitation[];
        received: Invitation[];
    };
}) {
    const [activeTab, setActiveTab] = useState<"received" | "send" | "sent">(
        "send"
    );
    const [invitations, setInvitations] = useState(invitationProp);
    const { session } = useSession();

    useEffect(() => {
        console.log(session);
        if (!session) return;
        const pusher = pusherClient.subscribe(
            `invitation__${session.user._id}`
        );

        pusher.bind("invitation_received", (data: Invitation) => {
            setInvitations((prev) => ({
                ...prev,
                received: [...prev.received, data],
            }));
        });

        pusher.bind("invitation_deleted", (data: Invitation) => {
            setInvitations((prev) => ({
                ...prev,
                received: prev.received.filter(
                    (invite) => invite._id !== data._id
                ),
            }));
        });

        pusher.bind("invitation_updated", (data: Invitation) => {
            setInvitations((prev) => ({
                ...prev,
                received: prev.received.map((invite) =>
                    invite._id === data._id
                        ? { ...invite, status: data.status }
                        : invite
                ),
            }));
        });

        return () => {
            pusher.unbind("invitation_received");
            pusher.unbind("invitation_deleted");
            pusher.unbind("invitation_updated");
            pusherClient.unsubscribe(`invitation__${session.user._id}`);
        };
    }, [session]);

    return (
        <div className="h-full bg-white flex flex-col max-w-2xl mx-auto w-full pt-10 px-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Manage Invitations
                </h2>
                <p className="text-gray-500">
                    Connect with friends and grow your network.
                </p>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-8 self-center">
                <button
                    onClick={() => setActiveTab("send")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "send"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Send Invite
                </button>
                <button
                    onClick={() => setActiveTab("sent")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "sent"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Sent Invitations
                </button>
                <button
                    onClick={() => setActiveTab("received")}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        activeTab === "received"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Received
                    {invitations.received.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {
                                invitations.received.filter(
                                    (i) => i.status !== "deleted"
                                ).length
                            }
                        </span>
                    )}
                </button>
            </div>

            {activeTab === "send" && (
                <SendInvitation setInvitations={setInvitations} />
            )}
            {activeTab === "received" && (
                <ReceivedInvitations
                    invitations={invitations.received.filter(
                        (invite) => invite.status !== "deleted"
                    )}
                    setInvitations={setInvitations}
                />
            )}
            {activeTab === "sent" && (
                <SentInvitations
                    invitations={invitations.sent.filter(
                        (i) => !["accepted", "rejected"].includes(i.status)
                    )}
                    setInvitations={setInvitations}
                />
            )}
        </div>
    );
}

function SentInvitations({
    invitations,
    setInvitations,
}: {
    invitations: Invitation[];
    setInvitations: React.Dispatch<
        React.SetStateAction<{ sent: Invitation[]; received: Invitation[] }>
    >;
}) {
    async function handleInvitationDelete(id: string) {
        const res = await fetchClient("/users/invitations", {
            method: "DELETE",
            data: { id },
            showToast: true,
        });
        if (res.success) {
            setInvitations((prev) => ({
                ...prev,
                sent: prev.sent.map((invite) => {
                    if (invite._id === id) {
                        return {
                            ...invite,
                            status: "deleted",
                        };
                    }
                    return invite;
                }),
            }));
        }
    }
    return (
        <div className="space-y-4">
            {invitations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <p>No sent invitations</p>
                </div>
            ) : (
                invitations.map((invite) => (
                    <div
                        key={invite._id}
                        className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar name={invite.receiver.name} />
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {invite.receiver.name}{" "}
                                    <span className="font-normal text-gray-500">
                                        sent invitation
                                    </span>
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                    {invite.group
                                        ? `Join ${invite.group.name}`
                                        : "Connect as Friends"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                        invite.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {invite.status === "pending" && (
                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        handleInvitationDelete(invite._id)
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                            {invite.status === "deleted" && (
                                <div className="flex items-center flex-row gap-2 px-4 py-2 rounded bg-red-500/50 cursor-pointer text-white">
                                    <X size={16} />
                                    <p className="text-sm">Deleted</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function ReceivedInvitations({
    invitations,
    setInvitations,
}: {
    invitations: Invitation[];
    setInvitations: React.Dispatch<
        React.SetStateAction<{ sent: Invitation[]; received: Invitation[] }>
    >;
}) {
    async function handleInvitationStatus(
        id: string,
        status: "accepted" | "rejected"
    ) {
        const res = await fetchClient("/users/invitations", {
            method: "PUT",
            data: { id, status },
            showToast: true,
        });
        if (res.success) {
            setInvitations((prev) => ({
                ...prev,
                received: prev.received.map((invite) => {
                    if (invite._id === id) {
                        return {
                            ...invite,
                            status,
                        };
                    }
                    return invite;
                }),
            }));
        }
    }
    return (
        <div className="space-y-4">
            {invitations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <p>No pending invitations</p>
                </div>
            ) : (
                invitations.map((invite) => (
                    <div
                        key={invite._id}
                        className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar name={invite.sender.name} />
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {invite.sender.name}{" "}
                                    <span className="font-normal text-gray-500">
                                        invited you to
                                    </span>
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                    {invite.group
                                        ? `Join ${invite.group.name}`
                                        : "Connect as Friends"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                        invite.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {invite.status === "pending" && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleInvitationStatus(
                                            invite._id,
                                            "rejected"
                                        )
                                    }
                                    className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                    title="Reject"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={() =>
                                        handleInvitationStatus(
                                            invite._id,
                                            "accepted"
                                        )
                                    }
                                    className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-colors"
                                    title="Accept"
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        )}

                        {invite.status === "accepted" && (
                            <div className="flex items-center flex-row gap-2 px-4 py-2 rounded bg-emerald-500/50 cursor-pointer text-white">
                                <Check size={16} />
                                <p className="text-sm">Accepted</p>
                            </div>
                        )}
                        {invite.status === "rejected" && (
                            <div className="flex items-center flex-row gap-2 px-4 py-2 rounded bg-red-500/50 cursor-pointer text-white">
                                <X size={16} />
                                <p className="text-sm">Rejected</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

function SendInvitation({
    setInvitations,
}: {
    setInvitations: React.Dispatch<
        React.SetStateAction<{ sent: Invitation[]; received: Invitation[] }>
    >;
}) {
    const [inputType, setInputType] = useState("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());

        if (inputType === "email") {
            if (!values.email) {
                setError("Email is required");
                return;
            }
            if (!values.email.toString().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setError("Invalid email address");
                return;
            }
        }
        if (inputType === "phone") {
            if (!values.phone) {
                setError("Phone is required");
                return;
            }
            if (!values.phone.toString().match(/^[+][0-9]{1,3}-[0-9]{10}$/)) {
                setError("Invalid phone number");
                return;
            }
        }
        setLoading(true);
        const res = await fetchClient("/users/invitations", {
            method: "POST",
            data: values,
        });
        setLoading(false);
        if (res.success) {
            setSuccess(res.message);
            setInvitations((prev) => ({
                ...prev,
                sent: [...prev.sent, res.data],
            }));
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                    <TriangleAlert size={14} />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {success}
                </div>
            )}

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setInputType("email")}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        inputType === "email"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                    <Mail
                        className={
                            inputType === "email"
                                ? "text-blue-600"
                                : "text-gray-400"
                        }
                    />
                    <span className="font-medium">Email</span>
                </button>
                <button
                    onClick={() => setInputType("phone")}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        inputType === "phone"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                    <Phone
                        className={
                            inputType === "phone"
                                ? "text-blue-600"
                                : "text-gray-400"
                        }
                    />
                    <span className="font-medium">Phone</span>
                </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
                {inputType === "email" ? (
                    <Input
                        name="email"
                        label="Friend's Email"
                        placeholder="john@example.com"
                        type="email"
                        required
                    />
                ) : (
                    <Input
                        name="phone"
                        label="Friend's Phone Number"
                        placeholder="+1 555 000 0000"
                        type="tel"
                        required
                    />
                )}
                <Button
                    type="submit"
                    variant={"primary"}
                    size={"full"}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <>
                            Send Invitation <Send size={16} className="ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}

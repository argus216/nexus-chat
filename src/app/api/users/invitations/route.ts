import { apiHandler } from "@/utils/apiHandler";
import { getServerSession } from "@/lib/getServerSession";
import Invitation from "@/models/Invitation";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { APIResponse } from "@/types/API";
import { pusherServer } from "@/lib/pusher";

export const GET = apiHandler(async () => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const invitations = await Invitation.aggregate([
        {
            $match: {
                $or: [
                    {
                        sender: new mongoose.Types.ObjectId(session.user._id),
                    },
                    {
                        receiver: new mongoose.Types.ObjectId(session.user._id),
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            phone: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            phone: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$receiver",
        },
        {
            $unwind: "$sender",
        },
        {
            $project: {
                _id: 1,
                sender: 1,
                receiver: 1,
                status: 1,
                createdAt: 1,
            },
        },
    ]);

    return NextResponse.json(
        {
            data: {
                sent: invitations.filter(
                    (invitation) =>
                        invitation.sender._id.toString() ===
                        session.user._id.toString()
                ),
                received: invitations.filter(
                    (invitation) =>
                        invitation.receiver._id.toString() ===
                        session.user._id.toString()
                ),
            },
            success: true,
            message: "Invitations fetched successfully",
        },
        { status: 200 }
    );
});

export const POST = apiHandler(async (req) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const { email, phone } = await req.json();

    if (!email && !phone) {
        return {
            success: false,
            error: "Email or phone is required",
            status: 400,
        };
    }

    const user = await User.findOne({
        $or: [{ email }, { phone }],
    });
    if (!user) {
        return {
            success: false,
            error: "User not found",
            status: 404,
        };
    }

    if (user._id.toString() === session.user._id) {
        return {
            success: false,
            error: "You cannot invite yourself",
            status: 400,
        };
    }

    const allInvitation = await Invitation.find({
        $or: [
            { sender: session.user._id, receiver: user._id },
            { sender: user._id, receiver: session.user._id },
        ],
    });

    let existingInvitation = false;
    allInvitation.forEach((i) => {
        if (i.status === "pending") {
            existingInvitation = true;
        }
    });

    if (existingInvitation) {
        return {
            success: false,
            error: "Invitation already sent",
            status: 400,
        };
    }

    const invitation = await Invitation.create({
        sender: session.user._id,
        receiver: user._id.toString(),
        status: "pending",
    });

    pusherServer.trigger(
        `invitation__${invitation.receiver.toString()}`,
        "invitation_received",
        {
            _id: invitation._id.toString(),
            sender: { ...session.user },
            receiver: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            status: "pending",
            createdAt: invitation.createdAt,
        }
    );

    return {
        success: true,
        data: {
            _id: invitation._id.toString(),
            sender: { ...session.user },
            receiver: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            status: "pending",
            createdAt: invitation.createdAt,
        },
        message: "Invitation sent successfully",
        status: 200,
    };
});

export const PUT = apiHandler(async (req) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const { id, status } = await req.json();

    if (!id || !status) {
        return {
            success: false,
            error: "Invitation ID and status are required",
            status: 400,
        };
    }

    if (!["accepted", "rejected"].includes(status)) {
        return {
            success: false,
            error: "Invalid status",
            status: 400,
        };
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
        return {
            success: false,
            error: "Invitation not found",
            status: 404,
        };
    }

    if (invitation.sender.toString() === session.user._id.toString()) {
        return {
            success: false,
            error: "You can not accept your own invitation",
            status: 400,
        };
    }

    if (invitation.receiver.toString() !== session.user._id.toString()) {
        return {
            success: false,
            error: "You are not authorized to accept this invitation",
            status: 400,
        };
    }

    if (status === "accepted") {
        const sender = await User.findById(invitation.sender);
        const receiver = await User.findById(invitation.receiver);
        if (!sender || !receiver) {
            return {
                success: false,
                error: "User not found",
                status: 404,
            };
        }

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        pusherServer.trigger(`user__${sender._id.toString()}`, "add_friend", {
            _id: receiver._id.toString(),
            name: receiver.name,
            email: receiver.email,
            phone: receiver.phone,
        });
        pusherServer.trigger(`user__${receiver._id.toString()}`, "add_friend", {
            _id: sender._id.toString(),
            name: sender.name,
            email: sender.email,
            phone: sender.phone,
        });
    }

    invitation.status = status;
    await invitation.save();

    pusherServer.trigger(
        `invitation__${invitation.sender.toString()}`,
        "invitation_updated",
        {
            _id: invitation._id.toString(),
            status: invitation.status,
        }
    );

    return {
        success: true,
        data: {},
        message: "Invitation updated successfully",
        status: 200,
    };
});

export const DELETE = apiHandler(async (req) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const { id } = await req.json();

    if (!id) {
        return {
            success: false,
            error: "Invitation ID is required",
            status: 400,
        };
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
        return {
            success: false,
            error: "Invitation not found",
            status: 404,
        };
    }

    if (invitation.sender.toString() !== session.user._id.toString()) {
        return {
            success: false,
            error: "You are not authorized to delete this invitation",
            status: 400,
        };
    }

    if (invitation.status !== "pending") {
        return {
            success: false,
            error: "You can only delete pending invitations",
            status: 400,
        };
    }

    invitation.status = "deleted";
    await invitation.save();

    pusherServer.trigger(
        `invitation__${invitation.receiver.toString()}`,
        "invitation_deleted",
        {
            _id: invitation._id.toString(),
        }
    );

    return {
        success: true,
        data: {},
        message: "Invitation deleted successfully",
        status: 200,
    };
});

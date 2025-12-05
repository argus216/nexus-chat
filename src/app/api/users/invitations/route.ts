import { getServerSession } from "@/lib/getserversession";
import Invitation from "@/models/Invitation";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const invitations = await Invitation.aggregate([
            {
                $match: {
                    $or: [
                        {
                            sender: new mongoose.Types.ObjectId(
                                session.user._id
                            ),
                        },
                        {
                            receiver: new mongoose.Types.ObjectId(
                                session.user._id
                            ),
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
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { email, phone } = await req.json();

        if (!email && !phone) {
            return NextResponse.json(
                { error: "Email or phone is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (user._id.toString() === session.user._id) {
            return NextResponse.json(
                { error: "You cannot invite yourself" },
                { status: 400 }
            );
        }

        const existingInvitation = await Invitation.findOne({
            $or: [
                { sender: session.user._id, receiver: user._id },
                { sender: user._id, receiver: session.user._id },
            ],
        });
        if (existingInvitation) {
            return NextResponse.json(
                { error: "Invitation already sent" },
                { status: 400 }
            );
        }

        const invitation = await Invitation.create({
            sender: session.user._id,
            receiver: user._id.toString(),
            status: "pending",
        });

        return NextResponse.json(
            { data: invitation, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json(
                { error: "Invitation ID and status are required" },
                { status: 400 }
            );
        }

        const invitation = await Invitation.findOne({
            _id: id,
        });
        if (!invitation) {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }

        if (invitation.sender.toString() === session.user._id.toString()) {
            return NextResponse.json(
                { error: "You are not authorized to accept this invitation" },
                { status: 400 }
            );
        }

        invitation.status = status;
        await invitation.save();

        if (status === "accepted") {
            await User.updateOne(
                { _id: session.user._id },
                {
                    $push: {
                        friends: { friend: invitation.sender, blocked: false },
                    },
                }
            );
            await User.updateOne(
                { _id: invitation.sender },
                {
                    $push: {
                        friends: { friend: session.user._id, blocked: false },
                    },
                }
            );
        }

        return NextResponse.json(
            { data: invitation, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

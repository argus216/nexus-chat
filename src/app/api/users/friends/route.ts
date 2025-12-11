import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import User from "@/models/User";
import { apiHandler } from "@/utils/apiHandler";
import { getServerSession } from "@/utils/getServerSession";
import mongoose from "mongoose";

export const GET = apiHandler(async () => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }
    await connectDB();

    const friends = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(session.user._id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "friends",
                foreignField: "_id",
                as: "friends",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            phone: 1,
                        },
                    },
                ],
            },
        },
    ]);

    return {
        success: true,
        data: friends[0].friends,
        message: "",
    };
});

export const DELETE = apiHandler(async (req) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    const { id } = await req.json();
    if (!id) {
        return {
            success: false,
            status: 400,
            error: "Missing friend ID",
        };
    }

    await connectDB();

    const user = await User.findById(session.user._id);
    if (!user) {
        return {
            success: false,
            status: 404,
            error: "User not found",
        };
    }
    const friend = await User.findById(id);
    if (!friend) {
        return {
            success: false,
            status: 404,
            error: "Friend not found",
        };
    }

    user.friends = user.friends.filter((friend) => {
        return friend.toString() !== id;
    });
    friend.friends = friend.friends.filter((friend) => {
        return friend.toString() !== session.user._id;
    });

    await user.save();
    await friend.save();

    await pusherServer.trigger(`user__${id}`, "remove_friend", {
        _id: session.user._id,
    });
    await pusherServer.trigger(`user__${session.user._id}`, "remove_friend", {
        _id: id,
    });

    return {
        success: true,
        message: "Friend removed successfully",
        data: user,
    };
});

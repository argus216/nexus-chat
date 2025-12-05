import { getServerSession } from "@/lib/getserversession";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

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
                                _id: 1,
                                name: 1,
                                email: 1,
                                phone: 1,
                            },
                        },
                    ],
                },
            },
        ]);

        return NextResponse.json(
            { data: friends[0].friends, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error, success: false }, { status: 500 });
    }
}

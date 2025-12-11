import { getServerSession } from "@/lib/getServerSession";
import User from "@/models/User";
import { apiHandler } from "@/utils/apiHandler";

export const GET = apiHandler(async (req, { id }) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const friendId = id
        .split("-")
        .filter((id: string) => id !== session.user._id)[0];
    const friend = await User.findById(friendId);
    if (!friend) {
        return {
            success: false,
            error: "Friend not found",
            status: 404,
        };
    }

    if (
        !friend.friends.filter((f: any) => f.toString() === session.user._id)
            .length
    ) {
        return {
            success: false,
            error: "You are not friends with this user",
            status: 403,
        };
    }

    return {
        success: true,
        message: "Friend found",
        data: {
            friend: {
                _id: friend._id.toString(),
                name: friend.name,
                email: friend.email,
                phone: friend.phone,
            },
        },
    };
});

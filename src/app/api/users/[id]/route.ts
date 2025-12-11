import User from "@/models/User";
import { apiHandler } from "@/utils/apiHandler";
import { getServerSession } from "@/utils/getServerSession";

export const GET = apiHandler(async (req, { id }) => {
    const session = await getServerSession();
    if (!session) {
        return {
            success: false,
            error: "Unauthorized",
            status: 401,
        };
    }

    const user = await User.findById(id);
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
            error: "User not found",
            status: 404,
        };
    }
    return {
        success: true,
        message: "User found",
        data: {
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
            },
        },
    };
});

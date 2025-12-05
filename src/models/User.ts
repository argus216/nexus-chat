import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFriend {
    friend: mongoose.Types.ObjectId;
    blocked: boolean;
}

export interface IUser extends Document {
    email: string;
    password?: string;
    oauth?: "GOOGLE" | null;
    name: string;
    phone?: string;
    groups: mongoose.Types.ObjectId[];
    friends: IFriend[];
}

const friendsSchema = new Schema<IFriend>({
    friend: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    blocked: {
        type: Boolean,
        default: false,
    },
});

const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        oauth: {
            type: String,
            enum: ["GOOGLE", null],
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        groups: [
            {
                type: Schema.Types.ObjectId,
                ref: "Group",
            },
        ],
        friends: [friendsSchema],
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

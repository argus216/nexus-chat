import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    password?: string;
    oauth?: "GOOGLE" | null;
    name: string;
    phone?: string;
    groups: mongoose.Types.ObjectId[];
    friends: mongoose.Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
        oauth: { type: String, enum: ["GOOGLE", null], default: null },
        name: { type: String, required: true },
        phone: { type: String },
        groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
        friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

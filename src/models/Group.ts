import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGroup extends Document {
    users: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    name: string;
    description?: string;
    isPublic: boolean;
}

const GroupSchema: Schema = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
        admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        name: { type: String, required: true },
        description: { type: String },
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Group: Model<IGroup> =
    mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);

export default Group;

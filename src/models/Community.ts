import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommunity extends Document {
    users: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    name: string;
    description?: string;
}

const CommunitySchema: Schema = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
        admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

const Community: Model<ICommunity> =
    mongoose.models.Community ||
    mongoose.model<ICommunity>("Community", CommunitySchema);

export default Community;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    isGroup: boolean;
    status: "pending" | "accepted" | "rejected" | "deleted";
    groupId?: mongoose.Types.ObjectId; // Optional, if it's a group invitation

    createdAt: Date;
    updatedAt: Date;
}

const InvitationSchema: Schema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isGroup: { type: Boolean, default: false },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "deleted"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Invitation: Model<IInvitation> =
    mongoose.models.Invitation ||
    mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;

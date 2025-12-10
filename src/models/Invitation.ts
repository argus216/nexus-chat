import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    isGroup: boolean;
    groupId?: mongoose.Types.ObjectId; // Optional, if it's a group invitation
}

const InvitationSchema: Schema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isGroup: { type: Boolean, default: false },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    },
    { timestamps: true }
);

const Invitation: Model<IInvitation> =
    mongoose.models.Invitation ||
    mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;

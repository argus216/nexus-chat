import { Session } from "./Session";

export type Invitation = {
    _id: string;
    sender: Session["user"];
    receiver: Session["user"];
    createdAt: Date;
    status: "pending" | "accepted" | "rejected" | "deleted";
    group?: {
        _id: string;
        name: string;
    };
    groupId?: string;
};

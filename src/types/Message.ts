export type Message = {
    _id: string;
    data: string;
    type: "text" | "image" | "link" | "video" | "file";
    sender: string;
    timestamp: number;
    status?: "sending" | "sent" | "failed";
};

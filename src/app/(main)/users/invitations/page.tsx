import { Invitation } from "@/types/Invitation";
import Invitations from "./Invitations";

export default function UserInvitationPage() {
    const invitation: {
        sent: Invitation[];
        received: Invitation[];
    } = {
        sent: [
            {
                _id: "1",
                sender: {
                    _id: "1",
                    name: "John Doe",
                    phone: "1234567890",
                    email: "john.doe@example.com",
                },
                receiver: {
                    _id: "2",
                    name: "Jane Doe",
                    phone: "1234567890",
                    email: "jane.doe@example.com",
                },
                createdAt: new Date(),
                status: "pending",
                group: {
                    _id: "1",
                    name: "Group 1",
                },
            },
            {
                _id: "2",
                sender: {
                    _id: "1",
                    name: "John Doe",
                    phone: "1234567890",
                    email: "john.doe@example.com",
                },
                receiver: {
                    _id: "2",
                    name: "Jane Doe",
                    phone: "1234567890",
                    email: "jane.doe@example.com",
                },
                createdAt: new Date(),
                status: "pending",
            },
        ],
        received: [
            {
                _id: "1",
                sender: {
                    _id: "1",
                    name: "John Doe",
                    phone: "1234567890",
                    email: "john.doe@example.com",
                },
                receiver: {
                    _id: "2",
                    name: "Jane Doe",
                    phone: "1234567890",
                    email: "jane.doe@example.com",
                },
                createdAt: new Date(),
                status: "pending",
                group: {
                    _id: "1",
                    name: "Group 1",
                },
            },
            {
                _id: "2",
                sender: {
                    _id: "1",
                    name: "John Doe",
                    phone: "1234567890",
                    email: "john.doe@example.com",
                },
                receiver: {
                    _id: "2",
                    name: "Jane Doe",
                    phone: "1234567890",
                    email: "jane.doe@example.com",
                },
                createdAt: new Date(),
                status: "pending",
            },
        ],
    };
    return <Invitations invitations={invitation} />;
}

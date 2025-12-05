import { MessageSquare, Users } from "lucide-react";

export default function UsersHomePage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8 text-center animate-in fade-in duration-500">
            <div className="relative mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <MessageSquare className="w-6 h-6 text-indigo-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select a friend to chat
            </h2>
            <p className="text-gray-500 max-w-sm">
                Choose a friend from the sidebar to start a private conversation
                or manage your pending invitations.
            </p>
        </div>
    );
}

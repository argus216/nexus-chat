import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="grid grid-cols-[auto_1fr] h-screen bg-gray-50">
                <Sidebar />
                {children}
            </div>
        </SessionProvider>
    );
}

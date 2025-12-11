import SessionProvider from "@/components/SessionProvider";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="md:grid md:grid-cols-[auto_1fr] flex flex-col h-screen bg-gray-50">
                <Sidebar />
                {children}
            </div>
        </SessionProvider>
    );
}

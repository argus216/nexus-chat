import { Sparkles } from "lucide-react";

export default function Authlayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex bg-gray-50">
            <div className="hidden lg:flex w-1/2 bg-linear-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl" />
                    <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Nexus Chat
                        </h1>
                    </div>

                    <h2 className="text-3xl font-semibold mb-6 leading-tight text-blue-100">
                        Connect seamlessly.
                        <br />
                        Experience intelligence.
                    </h2>

                    <p className="text-lg text-blue-200/80 mb-10 leading-relaxed">
                        Join the next generation of communication. Nexus
                        combines real-time messaging with advanced AI
                        capabilities to enhance your daily interactions.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="font-semibold text-white mb-1">
                                Real-time AI
                            </div>
                            <div className="text-sm text-blue-200/60">
                                Powered by Gemini 2.5
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="font-semibold text-white mb-1">
                                Secure Auth
                            </div>
                            <div className="text-sm text-blue-200/60">
                                Email & Mobile Support
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}

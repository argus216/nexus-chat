import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                    Nexus Chat
                </div>
                <div className="space-x-6"></div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                    Connect Beyond <br />
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
                        Boundaries
                    </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-10">
                    Experience seamless communication with Nexus Chat. Real-time
                    messaging, secure groups, and a community-driven platform
                    designed for the modern web.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/login"
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-xl"
                    >
                        Get Started
                    </Link>
                    <a
                        href="https://github.com/yourusername/nexus-chat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        GitHub
                    </a>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Real-time Chat
                        </h3>
                        <p className="text-gray-400">
                            Instant messaging with friends and groups. Never
                            miss a moment with live updates.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Groups & Communities
                        </h3>
                        <p className="text-gray-400">
                            Create public or private groups. Manage members and
                            build your community.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition">
                        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-400">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Secure & Private
                        </h3>
                        <p className="text-gray-400">
                            Your data is safe with us. Built with modern
                            security standards and best practices.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 mt-20 py-10">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-sm mb-4 md:mb-0">
                        © 2024 Nexus Chat. All rights reserved.
                    </div>
                    <div className="flex space-x-6 text-gray-400">
                        <a href="#" className="hover:text-white transition">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition">
                            Terms of Service
                        </a>
                        <a
                            href="mailto:developer@example.com"
                            className="hover:text-white transition"
                        >
                            Contact Developer
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

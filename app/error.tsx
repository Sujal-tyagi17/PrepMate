"use client";

import Link from "next/link";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0a0514] flex items-center justify-center p-6">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-red-600/8 blur-[140px]" />
            </div>
            <div className="relative z-10 max-w-md w-full text-center">
                <div className="rounded-3xl border border-white/8 bg-white/3 p-10">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        An unexpected error occurred. Don&apos;t worry — your progress is safe.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-gray-600 mb-5 font-mono bg-white/3 px-3 py-1.5 rounded-lg border border-white/5">
                            Error ID: {error.digest}
                        </p>
                    )}
                    <div className="flex flex-col gap-3">
                        <button onClick={reset}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:scale-[1.01] transition-all">
                            <RefreshCcw className="w-4 h-4" /> Try Again
                        </button>
                        <Link href="/dashboard"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/8 hover:text-white text-sm font-medium transition-all">
                            <Home className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

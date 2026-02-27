"use client";

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Listen for Clerk authentication events
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if click is on sign-in button
            if (target.closest('button[type="submit"]') || target.closest('.cl-formButtonPrimary')) {
                setIsLoading(true);
                // Reset after 5 seconds as fallback
                setTimeout(() => setIsLoading(false), 5000);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-600/8 blur-[120px]" />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1425] border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                        <div className="text-center">
                            <p className="text-white font-medium mb-1">Signing you in...</p>
                            <p className="text-sm text-gray-400">Please wait a moment</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                <SignIn 
                    appearance={{
                        elements: {
                            formButtonPrimary: 
                                "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02]",
                            card: "bg-[#0f0a1a] border border-white/10 shadow-2xl",
                            headerTitle: "text-white",
                            headerSubtitle: "text-gray-400",
                            socialButtonsBlockButton: 
                                "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all",
                            formFieldInput: 
                                "bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20",
                            formFieldLabel: "text-gray-300",
                            footerActionLink: "text-purple-400 hover:text-purple-300",
                            identityPreviewText: "text-gray-300",
                            formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-200",
                            dividerLine: "bg-white/10",
                            dividerText: "text-gray-500",
                            otpCodeFieldInput: "bg-white/5 border border-white/10 text-white",
                        },
                    }}
                />
            </div>
        </main>
    );
}

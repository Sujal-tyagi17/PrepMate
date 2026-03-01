"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();
    const autoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Hide whenever the route actually changes (new page mounted)
    useEffect(() => {
        if (autoHideRef.current) clearTimeout(autoHideRef.current);
        setVisible(false);
    }, [pathname]);

    useEffect(() => {
        const show = () => {
            setVisible(true);
            if (autoHideRef.current) clearTimeout(autoHideRef.current);
            // Safety: auto-hide after 4s if route change event never fires
            autoHideRef.current = setTimeout(() => setVisible(false), 4000);
        };

        window.addEventListener("pm:navstart", show as EventListener);

        return () => {
            window.removeEventListener("pm:navstart", show as EventListener);
            if (autoHideRef.current) clearTimeout(autoHideRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="page-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{
                        background: "rgba(10, 5, 20, 0.88)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                    }}
                >
                    {/* Top progress bar */}
                    <motion.div
                        className="fixed top-0 left-0 h-[3px]"
                        style={{
                            background: "linear-gradient(to right, #7c3aed, #a855f7, #ec4899)",
                            boxShadow: "0 0 12px rgba(168,85,247,0.7)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: "88%" }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    />

                    {/* Spinner */}
                    <div className="relative flex items-center justify-center mb-6">
                        <motion.div
                            className="w-16 h-16 rounded-full border-[3px] border-transparent"
                            style={{ borderTopColor: "#a855f7", borderRightColor: "#ec4899" }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Logo center */}
                        <div className="absolute w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">
                        Loading
                        <motion.span
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        >
                            ...
                        </motion.span>
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

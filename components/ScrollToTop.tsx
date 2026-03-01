"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const reduce = useReducedMotion();

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    key="scrolltop"
                    onClick={scrollTop}
                    initial={{ opacity: 0, scale: 0.7, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 16 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(139,92,246,0.55)" }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Scroll to top"
                    className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30"
                    style={{
                        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    }}
                >
                    <ArrowUp className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

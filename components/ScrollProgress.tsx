"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    const reduce = useReducedMotion();

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);

    if (reduce) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent pointer-events-none">
            <motion.div
                className="h-full origin-left"
                style={{
                    scaleX: progress / 100,
                    background: "linear-gradient(to right, #7c3aed, #a855f7, #ec4899, #06b6d4)",
                }}
                transition={{ duration: 0 }}
            />
        </div>
    );
}

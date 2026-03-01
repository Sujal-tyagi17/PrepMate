"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { isSignedIn } = useAuth();
    const router = useRouter();

    // Single scroll listener: shadow + active section via position
    useEffect(() => {
        const NAVBAR_HEIGHT = 80;

        const onScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 10);

            // Too close to top — nothing active
            if (scrollY < 200) {
                setActiveSection("");
                return;
            }

            // Near bottom (footer) — nothing active
            const nearBottom =
                window.innerHeight + scrollY >= document.body.scrollHeight - 100;
            if (nearBottom) {
                setActiveSection("");
                return;
            }

            // Find which section the viewport is currently inside
            // A section is "active" when its top has passed the navbar and
            // its bottom hasn't passed the middle of the viewport yet.
            const viewportMid = scrollY + window.innerHeight / 2;
            let current = "";
            NAV_LINKS.forEach(({ href }) => {
                const id = href.replace("#", "");
                const el = document.getElementById(id);
                if (!el) return;
                const top = el.offsetTop - NAVBAR_HEIGHT - 20;
                const bottom = top + el.offsetHeight;
                if (viewportMid >= top && viewportMid < bottom) {
                    current = id;
                }
            });
            setActiveSection(current);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // run once on mount
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close drawer on resize to desktop
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const scrollTo = (href: string) => {
        setMobileOpen(false);
        const id = href.replace("#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleStart = () => {
        setMobileOpen(false);
        window.dispatchEvent(new CustomEvent("pm:navstart"));
        router.push(isSignedIn ? "/interview/new" : "/sign-up");
    };

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: "rgba(10, 14, 39, 0.8)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderBottom: "1px solid rgba(168, 85, 247, 0.2)",
                    boxShadow: scrolled
                        ? "0 4px 32px rgba(168, 85, 247, 0.12), 0 1px 0 rgba(168,85,247,0.1)"
                        : "none",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
                            >
                                <Sparkles className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                PrepMate
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-1 text-sm">
                            {NAV_LINKS.map(({ label, href }) => {
                                const id = href.replace("#", "");
                                const isActive = activeSection === id;
                                return (
                                    <button
                                        key={href}
                                        onClick={() => scrollTo(href)}
                                        className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group"
                                    >
                                        <motion.span
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                            className={
                                                isActive
                                                    ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                                    : "text-gray-300 group-hover:text-white"
                                            }
                                        >
                                            {label}
                                        </motion.span>

                                        {/* Active underline */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="activeUnderline"
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                            />
                                        )}

                                        {/* Hover underline (slides from center) */}
                                        {!isActive && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-purple-400/60 to-fuchsia-400/60 rounded-full w-0 group-hover:w-4/5 transition-all duration-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => { window.dispatchEvent(new CustomEvent("pm:navstart")); router.push("/sign-in"); }}
                                className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                            >
                                Login
                            </button>
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                className="relative text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 overflow-hidden"
                            >
                                {/* Glow pulse */}
                                <motion.span
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/40 to-fuchsia-500/40 blur-sm"
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <span className="relative z-10">Start Free</span>
                            </motion.button>
                        </div>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen((o) => !o)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={mobileOpen ? "x" : "menu"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
                            style={{
                                background: "rgba(10, 14, 39, 0.97)",
                                backdropFilter: "blur(24px)",
                                borderLeft: "1px solid rgba(168, 85, 247, 0.2)",
                            }}
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-6 h-20 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold text-white">PrepMate</span>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer links */}
                            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                                {NAV_LINKS.map(({ label, href }, i) => {
                                    const id = href.replace("#", "");
                                    const isActive = activeSection === id;
                                    return (
                                        <motion.button
                                            key={href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => scrollTo(href)}
                                            className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            {label}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Drawer footer */}
                            <div className="px-4 pb-8 space-y-3 border-t border-white/5 pt-4">
                                <button
                                    onClick={() => { setMobileOpen(false); window.dispatchEvent(new CustomEvent("pm:navstart")); router.push("/sign-in"); }}
                                    className="block w-full text-center text-sm font-medium text-gray-300 hover:text-white px-4 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleStart}
                                    className="w-full text-sm font-semibold px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30 hover:from-purple-500 hover:to-fuchsia-500 transition-all"
                                >
                                    Start Free
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

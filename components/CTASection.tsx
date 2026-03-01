"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Check, Sparkles, Zap, Shield } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/* ─── Scroll hook ────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/* ─── Floating particle ──────────────────────────────────────── */
interface Particle { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number; color: string }

function Particle({ p }: { p: Particle }) {
    const reduce = useReducedMotion();
    if (reduce) return null;
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size,
                background: p.color, filter: "blur(1px)",
            }}
            animate={{ y: [0, -30, 0], opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
    );
}

const TRUST = [
    { icon: Check, label: "No credit card required" },
    { icon: Shield, label: "Free forever" },
    { icon: Zap, label: "Practice unlimited" },
];

/* ──────────────────────────────────────────────────────────────── */
export default function CTASection() {
    const { ref, inView } = useInView(0.15);
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const reduce = useReducedMotion();

    /* Generate particles once */
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 28 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1.5,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 4,
            opacity: Math.random() * 0.45 + 0.15,
            color: ["#a855f7", "#ec4899", "#06b6d4", "#8b5cf6", "#f472b6"][Math.floor(Math.random() * 5)],
        }))
    );

    const handleStart = () => router.push(isSignedIn ? "/dashboard" : "/sign-up");
    const handleDemo  = () => router.push(isSignedIn ? "/interview/new" : "/sign-in");

    return (
        <section className="relative py-28 px-6 overflow-hidden bg-[#0a0514]">

            {/* ── Ambient background blobs ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Large purple blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.18]"
                    style={{ background: "radial-gradient(ellipse, #7c3aed, transparent 70%)", filter: "blur(80px)" }} />
                {/* Pink accent */}
                <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full opacity-[0.12]"
                    style={{ background: "radial-gradient(ellipse, #ec4899, transparent 70%)", filter: "blur(60px)" }} />
                {/* Cyan accent */}
                <div className="absolute bottom-0 left-0 w-[350px] h-[250px] rounded-full opacity-[0.10]"
                    style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 70%)", filter: "blur(60px)" }} />
            </div>

            {/* ── Floating particles ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map(p => <Particle key={p.id} p={p} />)}
            </div>

            {/* ── Card ── */}
            <div ref={ref} className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.06), rgba(6,182,212,0.05))" }}
                >
                    {/* Gradient border via pseudo-element trick with inset box-shadow */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{ boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.25), inset 0 0 0 1px rgba(236,72,153,0.1)" }} />

                    {/* Animated shimmer top border */}
                    <div className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: "linear-gradient(to right, transparent 0%, rgba(139,92,246,0.8) 25%, rgba(236,72,153,0.6) 50%, rgba(6,182,212,0.6) 75%, transparent 100%)" }} />
                    {!reduce && (
                        <motion.div
                            className="absolute top-0 left-0 h-px w-24 rounded-full"
                            style={{ background: "linear-gradient(to right, transparent, white, transparent)" }}
                            animate={{ x: ["-100px", "110vw"] }}
                            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4 }}
                        />
                    )}

                    {/* Inner content */}
                    <div className="relative px-8 py-16 sm:px-16 text-center backdrop-blur-sm">

                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: reduce ? 0 : 0.55, delay: 0.18 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6"
                        >
                            Ready to Ace Your{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                    Next Interview?
                                </span>
                                {/* Underline swoosh */}
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                                    <motion.path
                                        d="M2 9 Q75 2, 150 7 Q225 12, 298 5"
                                        stroke="url(#cta-underline)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={inView ? { pathLength: 1 } : {}}
                                        transition={{ duration: reduce ? 0 : 0.9, delay: 0.6, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="cta-underline" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#a855f7" />
                                            <stop offset="50%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </motion.h2>

                        {/* Sub-headline */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: reduce ? 0 : 0.5, delay: 0.28 }}
                            className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto mb-12"
                        >
                            Built by a student, for students.{" "}
                            <span className="text-gray-200">PrepMate helps you practice interviews</span>{" "}
                            anytime, anywhere.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: reduce ? 0 : 0.5, delay: 0.38 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                        >
                            {/* Primary */}
                            <div className="relative group">
                                {/* Pulse ring */}
                                {!reduce && (
                                    <>
                                        <motion.span
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                                            animate={{ scale: [1, 1.12], opacity: [0.35, 0] }}
                                            transition={{ duration: 1.4, repeat: Infinity }}
                                            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", borderRadius: "1rem" }}
                                        />
                                    </>
                                )}
                                <motion.button
                                    onClick={handleStart}
                                    whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(139,92,246,0.55)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="relative flex items-center gap-3 px-9 py-4 rounded-2xl text-base font-bold text-white"
                                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%)", boxShadow: "0 0 20px rgba(139,92,246,0.35)" }}
                                >
                                    <Sparkles className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                                    Start Free Practice
                                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                </motion.button>
                            </div>

                            {/* Secondary */}
                            <motion.button
                                onClick={handleDemo}
                                whileHover={{ scale: 1.04, borderColor: "rgba(139,92,246,0.6)", color: "#e2e8f0" }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 px-9 py-4 rounded-2xl text-base font-semibold text-gray-400 border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-200"
                            >
                                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                </div>
                                Watch Demo
                            </motion.button>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: reduce ? 0 : 0.5, delay: 0.52 }}
                            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
                        >
                            {TRUST.map((t, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <t.icon className="w-2.5 h-2.5 text-emerald-400" strokeWidth={2.5} />
                                    </span>
                                    {t.label}
                                    {i < TRUST.length - 1 && (
                                        <span className="ml-4 text-gray-700 hidden sm:inline">•</span>
                                    )}
                                </span>
                            ))}
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}

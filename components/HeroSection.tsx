"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react"; // Sparkles used in MockupCard

/* ─── Particles ─────────────────────────────────────────────── */
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    delay: number;
    duration: number;
}

const PARTICLE_COLORS = ["#A855F7", "#FF0080", "#00D9FF", "#C084FC", "#F472B6"];

function generateParticles(count: number): Particle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 2,          // 2-4 px
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        opacity: Math.random() * 0.4 + 0.3,   // 0.3-0.7
        delay: Math.random() * 5,
        duration: Math.random() * 8 + 10,     // 10-18 s
    }));
}

/* ─── 3D Mockup ──────────────────────────────────────────────── */
function MockupCard() {
    const shouldReduce = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
            className="relative max-w-4xl mx-auto mt-16 w-full"
            style={{ perspective: "1400px" }}
        >
            {/* Glow beneath */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/25 via-pink-500/15 to-cyan-500/15 blur-3xl rounded-3xl" />

            {/* Tilt wrapper */}
            <motion.div
                animate={shouldReduce ? {} : { rotateX: [-8, -6, -8], rotateY: [3, 5, 3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                whileHover={shouldReduce ? {} : { rotateX: -4, rotateY: 6, scale: 1.01 }}
                style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.85), 0 0 60px rgba(168,85,247,0.12)",
                }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#100820]"
            >
                {/* ── Top bar ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                        </div>
                        <span className="text-xs text-gray-500">Technical Interview · Google L4</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            24:16
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">Live</span>
                    </div>
                </div>

                {/* ── Main content ── */}
                <div className="flex bg-[#0d0a1e]">

                    {/* Sidebar */}
                    <div className="w-56 flex-shrink-0 border-r border-white/5 p-5 space-y-5">
                        <div className="text-[10px] font-semibold text-gray-500 tracking-widest">PERFORMANCE</div>

                        {/* Circular scores */}
                        <div className="flex items-center justify-around">
                            {/* 8.2 avg */}
                            <div className="relative">
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6"/>
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#g1)" strokeWidth="6"
                                        strokeDasharray="201" strokeDashoffset="41" strokeLinecap="round"/>
                                    <defs>
                                        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#7c3aed"/>
                                            <stop offset="100%" stopColor="#db2777"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold leading-none">8.2</span>
                                    <span className="text-[9px] text-gray-600 mt-0.5">avg</span>
                                </div>
                            </div>
                            {/* 9.4 latest */}
                            <div className="relative">
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(236,72,153,0.15)" strokeWidth="6"/>
                                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#g2)" strokeWidth="6"
                                        strokeDasharray="201" strokeDashoffset="20" strokeLinecap="round"/>
                                    <defs>
                                        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ec4899"/>
                                            <stop offset="100%" stopColor="#f43f5e"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold leading-none">9.4</span>
                                    <span className="text-[9px] text-gray-600 mt-0.5">latest</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress bars */}
                        <div className="space-y-3 text-xs">
                            {[
                                { label: "Clarity", pct: 92 },
                                { label: "Structure", pct: 85 },
                                { label: "Technical", pct: 88 },
                            ].map(({ label, pct }) => (
                                <div key={label}>
                                    <div className="flex justify-between mb-1.5 text-gray-500">
                                        <span>{label}</span>
                                        <span className="text-white font-medium">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col min-h-[380px]">
                        <div className="flex-1 p-6 space-y-4 overflow-hidden">
                            {/* AI message */}
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] text-gray-600 mb-1 font-medium">AI Interviewer</div>
                                    <div className="bg-[#1a1030] border border-purple-500/15 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-300 leading-relaxed">
                                        Great answer! Your approach to debugging the distributed cache issue was methodical. Can you elaborate on how you identified the root cause?
                                    </div>
                                </div>
                            </div>

                            {/* User message */}
                            <div className="flex gap-3 items-start flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-sm text-gray-400 font-medium">
                                    U
                                </div>
                                <div className="flex-1 flex flex-col items-end">
                                    <div className="text-[10px] text-gray-600 mb-1 font-medium">You</div>
                                    <div className="bg-[#16112a] border border-white/8 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-300 leading-relaxed max-w-sm">
                                        I started by analyzing the logs and metrics. The latency spike correlated with a deployment...
                                    </div>
                                </div>
                            </div>

                            {/* Typing dots */}
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-[#1a1030] border border-purple-500/15 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                                    {[0, 0.15, 0.3].map((d, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2.5 h-2.5 rounded-full bg-purple-400"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.7, repeat: Infinity, delay: d, ease: "easeInOut" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Input row */}
                        <div className="border-t border-white/5 px-6 py-4 flex items-center gap-3 bg-[#0d0a1e]">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-500">
                                Type your answer...
                            </div>
                            {/* Feedback chip */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl px-4 py-2.5 shadow-lg shadow-purple-500/30 whitespace-nowrap">
                                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-xs font-semibold">&quot;Your tone is very professional and confident!&quot;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Main HeroSection ───────────────────────────────────────── */
const HEADLINE_WORDS = ["Ace", "Every", "Interview"];
const HEADLINE2_WORDS = ["with", "Your"];

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const shouldReduce = useReducedMotion();

    useEffect(() => {
        setMounted(true);
        setParticles(generateParticles(25));
    }, []);

    const handleStartPractice = () => {
        router.push(isSignedIn ? "/interview/new" : "/sign-up");
    };

    const handleWatchDemo = () => {
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-x-hidden pt-32 pb-48">

            {/* ── Animated gradient mesh background ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Base blobs */}
                <motion.div
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full opacity-30"
                    style={{ background: "radial-gradient(ellipse, #A855F7 0%, transparent 70%)", filter: "blur(80px)" }}
                    animate={shouldReduce ? {} : { scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
                    style={{ background: "radial-gradient(ellipse, #FF0080 0%, transparent 70%)", filter: "blur(80px)" }}
                    animate={shouldReduce ? {} : { x: [0, 40, 0], y: [0, -20, 0], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{ background: "radial-gradient(ellipse, #00D9FF 0%, transparent 70%)", filter: "blur(80px)" }}
                    animate={shouldReduce ? {} : { x: [0, -30, 0], y: [0, 20, 0], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Particles */}
                {mounted && !shouldReduce && particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                        }}
                        animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 0.5, p.opacity] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-5xl mx-auto w-full text-center">

                {/* Headline — word by word stagger */}
                <div className="mb-6">
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
                        {/* Line 1 */}
                        <span className="block">
                            {HEADLINE_WORDS.map((word, i) => (
                                <motion.span
                                    key={word}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: "easeOut" }}
                                    className="inline-block mr-[0.25em]"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </span>

                        {/* Line 2 */}
                        <span className="block">
                            {HEADLINE2_WORDS.map((word, i) => (
                                <motion.span
                                    key={word}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                                    className="inline-block mr-[0.25em]"
                                >
                                    {word}
                                </motion.span>
                            ))}{" "}
                            {/* "AI Partner" with animated gradient */}
                            <motion.span
                                initial={{ opacity: 0, y: 24 }}
                                animate={mounted ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
                                className="inline-block"
                            >
                                <motion.span
                                    className="bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: "linear-gradient(to right, #C084FC, #FF0080, #00D9FF, #A855F7)",
                                        backgroundSize: "200% auto",
                                    }}
                                    animate={shouldReduce ? {} : { backgroundPosition: ["0% center", "200% center", "0% center"] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                >
                                    AI Partner
                                </motion.span>
                            </motion.span>
                        </span>
                    </h1>
                </div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Unlock your career potential with real-time AI coaching, personalized mock
                    interviews, and actionable feedback that helps you stand out.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.95, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {/* Primary */}
                    <motion.button
                        onClick={handleStartPractice}
                        whileHover={shouldReduce ? {} : { scale: 1.05 }}
                        whileTap={shouldReduce ? {} : { scale: 0.97 }}
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #9333ea, #ec4899)",
                            boxShadow: "0 0 20px rgba(168,85,247,0.35), 0 4px 20px rgba(236,72,153,0.2)",
                        }}
                    >
                        {/* Pulse ring */}
                        <motion.span
                            className="absolute inset-0 rounded-xl"
                            animate={shouldReduce ? {} : { boxShadow: ["0 0 0px rgba(168,85,247,0.5)", "0 0 18px rgba(168,85,247,0.0)"] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                        />
                        <span className="relative z-10">Start Free Practice</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>

                    {/* Secondary */}
                    <motion.button
                        onClick={handleWatchDemo}
                        whileHover={shouldReduce ? {} : { scale: 1.04, boxShadow: "0 0 20px rgba(255,255,255,0.06)" }}
                        whileTap={shouldReduce ? {} : { scale: 0.97 }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm font-medium text-white hover:bg-white/10 transition-colors duration-200"
                    >
                        <Play className="w-5 h-5" />
                        Watch Demo
                    </motion.button>
                </motion.div>

            </div>

            {/* ── 3D Mockup ── */}
            {mounted && <MockupCard />}
        </section>
    );
}

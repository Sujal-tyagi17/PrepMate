"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Crosshair, MessageSquare, BarChart3, ArrowRight, Sparkles, CheckCircle2, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

/* ─── useInView hook ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/* ═══════════════════════════════════════════════════════════════
   MOCKUP PANELS
═══════════════════════════════════════════════════════════════ */

function SetupMockup({ active }: { active: boolean }) {
    const types = ["Technical", "Behavioral", "System Design"];
    const diffs = ["Easy", "Medium", "Hard"];
    const companies = [
        { name: "Google", color: "from-blue-500 to-cyan-400" },
        { name: "Meta", color: "from-blue-600 to-indigo-500" },
        { name: "Amazon", color: "from-orange-500 to-amber-400" },
        { name: "Apple", color: "from-gray-400 to-gray-300" },
    ];

    return (
        <div className="rounded-2xl bg-[#0e0b1f] border border-white/8 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/5 bg-white/[0.015]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] text-gray-600 font-medium ml-1">Configure Interview</span>
            </div>
            <div className="p-5 space-y-5">
                <div>
                    <p className="text-[10px] text-gray-600 font-semibold mb-2.5 tracking-widest uppercase">Interview Type</p>
                    <div className="flex gap-2 flex-wrap">
                        {types.map((t, i) => (
                            <motion.div key={t}
                                initial={{ opacity: 0, y: 6 }}
                                animate={active ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-default select-none ${
                                    i === 0 ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow shadow-purple-500/20" : "bg-white/[0.03] border-white/8 text-gray-500"
                                }`}>
                                {i === 0 && <span className="mr-1.5">✓</span>}{t}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-600 font-semibold mb-2.5 tracking-widest uppercase">Difficulty</p>
                    <div className="flex gap-2">
                        {diffs.map((d, i) => (
                            <motion.div key={d}
                                initial={{ opacity: 0, y: 6 }}
                                animate={active ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.25 + i * 0.08, duration: 0.3 }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium border cursor-default select-none ${
                                    i === 1 ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow shadow-amber-500/20" : "bg-white/[0.03] border-white/8 text-gray-500"
                                }`}>
                                {d}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-600 font-semibold mb-2.5 tracking-widest uppercase">Target Company</p>
                    <div className="flex gap-2 flex-wrap">
                        {companies.map(({ name, color }, i) => (
                            <motion.div key={name}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={active ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.38 + i * 0.07, duration: 0.3, type: "spring", stiffness: 200 }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-default select-none ${
                                    i === 0 ? "bg-blue-500/15 border-blue-500/40 text-blue-300" : "bg-white/[0.03] border-white/8 text-gray-500"
                                }`}>
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${color} flex-shrink-0`} />
                                {name}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={active ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center gap-2 text-sm font-semibold cursor-default shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-4 h-4" />
                    Start Interview
                </motion.div>
            </div>
        </div>
    );
}

function PracticeMockup({ active }: { active: boolean }) {
    return (
        <div className="rounded-2xl bg-[#0e0b1f] border border-white/8 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.015]">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[11px] text-gray-600 font-medium">Technical Interview · Google L4</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <motion.div
                        animate={active ? { opacity: [1, 0.4, 1] } : {}}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Live
                    </motion.div>
                    <span className="text-[10px] text-gray-600">14:32</span>
                </div>
            </div>
            <div className="p-5 space-y-4">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={active ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15, duration: 0.4 }} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow shadow-purple-500/30">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-600 mb-1 font-medium">AI Interviewer</p>
                        <div className="bg-white/[0.04] border border-purple-500/15 rounded-2xl rounded-tl-sm px-4 py-3 text-[13px] text-gray-300 leading-relaxed max-w-xs">
                            Walk me through how you&apos;d design a rate limiter for a distributed API at Google scale.
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={active ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.35, duration: 0.4 }} className="flex gap-3 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">U</div>
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] text-gray-600 mb-1 font-medium">You</p>
                        <div className="bg-white/[0.03] border border-white/8 rounded-2xl rounded-tr-sm px-4 py-3 text-[13px] text-gray-300 leading-relaxed max-w-xs">
                            I&apos;d use a sliding window counter with Redis. Each service node increments a key...
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.55 }} className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/[0.04] border border-purple-500/15 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1.5 items-center">
                        {[0, 1, 2].map(i => (
                            <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
                        ))}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={active ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.72, duration: 0.4 }}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-purple-300 leading-relaxed">
                        <span className="font-semibold">AI Insight:</span> Good structure! Try adding failure scenarios and TTL considerations for stronger depth.
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}} transition={{ delay: 0.85 }}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.025] border border-white/8 rounded-xl">
                    <motion.div animate={active ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow shadow-fuchsia-500/30">
                        <Mic className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                    <div className="flex-1 flex items-center gap-0.5">
                        {Array.from({ length: 28 }).map((_, i) => (
                            <motion.div key={i} className="flex-1 rounded-full bg-fuchsia-400/50"
                                animate={active ? { scaleY: [0.2, Math.random() * 3 + 0.4, 0.2] } : {}}
                                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.03, ease: "easeInOut" }}
                                style={{ height: 16, transformOrigin: "center" }} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function AnalyticsMockup({ active }: { active: boolean }) {
    const sessions = [38, 52, 47, 63, 70, 65, 82, 79, 88, 94];
    const skills = [
        { label: "Communication", score: 91, color: "from-purple-500 to-fuchsia-500", delay: 0.3 },
        { label: "Technical Depth", score: 78, color: "from-cyan-500 to-blue-500", delay: 0.42 },
        { label: "Problem Solving", score: 85, color: "from-emerald-500 to-teal-500", delay: 0.54 },
        { label: "Confidence", score: 88, color: "from-orange-500 to-amber-500", delay: 0.66 },
    ];
    return (
        <div className="rounded-2xl bg-[#0e0b1f] border border-white/8 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.015]">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[11px] text-gray-600 font-medium">Performance Dashboard</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold">+34% this week</span>
            </div>
            <div className="p-5 space-y-5">
                <div>
                    <div className="flex items-baseline justify-between mb-3">
                        <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest">Score History</p>
                        <p className="text-[10px] text-gray-600">Last 10 sessions</p>
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                        {sessions.map((h, i) => (
                            <motion.div key={i}
                                style={{ height: `${h}%`, transformOrigin: "bottom", background: `linear-gradient(to top, ${i >= 7 ? "#7c3aed" : "#4c1d95"}, ${i >= 7 ? "#db2777" : "#6d28d9"})`, opacity: 0.4 + (i / sessions.length) * 0.6 } as React.CSSProperties}
                                className="flex-1 rounded-t"
                                initial={{ scaleY: 0 }}
                                animate={active ? { scaleY: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 + i * 0.055, ease: "easeOut" }} />
                        ))}
                    </div>
                </div>
                <div className="space-y-2.5">
                    {skills.map(({ label, score, color, delay }) => (
                        <div key={label}>
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-gray-500">{label}</span>
                                <span className="text-white font-semibold">{score}%</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                <motion.div className={`h-full rounded-full bg-gradient-to-r ${color}`}
                                    initial={{ width: 0 }}
                                    animate={active ? { width: `${score}%` } : {}}
                                    transition={{ duration: 0.8, delay, ease: "easeOut" }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    {[
                        { label: "Top 12%", sub: "vs peers", color: "text-purple-300 bg-purple-500/10 border-purple-500/20" },
                        { label: "8 sessions", sub: "this week", color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20" },
                        { label: "Ready", sub: "for L4+", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
                    ].map(({ label, sub, color }) => (
                        <div key={label} className={`flex-1 rounded-xl p-2.5 border text-center ${color}`}>
                            <p className="text-xs font-bold">{label}</p>
                            <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   STEP DATA
═══════════════════════════════════════════════════════════════ */
const STEPS = [
    {
        num: "01",
        icon: Crosshair,
        title: "Choose Your Interview",
        desc: "Select your interview type, difficulty, and target company. PrepMate tailors every question to your exact goals in seconds.",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
        glowColor: "#7c3aed",
        tag: "Setup — 30 seconds",
        Panel: SetupMockup,
        checks: ["10+ interview categories", "FAANG & startup question banks", "Adjustable difficulty"],
    },
    {
        num: "02",
        icon: MessageSquare,
        title: "Practice with AI",
        desc: "Answer real questions, get instant AI feedback on clarity, depth, and delivery. Our AI coaches you live — like a senior interviewer in your corner.",
        gradient: "from-pink-500 via-fuchsia-500 to-rose-500",
        glowColor: "#ec4899",
        tag: "Interview — Real-time",
        Panel: PracticeMockup,
        checks: ["Real-time AI coaching", "Voice & text answers", "Instant follow-up questions"],
    },
    {
        num: "03",
        icon: BarChart3,
        title: "Track & Improve",
        desc: "See exactly where you stand. Review detailed breakdowns per skill, watch your scores trend up, and know what to practise next.",
        gradient: "from-cyan-500 via-blue-500 to-violet-500",
        glowColor: "#06b6d4",
        tag: "Analytics — Actionable",
        Panel: AnalyticsMockup,
        checks: ["Skill-by-skill breakdown", "Session history & trends", "Personalised improvement plan"],
    },
] as const;

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function HowItWorksSection() {
    const { ref: headerRef, inView: headerInView } = useInView(0.2);
    const s0 = useInView(0.12);
    const s1 = useInView(0.12);
    const s2 = useInView(0.12);
    const stepRefs = [s0, s1, s2];
    const shouldReduce = useReducedMotion();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    return (
        <section id="how-it-works" className="relative py-28 px-6 overflow-hidden">

            {/* ── Background ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(139,92,246,0.35), transparent)" }} />
                <div className="absolute inset-x-0 bottom-0 h-px"
                    style={{ background: "linear-gradient(to right, transparent, rgba(6,182,212,0.25), transparent)" }} />
                <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
                    style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(ellipse, #06b6d4 0%, transparent 70%)", filter: "blur(80px)" }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* ── Header ── */}
                <div ref={headerRef} className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/8 text-xs font-semibold text-purple-300 tracking-widest uppercase mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        How It Works
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 22 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5"
                    >
                        <span className="text-white">Interview-ready in</span>
                        <br />
                        <span className="bg-clip-text text-transparent"
                            style={{ backgroundImage: "linear-gradient(to right, #C084FC, #FF0080, #00D9FF)" }}>
                            3 simple steps
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base text-gray-400 max-w-md mx-auto"
                    >
                        From setup to offer — PrepMate guides you every step of the way.
                    </motion.p>
                </div>

                {/* ── Step cards ── */}
                <div className="space-y-6">
                    {STEPS.map((step, i) => {
                        const { ref, inView } = stepRefs[i];
                        const Panel = step.Panel;
                        const Icon = step.icon;

                        return (
                            <div key={step.num} ref={ref}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.65, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="group relative rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm"
                                    style={{ boxShadow: inView ? `0 0 80px -20px ${step.glowColor}30` : "none", transition: "box-shadow 1s ease" }}
                                >
                                    {/* Inner glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{ background: `radial-gradient(ellipse at 30% 50%, ${step.glowColor}10, transparent 65%)` }} />

                                    {/* Top accent line */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={inView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                        className="absolute top-0 inset-x-0 h-px origin-left"
                                        style={{ background: `linear-gradient(to right, ${step.glowColor}, transparent)` }}
                                    />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                        {/* Text */}
                                        <div className="flex flex-col justify-center p-8 lg:p-12">
                                            <motion.div
                                                initial={{ opacity: 0, x: -16 }}
                                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                                className="inline-flex items-center gap-2 mb-6 w-fit"
                                            >
                                                <span className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border"
                                                    style={{ color: step.glowColor, borderColor: `${step.glowColor}40`, background: `${step.glowColor}10` }}>
                                                    {step.tag}
                                                </span>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.4, delay: 0.28 }}
                                                className="flex items-center gap-4 mb-5"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={inView ? { scale: 1, rotate: 0 } : {}}
                                                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.34 }}
                                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl flex-shrink-0`}
                                                    style={{ boxShadow: `0 8px 32px ${step.glowColor}40` }}
                                                >
                                                    <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
                                                </motion.div>
                                                <span className="text-7xl font-black leading-none select-none"
                                                    style={{ color: "transparent", WebkitTextStroke: `2px ${step.glowColor}CC` } as React.CSSProperties}>
                                                    {step.num}
                                                </span>
                                            </motion.div>

                                            <motion.h3
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.45, delay: 0.38 }}
                                                className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight"
                                            >
                                                {step.title}
                                            </motion.h3>

                                            <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.45, delay: 0.44 }}
                                                className="text-gray-400 leading-relaxed mb-7 text-[15px]"
                                            >
                                                {step.desc}
                                            </motion.p>

                                            <div className="space-y-2.5">
                                                {step.checks.map((c, ci) => (
                                                    <motion.div key={c}
                                                        initial={{ opacity: 0, x: -12 }}
                                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                                        transition={{ duration: 0.35, delay: 0.54 + ci * 0.09 }}
                                                        className="flex items-center gap-2.5 text-sm text-gray-400"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: step.glowColor }} />
                                                        {c}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mockup */}
                                        <div className="relative flex items-center justify-center p-6 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/[0.05]"
                                            style={{ background: `radial-gradient(ellipse at 60% 40%, ${step.glowColor}08, transparent 70%)` }}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                                                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                                                transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                                                style={{ width: "100%", maxWidth: 420 }}
                                            >
                                                <motion.div
                                                    animate={shouldReduce ? {} : { y: [0, -6, 0] }}
                                                    transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                                                    whileHover={shouldReduce ? {} : { scale: 1.02 }}
                                                    style={{ filter: `drop-shadow(0 20px 40px ${step.glowColor}30)` }}
                                                >
                                                    <Panel active={inView} />
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Connector */}
                                {i < STEPS.length - 1 && (
                                    <div className="flex justify-center my-2">
                                        <motion.div
                                            initial={{ scaleY: 0, opacity: 0 }}
                                            animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                                            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                                            className="origin-top w-px h-6"
                                            style={{ background: `linear-gradient(to bottom, ${step.glowColor}60, ${STEPS[i + 1].glowColor}60)` }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

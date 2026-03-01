"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    Brain,
    TrendingUp,
    Building2,
    Clock,
    Layers,
    ShieldCheck,
} from "lucide-react";

/* ─── Feature data ───────────────────────────────────────────── */
const FEATURES = [
    {
        icon: Brain,
        title: "Real-Time AI Coaching",
        description:
            "Get instant, personalized feedback on every answer with advanced AI analysis that pinpoints exactly where you can improve.",
        gradient: "from-purple-500 to-fuchsia-600",
        glow: "rgba(168,85,247,0.18)",
        border: "rgba(168,85,247,0.3)",
        iconBg: "from-purple-500/20 to-fuchsia-600/10",
    },
    {
        icon: TrendingUp,
        title: "Detailed Analytics",
        description:
            "Monitor your improvement with comprehensive performance tracking, score trends, and actionable insights across every session.",
        gradient: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.18)",
        border: "rgba(236,72,153,0.3)",
        iconBg: "from-pink-500/20 to-rose-600/10",
    },
    {
        icon: Building2,
        title: "Prepare for Top Companies",
        description:
            "Practice with questions tailored to FAANG, startups, and your target companies so nothing surprises you on interview day.",
        gradient: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.18)",
        border: "rgba(6,182,212,0.3)",
        iconBg: "from-cyan-500/20 to-blue-600/10",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description:
            "No scheduling needed. Start practicing instantly, whenever you're ready — at midnight, on the weekend, or right before an interview.",
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.18)",
        border: "rgba(16,185,129,0.3)",
        iconBg: "from-emerald-500/20 to-teal-600/10",
    },
    {
        icon: Layers,
        title: "Technical & Behavioral",
        description:
            "Master every interview format — coding challenges, system design, behavioral questions, case studies, and more.",
        gradient: "from-orange-500 to-amber-600",
        glow: "rgba(249,115,22,0.18)",
        border: "rgba(249,115,22,0.3)",
        iconBg: "from-orange-500/20 to-amber-600/10",
    },
    {
        icon: ShieldCheck,
        title: "Your Data is Safe",
        description:
            "End-to-end encryption on every session. Your practice recordings and responses stay completely private, always.",
        gradient: "from-violet-500 to-purple-700",
        glow: "rgba(139,92,246,0.18)",
        border: "rgba(139,92,246,0.3)",
        iconBg: "from-violet-500/20 to-purple-700/10",
    },
] as const;

/* ─── Hook: intersection observer ───────────────────────────── */
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return { ref, inView };
}

/* ─── Individual feature card ────────────────────────────────── */
function FeatureCard({
    feature,
    index,
    inView,
}: {
    feature: (typeof FEATURES)[number];
    index: number;
    inView: boolean;
}) {
    const shouldReduce = useReducedMotion();
    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.55,
                delay: inView ? index * 0.1 : 0,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={
                shouldReduce
                    ? {}
                    : {
                          y: -8,
                          scale: 1.03,
                          rotateX: 2,
                          rotateY: -2,
                          boxShadow: `0 24px 60px -12px ${feature.glow}, 0 0 0 1px ${feature.border}`,
                      }
            }
            transition-hover={{ duration: 0.25 }}
            style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 4px 24px -8px rgba(0,0,0,0.4)",
            }}
            className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] p-8 cursor-default overflow-hidden"
        >
            {/* Gradient border overlay on hover */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${feature.glow} 0%, transparent 60%)`,
                }}
            />

            {/* Subtle grid texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Corner accent */}
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-tr-2xl"
                style={{
                    background: `radial-gradient(circle at top right, ${feature.glow}, transparent 70%)`,
                }}
            />

            <div className="relative z-10">
                {/* Icon */}
                <motion.div
                    animate={
                        shouldReduce
                            ? {}
                            : { y: [0, -4, 0] }
                    }
                    transition={{
                        duration: 3 + index * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                    }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.iconBg} border border-white/10 flex items-center justify-center mb-6`}
                >
                    <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 4px 16px ${feature.glow}` }}
                    >
                        <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                    </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 leading-snug">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                </p>

                {/* Bottom gradient line — appears on hover */}
                <div
                    className={`mt-6 h-px w-0 group-hover:w-full transition-all duration-500 ease-out bg-gradient-to-r ${feature.gradient} opacity-40`}
                />
            </div>
        </motion.div>
    );
}

/* ─── Main FeaturesSection ───────────────────────────────────── */
export default function FeaturesSection() {
    const { ref, inView } = useInView(0.1);
    const shouldReduce = useReducedMotion();

    return (
        <section
            id="features"
            className="relative py-28 px-6 overflow-hidden"
        >
            {/* Background glow blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.06]"
                    style={{
                        background:
                            "radial-gradient(ellipse, #A855F7 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
                    style={{
                        background:
                            "radial-gradient(ellipse, #06B6D4 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ── Section header ── */}
                <div className="text-center mb-20" ref={ref}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/8 text-xs font-semibold text-purple-300 tracking-widest uppercase mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        Why PrepMate
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5"
                    >
                        <span className="text-white">Everything you need to</span>
                        <br />
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, #C084FC, #FF0080, #00D9FF)",
                            }}
                        >
                            ace your interviews
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
                        className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed"
                    >
                        PrepMate combines cutting-edge AI with proven interview strategies
                        to help you walk in confident and walk out with an offer.
                    </motion.p>
                </div>

                {/* ── Feature grid ── */}
                <div
                    style={{ perspective: "1200px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {FEATURES.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={i}
                            inView={inView}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";


function useInView(threshold = 0.08) {
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

const PARAGRAPHS = [
    "PrepMate was born from a simple observation: talented people fail interviews every day — not because they lack skills, but because they lack practice.",
    "Traditional mock interviews cost $100–200 per session. Scheduling is a nightmare. Quality is inconsistent. And most people can't afford enough practice to actually improve.",
    "We asked ourselves: what if AI could democratize interview preparation? What if anyone could practice unlimited interviews, get instant expert feedback, and track their progress — all for free?",
    "That's why PrepMate exists.",
];

const KEY_POINTS = [
    { label: "Accessible", detail: "Start practicing in 30 seconds, no barriers" },
    { label: "Affordable", detail: "Completely free, forever. No hidden costs" },
    { label: "Available", detail: "Practice 24/7, no scheduling, no waiting" },
    { label: "Effective", detail: "AI-powered feedback that actually helps you improve" },
];

export default function AboutSection() {
    const { ref, inView } = useInView();
    const reduce = useReducedMotion();

    const fade = (delay: number) => ({
        initial: { opacity: 0, y: reduce ? 0 : 18 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: reduce ? 0 : 0.55, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    });

    return (
        <section id="about" className="relative py-28 px-6 overflow-hidden bg-[#06030f]">

            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]"
                    style={{ background: "radial-gradient(ellipse, #7c3aed, transparent 70%)", filter: "blur(90px)" }} />
                <div className="absolute top-0 right-0 w-[300px] h-[250px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(ellipse, #ec4899, transparent 70%)", filter: "blur(70px)" }} />
                <div className="absolute bottom-0 left-0 w-[250px] h-[200px] rounded-full opacity-[0.04]"
                    style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 70%)", filter: "blur(70px)" }} />
            </div>

            <div ref={ref} className="relative z-10 max-w-3xl mx-auto text-center">

                {/* Badge */}
                <motion.div {...fade(0)}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/8 text-xs font-semibold text-purple-300 tracking-widest uppercase mb-6"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    About PrepMate
                </motion.div>

                {/* Headline */}
                <motion.h2 {...fade(0.07)}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-10"
                >
                    <span className="text-white">Interview Prep</span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                        Shouldn&apos;t Cost Hundreds
                    </span>
                </motion.h2>

                {/* Story paragraphs */}
                <div className="space-y-6 mb-12">
                    {PARAGRAPHS.map((p, i) => (
                        <motion.p
                            key={i}
                            {...fade(0.12 + i * 0.09)}
                            className={
                                i === PARAGRAPHS.length - 1
                                    ? "text-xl font-semibold text-white"
                                    : "text-lg leading-relaxed text-gray-400"
                            }
                        >
                            {p}
                        </motion.p>
                    ))}
                </div>

                {/* Divider */}
                <motion.div {...fade(0.46)}
                    className="w-16 h-px mx-auto mb-12"
                    style={{ background: "linear-gradient(to right, transparent, rgba(139,92,246,0.6), transparent)" }}
                />

                {/* Key points */}
                <motion.ul {...fade(0.52)} className="inline-flex flex-col items-start gap-4 mb-14 text-left">
                    {KEY_POINTS.map((kp, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                            </span>
                            <span className="text-base text-gray-300">
                                <span className="font-semibold text-white">{kp.label}</span>
                                {" — "}
                                {kp.detail}
                            </span>
                        </li>
                    ))}
                </motion.ul>

                {/* Closing statement */}
                <motion.p {...fade(0.60)}
                    className="text-xl font-medium text-gray-200 leading-relaxed mb-3"
                >
                    Interview preparation should be accessible to everyone, not just those who can afford expensive coaching.{" "}
                    <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent font-semibold">
                        PrepMate makes that possible.
                    </span>
                </motion.p>

                {/* Subtext */}
                <motion.p {...fade(0.66)} className="text-sm text-gray-600 mb-12">
                    Powered by advanced AI &nbsp;•&nbsp; Built for job seekers everywhere
                </motion.p>

            </div>
        </section>
    );
}

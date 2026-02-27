"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Clock, Target, ArrowRight, Brain, BarChart2, Flame, Trophy, Zap, BookOpen } from "lucide-react";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, avgScore: 0, streak: 0, hoursPracticed: 0, improvement: 0 });
    const [heatmapData, setHeatmapData] = useState<any[]>([]);

    useEffect(() => {
        if (isLoaded) fetchData();
    }, [isLoaded]);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/analytics");
            const data = await res.json();
            if (data.success) {
                const interviews = data.analytics.recentInterviews || [];
                setRecentInterviews(interviews);
                const scores = interviews.map((iv: any) => iv.score ?? 0).filter((s: number) => s > 0);
                const firstScore = scores.length > 1 ? scores[scores.length - 1] : 0;
                const lastScore = scores.length > 0 ? scores[0] : 0;
                setStats({
                    total: data.analytics.totalInterviews || 0,
                    avgScore: Math.round(data.analytics.averageScore || 0),
                    streak: data.analytics.streak || 0,
                    hoursPracticed: Math.round((data.analytics.totalMinutes || 0) / 60), // REAL hours from actual interview duration
                    improvement: scores.length > 1 ? Math.round(lastScore - firstScore) : 0,
                });
                // Set REAL heatmap data from API
                setHeatmapData(data.analytics.heatmapData || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (!isLoaded || loading) {
        return (
            <div className="p-8 max-w-6xl">
                {/* Skeleton Header */}
                <div className="mb-10 animate-pulse">
                    <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                    <div className="h-8 w-64 bg-white/10 rounded"></div>
                </div>

                {/* Skeleton Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-2xl p-5 border border-white/10 bg-white/5 animate-pulse">
                            <div className="h-16 w-16 bg-white/10 rounded-full mb-2"></div>
                            <div className="h-4 w-20 bg-white/10 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Skeleton Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 animate-pulse">
                        <div className="h-6 w-48 bg-white/10 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/10 rounded"></div>)}
                        </div>
                    </div>
                    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 animate-pulse">
                        <div className="h-6 w-48 bg-white/10 rounded mb-4"></div>
                        <div className="h-64 bg-white/10 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";
    const avgScore = stats.avgScore;
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (avgScore / 100) * circumference;

    // Achievement badges
    const badges = [
        { icon: "🎯", label: "First Interview", earned: stats.total >= 1, color: "from-purple-500 to-fuchsia-500" },
        { icon: "🔥", label: "5-Day Streak", earned: stats.streak >= 5, color: "from-purple-500 to-fuchsia-600" },
        { icon: "⭐", label: "High Scorer", earned: avgScore >= 80, color: "from-fuchsia-500 to-purple-600" },
        { icon: "🚀", label: "10 Sessions", earned: stats.total >= 10, color: "from-purple-600 to-fuchsia-500" },
    ];

    // Intensity colors for heatmap
    const intensityColors = ["bg-white/5", "bg-purple-500/25", "bg-purple-500/55", "bg-purple-500/90"];

    return (
        <div className="p-8 max-w-6xl">

            {/* Header */}
            <div className="mb-10">
                <p className="text-gray-500 text-sm mb-1">Good to see you back 👋</p>
                <h1 className="text-3xl font-bold text-white">Welcome, <span className="grad-text">{firstName}!</span></h1>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                {/* Average Score — Circle */}
                <div className="rounded-2xl p-5 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <svg width="72" height="72" viewBox="0 0 84 84">
                            <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="8" />
                            <circle cx="42" cy="42" r="36" fill="none"
                                stroke="url(#scoreGrad)" strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                transform="rotate(-90 42 42)" />
                            <defs>
                                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-base font-bold text-white">{avgScore}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">Avg Score</p>
                        <p className="text-sm font-bold text-white">{avgScore > 0 ? (avgScore >= 80 ? "Excellent" : avgScore >= 60 ? "Good" : "Needs Work") : "—"}</p>
                        {avgScore > 0 && <p className="text-xs text-purple-400 mt-0.5">↑ Top {avgScore > 80 ? "10" : "25"}%</p>}
                    </div>
                </div>

                {/* Total sessions */}
                <div className="rounded-2xl p-5 border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-fuchsia-400" />
                        </div>
                        <span className="text-xs text-gray-600">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-0.5">{loading ? <div className="h-8 w-12 bg-white/10 rounded animate-pulse" /> : stats.total}</div>
                    <div className="text-xs text-gray-500">Interview Sessions</div>
                </div>

                {/* Hours Practiced */}
                <div className="rounded-2xl p-5 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-xs text-gray-600">Practice</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-0.5">{loading ? <div className="h-8 w-10 bg-white/10 rounded animate-pulse" /> : stats.hoursPracticed}</div>
                    <div className="text-xs text-gray-500">Hours Practiced</div>
                </div>

                {/* Improvement Rate */}
                <div className="rounded-2xl p-5 border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
                        </div>
                        <span className="text-xs text-gray-600">Growth</span>
                    </div>
                    <div className={`text-3xl font-bold mb-0.5 ${stats.improvement >= 0 ? "text-fuchsia-400" : "text-orange-400"}`}>
                        {loading ? <div className="h-8 w-12 bg-white/10 rounded animate-pulse" /> : `${stats.improvement >= 0 ? "+" : ""}${stats.improvement}%`}
                    </div>
                    <div className="text-xs text-gray-500">Score Improvement</div>
                </div>
            </div>

            {/* New Session CTA */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20 p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">Ready for your next session?</h3>
                        <p className="text-sm text-gray-400">Start a personalized AI mock interview in seconds</p>
                    </div>
                </div>
                <Link href="/interview/new"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] flex-shrink-0">
                    New Interview <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Achievement Badges */}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                    <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-400" /> Achievements
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {badges.map((badge) => (
                            <div key={badge.label} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${badge.earned ? "border-white/15 bg-white/5" : "border-white/5 bg-white/2 opacity-40"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${badge.earned ? `bg-gradient-to-br ${badge.color}` : "bg-white/10"}`}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white">{badge.label}</p>
                                    <p className={`text-xs ${badge.earned ? "text-fuchsia-400" : "text-gray-600"}`}>{badge.earned ? "Earned ✓" : "Locked"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Heatmap */}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                    <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-fuchsia-400" /> Activity (Last 7 Weeks)
                    </h2>
                    {heatmapData.length > 0 ? (
                        <div className="flex items-start gap-1">
                            {Array.from({ length: 7 }, (_, week) => (
                                <div key={week} className="flex flex-col gap-1">
                                    {Array.from({ length: 7 }, (_, day) => {
                                        const index = week * 7 + day;
                                        if (index >= heatmapData.length) return null;
                                        const cell = heatmapData[index];
                                        return (
                                            <div key={day}
                                                className={`w-6 h-6 rounded-sm ${intensityColors[cell.intensity]} hover:ring-1 hover:ring-purple-400/40 transition-all`}
                                                title={`${new Date(cell.date).toLocaleDateString()}: ${cell.count} session${cell.count !== 1 ? 's' : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Complete interviews to see your activity
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-600">Less</span>
                        {intensityColors.map((c, i) => <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />)}
                        <span className="text-xs text-gray-600">More</span>
                    </div>
                </div>
            </div>

            {/* Recent Interviews */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <Link href="/history" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/3 animate-pulse" />)}
                </div>
            ) : recentInterviews.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/3 p-14 text-center">
                    <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-6 text-base">No interviews yet — let&apos;s start your first one!</p>
                    <Link href="/interview/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/25">
                        <Sparkles className="w-4 h-4" /> Start Your First Interview
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentInterviews.slice(0, 5).map((iv: any) => (
                        <button key={iv.id} onClick={() => router.push(`/interview/${iv.id}/feedback`)}
                            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/3 border border-white/8 hover:border-purple-500/20 hover:bg-white/5 transition-all text-left group">
                            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                                style={{
                                    background: `conic-gradient(#a855f7 ${(iv.score ?? 0)}%, rgba(255,255,255,0.05) 0%)`,
                                    boxShadow: "0 0 0 3px rgba(168,85,247,0.15)"
                                }}>
                                <div className="w-9 h-9 rounded-full bg-[#0a0a0f] flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{iv.score ?? "—"}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white capitalize">{iv.type || "Interview"} — {iv.difficulty || "—"}</p>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {new Date(iv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                            <div className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                                iv.status === "completed" 
                                    ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20" 
                                    : iv.status === "abandoned"
                                    ? "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                    : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                            }`}>
                                {iv.status === "completed" ? "Completed" : iv.status === "abandoned" ? "Abandoned" : "In Progress"}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                        </button>
                    ))}
                </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                {[
                    { href: "/analytics", icon: BarChart2, label: "Analytics", desc: "Charts & insights", color: "text-purple-400", bg: "bg-purple-500/15" },
                    { href: "/history", icon: BookOpen, label: "History", desc: "Past sessions", color: "text-fuchsia-400", bg: "bg-fuchsia-500/15" },
                    { href: "/profile", icon: Target, label: "Settings", desc: "Preferences", color: "text-purple-400", bg: "bg-purple-500/15" },
                    { href: "/interview/new", icon: Zap, label: "Quick Start", desc: "Mixed difficulty", color: "text-fuchsia-400", bg: "bg-fuchsia-500/15" },
                ].map(({ href, icon: Icon, label, desc, color, bg }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-purple-500/20 hover:bg-white/5 transition-all group">
                        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-4 h-4 ${color}`} size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

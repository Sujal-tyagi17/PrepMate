"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play, Sparkles, Zap, Clock, BarChart2, Video, Building2 } from "lucide-react";

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main className="min-h-screen bg-[#0a0514] text-white overflow-x-hidden">
            
            {/* Background gradient effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-purple-600/20 blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-fuchsia-600/15 blur-[130px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 border-b border-white/5 bg-[#0a0514]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold">PrepMate</span>
                        </div>

                        {/* Nav items */}
                        <div className="hidden md:flex items-center gap-8 text-sm">
                            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                            <a href="#solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</a>
                            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                            <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex items-center gap-3">
                            <Link href="/sign-in" className="hidden sm:block text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors">
                                Login
                            </Link>
                            <Link href="/sign-up" className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-500/25">
                                Start Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className={`flex justify-center mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-xs font-medium text-purple-300">NEW: AI VIDEO MOCK INTERVIEWS</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className={`text-center max-w-5xl mx-auto mb-8 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
                            Ace Every Interview
                            <br />
                            with Your{" "}
                            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                                AI Partner
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Unlock your career potential with real-time AI coaching, personalized mock interviews, and actionable feedback that helps you stand out.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        <Link href="/sign-up" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 font-semibold transition-all shadow-xl shadow-purple-500/30 hover:scale-105">
                            Start Free Practice
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-medium transition-all">
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </button>
                    </div>

                    {/* 3D Mockup */}
                    <div className={`relative max-w-5xl mx-auto transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                        style={{ perspective: "2000px" }}>
                        
                        {/* Glow effect */}
                        <div className="absolute -inset-40 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-cyan-500/20 blur-3xl opacity-50" />
                        
                        {/* Device container with 3D transform */}
                        <div className="relative"
                            style={{
                                transform: "rotateX(8deg) rotateY(-2deg)",
                                transformStyle: "preserve-3d",
                            }}>
                            
                            {/* Outer frame - laptop shell */}
                            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl p-8 shadow-2xl"
                                style={{
                                    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.15)",
                                }}>
                                
                                {/* Screen bezel */}
                                <div className="relative bg-black rounded-2xl overflow-hidden"
                                    style={{
                                        border: "12px solid #1a1a1a",
                                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                                    }}>
                                    
                                    {/* Screen content */}
                                    <div className="relative bg-[#0f0a1f] aspect-[16/10]">
                                        
                                        {/* App UI */}
                                        <div className="h-full flex flex-col">
                                            
                                            {/* Header */}
                                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                                    </div>
                                                    <span className="text-xs text-gray-600">Technical Interview • Google L4</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        24:16
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                                                        Live
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Main content area */}
                                            <div className="flex-1 flex">
                                                {/* Sidebar metrics */}
                                                <div className="w-64 border-r border-white/5 p-6 space-y-4 bg-white/[0.01]">
                                                    <div>
                                                        <div className="text-xs text-gray-600 mb-3 font-medium">PERFORMANCE</div>
                                                        
                                                        {/* Circular score indicators */}
                                                        <div className="flex items-center justify-between mb-6">
                                                            {/* Score 1 */}
                                                            <div className="relative">
                                                                <svg className="w-20 h-20 transform -rotate-90">
                                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="6" />
                                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#grad1)" strokeWidth="6" strokeDasharray="200" strokeDashoffset="40" strokeLinecap="round" />
                                                                    <defs>
                                                                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                            <stop offset="0%" stopColor="#7c3aed" />
                                                                            <stop offset="100%" stopColor="#db2777" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg>
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                    <span className="text-xl font-bold">8.2</span>
                                                                    <span className="text-[9px] text-gray-600">avg</span>
                                                                </div>
                                                            </div>

                                                            {/* Score 2 */}
                                                            <div className="relative">
                                                                <svg className="w-20 h-20 transform -rotate-90">
                                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(236,72,153,0.1)" strokeWidth="6" />
                                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="url(#grad2)" strokeWidth="6" strokeDasharray="200" strokeDashoffset="20" strokeLinecap="round" />
                                                                    <defs>
                                                                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                            <stop offset="0%" stopColor="#ec4899" />
                                                                            <stop offset="100%" stopColor="#f43f5e" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg>
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                    <span className="text-xl font-bold">9.4</span>
                                                                    <span className="text-[9px] text-gray-600">latest</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Categories */}
                                                        <div className="space-y-3 text-xs">
                                                            <div>
                                                                <div className="flex justify-between mb-1.5 text-gray-500">
                                                                    <span>Clarity</span>
                                                                    <span className="text-white font-medium">92%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                    <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-between mb-1.5 text-gray-500">
                                                                    <span>Structure</span>
                                                                    <span className="text-white font-medium">85%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                    <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-between mb-1.5 text-gray-500">
                                                                    <span>Technical</span>
                                                                    <span className="text-white font-medium">88%</span>
                                                                </div>
                                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                    <div className="h-full w-[88%] bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chat area */}
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex-1 p-8 space-y-4">
                                                        {/* AI message */}
                                                        <div className="flex gap-3 items-start">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                                                <Sparkles className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-xs text-gray-600 mb-1">AI Interviewer</div>
                                                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-300 leading-relaxed">
                                                                    Great answer! Your approach to debugging the distributed cache issue was methodical. Can you elaborate on how you identified the root cause?
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* User message */}
                                                        <div className="flex gap-3 items-start flex-row-reverse">
                                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-sm text-gray-400">
                                                                U
                                                            </div>
                                                            <div className="flex-1 flex flex-col items-end">
                                                                <div className="text-xs text-gray-600 mb-1">You</div>
                                                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-300 leading-relaxed max-w-lg">
                                                                    I started by analyzing the logs and metrics. The latency spike correlated with a deployment...
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Typing indicator */}
                                                        <div className="flex gap-3 items-start">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                                                <Sparkles className="w-4 h-4" />
                                                            </div>
                                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                                                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Input area */}
                                                    <div className="border-t border-white/5 p-6 bg-white/[0.02]">
                                                        <div className="flex gap-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Type your answer..."
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                                                                disabled
                                                            />
                                                            <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-medium text-sm">
                                                                Send
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Testimonial overlay */}
                                        <div className="absolute bottom-6 right-6 bg-fuchsia-600/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-xl max-w-xs">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 flex-shrink-0" />
                                                <p className="text-xs font-medium leading-snug">"Your tone is very professional and confident!"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-xs font-medium text-purple-300 mb-6">
                            MASTER YOUR SKILLS
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Everything you need to land your
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                dream job
                            </span>
                        </h2>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Feature 1 */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center mb-5">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">AI-Powered Questions</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                    Dynamic questions tailored specifically to your role, company, and experience level using GPT-4.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium">Spatial ML</span>
                                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium">Eye Contact</span>
                                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-medium">Sentiment</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-fuchsia-500/30 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mb-5">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-time Feedback</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                    Get instant suggestions on your answers, filler words, tone, and body language while you practice.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-md bg-fuchsia-500/10 text-fuchsia-300 text-xs font-medium">Low Latency</span>
                                    <span className="px-2.5 py-1 rounded-md bg-fuchsia-500/10 text-fuchsia-300 text-xs font-medium">Detailed</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Practice History</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Track your progress over time and revisit past sessions to see how much you've improved.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Company-Specific</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Get ready for top tech firms like Google, Meta, and Amazon with curated question banks.
                                </p>
                            </div>
                        </div>

                        {/* Feature 5 */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-orange-500/30 transition-all hover:bg-white/[0.04]">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-5">
                                    <Video className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Voice & Video</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Practice in a realistic environment with camera and microphone integration for full immersion.
                                </p>
                            </div>
                        </div>

                        {/* Feature 6 - Wide */}
                        <div className="group relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-violet-500/30 transition-all hover:bg-white/[0.04] md:col-span-2 lg:col-span-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5">
                                    <BarChart2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Deep Performance Analytics</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                    Detailed metrics and data-driven insights on your interview readiness. We analyze over 50+ data points.
                                </p>
                                
                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-violet-500/10 rounded-lg p-3 border border-violet-500/20">
                                        <div className="text-2xl font-bold text-violet-300 mb-0.5">89%</div>
                                        <div className="text-xs text-gray-500">Technical Accuracy</div>
                                    </div>
                                    <div className="bg-violet-500/10 rounded-lg p-3 border border-violet-500/20">
                                        <div className="text-2xl font-bold text-fuchsia-300 mb-0.5">Vibrant</div>
                                        <div className="text-xs text-gray-500">Tone Analysis</div>
                                    </div>
                                    <div className="bg-violet-500/10 rounded-lg p-3 border border-violet-500/20">
                                        <div className="text-2xl font-bold text-cyan-300 mb-0.5">Top 5%</div>
                                        <div className="text-xs text-gray-500">vs Peers</div>
                                    </div>
                                    <div className="bg-violet-500/10 rounded-lg p-3 border border-violet-500/20">
                                        <div className="text-2xl font-bold text-emerald-300 mb-0.5">4.2m</div>
                                        <div className="text-xs text-gray-500">Words Analyzed</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-bold">PrepMate</span>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-8 text-sm text-gray-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>

                        {/* Copyright */}
                        <div className="text-xs text-gray-600">
                            © 2024 PrepMate AI. Crafted for the future of work.
                        </div>
                    </div>
                </div>
            </footer>

        </main>
    );
}

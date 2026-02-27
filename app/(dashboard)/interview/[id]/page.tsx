"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Brain, Send, Loader2, CheckCircle, Mic, MicOff, Clock, Zap, Target, MessageSquare, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDuration } from "@/lib/utils";
import AIAvatar from "@/components/interview/AIAvatar";

interface Message {
    role: "ai" | "user";
    content: string;
    score?: number;
}

export default function InterviewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [interview, setInterview] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSkipModal, setShowSkipModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [micActive, setMicActive] = useState(false);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [userName, setUserName] = useState("");
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [questionTimer, setQuestionTimer] = useState(120); // 2 minutes per question
    const [timerActive, setTimerActive] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const recognitionRef = useRef<any>(null);
    const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize speech synthesis and recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ('speechSynthesis' in window) {
                synthRef.current = window.speechSynthesis;
            }
            
            // Initialize speech recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';
                
                recognitionRef.current.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0])
                        .map((result: any) => result.transcript)
                        .join('');
                    setAnswer(transcript);
                };
                
                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    if (event.error === 'no-speech') {
                        toast.error('No speech detected. Please try again.');
                    }
                };
                
                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, []);

    // Function to speak text
    const speakText = (text: string) => {
        if (!voiceEnabled || !synthRef.current) return;
        
        // Cancel any ongoing speech
        synthRef.current.cancel();
        
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        // Try to use a female voice for more professional feel
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        synthRef.current.speak(utterance);
    };

    // Toggle microphone
    const toggleMicrophone = () => {
        if (!recognitionRef.current) {
            toast.error('Speech recognition not supported in this browser');
            return;
        }
        
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                // Stop AI voice when user starts speaking
                if (synthRef.current) {
                    synthRef.current.cancel();
                    setIsSpeaking(false);
                }
            } catch (error) {
                console.error('Error starting recognition:', error);
                toast.error('Could not start microphone');
            }
        }
    };

    // Derived stats - only count actual questions (not greeting/intro messages)
    const actualQuestions = messages.filter(m => 
        m.role === "ai" && 
        !m.content.toLowerCase().startsWith("hello") && 
        !m.content.toLowerCase().includes("welcome to your") &&
        !m.content.toLowerCase().includes("i'm your ai interviewer")
    );
    const questionCount = actualQuestions.length - (currentQuestion ? 1 : 0); // Count answered questions only
    const totalQuestions = interview?.total_questions || 5; // Use configured total or default to 5
    const scores = messages.filter(m => m.role === "user" && m.score !== undefined).map(m => m.score as number);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) : 0;
    const confidence = Math.min(100, Math.max(0, avgScore + (Math.random() * 10 - 5)));

    // Question timer effect
    useEffect(() => {
        if (timerActive && questionTimer > 0) {
            // Show warning at 30 seconds
            if (questionTimer === 30) {
                toast('⚠️ 30 seconds remaining!', { duration: 3000 });
                if (synthRef.current && voiceEnabled) {
                    const utterance = new SpeechSynthesisUtterance("30 seconds remaining");
                    utterance.rate = 1.0;
                    synthRef.current.speak(utterance);
                }
            }
            
            questionTimerRef.current = setInterval(() => {
                setQuestionTimer(prev => {
                    if (prev <= 1) {
                        setTimerActive(false);
                        // Check if user has provided an answer
                        if (answer.trim()) {
                            toast.success("⏰ Time's up! Submitting your answer...", { duration: 2000 });
                            // Auto-submit answer when time runs out but only if there's an answer
                            if (currentQuestion && !submitting) {
                                setTimeout(() => {
                                    handleSubmitAnswer({ preventDefault: () => {} } as any);
                                }, 500);
                            }
                        } else {
                            toast.error("Time's up! Question skipped - no answer provided.");
                            // Skip to next question without submitting
                            setAnswer("");
                            setCurrentQuestion("");
                            setTimeout(() => generateQuestion(), 1500);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (questionTimerRef.current) {
                clearInterval(questionTimerRef.current);
            }
        }
        
        return () => {
            if (questionTimerRef.current) {
                clearInterval(questionTimerRef.current);
            }
        };
    }, [timerActive, questionTimer, currentQuestion, submitting, answer]);

    useEffect(() => {
        fetchInterview();
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => {
            clearInterval(timer);
            // Cancel any ongoing speech when leaving the page
            if (synthRef.current) {
                synthRef.current.cancel();
            }
            // Stop recognition when leaving
            if (recognitionRef.current && isListening) {
                recognitionRef.current.stop();
            }
            // Clear question timer
            if (questionTimerRef.current) {
                clearInterval(questionTimerRef.current);
            }
        };
    }, [params.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchInterview = async () => {
        try {
            const response = await fetch(`/api/interview/${params.id}`);
            const data = await response.json();
            if (data.success) {
                setInterview(data.interview);
                setUserName(data.interview.user?.name || "there");
                
                const loadedMessages: Message[] = [];
                
                data.interview.answers.forEach((a: any) => {
                    loadedMessages.push({ role: "ai", content: a.questionText });
                    loadedMessages.push({ role: "user", content: a.userAnswer, score: a.score });
                });
                
                setMessages(loadedMessages);
                
                if (data.interview.status === "completed") {
                    setCompleted(true);
                } else if (data.interview.answers.length === 0) {
                    // New interview - show greeting and intro, then generate first question
                    const firstName = data.interview.user?.name?.split(' ')[0] || "there";
                    const greeting = `Hello ${firstName}! Welcome to your AI-powered interview.`;
                    const intro = `I'm your AI interviewer for the ${data.interview.role || 'this'} position${data.interview.company ? ` at ${data.interview.company}` : ''}. This is a ${data.interview.difficulty} difficulty ${data.interview.type.replace('-', ' ')} interview. You'll have 2 minutes to answer each question. Take your time, speak clearly, and feel free to think through your responses. Let's begin with your first question!`;
                    
                    // Set both greeting and intro messages at once
                    setMessages([
                        { role: "ai", content: greeting },
                        { role: "ai", content: intro }
                    ]);
                    
                    // Speak greeting and intro sequentially using speech events
                    if (voiceEnabled && synthRef.current) {
                        const greetingUtterance = new SpeechSynthesisUtterance(greeting);
                        greetingUtterance.rate = 0.9;
                        greetingUtterance.pitch = 1.0;
                        greetingUtterance.volume = 1.0;
                        
                        greetingUtterance.onend = () => {
                            // After greeting finishes, speak intro
                            const introUtterance = new SpeechSynthesisUtterance(intro);
                            introUtterance.rate = 0.9;
                            introUtterance.pitch = 1.0;
                            introUtterance.volume = 1.0;
                            
                            introUtterance.onend = () => {
                                // After intro finishes, generate first question
                                setIsSpeaking(false);
                                setTimeout(() => generateQuestion(), 1000);
                            };
                            
                            introUtterance.onerror = () => {
                                setIsSpeaking(false);
                                setTimeout(() => generateQuestion(), 1000);
                            };
                            
                            setIsSpeaking(true);
                            synthRef.current?.speak(introUtterance);
                        };
                        
                        greetingUtterance.onerror = () => {
                            // If greeting fails, still try to show intro and question
                            setIsSpeaking(false);
                            setTimeout(() => generateQuestion(), 1000);
                        };
                        
                        setIsSpeaking(true);
                        synthRef.current.speak(greetingUtterance);
                    } else {
                        // If voice disabled, just generate question after delay
                        setTimeout(() => generateQuestion(), 2000);
                    }
                }
            } else {
                toast.error(data.error || "Failed to load interview");
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching interview:", error);
            router.push("/dashboard");
        } finally { setLoading(false); }
    };

    const generateQuestion = async () => {
        setGenerating(true);
        try {
            const response = await fetch(`/api/interview/${params.id}/question`, { method: "POST" });
            const data = await response.json();
            if (data.success) {
                setCurrentQuestion(data.question);
                setMessages(prev => [...prev, { role: "ai", content: data.question }]);
                // Speak the question
                speakText(data.question);
                // Start timer for this question
                setQuestionTimer(120); // 2 minutes
                setTimerActive(true);
                
                // Auto-enable microphone after AI finishes speaking (voice-first approach)
                setTimeout(() => {
                    if (recognitionRef.current && !isListening) {
                        try {
                            recognitionRef.current.start();
                            setIsListening(true);
                            toast.success('🎤 Microphone activated - Start speaking!', { duration: 3000 });
                        } catch (error) {
                            console.log('Microphone auto-start failed:', error);
                        }
                    }
                }, 3000); // Wait 3 seconds for AI to start speaking
            }
        } catch (error) { console.error("Error generating question:", error); }
        finally { setGenerating(false); }
    };

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuestion) return;
        
        // Stop the question timer
        setTimerActive(false);
        if (questionTimerRef.current) {
            clearInterval(questionTimerRef.current);
        }
        
        // Check if answer is empty - skip evaluation if no answer provided
        const userAnswer = answer.trim();
        if (!userAnswer) {
            toast.error("Please provide an answer before submitting");
            return;
        }
        
        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        
        setSubmitting(true);
        setAnswer("");
        setMessages(prev => [...prev, { role: "user", content: userAnswer }]);
        try {
            const response = await fetch(`/api/interview/${params.id}/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: currentQuestion, answer: userAnswer }),
            });
            const data = await response.json();
            if (data.success) {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].score = data.evaluation.score;
                    return updated;
                });
                setCurrentQuestion("");
                
                // Check if we've reached the target number of questions
                const answeredQuestions = questionCount + 1; // +1 for the question we just answered
                
                // Auto-complete after reaching totalQuestions (usually 5-10)
                if (answeredQuestions >= totalQuestions) {
                    toast.success("🎉 Interview complete! Generating your feedback...");
                    setTimeout(async () => {
                        await handleEndInterview();
                    }, 2000);
                } else {
                    setTimeout(() => generateQuestion(), 1500);
                }
            }
        } catch (error) { console.error("Error submitting answer:", error); }
        finally { setSubmitting(false); }
    };

    const handleEndInterview = async () => {
        try {
            const response = await fetch(`/api/interview/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Interview completed!");
                router.push(`/interview/${params.id}/feedback`);
            }
        } catch (error) { console.error("Error ending interview:", error); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0514]">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Loading your interview...</p>
                </div>
            </div>
        );
    }

    if (completed) {
        const finalScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) : 0;
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0514] p-8">
                <div className="text-center max-w-md">
                    {/* Big score circle */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <svg width="128" height="128" viewBox="0 0 128 128">
                            <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="10" />
                            <circle cx="64" cy="64" r="54" fill="none"
                                stroke="url(#finGrad)" strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 54}
                                strokeDashoffset={2 * Math.PI * 54 - (finalScore / 100) * 2 * Math.PI * 54}
                                transform="rotate(-90 64 64)" />
                            <defs>
                                <linearGradient id="finGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{finalScore}%</span>
                            <span className="text-xs text-gray-500">Score</span>
                        </div>
                    </div>

                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
                    <p className="text-gray-400 mb-2">You answered {interview?.answers?.length || 0} questions</p>
                    <p className="text-gray-600 text-sm mb-8">
                        {finalScore >= 80 ? "Outstanding performance! 🎉" : finalScore >= 60 ? "Good effort! Keep practicing 💪" : "Keep going — progress takes time 🌱"}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <Link href="/dashboard"
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all">
                            <ArrowLeft className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/analytics"
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/25">
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0514]">

            {/* ── LEFT — Insights Panel ── */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col py-5 px-4 overflow-y-auto"
                style={{ background: "linear-gradient(180deg, #0f0a1a 0%, #0a0a0f 100%)" }}>

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-medium">Live Interview</span>
                    </div>
                    <p className="text-xs text-gray-600 capitalize">{interview?.type} · {interview?.difficulty}</p>
                </div>

                {/* Question Timer - Prominent Display */}
                {timerActive && (
                    <div className="glass-card rounded-2xl p-6 mb-4 border-2 border-purple-500/30">
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-3">
                                <svg className="transform -rotate-90" width="128" height="128">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="rgba(168,85,247,0.15)"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={questionTimer <= 30 ? "#ef4444" : questionTimer <= 60 ? "#f59e0b" : "#a855f7"}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 56}
                                        strokeDashoffset={2 * Math.PI * 56 * (1 - questionTimer / 120)}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-3xl font-bold font-mono ${questionTimer <= 30 ? 'text-red-400 animate-pulse' : questionTimer <= 60 ? 'text-yellow-400' : 'text-purple-400'}`}>
                                        {Math.floor(questionTimer / 60)}:{(questionTimer % 60).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-gray-600 mt-1">
                                        {questionTimer <= 30 ? 'Hurry!' : questionTimer <= 60 ? 'Half time' : 'Time left'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Answer within time frame
                            </p>
                        </div>
                    </div>
                )}

                {/* Interview Stats */}
                <div className="glass-card rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">Interview Status</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{currentQuestion ? questionCount + 1 : questionCount}</div>
                            <div className="text-xs text-gray-600">Current Question</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-fuchsia-400">{totalQuestions}</div>
                            <div className="text-xs text-gray-600">Total Questions</div>
                        </div>
                    </div>
                </div>

                {/* Timer */}
                <div className="glass-card rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-500">Total Time</span>
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">{formatDuration(elapsedTime)}</div>
                </div>

                {/* Confidence meter */}
                <div className="glass-card rounded-2xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-xs text-gray-400">Confidence</span>
                        </div>
                        <span className="text-sm font-bold text-white">{Math.round(confidence)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 transition-all duration-700"
                            style={{ width: `${Math.round(confidence)}%` }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                        {Math.round(confidence) >= 80 ? "Very confident" : Math.round(confidence) >= 60 ? "Good pace" : "Keep going!"}
                    </p>
                </div>

                {/* Score */}
                <div className="glass-card rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Target className="w-3.5 h-3.5 text-pink-400" />
                        <span className="text-xs text-gray-400">Avg Score</span>
                    </div>
                    <div className="text-2xl font-bold grad-text">{avgScore > 0 ? `${avgScore}%` : "—"}</div>
                    <p className="text-xs text-gray-600 mt-1">{questionCount} Q{questionCount !== 1 ? "s" : ""} answered</p>
                </div>

                {/* Live feedback */}
                {scores.length > 0 && (
                    <div className="glass-card rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-1.5 mb-3">
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-xs text-gray-400">Last Score</span>
                        </div>
                        <div className="text-xl font-bold text-white">{scores[scores.length - 1]}/10</div>
                        <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                            <div className="h-full rounded-full bg-cyan-500 transition-all"
                                style={{ width: `${(scores[scores.length - 1] / 10) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* Voice Toggle */}
                <div className="mb-3">
                    <button onClick={() => {
                        setVoiceEnabled(!voiceEnabled);
                        if (voiceEnabled && synthRef.current) {
                            synthRef.current.cancel();
                            setIsSpeaking(false);
                        }
                    }}
                        className={`w-full py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2 ${
                            voiceEnabled 
                                ? "border-purple-500/30 bg-purple-500/10 text-purple-400" 
                                : "border-white/10 bg-white/5 text-gray-500"
                        }`}>
                        {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        {voiceEnabled ? "AI Voice On" : "AI Voice Off"}
                    </button>
                </div>
                
                {/* End Interview */}
                <div className="mt-auto">
                    <button onClick={handleEndInterview}
                        className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-xs font-medium hover:bg-red-500/15 transition-all duration-200 active:scale-95">
                        End Interview
                    </button>
                </div>
            </aside>

            {/* ── CENTER — Chat Area ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        {interview?.company && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                                {interview.company}
                            </span>
                        )}
                        {interview?.role && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                {interview.role}
                            </span>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Show greeting/intro or center AI Avatar with current question */}
                    {messages.length > 0 && (messages.length < 3 || !currentQuestion) ? (
                        // Show conversation mode for greeting/intro
                        <div className="space-y-5 max-w-2xl mx-auto">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === "ai"
                                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                                        : "bg-white/10 text-gray-300"}`}>
                                        {msg.role === "ai" ? <Volume2 className="w-5 h-5" /> : "U"}
                                    </div>
                                    <div className={`max-w-xl ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${msg.role === "ai"
                                            ? "bg-purple-500/10 border border-purple-500/20 text-gray-200"
                                            : "bg-white/7 border border-white/10 text-gray-300"}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {generating && (
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-5 py-4">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                                                    style={{ animationDelay: `${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Center mode with AI Avatar and current question
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
                            
                            {/* AI Avatar */}
                            <AIAvatar isSpeaking={isSpeaking} size="lg" voiceEnabled={voiceEnabled} />
                            
                            {/* AI Name */}
                            <h2 className="text-xl font-bold grad-text mt-6 mb-2">AI Interviewer</h2>
                            <p className="text-gray-500 text-xs mb-8">
                                {interview?.company && `${interview.company} · `}
                                {interview?.role || "Interview Assistant"}
                            </p>
                        
                        {/* Current Question Display */}
                        {messages.length === 0 && !generating ? (
                            <div className="glass-card rounded-2xl p-8 max-w-xl">
                                <p className="text-gray-400 text-sm">Preparing your personalized interview...</p>
                                <p className="text-gray-600 text-xs mt-2">I'll speak each question to you</p>
                            </div>
                        ) : generating ? (
                            <div className="glass-card rounded-2xl p-8 max-w-xl border-2 border-purple-500/30">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                    <span className="text-purple-400 text-sm font-medium">Generating next question...</span>
                                </div>
                                <div className="flex gap-1.5 justify-center">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        ) : currentQuestion ? (
                            <div className="space-y-6 w-full">
                                {/* Current Question */}
                                <div className="glass-card rounded-2xl p-8 border-2 border-purple-500/30 bg-purple-500/5">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                            {voiceEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm text-purple-400 font-semibold">Question {questionCount + 1} of {totalQuestions}</p>
                                                {timerActive && (
                                                    <div className={`flex items-center gap-1.5 text-xs font-medium ${
                                                        questionTimer <= 30 ? 'text-red-400' : 
                                                        questionTimer <= 60 ? 'text-yellow-400' : 
                                                        'text-gray-500'
                                                    }`}>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {Math.floor(questionTimer / 60)}:{(questionTimer % 60).toString().padStart(2, '0')}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-200 text-base leading-relaxed text-left">{currentQuestion}</p>
                                        </div>
                                    </div>
                                    
                                    {voiceEnabled && !isSpeaking && (
                                        <div className="flex flex-col items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                                                <span className="text-sm font-medium text-purple-400">🎤 Microphone will auto-start - Answer by voice</span>
                                            </div>
                                            <span className="text-xs text-gray-600">Your speech transcribes to text • Edit if needed • 2 min limit</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Previous Q&A Summary */}
                                {questionCount > 0 && (
                                    <div className="text-xs text-gray-600">
                                        <p>Answered: {questionCount} questions • Average score: {avgScore}%</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-8 max-w-xl">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <p className="text-gray-400 text-sm">No active question</p>
                            </div>
                        )}
                        </div>
                    )}
                </div>

                {/* Input bar */}
                <div className="border-t border-white/5 px-6 py-4 flex-shrink-0 bg-[#0a0514]/80 backdrop-blur-xl">
                    {/* Only show input during actual questions, not during greeting/intro */}
                    {messages.length >= 2 && currentQuestion ? (
                        <>
                            <form onSubmit={handleSubmitAnswer} className="flex gap-3 items-end">
                                <button 
                                    type="button" 
                                    onClick={toggleMicrophone}
                                    className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg active:scale-90 ${
                                        isListening 
                                            ? "bg-gradient-to-br from-red-500 to-pink-600 border-2 border-red-400 text-white scale-110 shadow-red-500/50" 
                                            : "bg-gradient-to-br from-purple-600 to-fuchsia-600 border-2 border-purple-400/50 text-white hover:scale-105 shadow-purple-500/30"
                                    }`}
                                    disabled={submitting || generating || !currentQuestion}
                                >
                                    {isListening ? (
                                        <div className="relative">
                                            <Mic className="w-7 h-7" />
                                            <div className="absolute inset-0 animate-ping">
                                                <Mic className="w-7 h-7 opacity-75" />
                                            </div>
                                        </div>
                                    ) : (
                                        <Mic className="w-7 h-7" />
                                    )}
                                </button>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={answer}
                                        onChange={(e) => {
                                            setAnswer(e.target.value);
                                            // Stop speech when user starts typing
                                            if (synthRef.current && e.target.value.length > 0) {
                                                synthRef.current.cancel();
                                                setIsSpeaking(false);
                                            }
                                        }}
                                        onKeyDown={(e) => { 
                                            if (e.key === "Enter" && !e.shiftKey && !submitting) { 
                                                e.preventDefault(); 
                                                // Stop listening when submitting
                                                if (isListening && recognitionRef.current) {
                                                    recognitionRef.current.stop();
                                                }
                                                handleSubmitAnswer(e as any); 
                                            } 
                                        }}
                                        placeholder={
                                            isListening 
                                                ? "🎤 Listening... Your voice is being transcribed here" 
                                                : currentQuestion 
                                                    ? "Click the microphone to speak (or type to edit transcription)" 
                                                    : "Waiting for question..."
                                        }
                                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/15 transition-all resize-none ${
                                            isListening ? "border-red-500/30 bg-red-500/5" : "border-white/10"
                                        }`}
                                        rows={2}
                                        disabled={submitting || generating || !currentQuestion}
                                    />
                                    {isListening && (
                                        <div className="absolute bottom-2 right-2 flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-1 bg-red-400 rounded-full animate-pulse"
                                                    style={{ 
                                                        height: Math.random() * 12 + 8 + 'px',
                                                        animationDelay: `${i * 0.15}s` 
                                                    }} 
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowSkipModal(true);
                                    }}
                                    disabled={submitting || generating || !currentQuestion}
                                    className="flex-shrink-0 px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium text-sm flex items-center justify-center hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                                >
                                    Skip
                                </button>
                                <button type="submit"
                                    disabled={submitting || generating || !currentQuestion}
                                    className="flex-shrink-0 px-6 h-11 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium text-sm flex items-center justify-center hover:from-green-500 hover:to-emerald-500 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 gap-2">
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Answer
                                        </>
                                    )}
                                </button>
                            </form>
                            <div className="mt-3 text-center space-y-1">
                                <p className={`text-sm font-medium ${
                                    isListening ? "text-red-400" : "text-purple-400"
                                }`}>
                                    {isListening 
                                        ? "🎤 Recording your voice..." 
                                        : "🎙️ Use voice to answer (microphone auto-starts)"
                                    }
                                </p>
                                <p className="text-xs text-gray-600">
                                    {isListening 
                                        ? "Click mic button to stop • Speech is transcribed for editing" 
                                        : "Voice transcribes to text • Edit if needed • Enter to submit"
                                    }
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-3">
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                                {isSpeaking ? (
                                    <>
                                        <Volume2 className="w-4 h-4 animate-pulse" />
                                        <span>AI is speaking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Preparing interview...</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Skip Confirmation Modal */}
            {showSkipModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowSkipModal(false)}
                    />
                    {/* Card */}
                    <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#13091f] shadow-2xl shadow-purple-500/10 p-6 animate-in fade-in zoom-in-95 duration-200">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⏭️</span>
                        </div>
                        <h3 className="text-white font-semibold text-lg text-center mb-2">Skip this question?</h3>
                        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                            You won't receive feedback for skipped questions. Your score may be affected.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSkipModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
                            >
                                Keep Answering
                            </button>
                            <button
                                onClick={() => {
                                    setShowSkipModal(false);
                                    setTimerActive(false);
                                    setAnswer("");
                                    setCurrentQuestion("");
                                    if (isListening && recognitionRef.current) {
                                        recognitionRef.current.stop();
                                        setIsListening(false);
                                    }
                                    toast('Question skipped', { icon: '⏭️' });
                                    setTimeout(() => generateQuestion(), 800);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
                            >
                                Skip Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

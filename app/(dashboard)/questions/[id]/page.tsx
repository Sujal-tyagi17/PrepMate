"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, ArrowLeft, Lightbulb } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { getDifficultyVariant } from "@/lib/utils";

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { showToast } = useToast();
    const [question, setQuestion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        fetchQuestion();
    }, [params.id]);

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`/api/questions/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setQuestion(data.question);
            } else {
                showToast(data.error || "Failed to fetch question", "error");
                router.push("/questions");
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            showToast("Failed to fetch question", "error");
            router.push("/questions");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/questions" className="flex items-center gap-2">
                                <Brain className="w-8 h-8 text-purple-400" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    Prep Mate
                                </span>
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/questions" className="flex items-center gap-2">
                            <Brain className="w-8 h-8 text-purple-400" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Prep Mate
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/questions")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card variant="glass" className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant={getDifficultyVariant(question.difficulty)}>
                            {question.difficulty}
                        </Badge>
                        <Badge variant="info">{question.category}</Badge>
                        {question.company && (
                            <Badge variant="gray">{question.company}</Badge>
                        )}
                        {question.role && (
                            <Badge variant="default">{question.role}</Badge>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-6">
                        {question.text}
                    </h1>

                    {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {question.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-white/10 pt-6">
                        <Button
                            variant="gradient"
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="mb-4"
                        >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            {showAnswer ? "Hide" : "Show"} Sample Answer
                        </Button>

                        {showAnswer && question.sampleAnswer && (
                            <Card variant="gradient" className="mt-4">
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    Sample Answer:
                                </h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {question.sampleAnswer}
                                </p>
                            </Card>
                        )}
                    </div>
                </Card>

                <Card variant="glass">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Practice This Question
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Want to practice this question with AI feedback? Start a practice session
                        to get personalized evaluation and tips.
                    </p>
                    <Button variant="gradient" onClick={() => router.push("/interview/new")}>
                        Start Practice Session
                    </Button>
                </Card>
            </main>
        </div>
    );
}

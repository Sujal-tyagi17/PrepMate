"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import QuestionCard from "@/components/questions/QuestionCard";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

export default function QuestionsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [difficulty, setDifficulty] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchQuestions();
    }, [category, difficulty, page]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
            });

            if (category !== "all") params.append("category", category);
            if (difficulty !== "all") params.append("difficulty", difficulty);
            if (search) params.append("search", search);

            const response = await fetch(`/api/questions?${params}`);
            const data = await response.json();

            if (data.success) {
                setQuestions(data.questions);
                setTotalPages(data.pagination.pages);
            } else {
                showToast(data.error || "Failed to fetch questions", "error");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            showToast("Failed to fetch questions", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchQuestions();
    };

    const seedQuestions = async () => {
        setSeeding(true);
        try {
            const response = await fetch("/api/questions/seed", { method: "POST" });
            const data = await response.json();

            if (data.success) {
                showToast(`Seeded ${data.count} questions successfully!`, "success");
                fetchQuestions();
            } else {
                showToast(data.error || "Failed to seed questions", "error");
            }
        } catch (error) {
            console.error("Error seeding questions:", error);
            showToast("Failed to seed questions", "error");
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Brain className="w-8 h-8 text-purple-400" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                Prep Mate
                            </span>
                        </Link>
                        <Button variant="outline" size="sm" onClick={seedQuestions} disabled={seeding}>
                            {seeding ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Seeding...
                                </>
                            ) : (
                                "Seed Questions"
                            )}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Question Bank</h1>
                    <p className="text-gray-400 text-lg">
                        Browse and practice interview questions
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search questions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                variant="filled"
                            />
                        </div>
                        <Button type="submit" variant="gradient">
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            options={[
                                { value: "all", label: "All Categories" },
                                { value: "technical", label: "Technical" },
                                { value: "behavioral", label: "Behavioral" },
                                { value: "system-design", label: "System Design" },
                                { value: "coding", label: "Coding" },
                            ]}
                            variant="filled"
                        />

                        <Select
                            value={difficulty}
                            onChange={(e) => {
                                setDifficulty(e.target.value);
                                setPage(1);
                            }}
                            options={[
                                { value: "all", label: "All Difficulties" },
                                { value: "easy", label: "Easy" },
                                { value: "medium", label: "Medium" },
                                { value: "hard", label: "Hard" },
                            ]}
                            variant="filled"
                        />
                    </div>
                </div>

                {/* Questions Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-48" />
                        ))}
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-12">
                        <Filter className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-4">No questions found</p>
                        <Button variant="gradient" onClick={seedQuestions} disabled={seeding}>
                            {seeding ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Seeding Questions...
                                </>
                            ) : (
                                "Seed Sample Questions"
                            )}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {questions.map((question) => (
                                <QuestionCard
                                    key={question._id}
                                    question={question}
                                    onClick={() => router.push(`/questions/${question._id}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-gray-400">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

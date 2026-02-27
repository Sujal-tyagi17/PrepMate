export interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    _id: string;
    text: string;
    category: "technical" | "behavioral" | "system-design" | "coding";
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    company?: string;
    createdAt: Date;
}

export interface Answer {
    questionId: string;
    questionText: string;
    userAnswer: string;
    aiResponse?: string;
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    timestamp: Date;
}

export interface Interview {
    _id: string;
    userId: string;
    type: "technical" | "behavioral" | "system-design" | "mixed";
    difficulty: "easy" | "medium" | "hard";
    role?: string;
    company?: string;
    duration: number;
    status: "in-progress" | "completed" | "abandoned";
    answers: Answer[];
    overallScore: number;
    overallFeedback: string;
    startedAt: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Analytics {
    userId: string;
    totalInterviews: number;
    averageScore: number;
    categoryScores: {
        technical: number;
        behavioral: number;
        systemDesign: number;
    };
    improvementRate: number;
    strengths: string[];
    weaknesses: string[];
    lastUpdated: Date;
}

export interface InterviewSession {
    sessionId: string;
    userId: string;
    interviewId: string;
    currentQuestionIndex: number;
    questions: Question[];
    isActive: boolean;
}

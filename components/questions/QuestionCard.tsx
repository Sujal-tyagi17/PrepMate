import React from "react";
import { BookOpen, Target } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getDifficultyVariant } from "@/lib/utils";

interface QuestionCardProps {
    question: {
        _id: string;
        text: string;
        category: string;
        difficulty: string;
        tags: string[];
        company?: string;
    };
    onClick?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
    const categoryIcons: Record<string, any> = {
        technical: BookOpen,
        behavioral: Target,
        "system-design": Target,
        coding: BookOpen,
    };

    const Icon = categoryIcons[question.category] || BookOpen;

    return (
        <Card
            variant="glass"
            className="hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                            {question.text}
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getDifficultyVariant(question.difficulty)} size="sm">
                            {question.difficulty}
                        </Badge>
                        <Badge variant="info" size="sm">
                            {question.category}
                        </Badge>
                        {question.company && (
                            <Badge variant="gray" size="sm">
                                {question.company}
                            </Badge>
                        )}
                    </div>

                    {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {question.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                            {question.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                    +{question.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default QuestionCard;

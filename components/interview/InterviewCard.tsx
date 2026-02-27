import React from "react";
import { Calendar, Target, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate, getDifficultyVariant } from "@/lib/utils";

interface InterviewCardProps {
    interview: {
        id: string;
        type: string;
        difficulty: string;
        completedAt: Date | string;
        questionsCount: number;
        averageScore: number;
    };
    onClick?: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onClick }) => {
    return (
        <Card
            variant="glass"
            className="hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white capitalize mb-2">
                        {interview.type.replace("-", " ")} Interview
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(interview.completedAt)}
                    </div>
                </div>
                <Badge variant={getDifficultyVariant(interview.difficulty)}>
                    {interview.difficulty}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <div>
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="text-lg font-semibold text-white">
                            {interview.questionsCount}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                        <p className="text-xs text-gray-500">Avg Score</p>
                        <p className="text-lg font-semibold text-white">
                            {interview.averageScore}/10
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default InterviewCard;

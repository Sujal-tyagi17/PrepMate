import React from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
    role: "ai" | "user";
    content: string;
    score?: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, score }) => {
    const isAI = role === "ai";

    return (
        <div className={cn("flex gap-4 mb-6", isAI ? "justify-start" : "justify-end")}>
            {isAI && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    isAI
                        ? "bg-white/5 border border-white/10"
                        : "bg-gradient-to-br from-purple-600 to-pink-600"
                )}
            >
                <p className="text-white whitespace-pre-wrap">{content}</p>
                {score !== undefined && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                        <span className="text-sm font-medium text-purple-300">
                            Score: {score}/10
                        </span>
                    </div>
                )}
            </div>

            {!isAI && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;

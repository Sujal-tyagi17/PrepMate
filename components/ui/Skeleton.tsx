import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

const Skeleton: React.FC<SkeletonProps> = ({ className, variant = "rectangular" }) => {
    const variantClasses = {
        text: "h-4 w-full rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    return (
        <div
            className={cn(
                "animate-pulse bg-white/10",
                variantClasses[variant],
                className
            )}
        />
    );
};

export default Skeleton;

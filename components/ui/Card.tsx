import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "gradient";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
            glass: "glass-effect",
            gradient: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20",
        };

        return (
            <div
                ref={ref}
                className={cn("rounded-xl p-6 shadow-lg", variants[variant], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export default Card;

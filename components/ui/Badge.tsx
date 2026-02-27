import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                success: "bg-green-500/20 text-green-300 border border-green-500/30",
                warning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
                danger: "bg-red-500/20 text-red-300 border border-red-500/30",
                info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                gray: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
            },
            size: {
                sm: "px-2 py-0.5 text-xs",
                md: "px-3 py-1 text-sm",
                lg: "px-4 py-1.5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

const Badge: React.FC<BadgeProps> = ({ className, variant, size, children, ...props }) => {
    return (
        <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
            {children}
        </span>
    );
};

export default Badge;

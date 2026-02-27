import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
    "w-full px-4 py-2.5 rounded-lg transition-all duration-200 outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20",
                outline: "bg-transparent border-2 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20",
                filled: "bg-white/10 border-0 text-white placeholder:text-gray-500 focus:bg-white/15 focus:ring-purple-500/20",
            },
            inputSize: {
                sm: "text-sm py-2 px-3",
                md: "text-base py-2.5 px-4",
                lg: "text-lg py-3 px-5",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "md",
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, inputSize, label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <input
                    className={cn(inputVariants({ variant, inputSize, className }))}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-400">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;

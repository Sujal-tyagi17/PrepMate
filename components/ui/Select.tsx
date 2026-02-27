import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
    "w-full px-4 py-2.5 rounded-lg transition-all duration-200 outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10",
    {
        variants: {
            variant: {
                default: "bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20",
                outline: "bg-transparent border-2 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/20",
                filled: "bg-white/10 border-0 text-white focus:bg-white/15 focus:ring-purple-500/20",
            },
            selectSize: {
                sm: "text-sm py-2 px-3",
                md: "text-base py-2.5 px-4",
                lg: "text-lg py-3 px-5",
            },
        },
        defaultVariants: {
            variant: "default",
            selectSize: "md",
        },
    }
);

export interface SelectProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
    label?: string;
    error?: string;
    helperText?: string;
    options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, variant, selectSize, label, error, helperText, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(selectVariants({ variant, selectSize, className }))}
                        ref={ref}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundSize: "1.5em 1.5em",
                        }}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-900">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
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

Select.displayName = "Select";

export default Select;

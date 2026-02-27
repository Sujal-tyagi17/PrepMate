'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface LogoProps {
    variant?: 'icon' | 'horizontal' | 'full';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    animated?: boolean;
    className?: string;
}

export default function PrepMateLogo({
    variant = 'horizontal',
    size = 'md',
    animated = true,
    className,
}: LogoProps) {
    const sizes = { sm: 28, md: 40, lg: 56, xl: 80 };
    const iconSizes = { sm: 14, md: 20, lg: 28, xl: 40 };
    const textSizes = { sm: 'text-[15px]', md: 'text-[20px]', lg: 'text-[26px]', xl: 'text-[38px]' };
    const s = sizes[size];
    const iconSize = iconSizes[size];

    const Icon = () => (
        <motion.div
            className="relative flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center"
            style={{ width: s, height: s }}
            whileHover={animated ? { scale: 1.08 } : {}}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        >
            <Sparkles className="text-white" style={{ width: iconSize, height: iconSize }} />
        </motion.div>
    );

    const Text = () => (
        <span
            className={cn(
                'font-bold tracking-tight leading-none select-none',
                textSizes[size]
            )}
        >
            PrepMate
        </span>
    );

    if (variant === 'icon') {
        return <div className={cn('inline-flex', className)}><Icon /></div>;
    }

    if (variant === 'horizontal') {
        return (
            <div className={cn('inline-flex items-center gap-2.5', className)}>
                <Icon />
                <Text />
            </div>
        );
    }

    return (
        <div className={cn('inline-flex flex-col items-center gap-3', className)}>
            <Icon />
            <div className="flex flex-col items-center gap-0.5">
                <Text />
                <span className="text-[11px] text-gray-500 tracking-wide font-medium">Your AI Interview Partner</span>
            </div>
        </div>
    );
}

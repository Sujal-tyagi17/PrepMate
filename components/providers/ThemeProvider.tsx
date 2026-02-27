"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved theme on mount
        const savedTheme = localStorage.getItem("prepmate-theme") as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("prepmate-theme", newTheme);
        applyTheme(newTheme);
    };

    const applyTheme = (t: Theme) => {
        if (t === "light") {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            document.body.style.background = "#f9fafb";
        } else if (t === "dark") {
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
            document.body.style.background = "#0a0514";
        } else {
            // system
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", prefersDark);
            document.documentElement.classList.toggle("light", !prefersDark);
            document.body.style.background = prefersDark ? "#0a0514" : "#f9fafb";
        }
    };

    // Prevent flash of unstyled content
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/providers/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";

const splineSans = Spline_Sans({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
    preload: true,
    variable: "--font-spline",
});

export const metadata: Metadata = {
    title: "PrepMate - AI Interview Preparation",
    description: "Master your interviews with AI-powered mock interviews, personalized feedback, and comprehensive analytics.",
    keywords: ["interview preparation", "AI interview", "mock interview", "job interview", "career"],
    openGraph: {
        title: "PrepMate - AI Interview Preparation",
        description: "Ace every interview with your AI partner.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: "#a855f7",
                    colorBackground: "#0a0514",
                    colorInputBackground: "#1a1025",
                    colorText: "#ffffff",
                    colorTextSecondary: "#9ca3af",
                    colorInputText: "#ffffff",
                    borderRadius: "0.75rem",
                },
                elements: {
                    card: "bg-[#0a0514] border border-white/10 shadow-2xl shadow-purple-900/20",
                    headerTitle: "text-white font-bold",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white",
                    formFieldInput: "bg-[#1a1025] border-white/10 text-white focus:border-purple-500",
                    formButtonPrimary: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500",
                    footerActionLink: "text-purple-400 hover:text-purple-300",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-500",
                },
            }}
        >
            <html lang="en" suppressHydrationWarning>
                <body className={splineSans.className} style={{ background: "#0a0514" }}>
                    <ScrollProgress />
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                    <PageLoader />
                    <ScrollToTop />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: "#1a1025",
                                color: "#fff",
                                border: "1px solid rgba(124,58,237,0.3)",
                                borderRadius: "12px",
                                fontSize: "14px",
                            },
                            success: {
                                iconTheme: { primary: "#a855f7", secondary: "#fff" },
                            },
                            error: {
                                iconTheme: { primary: "#ef4444", secondary: "#fff" },
                            },
                        }}
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}

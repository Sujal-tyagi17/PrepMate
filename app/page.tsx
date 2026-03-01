"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

/* ─── Below-fold: dynamically loaded chunks ─────────────────── */
function SectionSkeleton() {
    return <div className="w-full py-24 animate-pulse" aria-hidden />;
}

const FeaturesSection    = dynamic(() => import("@/components/FeaturesSection"),    { loading: () => <SectionSkeleton />, ssr: false });
const HowItWorksSection  = dynamic(() => import("@/components/HowItWorksSection"),  { loading: () => <SectionSkeleton />, ssr: false });
const AboutSection       = dynamic(() => import("@/components/AboutSection"),       { loading: () => <SectionSkeleton />, ssr: false });
const CTASection         = dynamic(() => import("@/components/CTASection"),         { loading: () => <SectionSkeleton />, ssr: false });
const Footer             = dynamic(() => import("@/components/Footer"),             { loading: () => <div className="h-48" />, ssr: false });

export default function Home() {
    return (
        <motion.main
            className="min-h-screen bg-[#0a0514] text-white overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >

            {/* Navigation — always eager */}
            <Navbar />

            {/* Hero — above fold, always eager */}
            <HeroSection />

            {/* Below-fold — lazy-loaded separate JS chunks */}
            <Suspense fallback={<SectionSkeleton />}>
                <FeaturesSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <HowItWorksSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <AboutSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton />}>
                <CTASection />
            </Suspense>

            <Suspense fallback={<div className="h-48" />}>
                <Footer />
            </Suspense>

        </motion.main>
    );
}

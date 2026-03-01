"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0514] text-white overflow-x-hidden">

            {/* Navigation */}
            <Navbar />

            {/* Hero */}
            <HeroSection />

            {/* Features */}
            <FeaturesSection />

            {/* How It Works */}
            <HowItWorksSection />

            {/* CTA */}
            <CTASection />

            {/* Footer */}
            <Footer />

        </main>
    );
}

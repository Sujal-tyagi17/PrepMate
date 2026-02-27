"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AIAvatarProps {
    isSpeaking?: boolean;
    size?: "sm" | "md" | "lg";
    voiceEnabled?: boolean;
}

export default function AIAvatar({ isSpeaking = false, size = "md", voiceEnabled = true }: AIAvatarProps) {
    const [mouthFrame, setMouthFrame] = useState(0);
    const [headTilt, setHeadTilt] = useState(0);
    const [blinkLeft, setBlinkLeft] = useState(false);
    const [blinkRight, setBlinkRight] = useState(false);
    const [handGesture, setHandGesture] = useState(0);

    const sizeClasses = {
        sm: "w-32 h-40",
        md: "w-48 h-64",
        lg: "w-64 h-80"
    };

    // Mouth animation when speaking
    useEffect(() => {
        if (isSpeaking) {
            const interval = setInterval(() => {
                setMouthFrame(prev => (prev + 1) % 4);
                setHandGesture(prev => (prev + 1) % 3);
            }, 250);
            return () => clearInterval(interval);
        } else {
            setMouthFrame(0);
            setHandGesture(0);
        }
    }, [isSpeaking]);

    // Head tilt animation
    useEffect(() => {
        const interval = setInterval(() => {
            setHeadTilt(Math.sin(Date.now() / 2000) * 3);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinkLeft(true);
            setBlinkRight(true);
            setTimeout(() => {
                setBlinkLeft(false);
                setBlinkRight(false);
            }, 150);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(blinkInterval);
    }, []);

    return (
        <div className={`${sizeClasses[size]} relative`}>
            {/* Outer glow ring - only when speaking */}
            {isSpeaking && (
                <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 opacity-30 blur-3xl animate-pulse" />
            )}
            
            {/* Main container - 3D Human Avatar */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
                
                {/* Background - Office environment suggestion */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-800 to-purple-900/20" />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-700/30 to-transparent" />
                
                {/* 3D Human Character */}
                <svg 
                    viewBox="0 0 200 280" 
                    className="w-full h-full"
                    style={{ transform: `rotate(${headTilt}deg)`, transition: 'transform 0.3s ease-out' }}
                >
                    <defs>
                        {/* Gradients */}
                        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#FDBCB4', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#F5A898', stopOpacity: 1}} />
                        </linearGradient>
                        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#5D4037', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#3E2723', stopOpacity: 1}} />
                        </linearGradient>
                        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#FFC107', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#FFA000', stopOpacity: 1}} />
                        </linearGradient>
                        <radialGradient id="faceGlow">
                            <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.3}} />
                            <stop offset="100%" style={{stopColor: '#FFFFFF', stopOpacity: 0}} />
                        </radialGradient>
                    </defs>
                    
                    {/* Shoulders & Body */}
                    <ellipse cx="100" cy="240" rx="70" ry="50" fill="url(#shirtGrad)" />
                    <path d="M 30 220 Q 100 210 170 220 L 170 280 L 30 280 Z" fill="url(#shirtGrad)" />
                    
                    {/* Collar */}
                    <path d="M 70 220 L 80 235 L 100 230 L 120 235 L 130 220" 
                          fill="none" stroke="#E69500" strokeWidth="2" />
                    
                    {/* Neck */}
                    <rect x="85" y="160" width="30" height="60" rx="15" fill="url(#skinGrad)" />
                    
                    {/* Left Hand/Arm */}
                    <g style={{ 
                        transform: `translate(${handGesture === 1 ? '5px' : handGesture === 2 ? '-3px' : '0px'}, 
                                             ${handGesture === 1 ? '-8px' : handGesture === 2 ? '-5px' : '0px'})`,
                        transition: 'transform 0.3s ease-out'
                    }}>
                        <ellipse cx="35" cy="230" rx="12" ry="35" fill="url(#skinGrad)" transform="rotate(-20 35 230)" />
                        <circle cx="30" cy="250" r="10" fill="url(#skinGrad)" />
                    </g>
                    
                    {/* Right Hand/Arm */}
                    <g style={{ 
                        transform: `translate(${handGesture === 2 ? '-5px' : handGesture === 1 ? '3px' : '0px'}, 
                                             ${handGesture === 2 ? '-8px' : handGesture === 1 ? '-5px' : '0px'})`,
                        transition: 'transform 0.3s ease-out'
                    }}>
                        <ellipse cx="165" cy="230" rx="12" ry="35" fill="url(#skinGrad)" transform="rotate(20 165 230)" />
                        <circle cx="170" cy="250" r="10" fill="url(#skinGrad)" />
                    </g>
                    
                    {/* Head */}
                    <ellipse cx="100" cy="100" rx="45" ry="55" fill="url(#skinGrad)" />
                    <circle cx="100" cy="100" r="50" fill="url(#faceGlow)" opacity="0.3" />
                    
                    {/* Hair */}
                    <ellipse cx="100" cy="70" rx="48" ry="40" fill="url(#hairGrad)" />
                    <path d="M 52 85 Q 50 95 55 105 Q 60 95 52 85 Z" fill="url(#hairGrad)" />
                    <path d="M 148 85 Q 150 95 145 105 Q 140 95 148 85 Z" fill="url(#hairGrad)" />
                    <ellipse cx="75" cy="80" rx="15" ry="30" fill="url(#hairGrad)" transform="rotate(-20 75 80)" />
                    <ellipse cx="125" cy="80" rx="15" ry="30" fill="url(#hairGrad)" transform="rotate(20 125 80)" />
                    
                    {/* Eyebrows */}
                    <path d="M 70 85 Q 80 83 90 85" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 110 85 Q 120 83 130 85" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Eyes */}
                    <g>
                        {/* Left Eye */}
                        <ellipse cx="80" cy="95" rx="8" ry={blinkLeft ? "1" : "10"} fill="white" />
                        <circle cx="80" cy="95" r="5" fill="#3E2723" />
                        <circle cx="82" cy="93" r="2" fill="white" />
                        
                        {/* Right Eye */}
                        <ellipse cx="120" cy="95" rx="8" ry={blinkRight ? "1" : "10"} fill="white" />
                        <circle cx="120" cy="95" r="5" fill="#3E2723" />
                        <circle cx="122" cy="93" r="2" fill="white" />
                    </g>
                    
                    {/* Nose */}
                    <path d="M 100 100 L 98 115 Q 100 117 102 115 Z" fill="#E89B8F" opacity="0.5" />
                    
                    {/* Cheeks blush */}
                    <circle cx="70" cy="110" r="8" fill="#FF8A80" opacity="0.3" />
                    <circle cx="130" cy="110" r="8" fill="#FF8A80" opacity="0.3" />
                    
                    {/* Mouth - Animated */}
                    <g>
                        {!isSpeaking ? (
                            <path d="M 85 125 Q 100 130 115 125" fill="none" stroke="#D84315" strokeWidth="2.5" strokeLinecap="round" />
                        ) : mouthFrame === 0 ? (
                            <ellipse cx="100" cy="128" rx="12" ry="8" fill="#D84315" />
                        ) : mouthFrame === 1 ? (
                            <ellipse cx="100" cy="130" rx="10" ry="12" fill="#D84315" />
                        ) : mouthFrame === 2 ? (
                            <ellipse cx="100" cy="128" rx="14" ry="6" fill="#D84315" />
                        ) : (
                            <ellipse cx="100" cy="127" rx="11" ry="9" fill="#D84315" />
                        )}
                        {/* Teeth when mouth open */}
                        {isSpeaking && mouthFrame % 2 === 1 && (
                            <rect x="95" y="126" width="10" height="3" rx="1" fill="white" opacity="0.8" />
                        )}
                    </g>
                </svg>
                
                {/* Sound waves when speaking */}
                {isSpeaking && (
                    <>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="absolute inset-0 rounded-3xl border-2 border-purple-400 opacity-20"
                                style={{
                                    animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                    animationDelay: `${i * 0.4}s`
                                }}
                            />
                        ))}
                    </>
                )}
                
                {/* Voice indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
                    {voiceEnabled ? (
                        <>
                            <Volume2 className="w-4 h-4 text-green-400" />
                            {isSpeaking && (
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-green-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${8 + Math.sin(Date.now() / 100 + i) * 6}px`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            <span className="text-xs font-medium text-green-400">
                                {isSpeaking ? "Speaking" : "Ready"}
                            </span>
                        </>
                    ) : (
                        <>
                            <VolumeX className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500">Muted</span>
                        </>
                    )}
                </div>
                
                {/* AI Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg border border-white/20">
                    AI Interviewer
                </div>
            </div>
        </div>
    );
}
